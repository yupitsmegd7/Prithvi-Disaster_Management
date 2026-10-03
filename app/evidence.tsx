"use client";
import { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { finite, sumComplete, maxComplete, distanceKm } from "@/lib/risk";
export const HAZARDS = [
  { id: "flood", name: "Floods" },
  { id: "drought", name: "Droughts" },
  { id: "earthquake", name: "Earthquakes" },
  { id: "cyclone", name: "Cyclones" },
  { id: "acid-rain", name: "Acid rain" },
];
export const number = (v: unknown, d = 1) =>
  finite(v)
    ? v.toLocaleString("en-IN", {
        maximumFractionDigits: d,
        minimumFractionDigits: d,
      })
    : "Unavailable";
export const stamp = (v: string) =>
  new Date(v).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }) + " IST";
const shortDate = (v: string) =>
  v.length === 10
    ? new Date(v + "T00:00:00Z").toLocaleDateString("en-IN", {
        timeZone: "UTC",
        day: "numeric",
        month: "short",
      })
    : new Date(v).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        hour: "2-digit",
      });
export function HazardTabs({
  value,
  onChange,
  all = false,
}: {
  value: string;
  onChange: (v: string) => void;
  all?: boolean;
}) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className="tab-list hazard-tabs">
        {all && <TabsTrigger value="all">All events</TabsTrigger>}
        {HAZARDS.map((h) => (
          <TabsTrigger key={h.id} value={h.id}>
            {h.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
export function Metrics({
  items,
}: {
  items: { label: string; value: string; note?: string }[];
}) {
  return (
    <div className="evidence-metrics">
      {items.map((i) => (
        <div key={i.label}>
          <span>{i.label}</span>
          <strong>{i.value}</strong>
          {i.note && <small>{i.note}</small>}
        </div>
      ))}
    </div>
  );
}
export function DataChart({
  title,
  rows,
  series,
  unit,
  note,
  scatter = false,
}: {
  title: string;
  rows: any[];
  series: { key: string; name: string; color: string; bar?: boolean }[];
  unit: string;
  note: string;
  scatter?: boolean;
}) {
  const hasValues = rows.some((r) => series.some((s) => finite(r[s.key])));
  return (
    <figure className="data-figure">
      <figcaption>
        <h3>{title}</h3>
        <span>{unit}</span>
      </figcaption>
      {hasValues ? (
        <div
          className="evidence-chart"
          role="img"
          aria-label={`${title}. ${unit}. Exact values in the expandable table below.`}
        >
          <ResponsiveContainer
            width="100%"
            height={280}
            minWidth={1}
            initialDimension={{ width: 600, height: 280 }}
          >
            {scatter ? (
              <ScatterChart margin={{ top: 12, right: 18, left: 0, bottom: 8 }}>
                <CartesianGrid stroke="#e1e9e5" />
                <XAxis
                  dataKey="timestamp"
                  type="number"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={(v) => shortDate(new Date(v).toISOString())}
                  name="Recorded at"
                  tick={{ fontSize: 12 }}
                  minTickGap={45}
                />
                <YAxis
                  dataKey={series[0].key}
                  name={series[0].name}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v: any, name: any) => [
                    name === "Recorded at"
                      ? stamp(new Date(Number(v)).toISOString())
                      : number(v),
                    name,
                  ]}
                />
                <Scatter
                  data={rows
                    .filter((r) => finite(r[series[0].key]))
                    .map((r) => ({ ...r, timestamp: Date.parse(r.time) }))}
                  fill={series[0].color}
                  isAnimationActive={false}
                />
              </ScatterChart>
            ) : (
              <ComposedChart
                data={rows}
                margin={{ top: 12, right: 18, left: 0, bottom: 8 }}
              >
                <CartesianGrid stroke="#e1e9e5" vertical={false} />
                <XAxis
                  dataKey="time"
                  tickFormatter={shortDate}
                  minTickGap={50}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} width={48} />
                <Tooltip
                  labelFormatter={(v) =>
                    String(v).length === 10
                      ? String(v) + " · UTC day"
                      : stamp(String(v))
                  }
                  formatter={(v: any, name: any) => [
                    `${number(v, 2)} ${unit}`,
                    name,
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: 14 }} />
                {series.map((s) =>
                  s.bar ? (
                    <Bar
                      key={s.key}
                      dataKey={s.key}
                      name={s.name}
                      fill={s.color}
                      maxBarSize={24}
                      radius={[3, 3, 0, 0]}
                      isAnimationActive={false}
                    />
                  ) : (
                    <Line
                      key={s.key}
                      dataKey={s.key}
                      name={s.name}
                      stroke={s.color}
                      strokeWidth={2.2}
                      dot={rows.length < 10}
                      connectNulls={false}
                      type="linear"
                      isAnimationActive={false}
                    />
                  ),
                )}
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="chart-unavailable">
          No measurements available for this graph. Missing values are not
          treated as zero.
        </div>
      )}
      <p className="chart-method">{note}</p>
      {rows.length > 0 && (
        <details className="data-table-details">
          <summary>Inspect exact values ({rows.length} rows)</summary>
          <div className="table-scroll">
            <table>
              <caption>
                {title} · {unit}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Time / date</th>
                  {series.map((s) => (
                    <th scope="col" key={s.key}>
                      {s.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <th scope="row">
                      {r.time.length === 10 ? r.time : stamp(r.time)}
                    </th>
                    {series.map((s) => (
                      <td key={s.key}>{number(r[s.key], 2)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </figure>
  );
}
export function DownloadData({ rows, name }: { rows: any[]; name: string }) {
  return (
    <button
      disabled={!rows.length}
      className="download-small"
      onClick={() => {
        const keys = Object.keys(rows[0]);
        const escape = (v: any) =>
          '"' + String(v ?? "").replaceAll('"', '""') + '"';
        const csv = [
          keys.map(escape).join(","),
          ...rows.map((r) => keys.map((k) => escape(r[k])).join(",")),
        ].join("\n");
        const url = URL.createObjectURL(
          new Blob([csv], { type: "text/csv;charset=utf-8" }),
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = name + ".csv";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }}
    >
      Download data · CSV
    </button>
  );
}
export default function Evidence({
  data,
  busy,
  error,
  onRetry,
  areaName,
}: {
  data: any;
  busy: boolean;
  error?: string;
  onRetry: () => void;
  areaName: string;
}) {
  const [hazard, setHazard] = useState("flood");
  const h = data?.hazards?.find((x: any) => x.id === hazard);
  const weather = data?.weather?.data?.hours ?? [],
    dry = data?.dry?.data,
    air = data?.air?.data;
  const quakes = data?.quakes?.data?.events ?? [];
  const storms = (data?.cyclones?.data?.events ?? []).filter(
    (e: any) => e.distance <= 800,
  );
  const river = data?.flood?.data;
  const rain1 = sumComplete(
      weather.slice(0, 24).map((r: any) => r.rain),
      24,
    ),
    rain2 = sumComplete(
      weather.slice(24, 48).map((r: any) => r.rain),
      24,
    );
  const sources: Record<string, string[]> = {
    flood: ["weather", "flood"],
    drought: ["dry"],
    earthquake: ["quakes"],
    cyclone: ["weather", "cyclones"],
    "acid-rain": ["air"],
  };
  return (
    <section className="panel evidence-panel" id="evidence">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">THE EVIDENCE DESK</span>
          <h2>One hazard. A clearer picture.</h2>
        </div>
        <div className="evidence-actions">
          <span className="status neutral">{areaName}</span>
          <button className="refresh" disabled={busy} onClick={onRetry}>
            {busy ? "Checking sources…" : "Refresh evidence"}
          </button>
        </div>
      </div>
      <HazardTabs value={hazard} onChange={setHazard} />
      {busy && (
        <p className="subtle-note" role="status">
          Checking the current data sources…
          {data
            ? " The last response remains visible while we refresh."
            : " You can still explore each hazard below."}
        </p>
      )}
      {!data && error && (
        <p className="data-notice" role="alert">
          {error}
        </p>
      )}
      <>
        <div className="evidence-intro">
          <div>
            <h3>{h?.name ?? HAZARDS.find((x) => x.id === hazard)?.name}</h3>
            <p>
              {h?.detail ??
                "The data source has not returned a usable response. Check official warnings."}
            </p>
          </div>
          {h && <span className={`status ${h.level}`}>{h.label}</span>}
        </div>
        {data &&
          sources[hazard]
            .filter((key) => data[key]?.status !== "ok")
            .map((key) => (
              <p className="data-notice" key={key} role="status">
                <b>
                  {
                    {
                      weather: "Weather forecast",
                      flood: "River discharge",
                      dry: "Rainfall history",
                      quakes: "Earthquake catalogue",
                      cyclones: "Cyclone reports",
                      air: "Air chemistry",
                    }[key]
                  }
                  :{" "}
                </b>
                {data[key]?.error || "No usable response is available."}
                {data[key]?.retryAt &&
                  ` Next provider attempt after ${stamp(data[key].retryAt)}.`}
              </p>
            ))}
        {hazard === "flood" && (
          <>
            <Metrics
              items={[
                {
                  label: "First 24 hours",
                  value: number(rain1) + " mm",
                  note: "Total forecast precipitation",
                },
                {
                  label: "Following 24 hours",
                  value: number(rain2) + " mm",
                  note: "Separate 24-hour window",
                },
                {
                  label: "Research rainfall triggers",
                  value: "50 / 100 mm",
                  note: "Watch / high · per 24h; not flood probability",
                },
              ]}
            />
            <div className="evidence-chart-grid">
              <DataChart
                title="Hourly precipitation"
                rows={weather}
                unit="mm"
                series={[
                  {
                    key: "rain",
                    name: "Rainfall",
                    bar: true,
                    color: "#257e83",
                  },
                ]}
                note="Forecast accumulation in each preceding hour, labelled by its end time. Rainfall alone cannot determine local inundation."
              />
              <DataChart
                title="Modelled river discharge"
                rows={
                  river?.days?.map((time: string, i: number) => ({
                    time,
                    discharge: river.discharge[i],
                  })) ?? []
                }
                unit="m³/s"
                series={[
                  {
                    key: "discharge",
                    name: "Daily discharge",
                    color: "#386995",
                  },
                ]}
                note={`GloFAS river grid${river ? ` at ${number(river.latitude, 3)}° N, ${number(river.longitude, 3)}° E` : ""}. A modelled river cell may differ from your city. No calibrated flood threshold or street water depth is available.`}
              />
            </div>
          </>
        )}
        {hazard === "drought" && (
          <>
            <Metrics
              items={[
                {
                  label: "Dry days",
                  value: dry ? `${dry.dryDays} / 30` : "Unavailable",
                  note: "Daily precipitation below 1 mm",
                },
                {
                  label: "Window rainfall",
                  value: number(dry?.rain) + " mm",
                },
                {
                  label: "Reanalysis window",
                  value: dry ? dry.end : "Unavailable",
                  note: "End date · data delayed by five days",
                },
              ]}
            />
            <DataChart
              title="A month of daily rainfall"
              rows={dry?.days ?? []}
              unit="mm"
              series={[
                {
                  key: "rain",
                  name: "Daily precipitation",
                  bar: true,
                  color: "#a38948",
                },
              ]}
              note={`${dry ? `${dry.start} to ${dry.end}. ` : ""}UTC daily totals. Twenty dry days trigger a research watch; this is not an official drought index. A normal dry season can produce the same signal.`}
            />
          </>
        )}
        {hazard === "earthquake" && (
          <>
            <Metrics
              items={[
                {
                  label: "Recorded events",
                  value:
                    data?.quakes?.status === "ok"
                      ? String(quakes.length)
                      : "Unavailable",
                  note: "M2.5+ · 500 km · past 7 days",
                },
                {
                  label: "Largest recorded magnitude",
                  value: quakes.some((q: any) => finite(q.magnitude))
                    ? number(
                        Math.max(
                          ...quakes
                            .filter((q: any) => finite(q.magnitude))
                            .map((q: any) => q.magnitude),
                        ),
                      )
                    : "No usable record",
                },
                {
                  label: "Forecast capability",
                  value: "No prediction",
                  note: "Catalogue records describe past events",
                },
              ]}
            />
            <DataChart
              title="Magnitude through time"
              rows={quakes}
              unit="Magnitude"
              series={[
                { key: "magnitude", name: "Magnitude", color: "#81729b" },
              ]}
              scatter
              note="Each point is one recorded earthquake. Magnitude is logarithmic; it is not the local shaking intensity. This query returns up to 200 recent records. A quiet catalogue does not establish safety."
            />
            {data?.quakes?.data?.limited && (
              <p className="notice">
                The 200-record cap was reached. This view may omit earlier
                events in the window.
              </p>
            )}
            {quakes.length > 0 && (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Depth</th>
                      <th>Distance from city</th>
                      <th>Recorded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quakes.map((q: any) => (
                      <tr key={q.id}>
                        <td>
                          <a
                            className="source-link"
                            href={q.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {q.place}
                          </a>
                        </td>
                        <td>{number(q.depth)} km</td>
                        <td>
                          {number(
                            distanceKm(
                              data.area.lat,
                              data.area.lon,
                              q.lat,
                              q.lon,
                            ),
                            0,
                          )}{" "}
                          km
                        </td>
                        <td>{stamp(q.time)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        {hazard === "cyclone" && (
          <>
            <Metrics
              items={[
                {
                  label: "Peak local wind",
                  value:
                    number(
                      maxComplete(
                        weather.map((r: any) => r.wind),
                        48,
                      ),
                    ) + " km/h",
                  note: "Forecast at 10 m · next 48h",
                },
                {
                  label: "Peak local gust",
                  value:
                    number(
                      maxComplete(
                        weather.map((r: any) => r.gust),
                        48,
                      ),
                    ) + " km/h",
                  note: "Gusts are distinct from sustained wind",
                },
                {
                  label: "Nearby GDACS reports",
                  value:
                    data?.cyclones?.status === "ok"
                      ? String(storms.length)
                      : "Unavailable",
                  note: "Reported centres within 800 km",
                },
              ]}
            />
            <div className="evidence-chart-grid">
              <DataChart
                title="Local wind and gusts"
                rows={weather}
                unit="km/h"
                series={[
                  { key: "wind", name: "Wind at 10 m", color: "#257e83" },
                  { key: "gust", name: "Gusts", color: "#bd834c" },
                ]}
                note="Grid forecast at your selected city, not the cyclone’s maximum wind or forecast track."
              />
              <DataChart
                title="Sea-level pressure"
                rows={weather}
                unit="hPa"
                series={[
                  { key: "pressure", name: "Pressure", color: "#386995" },
                ]}
                note="Modelled pressure at your city. A falling pressure trend alone does not diagnose a cyclone."
              />
            </div>
            {storms.map((s: any) => (
              <div className="storm-event" key={s.id}>
                <div>
                  <a
                    href={
                      s.url?.startsWith("https://")
                        ? s.url
                        : "https://www.gdacs.org/"
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.title}
                  </a>
                  <small>
                    {s.distance} km to reported centre · {s.level} GDACS level ·
                    updated {s.updated ? stamp(s.updated) : "unavailable"}
                  </small>
                </div>
              </div>
            ))}
            {!storms.length && (
              <p className="subtle-note">
                {data?.cyclones?.status === "ok"
                  ? "No nearby cyclone report returned by this feed. This does not replace current IMD coastal warnings."
                  : "Cyclone reports are unavailable. Consult the IMD bulletin."}
              </p>
            )}
          </>
        )}
        {hazard === "acid-rain" && (
          <>
            <Metrics
              items={[
                {
                  label: "Sulphur dioxide",
                  value: number(air?.so2, 2) + " µg/m³",
                  note: "Current model hour",
                },
                {
                  label: "Nitrogen dioxide",
                  value: number(air?.no2, 2) + " µg/m³",
                  note: "Current model hour",
                },
                {
                  label: "Rainwater pH",
                  value: "Not measured",
                  note: "No acid-rain event is inferred",
                },
              ]}
            />
            <DataChart
              title="Acid-deposition precursors"
              rows={air?.hours ?? []}
              unit="µg/m³"
              series={[
                { key: "so2", name: "SO₂", color: "#81729b" },
                { key: "no2", name: "NO₂", color: "#bd834c" },
              ]}
              note="CAMS model concentrations. Airborne SO₂ and NO₂ do not determine rainwater pH. No acid-rain alert threshold is applied."
            />
          </>
        )}
        <div className="evidence-foot">
          <div>
            {sources[hazard].map((k) => (
              <small key={k}>
                {
                  (
                    {
                      weather: "Open-Meteo forecast",
                      flood: "GloFAS / Open-Meteo",
                      dry: "Open-Meteo reanalysis",
                      quakes: "USGS catalogue",
                      cyclones: "GDACS",
                      air: "CAMS / Open-Meteo",
                    } as any
                  )[k]
                }{" "}
                ·{" "}
                {data?.[k]?.status === "ok" && data[k].fetchedAt
                  ? `retrieved ${stamp(data[k].fetchedAt)}`
                  : "unavailable"}
              </small>
            ))}
          </div>
          <a className="text-link" href={`/prepare#${hazard}`}>
            Open the {HAZARDS.find((x) => x.id === hazard)?.name.toLowerCase()}{" "}
            preparation guide
          </a>
        </div>
      </>
    </section>
  );
}
