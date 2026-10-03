"use client";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Check,
  RotateCcw,
  Printer,
  Download,
  MapPin,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { GUIDES, SCENARIOS, KIT } from "@/lib/preparedness";
import { HazardTabs, HAZARDS } from "./evidence";
const PLAN_FIELDS = [
  {
    id: "contact",
    label: "Contact outside the area",
    placeholder: "Name and phone number",
  },
  {
    id: "meeting",
    label: "Meeting point near home",
    placeholder: "A safe, familiar location",
  },
  {
    id: "alternate",
    label: "Alternative meeting point",
    placeholder: "Outside your neighbourhood",
  },
  {
    id: "shelter",
    label: "Designated shelter and route",
    placeholder: "Confirm with local authorities",
  },
  {
    id: "support",
    label: "Who needs assistance?",
    placeholder: "Medicines, mobility, children, pets",
  },
  {
    id: "roles",
    label: "Who does what?",
    placeholder: "Who brings the bag? Who checks on neighbours?",
  },
];
export default function Preparedness() {
  const [hazard, setHazard] = useState("flood"),
    [scenario, setScenario] = useState("flood"),
    [checks, setChecks] = useState<string[]>([]),
    [plan, setPlan] = useState<Record<string, string>>({}),
    [storageNote, setStorageNote] = useState(
      "Saved only on this device. These notes are not sent to your alert profile.",
    );
  useEffect(() => {
    const choose = () => {
      const h = location.hash.slice(1);
      if (GUIDES.some((g) => g.id === h)) setHazard(h);
    };
    choose();
    window.addEventListener("hashchange", choose);
    try {
      const c = JSON.parse(localStorage.getItem("prithvi-kit-v2") || "[]");
      if (Array.isArray(c)) setChecks(c.filter((x) => KIT.includes(x)));
      const p = JSON.parse(
        localStorage.getItem("prithvi-household-plan") || "{}",
      );
      if (p && typeof p === "object" && !Array.isArray(p))
        setPlan(
          Object.fromEntries(
            Object.entries(p).filter(
              ([k, v]) =>
                PLAN_FIELDS.some((f) => f.id === k) && typeof v === "string",
            ),
          ) as Record<string, string>,
        );
    } catch {
      setStorageNote(
        "Device storage is unavailable. You can still download your plan during this visit.",
      );
    }
    return () => window.removeEventListener("hashchange", choose);
  }, []);
  const guide = GUIDES.find((g) => g.id === hazard)!;
  function save(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      setStorageNote(
        "Changes are held for this visit only. Download your plan to keep it.",
      );
    }
  }
  function select(h: string) {
    setHazard(h);
    history.replaceState(null, "", `#${h}`);
  }
  function download() {
    const text = [
      "# Prithvi · Household preparedness guide",
      "Reviewed 2 October 2026. Educational preparation; follow official local instructions. In immediate danger in India, call 112.",
      "## My household plan",
      ...PLAN_FIELDS.map(
        (f) => `- ${f.label}: ${plan[f.id] || "To be decided"}`,
      ),
      "## Emergency bag",
      ...KIT.map((k) => `- [${checks.includes(k) ? "x" : " "}] ${k}`),
      ...GUIDES.flatMap((g) => [
        `## ${g.name}`,
        g.intro,
        `Priority: ${g.priority}`,
        ...g.phases.flatMap((p) => [
          `### ${p.name}`,
          ...p.steps.map((s) => `- **${s.title}.** ${s.text}`),
        ]),
        "Sources:",
        ...g.sources.map((s) => `- ${s.label}: ${s.url}`),
      ]),
      "## A safe practice session",
      "Choose one scenario together. Talk through the first action, destination and communication plan. Use an agreed pretend signal. Never simulate flooding, smoke, blocked exits or live emergency calls.",
    ].join("\n\n");
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/markdown;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "Prithvi_Household_Preparedness_Guide.md";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <section className="preparedness-banner">
        <div>
          <span className="eyebrow">PLEASE READ THIS FIRST</span>
          <h2>Don’t wait for a danger colour to make a plan.</h2>
          <p>
            A watch gives you a reason to pay attention. Preparation gives you
            something useful to do. Agree on a safe place, a way to get there,
            and a person to contact—while everyone is calm.
          </p>
          <p>
            <b>Official evacuation instructions take priority.</b> If you are in
            immediate danger in India, call <a href="tel:112">112</a>. Prithvi
            is a research and education tool; these scenarios do not describe a
            current emergency.
          </p>
        </div>
        <ShieldCheck size={72} strokeWidth={1} />
      </section>
      <div className="prepare-actions">
        <a href="#practice" className="primary-link">
          Practise a scenario
        </a>
        <a href="#household-plan" className="secondary-link">
          Make a household plan
        </a>
        <button onClick={download}>
          <Download size={16} /> Download all guides & my plan
        </button>
        <button onClick={() => window.print()}>
          <Printer size={16} /> Print this guide
        </button>
      </div>
      <section className="guide-section" id={hazard}>
        <div className="section-heading">
          <div>
            <span className="eyebrow">BEFORE · DURING · AFTER</span>
            <h2>Preparation, one situation at a time</h2>
          </div>
          <small>Guidance reviewed · 2 Oct 2026</small>
        </div>
        <HazardTabs value={hazard} onChange={select} />
        <article className="hazard-guide">
          <div className="guide-title">
            <h2>{guide.name}</h2>
            <p>{guide.intro}</p>
          </div>
          <div className="guide-priority">
            <ShieldCheck size={23} />
            <b>{guide.priority}</b>
          </div>
          <div className="guide-phases">
            {guide.phases.map((phase, i) => (
              <section className="panel" key={phase.name}>
                <span className="phase-number">0{i + 1}</span>
                <h3>{phase.name}</h3>
                <ol>
                  {phase.steps.map((step) => (
                    <li key={step.title}>
                      <h4>{step.title}</h4>
                      <p>{step.text}</p>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
          <div className="guide-bottom">
            <div className="source-links">
              {guide.sources.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
            <button
              onClick={() => {
                setScenario(hazard);
                document
                  .getElementById("practice")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Practise this situation
            </button>
          </div>
        </article>
      </section>
      <section className="practice-section" id="practice">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A QUIET REHEARSAL</span>
            <h2>What would you do next?</h2>
          </div>
          <span className="status neutral">
            Simulation · fictional situations
          </span>
        </div>
        <p>
          Make three decisions, see why each action matters, then discuss the
          plan with someone you live with. No alerts are sent and no emergency
          contacts are called.
        </p>
        <HazardTabs value={scenario} onChange={setScenario} />
        <Simulation key={scenario} id={scenario} />
      </section>
      <section className="household-grid" id="household-plan">
        <div className="panel household-form">
          <span className="eyebrow">WRITE IT DOWN TOGETHER</span>
          <h2>Your household or hostel plan</h2>
          <p>
            A useful plan is one everyone can find. Keep a paper copy where it
            is easy to reach.
          </p>
          <div className="plan-fields">
            {PLAN_FIELDS.map((f) => (
              <label key={f.id}>
                <span>{f.label}</span>
                <textarea
                  rows={2}
                  maxLength={500}
                  placeholder={f.placeholder}
                  value={plan[f.id] || ""}
                  onChange={(e) => {
                    const next = { ...plan, [f.id]: e.target.value };
                    setPlan(next);
                    save("prithvi-household-plan", next);
                  }}
                />
              </label>
            ))}
          </div>
          <small role="status">{storageNote}</small>
          <button className="download-small" onClick={download}>
            <Download size={16} /> Download my plan and guides
          </button>
        </div>
        <aside className="panel kit-panel">
          <span className="eyebrow">PACK FOR YOUR PEOPLE</span>
          <h2>The emergency bag</h2>
          <p>
            Adapt quantities to your household and local advice. Revisit
            medicines, batteries and food dates regularly.
          </p>
          <progress
            aria-label="Emergency bag checklist progress"
            value={checks.length}
            max={KIT.length}
          />
          <b>
            {checks.length} of {KIT.length} checklist items prepared
          </b>
          {KIT.map((item) => (
            <label className="kit-item" key={item}>
              <Checkbox
                checked={checks.includes(item)}
                onCheckedChange={(v) => {
                  const next =
                    v === true
                      ? [...new Set([...checks, item])]
                      : checks.filter((x) => x !== item);
                  setChecks(next);
                  save("prithvi-kit-v2", next);
                }}
              />
              <span>{item}</span>
            </label>
          ))}
          <small>
            This checklist measures completion, not your probability of being
            safe.
          </small>
        </aside>
      </section>
      <section className="panel rehearse-note">
        <MapPin size={27} />
        <div>
          <h2>Try a ten-minute household rehearsal</h2>
          <p>
            Agree on a pretend signal, locate the bag, and talk through your
            route and contact plan. Give each person a role they can manage.
            Include someone who uses mobility aids or needs medicines in the
            planning, rather than deciding for them. Finish by writing down one
            thing to improve.
          </p>
          <p>
            <b>Keep practice safe:</b> do not create smoke or water hazards,
            block exits, touch utilities, or make test calls to emergency
            numbers. Ask your school, campus or local disaster authority about
            supervised drills.
          </p>
        </div>
      </section>
    </>
  );
}
function Simulation({ id }: { id: string }) {
  const s = SCENARIOS.find((x) => x.id === id)!,
    [step, setStep] = useState(0),
    [answers, setAnswers] = useState<number[]>([]),
    [choice, setChoice] = useState<number | null>(null);
  const finished = step === s.steps.length,
    current = s.steps[step];
  useEffect(() => {
    if (step > 0) document.getElementById("scenario-question")?.focus();
  }, [step]);
  function reset() {
    setStep(0);
    setAnswers([]);
    setChoice(null);
  }
  return (
    <div className="simulation">
      <div className="simulation-context">
        <span className="eyebrow">
          {HAZARDS.find((h) => h.id === id)?.name} · PRACTICE ONLY
        </span>
        <h3>{s.title}</h3>
        <p>{s.setting}</p>
        <ol className="scenario-timeline">
          {s.steps.map((st, i) => (
            <li
              key={st.time}
              className={step === i ? "current" : step > i ? "complete" : ""}
            >
              <span>{step > i ? <Check size={16} /> : i + 1}</span>
              {st.time}
            </li>
          ))}
        </ol>
        <button onClick={reset}>
          <RotateCcw size={15} /> Start again
        </button>
      </div>
      <div className="simulation-stage">
        {finished ? (
          <div role="status">
            <span className="eyebrow">REHEARSAL COMPLETE</span>
            <h3 tabIndex={-1} id="scenario-question">
              Take the decisions into your real plan.
            </h3>
            <p>
              You selected the recommended action at{" "}
              {answers.filter((a, i) => a === s.steps[i].best).length} of{" "}
              {s.steps.length} checkpoints. This is learning feedback, not a
              readiness certificate or a prediction of safety.
            </p>
            <ul className="simulation-review">
              {s.steps.map((st, i) => (
                <li key={st.time}>
                  <b>{st.time}</b>
                  <p>{st.options[st.best].text}</p>
                  {answers[i] !== st.best && (
                    <small>Worth revisiting together</small>
                  )}
                </li>
              ))}
            </ul>
            <a className="primary-link" href="#household-plan">
              Write down the household plan
            </a>
          </div>
        ) : (
          <>
            <div className="scenario-step">
              Decision {step + 1} of {s.steps.length}
            </div>
            <h3 tabIndex={-1} id="scenario-question">
              {current.prompt}
            </h3>
            <div
              className="scenario-options"
              aria-labelledby="scenario-question"
            >
              {current.options.map((o, i) => (
                <button
                  key={`${step}-${i}`}
                  disabled={choice !== null}
                  className={
                    choice === i
                      ? i === current.best
                        ? "chosen recommended"
                        : "chosen revisit"
                      : ""
                  }
                  onClick={() => setChoice(i)}
                >
                  <span>{String.fromCharCode(65 + i)}</span>
                  {o.text}
                </button>
              ))}
            </div>
            {choice !== null && (
              <div
                className={`scenario-feedback ${choice === current.best ? "recommended" : "revisit"}`}
                role="status"
              >
                <b>
                  {choice === current.best
                    ? "A sound choice for this situation"
                    : "A decision to reconsider"}
                </b>
                <p>{current.options[choice].feedback}</p>
                {choice !== current.best && (
                  <p>
                    <b>Recommended action:</b>{" "}
                    {current.options[current.best].text}
                  </p>
                )}
                <button
                  className="primary-link"
                  onClick={() => {
                    setAnswers([...answers, choice]);
                    setStep(step + 1);
                    setChoice(null);
                  }}
                >
                  {step === s.steps.length - 1
                    ? "See the debrief"
                    : "Continue the scenario"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
