"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HISTORIC_EVENTS } from "@/lib/historic-events";
import { finite, sumComplete, maxComplete } from "@/lib/risk";
import {
  DataChart,
  DownloadData,
  HazardTabs,
  Metrics,
  number,
  stamp,
  HAZARDS,
} from "./evidence";
function useRecord(url: string) {
  const [state, setState] = useState<{
    data: any;
    busy: boolean;
    error: string;
    fetchedAt: string | null;
  }>({ data: null, busy: true, error: "", fetchedAt: null });
  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, busy: true, error: "", fetchedAt: null });
    fetch(url, { signal: controller.signal })
      .then(async (r) => {
        const d: any = await r.json();
        if (!r.ok || d.status !== "ok")
          throw new Error(
            d.error ||
              "The provider did not return a usable record. Try again later.",
          );
        return d;
      })
      .then((d) =>
        setState({
          data: d.data,
          busy: false,
          error: "",
          fetchedAt: d.fetchedAt,
        }),
      )
      .catch((e) => {
        if (!controller.signal.aborted)
          setState({
            data: null,
            busy: false,
            error: e.message,
            fetchedAt: null,
          });
      });
    return () => controller.abort();
  }, [url]);
  return state;
}
function RecordState({ busy, error }: { busy: boolean; error: string }) {
  return busy ? (
    <p className="chart-unavailable" role="status">
      Retrieving the historical series…
    </p>
  ) : error ? (
    <p className="chart-unavailable" role="alert">
      {error} The documented event remains available; its graph is not filled
      with estimated values.
    </p>
  ) : null;
}
export default function HistoryAtlas({
  areaId,
  area,
}: {
  areaId: string;
  area: any;
}) {
  const [kind, setKind] = useState("all"),
    [eventId, setEventId] = useState("fani-2019"),
    [related, setRelated] = useState(false);
  const events = HISTORIC_EVENTS.filter(
    (e) =>
      (kind === "all" || e.hazard === kind) &&
      (!related || e.areas.includes(areaId)),
  );
  const event = events.find((e) => e.id === eventId) ?? events[0];
  return (
    <>
      <div className="notice">
        <span>
          <b>History helps us ask better questions.</b> Dates here describe
          recorded events or seasons, not a schedule for the next disaster.
        </span>
      </div>
      <section className="atlas-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">DOCUMENTED EVENTS · 2001–2021</span>
            <h2>Open a case. See what happened.</h2>
          </div>
          <button
            className={related ? "filter-active" : ""}
            aria-pressed={related}
            onClick={() => setRelated(!related)}
          >
            {related
              ? `Related to ${area.name}`
              : "Show events related to my city"}
          </button>
        </div>
        <HazardTabs value={kind} onChange={setKind} all />
        <p className="subtle-note">
          {events.length} curated case{events.length === 1 ? "" : "s"} · India
          and regional context. This selection is not a complete catalogue or an
          estimate of disaster frequency. City relevance is educational, not a
          mapped impact boundary.
        </p>
        {event ? (
          <div className="atlas-layout">
            <div className="event-selector" aria-label="Historical cases">
              {events.map((e) => (
                <button
                  key={e.id}
                  className={e.id === event.id ? "active" : ""}
                  aria-pressed={e.id === event.id}
                  onClick={() => setEventId(e.id)}
                >
                  <small>
                    {e.dateLabel} ·{" "}
                    {HAZARDS.find((h) => h.id === e.hazard)?.name}
                  </small>
                  <strong>{e.name}</strong>
                  <span>{e.place}</span>
                </button>
              ))}
            </div>
            <EventRecord key={event.id} event={event} />
          </div>
        ) : (
          <div className="panel empty-state">
            <h3>
              {kind === "acid-rain"
                ? "Rain chemistry needs measured evidence"
                : "No matching documented case in this selection"}
            </h3>
            <p>
              {kind === "acid-rain"
                ? "A verified Indian precipitation-chemistry event catalogue is not connected. SO₂ and NO₂ charts show precursors only, so no historical acid-rain events or pH values are invented."
                : "Try all events. An empty selection does not mean this city has never experienced a disaster."}
            </p>
            <a
              className="text-link"
              href="https://www.epa.gov/acidrain/what-acid-rain"
              target="_blank"
              rel="noreferrer"
            >
              {kind === "acid-rain"
                ? "Read EPA’s explanation of acid deposition"
                : ""}
            </a>
          </div>
        )}
      </section>
      <ClimateRecord key={areaId} areaId={areaId} area={area} />
    </>
  );
}
function EventRecord({ event }: { event: (typeof HISTORIC_EVENTS)[number] }) {
  const record = useRecord(`/api/event-history?event=${event.id}`),
    [metric, setMetric] = useState("rain");
  const earthquake = event.hazard === "earthquake";
  const labels: Record<string, { label: string; unit: string }> = {
    rain: { label: "Daily precipitation", unit: "mm" },
    wind: { label: "Maximum daily wind at 10 m", unit: "km/h" },
    temperature: { label: "Maximum daily temperature", unit: "°C" },
  };
  return (
    <article className="panel event-record">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">{event.dateLabel}</span>
          <h2>{event.name}</h2>
          <p>{event.place}</p>
        </div>
        <span className="status neutral">Historical record</span>
      </div>
      <div className="record-headline">
        <strong>{event.metric}</strong>
        <span>{event.metricLabel}</span>
      </div>
      <p>{event.summary}</p>
      <a
        className="source-link"
        href={event.url}
        target="_blank"
        rel="noreferrer"
      >
        Official record · {event.source}
      </a>
      <div className="record-context">
        <b>
          {earthquake ? "Recorded sequence" : "Local weather during the event"}
        </b>
        <p>
          {event.point} · requested point {event.lat.toFixed(3)}° N,{" "}
          {event.lon.toFixed(3)}° E<br />
          {event.start} to {event.end} ·{" "}
          {earthquake
            ? "150 km radius · M2.5+ · USGS"
            : "Daily reanalysis · Open-Meteo"}
        </p>
      </div>
      <RecordState busy={record.busy} error={record.error} />
      {record.data && (
        <>
          {!earthquake && (
            <Tabs value={metric} onValueChange={setMetric}>
              <TabsList className="tab-list">
                <TabsTrigger value="rain">Rainfall</TabsTrigger>
                <TabsTrigger value="wind">Wind</TabsTrigger>
                <TabsTrigger value="temperature">Temperature</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          <DataChart
            title={
              earthquake
                ? "Earthquake magnitude through time"
                : labels[metric].label
            }
            rows={record.data.rows}
            unit={earthquake ? "Magnitude" : labels[metric].unit}
            series={[
              {
                key: earthquake ? "magnitude" : metric,
                name: earthquake ? "Magnitude" : labels[metric].label,
                color: earthquake ? "#81729b" : "#287d83",
                bar: !earthquake && metric === "rain",
              },
            ]}
            scatter={earthquake}
            note={
              earthquake
                ? "Recorded earthquakes in the specified window and radius. This is not a forecast of aftershocks. Catalogue completeness varies with time and magnitude."
                : `Grid reanalysis at ${number(record.data.latitude, 3)}° N, ${number(record.data.longitude, 3)}° E; UTC daily values. Not a station observation, cyclone best-track intensity, or flood depth. Local modelled wind can differ greatly from the official storm maximum.`
            }
          />
          {record.data.limited && (
            <p className="notice">
              The 1,000-record retrieval cap was reached; this sequence may be
              incomplete.
            </p>
          )}
          <div className="evidence-foot">
            <DownloadData
              rows={record.data.rows}
              name={`prithvi-${event.id}`}
            />
            <a
              className="source-link"
              href={record.data.url}
              target="_blank"
              rel="noreferrer"
            >
              Inspect the provider query
            </a>
          </div>
          <small>
            {record.fetchedAt ? `Retrieved ${stamp(record.fetchedAt)}` : ""}
          </small>
        </>
      )}
      <aside className="lesson-box">
        <span className="eyebrow">A LESSON TO CARRY FORWARD</span>
        <p>{event.lesson}</p>
        <a className="text-link" href={`/prepare#${event.hazard}`}>
          Practise the preparation steps
        </a>
      </aside>
    </article>
  );
}
function ClimateRecord({ areaId, area }: { areaId: string; area: any }) {
  const [year, setYear] = useState("2025"),
    [metric, setMetric] = useState("rain");
  const record = useRecord(`/api/history?area=${areaId}&year=${year}`);
  const monthly = (record.data?.months ?? []).map((m: any) => ({
    ...m,
    time: `${year}-${String(m.month).padStart(2, "0")}-01`,
  }));
  const daily = record.data?.daily ?? [],
    expected = Number(year) % 4 === 0 ? 366 : 365;
  const labels: Record<string, { label: string; unit: string }> = {
    rain: { label: "Monthly rainfall", unit: "mm" },
    dryDays: { label: "Dry days per month", unit: "days" },
    heavyDays: { label: "Days with at least 50 mm rain", unit: "days" },
    temperature: { label: "Monthly mean temperature", unit: "°C" },
  };
  return (
    <section className="panel climate-section">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">SEASONAL CONTEXT · {area.name}</span>
          <h2>A year in local weather</h2>
        </div>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger
            aria-label="Historical weather year"
            className="picker"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="select-menu">
            {Array.from({ length: 26 }, (_, i) => String(2025 - i)).map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p>
        Explore 2000–2025. Each month uses all of its expected days; an
        incomplete month stays blank. Rainfall and temperature coverage are
        checked separately.
      </p>
      <RecordState busy={record.busy} error={record.error} />
      {record.data && (
        <>
          <Metrics
            items={[
              {
                label: "Annual precipitation",
                value:
                  number(
                    sumComplete(
                      monthly.map((m: any) => m.rain),
                      12,
                    ),
                  ) + " mm",
              },
              {
                label: "Wettest daily total",
                value:
                  number(
                    maxComplete(
                      daily.map((d: any) => d.rain),
                      expected,
                    ),
                  ) + " mm",
                note: "Largest complete UTC-day total",
              },
              {
                label: "Rainfall coverage",
                value: `${daily.filter((d: any) => finite(d.rain)).length} / ${expected} days`,
                note: "Reanalysis, not station measurements",
              },
            ]}
          />
          <Tabs value={metric} onValueChange={setMetric}>
            <TabsList className="tab-list history-tabs">
              <TabsTrigger value="rain">Rainfall</TabsTrigger>
              <TabsTrigger value="dryDays">Dry days</TabsTrigger>
              <TabsTrigger value="heavyDays">Heavy rain</TabsTrigger>
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
            </TabsList>
          </Tabs>
          <DataChart
            title={labels[metric].label}
            unit={labels[metric].unit}
            rows={monthly}
            series={[
              {
                key: metric,
                name: labels[metric].label,
                color: "#287d83",
                bar: metric !== "temperature",
              },
            ]}
            note={`A dry day has less than 1 mm rain. The ≥50 mm daily threshold is a project analysis cutoff, not an IMD rainfall category. This seasonal view is not a disaster-frequency chart. Grid ${number(record.data.latitude, 3)}° N, ${number(record.data.longitude, 3)}° E.`}
          />
          <details className="daily-record">
            <summary>Examine all {daily.length} daily rainfall values</summary>
            <DataChart
              title="Daily precipitation through the year"
              rows={daily}
              unit="mm"
              series={[
                { key: "rain", name: "Rainfall", color: "#287d83", bar: true },
              ]}
              note="Daily reanalysis totals. Gaps remain missing; monthly values above are not interpolated."
            />
          </details>
          <div className="evidence-foot">
            <DownloadData
              rows={daily}
              name={`prithvi-${areaId}-${year}-daily`}
            />
            <a
              className="source-link"
              href={record.data.url}
              target="_blank"
              rel="noreferrer"
            >
              Open-Meteo historical data documentation
            </a>
          </div>
          <small>
            {record.fetchedAt ? `Retrieved ${stamp(record.fetchedAt)}` : ""}
          </small>
        </>
      )}
    </section>
  );
}
