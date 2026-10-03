export type Level = "neutral" | "low" | "caution" | "danger";
export type Hazard = {
  id: string;
  name: string;
  level: Level;
  label: string;
  summary: string;
  detail: string;
  metric: string;
  source: string;
  url: string;
  window: string;
};
export const finite = (x: unknown): x is number =>
  typeof x === "number" && Number.isFinite(x);
export function sumComplete(values: unknown[], count: number) {
  return values.length === count && values.every(finite)
    ? (values as number[]).reduce((a, b) => a + b, 0)
    : null;
}
export function maxComplete(values: unknown[], count: number) {
  return values.length === count && values.every(finite)
    ? Math.max(...(values as number[]))
    : null;
}
export function rainfallLevel(mm: number | null): Level {
  return mm === null
    ? "neutral"
    : mm >= 100
      ? "danger"
      : mm >= 50
        ? "caution"
        : "low";
}
export function distanceKm(a: number, b: number, c: number, d: number) {
  const rad = Math.PI / 180;
  const x =
    Math.sin(((c - a) * rad) / 2) ** 2 +
    Math.cos(a * rad) * Math.cos(c * rad) * Math.sin(((d - b) * rad) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
export function makeHazards(data: any): Hazard[] {
  const w = data.weather.data;
  const rows = w?.hours || [];
  const r1 = sumComplete(
    rows.slice(0, 24).map((x: any) => x.rain),
    24,
  );
  const r2 = sumComplete(
    rows.slice(24, 48).map((x: any) => x.rain),
    24,
  );
  const maxRain = r1 !== null && r2 !== null ? Math.max(r1, r2) : null;
  const wind = maxComplete(
    rows.map((x: any) => x.wind),
    48,
  );
  const q = data.quakes.data?.events || [];
  const a = data.air.data;
  const dry = data.dry.data;
  const fld = rainfallLevel(maxRain);
  const fnum = maxRain === null ? "—" : `${maxRain.toFixed(1)} mm / 24h`;
  const storms = (data.cyclones.data?.events || []).filter(
    (s: any) => s.distance <= 800,
  );
  const serious = storms.some((s: any) => /red/i.test(s.level));
  return [
    {
      id: "flood",
      name: "Floods",
      level: fld,
      label:
        fld === "neutral"
          ? "Data unavailable"
          : fld === "danger"
            ? "High rainfall signal"
            : fld === "caution"
              ? "Rainfall watch"
              : "Below rainfall trigger",
      summary: "Rainfall screening · 48 hours",
      metric: fnum,
      source: "Open-Meteo / GloFAS",
      url: "https://open-meteo.com/en/docs/flood-api",
      window: "Next 48 hours",
      detail:
        "The larger of two consecutive 24-hour rainfall totals is compared with research triggers: watch ≥50 mm, high ≥100 mm. These are project thresholds, not official flood warning levels. Drainage, terrain, upstream releases and calibrated river thresholds are not yet modelled. A low rainfall signal does not rule out flooding.",
    },
    {
      id: "drought",
      name: "Droughts",
      level: !dry ? "neutral" : dry.dryDays >= 20 ? "caution" : "low",
      label: !dry
        ? "Data unavailable"
        : dry.dryDays >= 20
          ? "Dry-spell watch"
          : "Long-term monitor",
      summary: "Rainfall history · 30 days",
      metric: dry ? `${dry.dryDays} dry days` : "—",
      source: "Open-Meteo reanalysis",
      url: "https://open-meteo.com/en/docs/historical-weather-api",
      window: dry ? `${dry.start} to ${dry.end}` : "Recent 30 days",
      detail:
        "Counts days with less than 1 mm precipitation in the latest complete 30-day reanalysis window, ending five days ago. A project watch begins at 20 dry days. This is not a drought diagnosis. Seasonal climatology, SPI/SPEI, soil moisture and water supply are needed, especially in naturally dry seasons.",
    },
    {
      id: "earthquake",
      name: "Earthquakes",
      level: "neutral",
      label:
        data.quakes.status === "ok" ? "Recent activity" : "Feed unavailable",
      summary: "Recorded events · past 7 days",
      metric: data.quakes.status === "ok" ? `${q.length} within 500 km` : "—",
      source: "USGS",
      url: "https://www.usgs.gov/faqs/can-you-predict-earthquakes",
      window: "Past 7 days",
      detail:
        "These earthquakes have already happened. Reliable predictions of the time, place and magnitude of a future earthquake are not possible. Zero recorded events does not mean zero risk. Early warning detects a quake after it begins; it is a different task.",
    },
    {
      id: "acid-rain",
      name: "Acid rain",
      level: "neutral",
      label: a ? "Precursors only" : "Feed unavailable",
      summary: "Air chemistry · not rain acidity",
      metric:
        a?.so2 !== null && a?.so2 !== undefined
          ? `${a.so2.toFixed(1)} µg/m³ SO₂`
          : "—",
      source: "CAMS / Open-Meteo",
      url: "https://www.epa.gov/acidrain/what-acid-rain",
      window: "Current model hour",
      detail:
        "SO₂ and NO₂ are ingredients in acid deposition. Their concentrations alone do not establish rainwater acidity or predict an acid-rain event. This version has no precipitation-chemistry labels and sends no acid-rain danger alerts.",
    },
    {
      id: "cyclone",
      name: "Cyclones",
      level:
        data.cyclones.status !== "ok"
          ? "neutral"
          : storms.length
            ? serious
              ? "danger"
              : "caution"
            : "neutral",
      label:
        data.cyclones.status !== "ok"
          ? "Check official bulletins"
          : storms.length
            ? "Regional storm report"
            : "No nearby feed report",
      summary: "Reported storms · regional context",
      metric: wind === null ? "—" : `${wind.toFixed(0)} km/h peak wind`,
      source: "GDACS / IMD",
      url: "https://rsmcnewdelhi.imd.gov.in/",
      window: "Active feed reports",
      detail:
        "Shows GDACS tropical cyclone reports whose reported centre is within 800 km, not a forecast impact footprint. Events must be active or recently updated. Local wind alone does not diagnose a cyclone. Consult IMD track, coastal warnings and evacuation instructions.",
    },
  ];
}
