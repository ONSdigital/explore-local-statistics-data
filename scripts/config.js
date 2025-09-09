export const skipDatasets = ["population-under-devolution-deal-in-england"];

const cols = {
  AREACD: {
    name: "Area code",
    datatype: "string",
    transform: {
      key: "areacd",
      type: "dimension",
    },
  },
  AREANM: {
    name: "Area name",
    datatype: "string",
  },
  Geography: {
    name: "Geography type",
    datatype: "string",
  },
  "Variable Name": {
    name: "Variable name",
    datatype: "string",
  },
  Indicator: {
    name: "Indicator",
    datatype: "string",
    transform: {
      key: "indicator",
      type: "indicator",
    },
  },
  Period: {
    name: "Time period",
    datatype: "string",
    transform: {
      key: "period",
      type: "dimension",
    },
  },
  Observation: {
    name: "Observation value",
    datatype: "number",
    transform: {
      key: "value",
      type: "measure",
    },
  },
  Measure: {
    name: "Measure",
    datatype: "string",
    transform: {
      key: "measure",
      type: "metadata",
    },
  },
  Unit: {
    name: "Unit",
    datatype: "string",
    transform: {
      key: "unit",
      type: "metadata",
    },
  },
  "Lower Confidence Interval (95%)": {
    name: "Lower Confidence Interval (95%)",
    datatype: "number",
    transform: {
      key: "lci",
      type: "measure",
    },
  },
  "Upper Confidence Interval (95%)": {
    name: "Upper Confidence Interval (95%)",
    datatype: "number",
    transform: {
      key: "uci",
      type: "measure",
    },
  },
  "Observation Status": {
    name: "Observation status",
    datatype: "string",
    transform: {
      key: "status",
      type: "status",
    },
  },
  Polarity: {
    name: "Polarity",
    datatype: "number",
    transform: {
      key: "polarity",
      type: "metadata",
    },
  },
  Notes: {
    name: "Notes",
    datatype: "string",
    transform: {
      key: "notes",
      type: "metadata",
    },
  },
  Mission: {
    name: "Mission",
    datatype: "string",
  },
  Category: {
    name: "Category",
    datatype: "string",
  },
  Numerator: {
    name: "Numerator",
    datatype: "number",
    transform: {
      key: "numerator",
      type: "measure",
    },
  },
  Denominator: {
    name: "Denominator",
    datatype: "number",
    transform: {
      key: "denominator",
      type: "measure",
    },
  },
  "Age band": {
    name: "Age band",
    datatype: "string",
    transform: {
      key: "age",
      type: "dimension",
    },
  },
  Sex: {
    name: "Sex",
    datatype: "string",
    transform: {
      key: "sex",
      type: "dimension",
    },
  },
  "mode-of-travel": {
    name: "Mode of travel",
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
