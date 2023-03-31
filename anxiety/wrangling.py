import click
import pandas as pd
from pathlib import Path


@click.command()
@click.argument("input", type=click.Path(exists=True, path_type=Path))
@click.argument("metrics_geographies", type=click.Path(exists=True, path_type=Path))
@click.option("--output", default=Path("./output.csv"), type=click.Path(path_type=Path))
def wrangle(input: Path(), metrics_geographies: Path(), output: Path()) -> None:
    df = pd.read_csv(input, na_values="na")
    metrics_geographies = pd.read_csv(metrics_geographies)

    df["Period"] = df.apply(
        lambda x: str(x["Period"])[:4] + "-20" + str(x["Period"])[-2:], axis=1
    )
    metrics_geographies["Period"] = metrics_geographies.apply(
        lambda x: str(x["Period"])[:4] + "-20" + str(x["Period"])[-2:], axis=1
    )
    metrics_geographies["Data source value"] = metrics_geographies[
        ["Data source value"]
    ].apply(lambda x: x.str[1:2])

    df["Observation Status"] = df.apply(
        lambda x: "u"
        if "suppressed" in str(x["Observation Status"])
        else x["Observation Status"],
        axis=1,
    )
    df["Observation Status"] = df.apply(
        lambda x: "x"
        if ("na" in str(x["Value"])) & ("u" not in str(x["Observation Status"]))
        else x["Observation Status"],
        axis=1,
    )
    # There are NA values without an observation stutus, I'm choosing to take them on face value as 'not-available'
    df = df.merge(metrics_geographies, how="left", on=["Period", "AREACD"])
    df.loc[df["Data source value"].notna(), "Observation Status"] = df.loc[
        df["Data source value"].notna(), "Data source value"
    ]
    df = df.rename({"AREANM_x": "AREANM"}, axis=1)
    df = df[[
        "AREACD",
        "AREANM",
        "Geography",
        "Variable Name",
        "Indicator",
        "Mission",
        "Category",
        "Period",
        "Value",
        "Measure",
        "Unit",
        "Lower Confidence Interval (95%)",
        "Upper Confidence Interval (95%)",
        "Observation Status",
        "Polarity",
        "Notes",
    ]]

    df = df.round(
        {
            "Value": 2,
            "Lower Confidence Interval (95%)": 2,
            "Upper Confidence Interval (95%)": 2,
        }
    )

    df.to_csv(output, index=False)
    return


if __name__ == "__main__":

    wrangle()
