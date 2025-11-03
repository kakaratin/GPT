import { OrderForm } from "@/components/order-form";

const heroHighlights = [
  {
    title: "Same-day turnaround",
    body: "Most brake, battery, and diagnostic jobs leave the shop in under 24 hours.",
  },
  {
    title: "Friendly updates",
    body: "Techs send quick text and photo updates so you always know what's happening.",
  },
  {
    title: "Remote help",
    body: "Need advice from the road? Borrow one of our TDJS helper devices instantly.",
  },
];

const shopServices = [
  {
    name: "Brake & suspension",
    copy: "Rotor resurfacing, pad swaps, alignments, and steering checks built for daily drivers and fleets.",
  },
  {
    name: "Electrical & diagnostics",
    copy: "Check-engine lights, battery replacements, remote resets, and sensor calibration handled in-house.",
  },
  {
    name: "Preventive care",
    copy: "Oil changes, coolant service, tire rotations, and seasonal inspections that keep surprises away.",
  },
];

const remoteDeviceBenefits = [
  {
    title: "Ready-to-go setup",
    description: "We host the device - no extra hardware, no confusing logins. Pick phone or tablet and we send the link.",
  },
  {
    title: "Guided support",
    description: "Our techs jump in with screen-share instructions, photo notes, or tune-ups while you stay with the customer.",
  },
  {
    title: "Simple billing",
    description: "Devices are billed just like any service visit. Add a memo so the invoice matches your workflow.",
  },
];

const remoteSteps = [
  "Tell us what kind of device you need.",
  "We send a secure TDJS link with your requested login details.",
  "Use it for calls, paperwork, or remote diagnostics - then let us know when you're done.",
];

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_65%)]" />
        <div className="absolute left-1/2 top-1/2 -z-10 h-64 w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <header className="relative z-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-sky-200/90">
            TDJS Auto Service
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl sm:leading-[1.1]">
            Keep your drivers on the road with repairs, updates, and remote support that actually makes sense.
          </h1>
          <p className="max-w-2xl text-base text-slate-200/80 sm:text-lg">
            From emergency roadside fixes to routine maintenance, our family-run shop combines hands-on service and
            easy remote help. Schedule in-shop work or borrow a TDJS helper device whenever your team is stuck on-site.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {heroHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-slate-900/30"
              >
                <p className="text-sm font-semibold text-slate-50">{item.title}</p>
                <p className="mt-2 text-xs text-slate-200/80">{item.body}</p>
              </article>
            ))}
          </div>
        </div>

        <OrderForm />
      </header>

      <section className="relative z-10 grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-slate-950/40 backdrop-blur sm:p-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">Our shop services</h2>
          <p className="text-sm text-slate-200/80 sm:text-base">
            Drop your car or fleet vehicle off and we handle the rest. Honest timelines, upfront pricing, and clear
            follow-ups when the work is done.
          </p>

          <div className="space-y-5">
            {shopServices.map((service) => (
              <article key={service.name} className="space-y-2 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <h3 className="text-lg font-semibold text-slate-50 capitalize">{service.name}</h3>
                <p className="text-sm text-slate-300/80">{service.copy}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-sky-400/20 bg-slate-950/60 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300/90">
              Why borrow a TDJS device?
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-50">Remote help that feels as easy as a phone call.</h3>
          </div>

          <div className="space-y-4">
            {remoteDeviceBenefits.map((benefit) => (
              <div key={benefit.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-slate-100">{benefit.title}</p>
                <p className="mt-2 text-sm text-slate-300/80">{benefit.description}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400/80">
            Need something special for your crew? Add the note in the form and we&apos;ll tailor the setup.
          </p>
        </div>
      </section>

      <section className="relative z-10 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-slate-950/40 backdrop-blur sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">How the helper device process works</h2>
            <p className="text-sm text-slate-200/80 sm:text-base">
              Whether you&apos;re coaching a tech in the bay or supporting a customer on the road, TDJS helper devices
              let you jump in without leaving your current job.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {remoteSteps.map((step, index) => (
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
      </section>

      <footer className="relative z-10 flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/70 px-6 py-6 text-xs text-slate-400/80 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-slate-300/80">
          TDJS Auto Service - Local repair experts with remote backup that keeps you moving.
        </p>
        <p className="text-[13px] text-slate-500/70">
          742 Mechanic Ave, Suite B - Call or text (555) 014-7765 for appointments.
        </p>
      </footer>
    </main>
  );
}
