"""Use a locally trained trusted model on a CSV containing the saved features."""
import argparse,json
import pandas as pd
import joblib
p=argparse.ArgumentParser();p.add_argument('--model',required=True);p.add_argument('--csv',required=True);a=p.parse_args()
# Pickle/joblib is executable: load only artifacts you trained or trust.
bundle=joblib.load(a.model);frame=pd.read_csv(a.csv)
x=frame[bundle['features']]
if x.isna().any().any():raise ValueError('Missing required features')
model=bundle['model']
values=model.predict_proba(x)[:,1] if hasattr(model,'predict_proba') else model.predict(x)
print(json.dumps({'target':bundle['target'],'predictions':values.tolist(),'use':'Research only; not an emergency warning'}))
