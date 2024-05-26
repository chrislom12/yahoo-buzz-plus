import pandas as pd

fake_df = pd.read_csv('Fake.csv')[['title', 'text']]
true_df = pd.read_csv('True.csv')[['title', 'text']]

fake_df['label'] = 'FAKE'
true_df['label'] = 'REAL'

combined_df = pd.concat([fake_df, true_df], ignore_index=True)

combined_df.to_csv('misinfoDataset.csv', index=False)
