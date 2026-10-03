import { HISTORIC_EVENTS } from "./historic-events";
import { Area } from "./locations";
import { cached } from "./storage";
import { distanceKm, finite, makeHazards } from "./risk";
async function json(url: string) {
  const r = await fetch(url, {
    signal: AbortSignal.timeout(18000),
    headers: { Accept: "application/json" },
  });
  if (!r.ok) {
    const retry = r.headers.get("Retry-After");
    const retryTime =
      retry && /^\d+$/.test(retry)
        ? Date.now() + Number(retry) * 1000
        : Date.parse(retry || "");
    throw Object.assign(new Error(`Provider returned ${r.status}`), {
      status: r.status,
      retryAt: new Date(
        Math.max(
          Date.now() + (r.status === 429 ? 900000 : 60000),
          Number.isFinite(retryTime) ? retryTime : 0,
        ),
      ).toISOString(),
    });
  }
  return r.json() as Promise<any>;
}
const date = (days: number) =>
  new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
async function source(key: string, ttl: number, fn: () => Promise<any>) {
  try {
    return { status: "ok", ...(await cached(key, ttl, fn)) };
  } catch (e: any) {
    console.error("feed", key, String(e));
    return {
      status: "unavailable",
      data: null,
      fetchedAt: null,
      retryAt: e.retryAt ?? null,
      error:
        e.status === 429
          ? "The provider has temporarily limited requests. Other available sources remain visible. Please check official warnings."
          : "This source is temporarily unavailable. Please check official warnings.",
    };
  }
}
function validHours(raw: any) {
  if (!Array.isArray(raw?.hourly?.time)) throw new Error("Missing hourly data");
  return raw.hourly.time;
}
function tag(xml: string, name: string) {
  const v =
    xml.match(
      new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`),
    )?.[1] || "";
  return v
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .trim();
}
export async function monitor(area: Area) {
  const xy = `latitude=${area.lat}&longitude=${area.lon}`;
  const [weather, flood, air, quakes, cyclones, dry] = await Promise.all([
    source(`weather:v2:${area.id}`, 900, async () => {
      const raw = await json(
        `https://api.open-meteo.com/v1/forecast?${xy}&hourly=precipitation,precipitation_probability,temperature_2m,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,pressure_msl,soil_moisture_0_to_1cm&forecast_days=4&timezone=UTC`,
      );
      const times = validHours(raw);
      const hour = Math.ceil(Date.now() / 3600000) * 3600000;
      const hours = times
        .map((t: string, i: number) => ({
          time: t + "Z",
          rain: raw.hourly.precipitation?.[i] ?? null,
          probability: raw.hourly.precipitation_probability?.[i] ?? null,
          temperature: raw.hourly.temperature_2m?.[i] ?? null,
          humidity: raw.hourly.relative_humidity_2m?.[i] ?? null,
          wind: raw.hourly.wind_speed_10m?.[i] ?? null,
          gust: raw.hourly.wind_gusts_10m?.[i] ?? null,
          pressure: raw.hourly.pressure_msl?.[i] ?? null,
          soil: raw.hourly.soil_moisture_0_to_1cm?.[i] ?? null,
        }))
        .filter((x: any) => Date.parse(x.time) >= hour)
        .slice(0, 48);
      if (hours.length !== 48) throw new Error("Incomplete forecast");
      return { hours, latitude: raw.latitude, longitude: raw.longitude };
    }),
    source(`flood:v2:${area.id}`, 3600, async () => {
      const r = await json(
        `https://flood-api.open-meteo.com/v1/flood?${xy}&daily=river_discharge&forecast_days=7`,
      );
      if (!r.daily?.river_discharge?.some(finite))
        throw new Error("No modelled river coverage");
      return {
        days: r.daily.time,
        discharge: r.daily.river_discharge,
        latitude: r.latitude,
        longitude: r.longitude,
      };
    }),
    source(`air:v2:${area.id}`, 3600, async () => {
      const r = await json(
        `https://air-quality-api.open-meteo.com/v1/air-quality?${xy}&hourly=nitrogen_dioxide,sulphur_dioxide&forecast_days=4&timezone=UTC`,
      );
      const times = validHours(r);
      const now = Math.floor(Date.now() / 3600000) * 3600000;
      const i = times.findIndex((t: string) => Date.parse(t + "Z") >= now);
      if (i < 0) throw new Error("Missing current model hour");
      const so2 = r.hourly.sulphur_dioxide?.[i] ?? null;
      const no2 = r.hourly.nitrogen_dioxide?.[i] ?? null;
      if (!finite(so2) && !finite(no2)) throw new Error("No pollutant data");
      return {
        so2,
        no2,
        time: times[i] + "Z",
        latitude: r.latitude,
        longitude: r.longitude,
        hours: times.slice(i, i + 48).map((t: string, j: number) => ({
          time: t + "Z",
          so2: r.hourly.sulphur_dioxide?.[i + j] ?? null,
          no2: r.hourly.nitrogen_dioxide?.[i + j] ?? null,
        })),
      };
    }),
    source(`quake:v2:${area.id}`, 900, async () => {
      const r = await json(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${new Date(Date.now() - 7 * 86400000).toISOString()}&latitude=${area.lat}&longitude=${area.lon}&maxradiuskm=500&minmagnitude=2.5&orderby=time&limit=200`,
      );
      if (!Array.isArray(r.features))
        throw new Error("Invalid earthquake catalogue");
      return {
        limited: r.features.length === 200,
        events: r.features.map((f: any) => ({
          id: f.id,
          magnitude: f.properties.mag,
          place: f.properties.place,
          time: new Date(f.properties.time).toISOString(),
          url: f.properties.url,
          lat: f.geometry.coordinates[1],
          lon: f.geometry.coordinates[0],
          depth: f.geometry.coordinates[2],
        })),
      };
    }),
    source(`cyclone:${area.id}`, 1800, async () => {
      const r = await fetch("https://www.gdacs.org/xml/rss.xml", {
        signal: AbortSignal.timeout(18000),
      });
      if (!r.ok) throw new Error("Storm feed unavailable");
      const xml = await r.text();
      if (!xml.includes("<rss")) throw new Error("Invalid storm feed");
      const events = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/g)]
        .map((x) => x[1])
        .filter((x) => tag(x, "gdacs:eventtype") === "TC")
        .map((x) => ({
          id: tag(x, "gdacs:eventid"),
          title: tag(x, "title"),
          level: tag(x, "gdacs:alertlevel"),
          url: tag(x, "link"),
          lat: Number(tag(x, "geo:lat")),
          lon: Number(tag(x, "geo:long")),
          start: tag(x, "gdacs:fromdate"),
          end: tag(x, "gdacs:todate"),
          updated: tag(x, "gdacs:datemodified") || tag(x, "pubDate"),
        }))
        .filter(
          (x) =>
            Number.isFinite(x.lat) &&
            Number.isFinite(x.lon) &&
            Date.parse(x.end || x.updated) >= Date.now() - 86400000,
        )
        .map((x) => ({
          ...x,
          distance: Math.round(distanceKm(area.lat, area.lon, x.lat, x.lon)),
        }));
      return { events };
    }),
    source(`dry:v2:${area.id}`, 43200, async () => {
      const start = date(34),
        end = date(5);
      const r = await json(
        `https://archive-api.open-meteo.com/v1/archive?${xy}&start_date=${start}&end_date=${end}&daily=precipitation_sum&timezone=UTC`,
      );
      const p = r.daily?.precipitation_sum;
      if (!Array.isArray(p) || p.length !== 30 || !p.every(finite))
        throw new Error("Incomplete drought window");
      return {
        days: r.daily.time.map((time: string, i: number) => ({
          time,
          rain: p[i],
        })),
        dryDays: p.filter((n: number) => n < 1).length,
        rain: p.reduce((a: number, b: number) => a + b, 0),
        start,
        end,
      };
    }),
  ]);
  const data = { area, weather, flood, air, quakes, cyclones, dry };
  return {
    ...data,
    generatedAt: new Date().toISOString(),
    hazards: makeHazards(data),
  };
}
export async function historical(area: Area, year: number) {
  return source(`history:v2:${area.id}:${year}`, 86400, async () => {
    const r = await json(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${area.lat}&longitude=${area.lon}&start_date=${year}-01-01&end_date=${year}-12-31&daily=precipitation_sum,temperature_2m_mean&timezone=UTC`,
    );
    if (!r.daily?.time?.length) throw new Error("No historical record");
    const daily = r.daily.time.map((time: string, i: number) => ({
      time,
      rain: finite(r.daily.precipitation_sum?.[i])
        ? r.daily.precipitation_sum[i]
        : null,
      temperature: finite(r.daily.temperature_2m_mean?.[i])
        ? r.daily.temperature_2m_mean[i]
        : null,
    }));
    const months = Array.from({ length: 12 }, (_, i) => {
      const rows = daily.filter(
        (d: any) => Number(d.time.slice(5, 7)) === i + 1,
      );
      const expected = new Date(Date.UTC(year, i + 1, 0)).getUTCDate();
      const rainValid = rows.filter((d: any) => finite(d.rain));
      const tempValid = rows.filter((d: any) => finite(d.temperature));
      const complete = rainValid.length === expected;
      return {
        month: i + 1,
        days: expected,
        valid: rainValid.length,
        temperatureValid: tempValid.length,
        rain: complete
          ? rainValid.reduce((n: number, d: any) => n + d.rain, 0)
          : null,
        dryDays: complete
          ? rainValid.filter((d: any) => d.rain < 1).length
          : null,
        heavyDays: complete
          ? rainValid.filter((d: any) => d.rain >= 50).length
          : null,
        temperature:
          tempValid.length === expected
            ? tempValid.reduce((n: number, d: any) => n + d.temperature, 0) /
              expected
            : null,
      };
    });
    return {
      year,
      months,
      daily,
      latitude: r.latitude,
      longitude: r.longitude,
      source: "Open-Meteo reanalysis",
      url: "https://open-meteo.com/en/docs/historical-weather-api",
    };
  });
}
export async function eventHistory(id: string) {
  const event = HISTORIC_EVENTS.find((e) => e.id === id);
  if (!event) throw new Error("Unknown event");
  return source(`event:v1:${id}`, 86400, async () => {
    const xy = `latitude=${event.lat}&longitude=${event.lon}`;
    if (event.hazard === "earthquake") {
      const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${event.start}&endtime=${event.end}T23:59:59&${xy}&maxradiuskm=150&minmagnitude=2.5&orderby=time-asc&limit=1000`;
      const r = await json(url);
      if (!Array.isArray(r.features)) throw new Error("Catalogue unavailable");
      return {
        kind: "earthquake",
        url,
        limited: r.features.length === 1000,
        rows: r.features.map((f: any) => ({
          time: new Date(f.properties.time).toISOString(),
          magnitude: f.properties.mag,
          depth: f.geometry.coordinates[2],
          place: f.properties.place,
          url: f.properties.url,
        })),
        latitude: event.lat,
        longitude: event.lon,
      };
    }
    const url = `https://archive-api.open-meteo.com/v1/archive?${xy}&start_date=${event.start}&end_date=${event.end}&daily=precipitation_sum,wind_speed_10m_max,temperature_2m_max&timezone=UTC`;
    const r = await json(url);
    if (!r.daily?.time?.length) throw new Error("Reanalysis unavailable");
    return {
      kind: "weather",
      url,
      latitude: r.latitude,
      longitude: r.longitude,
      rows: r.daily.time.map((time: string, i: number) => ({
        time,
        rain: r.daily.precipitation_sum?.[i] ?? null,
        wind: r.daily.wind_speed_10m_max?.[i] ?? null,
        temperature: r.daily.temperature_2m_max?.[i] ?? null,
      })),
    };
  });
}
