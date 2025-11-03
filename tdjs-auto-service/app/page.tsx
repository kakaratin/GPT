import { OrderForm } from "@/components/order-form";

const differentiators = [
  {
    title: "Ops-first telemetry",
    body: "Full journey traces for every automation run, plus downloadable audit snapshots for compliance teams.",
  },
  {
    title: "Modular playbooks",
    body: "Stack reusable actions, triggers, and guardrails to match how your technicians already deliver service.",
  },
  {
    title: "Human hand-off ready",
    body: "Escalate any workflow to a live engineer with one tap - no context lost, no duplicate data entry.",
  },
];

const stats = [
  { value: "58s", label: "Average activation time" },
  { value: "99.95%", label: "Orchestrator uptime this quarter" },
  { value: "24/7", label: "Global maintenance coverage" },
];

const services = [
  {
    name: "TDJS Virtual Smartphone",
    focus: "Rapid cloud handset for test benches and customer care assists.",
    perks: ["Hot-swap SIM profiles", "Region-aware latency routing", "Replayable macros"],
  },
  {
    name: "TDJS VMOS Enterprise",
    focus: "Enterprise-grade VM clusters with premium retention windows.",
    perks: ["Dedicated snapshots", "Encrypted storage expansion", "Priority disaster recovery"],
  },
];

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.35),_transparent_65%)]" />
        <div className="absolute left-1/2 top-1/2 -z-10 h-64 w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <header className="relative z-10 grid gap-12 lg:grid-cols-[1.05fr_minmax(0,420px)]">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-sky-200/90">
            TDJS-AUTO-SERVICE
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl sm:leading-[1.1]">
            Build, deploy, and supervise cloud devices without babysitting infrastructure.
          </h1>
          <p className="max-w-2xl text-base text-slate-200/80 sm:text-lg">
            Our orchestration engine provisions virtual smartphones and VM clusters that are tuned for
            automotive aftercare, roadside diagnostics, and customer engagement teams. Plug in your account
            and we orchestrate the rest with live telemetry and audit-ready reports.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-center shadow-lg shadow-slate-900/30"
              >
                <p className="text-2xl font-semibold text-slate-50">{item.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-300/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <OrderForm />
      </header>

      <section className="relative z-10 grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-slate-950/40 backdrop-blur sm:p-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">Why teams choose TDJS</h2>
          <p className="text-sm text-slate-200/80 sm:text-base">
            Every workflow we run reinforces your brand. Our stack is engineered for transparent automation,
            giving your technicians confidence while customers experience consistent, reliable support.
          </p>

          <div className="space-y-5">
            {differentiators.map((item) => (
              <article key={item.title} className="space-y-2 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <h3 className="text-lg font-semibold text-slate-50">{item.title}</h3>
                <p className="text-sm text-slate-300/80">{item.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-sky-400/20 bg-slate-950/60 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300/90">
              Service lineup
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-50">Pick the module that fits your frontline.</h3>
          </div>

          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-slate-100">{service.name}</p>
                <p className="mt-2 text-sm text-slate-300/80">{service.focus}</p>
                <ul className="mt-3 space-y-1 text-xs text-slate-200/70">
                  {service.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-300/80" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400/80">
            Need custom integrations? Our automation engineers can extend any module with bespoke
            diagnostics and reporting hooks.
          </p>
        </div>
      </section>

      <section className="relative z-10 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-slate-950/40 backdrop-blur sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">How activation works</h2>
            <p className="text-sm text-slate-200/80 sm:text-base">
              Once you submit credentials, TDJS orchestrates provisioning, applies your policy templates, and
              feeds live telemetry to the cockpit so your engineers always have the truth.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {["Provision", "Calibrate", "Deliver"].map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-sky-400/20 bg-slate-950/60 px-5 py-4 text-center"
              >
                <p className="text-xs uppercase tracking-wide text-slate-400/70">Step {index + 1}</p>
                <p className="mt-2 text-sm font-semibold text-slate-50">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-3 text-xs text-slate-300/70 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="font-semibold text-slate-100">Provision</p>
            <p className="mt-2">We spin up the requested device, hardened with your baseline policies.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="font-semibold text-slate-100">Calibrate</p>
            <p className="mt-2">Automation scripts run smoke tests and verify handoff webhooks.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="font-semibold text-slate-100">Deliver</p>
            <p className="mt-2">We notify your ops channel with decrypted credentials and telemetry stream.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="font-semibold text-slate-100">Monitor</p>
            <p className="mt-2">Live dashboards mirror uptime, usage, and compliance events in plain English.</p>
          </div>
        </div>
      </section>

      <footer className="relative z-10 flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/70 px-6 py-6 text-xs text-slate-400/80 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-slate-300/80">
          TDJS-AUTO-SERVICE - Crafted for high-velocity automotive support teams.
        </p>
        <p className="text-[13px] text-slate-500/70">
          Looking to deploy? Point your Vercel project to `tdjs-auto-service` and you are ready.
        </p>
      </footer>
    </main>
  );
}
