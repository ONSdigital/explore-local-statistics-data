export const skipDatasets = ["population-under-devolution-deal-in-england"];

const cols = {
  AREACD: {
    titles: "Area code",
    datatype: "string",
    key: "areacd",
    type: "dimension"
  },
  AREANM: {
    titles: "Area name",
    datatype: "string",
  },
  Geography: {
    titles: "Geography type",
    datatype: "string",
  },
  "Variable Name": {
    titles: "Variable name",
    datatype: "string",
  },
  Indicator: {
    titles: "Indicator",
    datatype: "string",
    key: "indicator",
    type: "indicator"
  },
  Period: {
    titles: "Time period",
    datatype: "string",
    key: "period",
    type: "dimension"
  },
  Observation: {
    titles: "Observation value",
    datatype: "number",
    key: "value",
    type: "measure"
  },
  Measure: {
    titles: "Measure",
    datatype: "string",
    key: "measure",
    type: "metadata"
  },
  Unit: {
    titles: "Unit",
    datatype: "string",
    key: "unit",
    type: "metadata",
  },
  "Lower Confidence Interval (95%)": {
    titles: "Lower confidence interval (95%)",
    datatype: "number",
    key: "lci",
    type: "measure"
  },
  "Upper Confidence Interval (95%)": {
    titles: "Upper confidence interval (95%)",
    datatype: "number",
    key: "uci",
    type: "measure"
  },
  "Observation Status": {
    titles: "Observation status",
    datatype: "string",
    key: "status",
    type: "status"
  },
  Polarity: {
    titles: "Polarity",
    datatype: "number",
    key: "polarity",
    type: "metadata"
  },
  Notes: {
    titles: "Notes",
    datatype: "string"
  },
  Mission: {
    titles: "Mission",
    datatype: "string",
  },
  Category: {
    titles: "Category",
    datatype: "string",
  },
  Numerator: {
    titles: "Numerator",
    datatype: "number",
    key: "numerator",
    type: "measure"
  },
  Denominator: {
    titles: "Denominator",
    datatype: "number",
    key: "denominator",
    type: "measure"
  },
  "Age band": {
    titles: "Age band",
    datatype: "string",
    key: "age",
    type: "dimension"
  },
  Sex: {
    titles: "Sex",
    datatype: "string",
    key: "sex",
    type: "dimension"
  },
  "mode-of-travel": {
    titles: "Mode of travel",
    datatype: "string",
  },
};

const duplicateCols = {
  Count: "Observation",
  indicator: "Indicator",
  areacd: "AREACD",
  areanm: "AREANM",
  geography: "Geography",
  observation: "Observation",
  unit: "Unit",
  measure: "Measure",
  period: "Period",
  lower_confidence_interval_95: "Lower Confidence Interval (95%)",
  upper_confidence_interval_95: "Upper Confidence Interval (95%)",
  observation_status: "Observation Status",
  Lower_confidence_interval_95: "Lower Confidence Interval (95%)",
  Upper_confidence_interval_95: "Upper Confidence Interval (95%)",
  Observation_status: "Observation Status",
  numerator: "Numerator",
  denominator: "Denominator",
  notes: "Notes",
  Total: "Denominator",
  Value: "Observation",
};

export const colLookup = (() => {
  const lookup = {...cols};
  for (const col of Object.entries(duplicateCols))
    lookup[col[0]] = lookup[col[1]];
  return lookup;
})();
