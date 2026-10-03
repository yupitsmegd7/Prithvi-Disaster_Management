"""Future extension: train from externally verified event labels and precomputed modalities.
CSV needs issue_time, label_end, region, label and numeric feature_ columns.
Image/text embeddings must be computed from evidence available at issue_time.
This script deliberately rejects earthquake-occurrence prediction.
"""
import argparse,json
from pathlib import Path
import numpy as np,pandas as pd,joblib
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import average_precision_score,brier_score_loss,precision_score,recall_score
p=argparse.ArgumentParser();p.add_argument('--hazard',required=True,choices=['flood','drought','cyclone','acid-rain']);p.add_argument('--csv',required=True);p.add_argument('--test-region',required=True);p.add_argument('--cutoff',default='2024-01-01');p.add_argument('--out',default='ml/artifacts');a=p.parse_args()
df=pd.read_csv(a.csv,parse_dates=['issue_time','label_end'])
if not {'issue_time','label_end','region','label'}.issubset(df):raise ValueError('Missing required columns')
features=[c for c in df if c.startswith('feature_')]
if not features:raise ValueError('Add numeric feature_ columns')
if not df.label.isin([0,1]).all():raise ValueError('Labels must be verified binary outcomes')
if not (df.label_end>=df.issue_time).all():raise ValueError('Invalid label window')
cutoff=pd.Timestamp(a.cutoff)
train=df[(df.label_end<cutoff)&(df.region!=a.test_region)]
test=df[(df.issue_time>=cutoff)&(df.region==a.test_region)]
if len(train)<200 or len(test)<50 or min(train.label.nunique(),test.label.nunique())<2:raise ValueError('Insufficient event/non-event examples in held-out split')
model=HistGradientBoostingClassifier(max_iter=150,max_leaf_nodes=15,l2_regularization=2,random_state=42)
model.fit(train[features],train.label);prob=model.predict_proba(test[features])[:,1]
report={'hazard':a.hazard,'features':features,'train_rows':len(train),'test_rows':len(test),'test_region':a.test_region,'pr_auc':float(average_precision_score(test.label,prob)),'brier':float(brier_score_loss(test.label,prob)),'precision_at_05':float(precision_score(test.label,prob>=.5,zero_division=0)),'recall_at_05':float(recall_score(test.label,prob>=.5,zero_division=0)),'operationally_validated':False,'note':'Requires independent calibration, warning-threshold selection, event-level validation and expert review.'}
dest=Path(a.out);dest.mkdir(parents=True,exist_ok=True);joblib.dump({'model':model,'features':features},dest/f'{a.hazard}_research.joblib');(dest/f'{a.hazard}_report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
