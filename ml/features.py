"""Issue features at the end of day t; all targets start on t+1."""
import numpy as np
import pandas as pd
FEATURES=['rain','rain_3d','rain_7d','rain_30d','temperature','wind','month_sin','month_cos','latitude','longitude']

def build_features(frame):
    parts=[]
    for city,g in frame.groupby('city'):
        g=g.sort_values('date').copy()
        g['date']=pd.to_datetime(g['date'])
        if g.date.duplicated().any(): raise ValueError(f'Duplicate dates for {city}')
        if not (g.date.diff().dropna()==pd.Timedelta(days=1)).all(): raise ValueError(f'Non-contiguous series: {city}')
        for days in [3,7,30]: g[f'rain_{days}d']=g.rain.rolling(days,min_periods=days).sum()
        month=g.date.dt.month
        g['month_sin']=np.sin(2*np.pi*month/12)
        g['month_cos']=np.cos(2*np.pi*month/12)
        g['next_day_rain']=g.rain.shift(-1)
        # Sum exactly the following seven days; missing days stay missing.
        future=pd.concat([g.rain.shift(-i) for i in range(1,8)],axis=1)
        g['next_7d_rain']=future.sum(axis=1,min_count=7)
        g['dry_next_week']=(g.next_7d_rain<7).where(g.next_7d_rain.notna())
        parts.append(g)
    return pd.concat(parts).dropna(subset=FEATURES+['next_day_rain','dry_next_week']).reset_index(drop=True)

def split_time(frame):
    # Seven-day embargo prevents training labels crossing the split boundary.
    train=frame[frame.date<'2022-12-25']
    valid=frame[(frame.date>='2023-01-01')&(frame.date<'2023-12-25')]
    test=frame[(frame.date>='2024-01-01')&(frame.date<'2025-12-25')]
    return train,valid,test
