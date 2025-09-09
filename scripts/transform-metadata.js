import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { csvParse, autoType } from "d3-dsv";
import { reverseDate, stripBom, slugifyCode, titleFromSlug } from "./utils.js";
import { skipDatasets, colLookup } from "./config.js";
import inferGeos from "./infer-geos.js";

function formatCols(cols) {
  return cols.map((col) => {
    const meta = colLookup[col];
    const obj = { titles: col };
    for (const key of Object.keys(meta).filter((k) => k !== "transform"))
      obj[key] = meta[key];
    return obj;
  });
}

function makeTransformations(cols) {
  const transformations = [];
  for (const col of cols) {
    const transform = colLookup[col].transform;
    if (transform && transform.type !== "metadata") {
      transformations.push({ titles: col, ...transform });
    }
  }
  return transformations;
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

  const geoCol = cols.find(col => col?.transform?.key === "areacd");
  const geoCodes = Array.from(new Set(data.map(d => d[geoCol.key])));
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
  const valueCol = cols.find(col => col?.transform?.key === "value");
  const indicatorCol = cols.find(col => col?.transform?.type === "indicator");
  const metaCols = data.columns
    .map(col => colLookup[col])
    .filter(col => col?.transform?.type === "metadata");
  for (const code of codes) {
    const base = code === ds ? meta : meta[code];
    const rows = indicatorCol && code !== ds ? data.filter(d => d[indicatorCol.key] === code) : data;
    const indicator = {
      code,
      slug: slugifyCode(code), // Usually added at data processing stage
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
      confidenceIntervals: cols.find(col => col?.transform?.key === "lci") ? true : false,
      canBeNegative: rows.map(d => d[valueCol.key]).sort((a, b) => a - b)[0] < 0
    };
    // These seem to be the inverse of each other. Mybe can get rid of one?
    // (Current usage also seems to be inconsistent with the definition)
    indicator.zeroBaseline = !indicator.canBeNegative;

    for (const col of metaCols) {
      indicator[col.transform.key] = rows[0][col.key];
    }
    indicators.push(indicator);
  }
  return indicators;
}

async function makeMetadata(ds, meta, data) {
  const cols = data.columns.map(col => ({key: col, ...colLookup[col]}));

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

  const csvw = {
    "@context": ["http://www.w3.org/ns/csvw", { "@language": "en" }],
    "dc:title": meta.title || titleFromSlug(ds),
    tables: [
      {
        url: `${ds}.csv`,
        tableSchema: {
          columns: formatCols(data.columns),
        },
        // Note: We're slightly misusing the concept of "transformations" here
        transformations: makeTransformations(data.columns),
      },
    ],
    metadata: await makeMetadata(ds, meta["ess-beta-metadata"], data),
  };

  writeFileSync(csvwPath, JSON.stringify(csvw, null, 2));
  console.log(`Wrote ${csvwPath}`);
}
