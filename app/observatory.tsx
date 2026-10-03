"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Globe2,
  MapPin,
  Bell,
  ArrowUpRight,
  Waves,
  Wind,
  Activity,
  CloudRain,
  Sprout,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  Download,
  Phone,
  BookOpen,
  Check,
  Info,
  Mail,
  Clock,
  Database,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area as ChartArea,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Toaster, toast } from "sonner";
import { AREAS, SOURCES } from "@/lib/locations";
import { Hazard, sumComplete, makeHazards } from "@/lib/risk";
import { api } from "@/lib/client-api";
import { CONTACTS } from "@/lib/content";
import Evidence from "./evidence";
import HistoryAtlas from "./history-atlas";
import Preparedness from "./preparedness";
const icons: any = {
  flood: Waves,
  drought: Sprout,
  earthquake: Activity,
  "acid-rain": CloudRain,
  cyclone: Wind,
};
const NAV = [
  ["/", "Overview", "overview"],
  ["/history", "Historical atlas", "history"],
  ["/prepare", "Be prepared", "prepare"],
  ["/help", "Emergency help", "help"],
];
const fmt = (t: string) =>
  new Date(t).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
const hour = (t: string) =>
  new Date(t).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  });
const n = (v: any, dec = 1) =>
  typeof v === "number" && Number.isFinite(v) ? v.toFixed(dec) : "—";
function Picker({ value, onChange, items, label }: any) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className="picker">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="select-menu">
        {items.map((x: any) => (
          <SelectItem key={x.value} value={x.value}>
            {x.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
function Empty({ text, onRetry }: any) {
  return (
    <div className="empty-state">
      <Info size={25} />
      <p>{text}</p>
      {onRetry && <button onClick={onRetry}>Try again</button>}
    </div>
  );
}
export default function Observatory({
  page = "overview",
  signInHref = "/",
  signOutHref = "/",
}: {
  page?: string;
  signInHref?: string;
  signOutHref?: string;
}) {
  const [areaId, setAreaId] = useState("bhubaneswar");
  const [areaReady, setAreaReady] = useState(false);
  const area = AREAS.find((a) => a.id === areaId)!;
  const [snapshot, setData] = useState<any>(null),
    [busy, setBusy] = useState(true),
    [error, setError] = useState("");
  const data = snapshot?.area?.id === areaId ? snapshot : null;
  const [account, setAccount] = useState<any>(null),
    [accountError, setAccountError] = useState(""),
    [alerts, setAlerts] = useState<any[]>([]),
    [inboxError, setInboxError] = useState("");
  const [showAccount, setShowAccount] = useState(false),
    [detail, setDetail] = useState<Hazard | null>(null);
  const [profileArea, setProfileArea] = useState("bhubaneswar"),
    [threshold, setThreshold] = useState("caution"),
    [enabled, setEnabled] = useState(true),
    [emailOn, setEmailOn] = useState(false),
    [saving, setSaving] = useState(false);
  const reqId = useRef(0);
  const pending = useRef<AbortController | null>(null);
  const notified = useRef(new Set<string>());
  const loadAccount = useCallback(async () => {
    try {
      const a = await api("/api/profile");
      setAccount(a);
      setAccountError("");
      if (a.profile) {
        setProfileArea(a.profile.area_id);
        setThreshold(a.profile.threshold);
        setEnabled(!!a.profile.enabled);
        setEmailOn(!!a.profile.email_enabled);
      }
      return a;
    } catch (e: any) {
      setAccountError(e.message);
      return null;
    }
  }, []);
  const loadInbox = useCallback(async () => {
    try {
      const r = await api("/api/alerts");
      setAlerts(r.alerts);
      setInboxError("");
      return r.alerts;
    } catch (e: any) {
      setInboxError(e.message);
      return [];
    }
  }, []);
  useEffect(() => {
    let local: string | null = null;
    try {
      local = localStorage.getItem("prithvi-view-area");
    } catch {}
    if (AREAS.some((a) => a.id === local)) setAreaId(local!);
    setAreaReady(true);
    loadAccount().then((a) => {
      if (a?.profile && !local) setAreaId(a.profile.area_id);
    });
    if (new URLSearchParams(location.search).has("alerts"))
      setShowAccount(true);
    loadInbox();
  }, [loadAccount, loadInbox]);
  const chooseArea = useCallback((id: string) => {
    if (!AREAS.some((a) => a.id === id)) throw new Error("Unsupported area");
    setAreaId(id);
    setDetail(null);
    try {
      localStorage.setItem("prithvi-view-area", id);
    } catch {}
  }, []);
  const refresh = useCallback(async () => {
    const id = ++reqId.current;
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    setBusy(true);
    setError("");
    try {
      const d = await api(`/api/monitor?area=${areaId}`, {
        signal: controller.signal,
      });
      if (d?.area?.id !== areaId || !Array.isArray(d.hazards))
        throw new Error("The area data was incomplete. Please try again.");
      if (id === reqId.current) {
        setData(d);
        void loadInbox();
      }
    } catch (e: any) {
      if (id === reqId.current && !controller.signal.aborted)
        setError(e.message);
    } finally {
      if (id === reqId.current) setBusy(false);
    }
  }, [areaId, loadInbox]);
  useEffect(() => {
    if (page !== "overview" || !areaReady) return;
    refresh();
    const timer = setInterval(
      () => {
        if (page === "overview") refresh();
      },
      15 * 60 * 1000,
    );
    return () => {
      clearInterval(timer);
      ++reqId.current;
      pending.current?.abort();
    };
  }, [page, areaReady, refresh]);
  useEffect(() => {
    if (
      !account?.profile?.enabled ||
      typeof Notification === "undefined" ||
      Notification.permission !== "granted"
    )
      return;
    for (const a of alerts) {
      if (
        a.read_at ||
        notified.current.has(a.id) ||
        Date.now() - Date.parse(a.created_at) > 3600000
      )
        continue;
      notified.current.add(a.id);
      try {
        new Notification(`Prithvi: ${a.title}`, {
          body: a.body,
          tag: a.id,
          icon: "/favicon.svg",
        });
      } catch {}
    }
  }, [alerts, account]);
  useEffect(() => {
    const ctx = (document as any).modelContext;
    if (!ctx?.registerTool) return;
    const lifecycle = new AbortController();
    Promise.resolve(
      ctx.registerTool(
        {
          name: "set_monitoring_area",
          title: "Change monitoring area",
          description:
            "Change the visible city for the disaster observatory. Does not change saved alert preferences.",
          inputSchema: {
            type: "object",
            properties: {
              area_id: { type: "string", enum: AREAS.map((a) => a.id) },
            },
            required: ["area_id"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute: async (input: any) => {
            if (
              !input ||
              typeof input.area_id !== "string" ||
              Object.keys(input).some((k) => k !== "area_id")
            )
              throw new Error("Invalid area request");
            chooseArea(input.area_id);
            return { area: input.area_id, changed: true };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => {});
    return () => lifecycle.abort();
  }, [chooseArea]);
  async function saveProfile() {
    setSaving(true);
    try {
      await api("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area_id: profileArea,
          threshold,
          enabled,
          email_enabled: emailOn,
        }),
      });
      await loadAccount();
      toast.success("Your area and alert preferences are saved.");
      if (page === "overview") refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }
  async function notifications() {
    if (!("Notification" in window)) {
      toast.error(
        "This browser does not support desktop notifications. Your inbox still works.",
      );
      return;
    }
    const permission = await Notification.requestPermission();
    toast(
      permission === "granted"
        ? "Browser notifications enabled while Prithvi is open."
        : "Notifications are blocked. You can change this in browser settings.",
    );
  }
  const titles: any = {
    overview: [
      "OUR PLANET, OUR SHARED HOME",
      "Stay aware. Stay a step ahead.",
      "A clearer picture of your surroundings, so you can care for what matters.",
    ],
    history: [
      "LOOK BACK. PREPARE BETTER.",
      "Every season has a story.",
      "Explore historical conditions and learn from events that shaped our communities.",
    ],
    prepare: [
      "KNOWLEDGE IS A FORM OF CARE",
      "A little preparation goes a long way.",
      "Small, thoughtful steps today can make a difficult day easier.",
    ],
    help: [
      "YOU DON’T HAVE TO FACE IT ALONE",
      "Help, when it matters most.",
      "Keep trusted numbers close. Share them with someone you care about.",
    ],
  };
  const title = titles[page] || titles.overview;
  const unavailable = { status: "unavailable", data: null };
  const hazards =
    data?.hazards ??
    makeHazards({
      weather: unavailable,
      dry: unavailable,
      quakes: unavailable,
      air: unavailable,
      cyclones: unavailable,
    }).map((h) => ({ ...h, label: busy ? "Checking sources" : h.label }));
  return (
    <div className="site">
      <Toaster richColors position="bottom-right" />
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-icon">
            <Globe2 size={24} />
          </span>
          <span>
            prithvi
            <span className="brand-caption">
              A little awareness. A safer tomorrow.
            </span>
          </span>
        </a>
        <nav aria-label="Main navigation">
          {NAV.map(([href, text, key]) => (
            <a key={key} className={page === key ? "active" : ""} href={href}>
              {text}
            </a>
          ))}
        </nav>
        <button className="account" onClick={() => setShowAccount(true)}>
          <Bell size={17} /> My alerts
          {alerts.filter((a) => !a.read_at).length > 0 && (
            <span className="count">
              {alerts.filter((a) => !a.read_at).length}
            </span>
          )}
        </button>
      </header>
      <main>
        <div className="eyebrow">{title[0]}</div>
        <div className="page-heading">
          <div>
            <h1>{title[1]}</h1>
            <p>{title[2]}</p>
          </div>
          <div className="area-wrap">
            <MapPin size={17} />
            <Picker
              value={areaId}
              onChange={chooseArea}
              label="Monitoring area"
              items={AREAS.map((a) => ({
                value: a.id,
                label: `${a.name}, ${a.state}`,
              }))}
            />
          </div>
        </div>
        {page === "overview" && (
          <>
            <div className="notice">
              <ShieldCheck size={20} />
              <span>
                <b>Awareness starts with reliable information.</b> Research
                signals support preparedness. Always follow official local
                warnings.
              </span>
              <a
                href="https://sachet.ndma.gov.in/"
                target="_blank"
                rel="noreferrer"
              >
                Official alerts <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="section-heading">
              <h2>Your area at a glance</h2>
              <button className="refresh" disabled={busy} onClick={refresh}>
                <RefreshCw size={14} className={busy ? "spin" : ""} />
                {busy
                  ? "Checking sources"
                  : data
                    ? `Checked ${hour(data.generatedAt)} IST`
                    : "Refresh data"}
              </button>
            </div>
            {error && (
              <div className="data-notice" role="alert">
                {error}
                {data && (
                  <span>
                    {" "}
                    Showing the last response from {fmt(data.generatedAt)} IST.
                    It has not been refreshed.
                  </span>
                )}
              </div>
            )}
            {data?.notificationError && (
              <p className="data-notice">{data.notificationError}</p>
            )}
            {data &&
              !error &&
              Object.values(data).some(
                (v: any) => v?.status === "unavailable",
              ) && (
                <p className="data-notice" role="status">
                  Some sources are unavailable. Available evidence is shown
                  below; missing data does not establish safety.
                </p>
              )}
            <div className="hazard-grid">
              {hazards.map((h: Hazard) => {
                const Icon = icons[h.id];
                return (
                  <button
                    className={`hazard-card ${detail?.id === h.id ? "selected" : ""}`}
                    key={h.id}
                    onClick={() => setDetail(h)}
                  >
                    <div className="hazard-top">
                      <Icon size={25} />
                      <ChevronRight size={15} />
                    </div>
                    <h3>{h.name}</h3>
                    <div className={`status ${h.level}`}>{h.label}</div>
                    <p>{h.summary}</p>
                    <strong className="hazard-metric">{h.metric}</strong>
                    <small>View evidence & limitations</small>
                  </button>
                );
              })}
            </div>
            <Evidence
              data={data}
              busy={busy}
              error={error}
              onRetry={refresh}
              areaName={area.name}
            />
            <div className="dashboard-grid">
              <section className="panel forecast-panel">
                <div className="panel-heading">
                  <div>
                    <div className="eyebrow">THE NEXT 48 HOURS</div>
                    <h2>What’s on the horizon?</h2>
                  </div>
                  <span className="status neutral">Forecast · IST</span>
                </div>
                {data?.weather.status === "ok" ? (
                  <Forecast data={data} />
                ) : (
                  <Empty
                    text={
                      busy
                        ? "Bringing the latest forecast into view…"
                        : "Weather data is unavailable. Check IMD for local advisories."
                    }
                  />
                )}
              </section>
              <section className="planet-card">
                <span className="eyebrow">SMALL ACTIONS. SHARED FUTURE.</span>
                <Globe2 size={65} strokeWidth={1} />
                <h2>
                  There is no
                  <br />
                  place like home.
                </h2>
                <p>
                  A warmer planet changes the risks we live with. Learning,
                  preparing, and looking out for each other makes a difference.
                </p>
                <a href="/prepare">
                  Make your household ready <ArrowUpRight size={16} />
                </a>
              </section>
            </div>
            <div className="lower-grid">
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <div className="eyebrow">A CLOSER LOOK</div>
                    <h2>{area.name} & surroundings</h2>
                  </div>
                  <MapPin size={21} />
                </div>
                <div className="map-wrap">
                  <iframe
                    title={`Map of ${area.name}`}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${area.lon - 1.5}%2C${area.lat - 1}%2C${area.lon + 1.5}%2C${area.lat + 1}&layer=mapnik&marker=${area.lat}%2C${area.lon}`}
                    loading="lazy"
                  />
                  <div className="map-label">
                    Selected area · map is not a hazard footprint
                  </div>
                </div>
                <div className="map-footer">
                  <span>
                    {area.lat.toFixed(4)}° N · {area.lon.toFixed(4)}° E
                  </span>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${area.lat}&mlon=${area.lon}#map=9/${area.lat}/${area.lon}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open map <ArrowUpRight size={13} />
                  </a>
                </div>
              </section>
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <div className="eyebrow">EVIDENCE, NOT GUESSWORK</div>
                    <h2>Signals behind the watch</h2>
                  </div>
                  <Layers size={21} />
                </div>
                <div className="signal-list">
                  <Signal
                    name="Modelled river discharge"
                    value={`${n(data?.flood.data?.discharge?.[0])} m³/s`}
                    note="GloFAS river grid · not local water depth"
                  />
                  <Signal
                    name="Recent 30-day rainfall"
                    value={`${n(data?.dry.data?.rain, 0)} mm`}
                    note={
                      data?.dry.data
                        ? `Through ${data.dry.data.end} · reanalysis`
                        : "Historical data unavailable"
                    }
                  />
                  <Signal
                    name="Nitrogen dioxide"
                    value={`${n(data?.air.data?.no2)} µg/m³`}
                    note="CAMS forecast · not a rain pH reading"
                  />
                  <Signal
                    name="Recorded earthquakes"
                    value={
                      data?.quakes.status === "ok"
                        ? `${data.quakes.data.events.length} events`
                        : "Unavailable"
                    }
                    note="USGS · M2.5+ · within 500 km · past 7 days"
                  />
                </div>
              </section>
            </div>
            <section className="panel recent-panel">
              <div className="panel-heading">
                <h2>Recent reports near your area</h2>
                <a
                  className="text-link"
                  href="https://rsmcnewdelhi.imd.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                >
                  IMD cyclone bulletin <ArrowUpRight size={15} />
                </a>
              </div>
              {data?.quakes.status === "ok" ? (
                data.quakes.data.events.length ? (
                  <div className="event-list">
                    {data.quakes.data.events.slice(0, 5).map((e: any) => (
                      <a
                        key={e.id}
                        href={e.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="magnitude">M {n(e.magnitude)}</span>
                        <span>
                          <b>{e.place}</b>
                          <small>
                            {fmt(e.time)} IST · depth {n(e.depth)} km · recorded
                            event
                          </small>
                        </span>
                        <ArrowUpRight size={16} />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="subtle-note">
                    No M2.5+ earthquakes were returned within 500 km in the past
                    7 days. This does not predict future safety.
                  </p>
                )
              ) : (
                <p className="subtle-note">
                  The earthquake catalogue is {busy ? "loading" : "unavailable"}
                  . No prediction is inferred.
                </p>
              )}
              {data?.cyclones.data?.events
                ?.filter((e: any) => e.distance <= 800)
                .map((e: any) => (
                  <a
                    className="storm-event"
                    key={e.id}
                    href={
                      e.url.startsWith("https://")
                        ? e.url
                        : "https://www.gdacs.org/"
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Wind size={20} />
                    <span>
                      {e.title}
                      <small>
                        Reported centre about {e.distance} km away · {e.level}{" "}
                        GDACS level
                      </small>
                    </span>
                    <ArrowUpRight size={16} />
                  </a>
                ))}
            </section>
            <section className="source-strip" id="sources">
              <span className="eyebrow">OPEN DATA. VISIBLE LIMITS.</span>
              {[
                ["weather", "Weather"],
                ["flood", "River flow"],
                ["air", "Air chemistry"],
                ["quakes", "Seismic events"],
                ["cyclones", "Cyclone feed"],
                ["dry", "Rain history"],
              ].map(([key, label]) => (
                <div key={key}>
                  <span
                    className={`source-dot ${data?.[key]?.status === "ok" ? "ok" : ""}`}
                  />
                  <b>{label}</b>
                  <small>
                    {data?.[key]?.fetchedAt
                      ? fmt(data[key].fetchedAt) + " IST"
                      : busy
                        ? "Connecting"
                        : "Unavailable"}
                  </small>
                </div>
              ))}
            </section>
            <div className="source-links">
              {SOURCES.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  title={s.description}
                >
                  {s.name}
                </a>
              ))}
            </div>
          </>
        )}
        {page === "history" && <HistoryAtlas areaId={areaId} area={area} />}
        {page === "prepare" && <Preparedness />}
        {page === "help" && <Help area={area} />}
      </main>
      <footer>
        Prithvi · Built for awareness, rooted in care.
        <span>Science has limits. Our care shouldn’t.</span>
        <a href="/#sources">Data sources</a>
      </footer>
      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="dialog-surface">
          <DialogHeader>
            <DialogTitle>{detail?.name}: behind the signal</DialogTitle>
            <DialogDescription>
              Understand what the evidence can and cannot tell you.
            </DialogDescription>
          </DialogHeader>
          {detail && (
            <>
              <span className={`status ${detail.level}`}>{detail.label}</span>
              <div className="detail-number">{detail.metric}</div>
              <p>{detail.detail}</p>
              <div className="detail-meta">
                <span>
                  <Clock size={16} />
                  {detail.window}
                </span>
                <span>
                  <Database size={16} />
                  {detail.source}
                </span>
              </div>
              <a
                className="primary-link"
                href={detail.url}
                target="_blank"
                rel="noreferrer"
              >
                Read the source <ArrowUpRight size={16} />
              </a>
              <a className="text-link" href={`/prepare#${detail.id}`}>
                See preparedness advice
              </a>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={showAccount} onOpenChange={setShowAccount}>
        <DialogContent className="dialog-surface account-dialog">
          <DialogHeader>
            <DialogTitle>A watch for the place you call home.</DialogTitle>
            <DialogDescription>
              Save an area and choose when you would like to hear from us.
            </DialogDescription>
          </DialogHeader>
          {accountError ? (
            <Empty text={accountError} onRetry={loadAccount} />
          ) : !account ? (
            <p>Loading your account…</p>
          ) : !account.user ? (
            <>
              <div className="signin-icon">
                <ShieldCheck size={37} />
              </div>
              <p>
                Sign in securely with your ChatGPT account to register for
                area-based research alerts. Your preferences and inbox are saved
                to your account.
              </p>
              <a className="primary-link" href={signInHref} target="_top">
                Sign in with ChatGPT
              </a>
              <small>
                We use your account identity and email to save your preferences.
                Email alerts require separate opt-in.
              </small>
            </>
          ) : (
            <>
              <div className="user-line">
                <span>{account.user.name}</span>
                <a href={signOutHref} target="_top">
                  Sign out
                </a>
              </div>
              <Tabs defaultValue="preferences">
                <TabsList className="tab-list">
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="inbox">
                    Inbox ({alerts.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="preferences">
                  <label className="field-label">Your alert area</label>
                  <Picker
                    value={profileArea}
                    onChange={setProfileArea}
                    label="Saved alert area"
                    items={AREAS.map((a) => ({
                      value: a.id,
                      label: `${a.name}, ${a.state}`,
                    }))}
                  />
                  <label className="field-label">Notify me at</label>
                  <Picker
                    value={threshold}
                    onChange={setThreshold}
                    label="Alert threshold"
                    items={[
                      { value: "caution", label: "Caution and danger signals" },
                      { value: "danger", label: "Danger signals only" },
                    ]}
                  />
                  <div className="setting-row">
                    <span>Save alerts to my inbox</span>
                    <Switch
                      aria-label="Enable inbox alerts"
                      checked={enabled}
                      onCheckedChange={setEnabled}
                    />
                  </div>
                  <div className="setting-row">
                    <span>
                      Email alerts
                      <small>
                        {account.emailConfigured
                          ? "Send to your signed-in email"
                          : "Email delivery needs provider setup"}
                      </small>
                    </span>
                    <Switch
                      aria-label="Enable email alerts"
                      checked={emailOn}
                      disabled={!account.emailConfigured}
                      onCheckedChange={setEmailOn}
                    />
                  </div>
                  <button className="wide-button" onClick={notifications}>
                    <Bell size={16} /> Enable browser notifications
                  </button>
                  <small className="block-note">
                    Browser notifications work while this page is open. Email is{" "}
                    {account.emailConfigured
                      ? "configured; delivery depends on the provider"
                      : "not connected"}
                    . Background checks:{" "}
                    {account.lastRun?.ran_at
                      ? `last run ${fmt(account.lastRun.ran_at)} IST`
                      : "not yet verified"}
                    .
                  </small>
                  <div className="notice compact">
                    <Info size={18} />
                    <span>
                      These are research watches. No earthquake forecasts or
                      acid-rain danger alerts are sent.
                    </span>
                  </div>
                  <button
                    className="primary-button wide-button"
                    disabled={saving}
                    onClick={saveProfile}
                  >
                    {saving ? "Saving…" : "Save my preferences"}
                  </button>
                </TabsContent>
                <TabsContent value="inbox">
                  {inboxError ? (
                    <Empty text={inboxError} onRetry={loadInbox} />
                  ) : alerts.length ? (
                    <>
                      <button
                        className="text-button"
                        onClick={async () => {
                          try {
                            await api("/api/alerts", { method: "PATCH" });
                            await loadInbox();
                          } catch (e: any) {
                            toast.error(e.message);
                          }
                        }}
                      >
                        Mark all as read
                      </button>
                      <div className="inbox-list">
                        {alerts.map((a) => (
                          <article key={a.id}>
                            <span className={`status ${a.level}`}>
                              {a.read_at ? "Read" : "New"} · {a.level}
                            </span>
                            <h3>{a.title}</h3>
                            <p>{a.body}</p>
                            <small>{fmt(a.created_at)} IST</small>
                          </article>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Empty text="Your inbox is quiet. Watches will appear here when your saved area crosses a selected threshold." />
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
function Signal({ name, value, note }: any) {
  return (
    <div className="signal">
      <div>
        <span>{name}</span>
        <small>{note}</small>
      </div>
      <strong>{value}</strong>
    </div>
  );
}
function Forecast({ data }: any) {
  const [metric, setMetric] = useState("rain");
  const rows = data.weather.data.hours;
  const rain = sumComplete(
    rows.map((x: any) => x.rain),
    48,
  );
  const chart = rows.map((x: any) => ({ ...x, label: hour(x.time) }));
  return (
    <>
      <div className="forecast-summary">
        <div>
          <strong>{n(rain)}</strong>
          <span>mm over 48 hours</span>
        </div>
        <div>
          <strong>{n(rows[0]?.temperature, 0)}°</strong>
          <span>First forecast hour</span>
        </div>
        <Tabs value={metric} onValueChange={setMetric}>
          <TabsList className="tab-list">
            <TabsTrigger value="rain">Rainfall</TabsTrigger>
            <TabsTrigger value="wind">Wind</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chart}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#76b19b" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#76b19b" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#edf0ed" vertical={false} />
            <XAxis
              dataKey="time"
              tickFormatter={hour}
              minTickGap={55}
              tick={{ fontSize: 11, fill: "#71837a" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#71837a" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              labelFormatter={(v) => fmt(String(v)) + " IST"}
              formatter={(v: any) => [
                `${n(v)} ${metric === "rain" ? "mm" : "km/h"}`,
                metric === "rain" ? "Rainfall" : "Wind speed",
              ]}
              contentStyle={{
                borderRadius: 8,
                borderColor: "#dce5e0",
                fontSize: 13,
              }}
            />
            <ChartArea
              dataKey={metric}
              type="monotone"
              stroke="#478f76"
              strokeWidth={2.2}
              fill="url(#rainFill)"
              connectNulls={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-caption">
        <span>
          {metric === "rain" ? "Hourly rainfall (mm)" : "Wind at 10 m (km/h)"} ·
          Open-Meteo forecast
        </span>
        <span>Local time · IST</span>
      </div>
    </>
  );
}
function Help({ area }: any) {
  const [category, setCategory] = useState("All"),
    [search, setSearch] = useState("");
  const list = CONTACTS.filter(
    (c) =>
      (c.area === "all" || c.area === area.id) &&
      (category === "All" || c.kind === category) &&
      `${c.name} ${c.description}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <section className="emergency-banner">
        <div>
          <span className="eyebrow">IN IMMEDIATE DANGER?</span>
          <h2>Call 112. Tell them where you are.</h2>
          <p>
            India’s integrated emergency response for police, fire and medical
            help.
          </p>
        </div>
        <a href="tel:112">
          <Phone size={22} /> 112
        </a>
      </section>
      <div className="help-toolbar">
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="tab-list">
            <TabsTrigger value="All">All contacts</TabsTrigger>
            <TabsTrigger value="Emergency">Emergency</TabsTrigger>
            <TabsTrigger value="Hospital">Hospitals</TabsTrigger>
            <TabsTrigger value="Police">Police</TabsTrigger>
            <TabsTrigger value="NGO">NGOs</TabsTrigger>
          </TabsList>
        </Tabs>
        <input
          aria-label="Search helplines"
          placeholder="Find a service…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="contact-grid">
        {list.map((c) => (
          <article className="panel contact-card" key={c.name}>
            <div>
              <span className="status neutral">{c.kind}</span>
              <small>
                {c.area === "all" ? "National / regional network" : area.name}
              </small>
            </div>
            <h2>{c.name}</h2>
            <p>{c.description}</p>
            <a className="phone-number" href={`tel:${c.phone}`}>
              <Phone size={19} />
              {c.phone}
            </a>
            <a
              className="source-link"
              href={c.source}
              target="_blank"
              rel="noreferrer"
            >
              Official contact source <ArrowUpRight size={13} />
            </a>
          </article>
        ))}
      </div>
      {!list.length && (
        <Empty text="No matching verified contacts in this directory. For an emergency, call 112." />
      )}
      <div className="notice directory-note">
        <Info size={20} />
        <span>
          Source pages checked 2 October 2026. Hospital and local police
          contacts currently cover Bhubaneswar; national numbers remain
          available for all areas. This directory does not show live
          availability. NGO contacts are not emergency dispatch services.
        </span>
      </div>
      <div className="source-links">
        <a
          href="https://police.odisha.gov.in/"
          target="_blank"
          rel="noreferrer"
        >
          Find your police station · Odisha Police <ArrowUpRight size={15} />
        </a>
        <a
          href="https://www.india.gov.in/directory/helpline"
          target="_blank"
          rel="noreferrer"
        >
          National helpline directory <ArrowUpRight size={15} />
        </a>
      </div>
    </>
  );
}
