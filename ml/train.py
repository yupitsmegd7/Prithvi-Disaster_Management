"""Fit two honest weather-proxy baselines, never synthetic disaster labels."""
from pathlib import Path
import json, hashlib, platform
from datetime import datetime, timezone
import numpy as np
import pandas as pd
import sklearn,joblib
from sklearn.ensemble import RandomForestRegressor,RandomForestClassifier
from sklearn.metrics import mean_absolute_error,mean_squared_error,average_precision_score,brier_score_loss,precision_score,recall_score,confusion_matrix
from features import FEATURES,build_features,split_time

def scores(y,p,threshold):
    pred=p>=threshold
    return dict(pr_auc=float(average_precision_score(y,p)),brier=float(brier_score_loss(y,p)),precision=float(precision_score(y,pred,zero_division=0)),recall=float(recall_score(y,pred,zero_division=0)),confusion_matrix=confusion_matrix(y,pred,labels=[0,1]).tolist())

def train(data_dir='ml/data',out_dir='ml/artifacts'):
    paths=sorted(Path(data_dir).glob('*.csv'))
    if not paths: raise FileNotFoundError('Run ml/download_data.py first')
    data=pd.concat([pd.read_csv(p) for p in paths],ignore_index=True)
    frame=build_features(data); train,valid,test=split_time(frame)
    if min(len(train),len(valid),len(test))<100:raise ValueError('Not enough time-separated data')
    x=lambda f:f[FEATURES]
    rain=RandomForestRegressor(n_estimators=80,max_depth=9,min_samples_leaf=20,random_state=42,n_jobs=-1)
    rain.fit(x(train),train.next_day_rain)
    dry=RandomForestClassifier(n_estimators=80,max_depth=9,min_samples_leaf=20,random_state=42,n_jobs=-1)
    dry.fit(x(train),train.dry_next_week.astype(int))
    vp=dry.predict_proba(x(valid))[:,1];vy=valid.dry_next_week.astype(int)
    thresholds=np.arange(.1,.91,.05)
    # Select using validation only, with an explicit missed-event cost.
    costs=[3*np.sum((vp<t)&(vy==1))+np.sum((vp>=t)&(vy==0)) for t in thresholds]
    threshold=float(thresholds[int(np.argmin(costs))])
    pred=rain.predict(x(test));dp=dry.predict_proba(x(test))[:,1];dy=test.dry_next_week.astype(int)
    report={'created_at':datetime.now(timezone.utc).isoformat(),'summary':'Two experimental random-forest models trained on daily reanalysis for Bhubaneswar, Kolkata and Jaipur. These predict next-day rainfall and a dry following week, not disaster occurrence.',
      'target_issue_time':'End of each UTC day; reanalysis is retrospective and not a real-time observation feed.',
      'features':FEATURES,'training_rows':len(train),'validation_rows':len(valid),'test_rows':len(test),'train_period':['2000','2022-12-24'],'validation_period':['2023-01-01','2023-12-24'],'test_period':['2024-01-01','2025-12-24'],
      'rain':{'test_mae':float(mean_absolute_error(test.next_day_rain,pred)),'test_rmse':float(np.sqrt(mean_squared_error(test.next_day_rain,pred))),'baseline_mae':float(mean_absolute_error(test.next_day_rain,test.rain)),'baseline_name':'Persistence: tomorrow rain equals today rain','validation_mae':float(mean_absolute_error(valid.next_day_rain,rain.predict(x(valid))))},
      'dry_week':{'target':'Sum of next 7 days rainfall <7 mm; NOT a drought label','threshold':threshold,'validation':scores(vy,vp,threshold),'test':scores(dy,dp,threshold),'climatology_brier':float(brier_score_loss(dy,np.full(len(dy),float(train.dry_next_week.mean()))))},
      'rain_mae_by_city':{city:float(mean_absolute_error(g.next_day_rain,rain.predict(x(g)))) for city,g in test.groupby('city')},
      'versions':{'python':platform.python_version(),'sklearn':sklearn.__version__},'data_sha256':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in paths},
      'limitations':['Retrospective reanalysis, not issue-time forecast verification.','No held-out geographical region; no spatial generalisation claim.','No flood extent, damage, drought declaration, rain chemistry or cyclone landfall labels.','Model probabilities are not calibrated disaster probabilities.','Not connected to public alert decisions.']}
    dest=Path(out_dir);dest.mkdir(parents=True,exist_ok=True)
    joblib.dump({'model':rain,'features':FEATURES,'target':'next_day_rain'},dest/'rain_model.joblib')
    joblib.dump({'model':dry,'features':FEATURES,'target':'dry_next_week','threshold':threshold},dest/'dry_model.joblib')
    (dest/'model-report.json').write_text(json.dumps(report,indent=2))
    frame[['date','city']+FEATURES+['next_day_rain','dry_next_week']].tail(12).to_csv(dest/'feature_example.csv',index=False)
    pd.DataFrame({'date':test.date,'city':test.city,'observed_rain':test.next_day_rain,'predicted_rain':pred,'observed_dry_week':dy,'predicted_dry_week_probability':dp}).to_csv(dest/'heldout_predictions.csv',index=False)
    print(json.dumps({'rain':report['rain'],'dry_week':report['dry_week']['test'],'test_rows':len(test)},indent=2))

if __name__=='__main__':train()
