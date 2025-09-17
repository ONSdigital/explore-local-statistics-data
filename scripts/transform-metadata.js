import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { csvParse, autoType } from "d3-dsv";
import { reverseDate, stripBom, slugifyCode, titleFromSlug } from "./utils.js";
import { skipDatasets, colLookup } from "./config.js";
import inferGeos from "./infer-geos.js";

function formatColumns(cols) {
  return cols.map(col => {
    const obj = {...colLookup[col]};
    obj.titles = col === obj.titles ? [col] : [col, obj.titles];
    if (!obj.name || obj.type === "metadata") obj.supressOutput = true;
    return obj;
  });
}

async function makeBaseMetadata(meta, data, cols) {
  const shared = meta?.shared || meta;
  const sourceOrg = shared.sourceOrg.split("|");
  const sourceURL = shared.sourceURL.split("|");
  const sourceDate = shared.sourceDate.split("|").map((d) => reverseDate(d));
  const metadata = {
    source: sourceOrg.map((org, i) => ({
      name: org,
      href: sourceURL[i],
      date: sourceDate[i],
    })),
    experimentalStatistic: shared.experimentalStatistic === "T"
  };

  const geoCol = cols.find(col => col.name === "areacd");
  const geoCodes = Array.from(new Set(data.map(d => d[geoCol.titles[0]])));
  const geos = await inferGeos(geoCodes);

  metadata.geographyCountries = geos.ctrys;
  metadata.geographyGroups = geos.groups;
  metadata.geographyTypes = geos.types;
  metadata.geographyYear = geos.year;
  metadata.geographyInitialLevel = geos.groups[geos.groups.length - 1];
  // geographyInitialLevel was previously called initialGeographyLevel

  return metadata;
}

function makeIndicators(ds, meta, data, cols) {
  const indicators = [];
  const codes = meta.shared
    ? Object.keys(meta).filter((k) => k !== "shared")
    : [ds];
  const valueCol = cols.find(col => col.name === "value");
  const indicatorCol = cols.find(col => col.type === "indicator");
  const metaCols = cols.filter(col => col.type === "metadata");
  
  for (const code of codes) {
    const base = code === ds ? meta : meta[code];
    const rows = indicatorCol && code !== ds ? data.filter(d => d[indicatorCol.titles[0]] === code) : data;
    const indicator = {
      code: code,
      slug: slugifyCode(code), // Usually added at data processing stage
      dataset: ds,
      label: base.label,
      prefix: base.prefix,
      suffix: base.suffix,
      subText: base.subText,
      decimalPlaces: base.decimalPlaces,
      standardised: base.standardised === "T",
      subtitle: base.subtitle,
      longDescription: base.longDescription,
      caveats: base.caveats,
      // The below are usually calculated at the data processing stage
      confidenceIntervals: cols.find(col => col.name === "lci") ? true : false,
      canBeNegative: rows.map(d => d[valueCol.titles[0]]).sort((a, b) => a - b)[0] < 0
    };
    // These seem to be the inverse of each other. Mybe can get rid of one?
    // (Current usage also seems to be inconsistent with the definition)
    indicator.zeroBaseline = !indicator.canBeNegative;

    for (const col of metaCols) {
      indicator[col.name] = rows[0][col.titles[0]];
    }
    indicators.push(indicator);
  }
  return indicators;
}

async function makeMetadata(ds, meta, data, cols) {
  const metadata = await makeBaseMetadata(meta, data, cols);
  metadata.indicators = makeIndicators(ds, meta, data, cols);

  return metadata;
}

const datasets = readdirSync("./")
  .filter((item) => !item.includes(".") && !skipDatasets.includes(item))
  .filter(
    (item) =>
      existsSync(`./${item}/${item}.csv`) &&
      existsSync(`./${item}/${item}.json`)
  );

for (const ds of datasets) {
  const dataPath = `./${ds}/${ds}.csv`;
  const metaPath = `./${ds}/${ds}.json`;
  const csvwPath = `./${ds}/${ds}.csv-metadata.json`;

  const data = csvParse(
    stripBom(readFileSync(dataPath, { encoding: "utf-8" })),
    autoType
  );
  const meta = JSON.parse(readFileSync(metaPath, { encoding: "utf-8" }));
  const columns = formatColumns(data.columns);

  const csvw = {
    "@context": ["http://www.w3.org/ns/csvw", { "@language": "en" }],
    "dc:title": meta.title || titleFromSlug(ds),
    tables: [
      {
        url: `${ds}.csv`,
        tableSchema: {
          columns
        }
      },
    ],
    metadata: await makeMetadata(ds, meta["ess-beta-metadata"], data, columns),
  };

  writeFileSync(csvwPath, JSON.stringify(csvw, null, 2));
  console.log(`Wrote ${csvwPath}`);
}
