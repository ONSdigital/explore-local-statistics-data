# %%

import pandas as pd
# %%
df = pd.read_csv('/Users/benhowland/Documents/Projects/ons-sns/provider-ons-sns/average-travel-time-test/average-travel-time-to-nearest-employment-centre-with-500-to-4999-jobs-available.csv')
# %%
df_cycle = df[["areacd","areanm","geography","period","cycle_to_work", "cycle_lower_confidence_interval_95","cycle_upper_confidence_interval_95","cycle_observation_status"]].rename(columns ={"cycle_to_work":"value","cycle_lower_confidence_interval_95":"lower_confidence_interval_95","cycle_upper_confidence_interval_95":"upper_confidence_interval_95","cycle_observation_status":"observation_status"})
# %%
df_cycle["type-of-travel"]="cycling"
# %%
df_drive = df[["areacd","areanm","geography","period","drive_to_work","drive_lower_confidence_interval_95","drive_upper_confidence_interval_95","drive_observation_status"]].rename(columns ={"drive_to_work":"value","drive_lower_confidence_interval_95":"lower_confidence_interval_95","drive_upper_confidence_interval_95":"upper_confidence_interval_95","drive_observation_status":"observation_status"})
# %%
df_drive["type-of-travel"]="driving"
# %%
df_public = df[["areacd","areanm","geography","period","public_transport_or_walk_to_work", "public_transport_or_walk_lower_confidence_interval_95","public_transport_or_walk_upper_confidence_interval_95","public_transport_observation_status"]].rename(columns ={"public_transport_or_walk_to_work":"value","public_transport_or_walk_lower_confidence_interval_95":"lower_confidence_interval_95","public_transport_or_walk_upper_confidence_interval_95":"upper_confidence_interval_95","public_transport_observation_status":"observation_status"})
# %%
df_public["type-of-travel"]="public transport or walking"
# %%
df_average_travel = pd.concat([df_cycle,df_drive,df_public])
# %%
#df_average_travel= df_average_travel.rename(columns ={"areacd": "Area Code", "geography": "Geography Type"})
# %%
df_average_travel.to_csv("/Users/benhowland/Documents/Projects/ons-sns/provider-ons-sns/average-travel-time-to-nearest-employment-centre-with-500-to-4999-jobs-available/average-travel-time-long.csv", index=False)


# %%
