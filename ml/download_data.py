"""Download daily reanalysis; preserve retrieval metadata for reproducibility."""
from pathlib import Path
from urllib.request import urlopen
from urllib.parse import urlencode
from datetime import datetime, timezone
import json, argparse, time
import pandas as pd

CITIES = {'bhubaneswar': (20.2961,85.8245), 'kolkata':(22.5726,88.3639), 'jaipur':(26.9124,75.7873)}

def download(start='2000-01-01', end='2025-12-31', out='ml/data'):
    dest=Path(out); dest.mkdir(parents=True, exist_ok=True)
    manifest=[]
    for city,(lat,lon) in CITIES.items():
        query=urlencode(dict(latitude=lat,longitude=lon,start_date=start,end_date=end,
            daily='precipitation_sum,temperature_2m_mean,wind_speed_10m_max',timezone='UTC'))
        url='https://archive-api.open-meteo.com/v1/archive?'+query
        path=dest/f'{city}.csv'
        # Do not silently mix old data with different requested dates.
        payload=None
        for attempt in range(3):
            try:
                with urlopen(url,timeout=90) as response: payload=json.load(response)
                break
            except Exception:
                if attempt==2: raise
                time.sleep(2**attempt)
        frame=pd.DataFrame(payload['daily']).rename(columns={'time':'date','precipitation_sum':'rain','temperature_2m_mean':'temperature','wind_speed_10m_max':'wind'})
        frame['city']=city;frame['latitude']=lat;frame['longitude']=lon
        frame.to_csv(path,index=False)
        manifest.append({'city':city,'url':url,'retrieved_at':datetime.now(timezone.utc).isoformat(),'rows':len(frame),'missing':int(frame.isna().sum().sum()),'path':path.name})
        print(city,len(frame),'daily records')
    (dest/'manifest.json').write_text(json.dumps(manifest,indent=2))

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--start',default='2000-01-01');p.add_argument('--end',default='2025-12-31');p.add_argument('--out',default='ml/data');a=p.parse_args();download(a.start,a.end,a.out)
