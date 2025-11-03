'use client';

import { FormEvent, useMemo, useState } from "react";

type OrderResponse = {
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
};

type ServiceOption = {
  id: "Vsphone" | "Vmos";
  label: string;
  headline: string;
  bullet: string;
};

const services: ServiceOption[] = [
  {
    id: "Vsphone",
    label: "TDJS Virtual Smartphone",
    headline: "Always-on Android automation tuned for reliability.",
    bullet: "Latency-optimised nodes across 8 regions.",
  },
  {
    id: "Vmos",
    label: "TDJS VMOS Enterprise",
    headline: "Extended runtime with premium compute and storage tiers.",
    bullet: "Dedicated snapshots and compliance logging ready to export.",
  },
];

const initialState = {
  service: services[0]?.id ?? "Vsphone",
  account: "",
  password: "",
  memo: "",
};

export function OrderForm() {
  const [formState, setFormState] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<OrderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedService = useMemo(
    () => services.find((service) => service.id === formState.service),
    [formState.service],
  );

  const resetFeedback = () => {
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetFeedback();

    if (!formState.account.trim() || !formState.password.trim()) {
      setError("Account credentials must be provided before we can deploy a device.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: formState.service,
          account: formState.account.trim(),
          password: formState.password,
          memo: formState.memo.trim() ? formState.memo.trim() : undefined,
        }),
      });

      const data: OrderResponse = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message ?? "We hit a snag while orchestrating that workflow.");
      }

      setResult({
        success: true,
        message: data.message,
        details: data.details,
      });

      setFormState((prev) => ({
        ...prev,
        password: "",
        memo: "",
      }));
    } catch (err) {
      const fallbackMessage =
        err instanceof Error ? err.message : "We could not complete that request just now.";
      setError(fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-sky-900/20 backdrop-blur lg:p-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(148,163,255,0.18),_transparent_55%)]" />

      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300/90">
          Instant Provisioning
        </p>
        <h2 className="text-2xl font-semibold text-slate-50">Launch a device in under a minute.</h2>
        {selectedService ? (
          <p className="text-sm text-slate-300/90">
            {selectedService.headline}
            <span className="mt-1 block text-xs text-slate-400/90">
              {selectedService.bullet}
            </span>
          </p>
        ) : null}
      </header>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-200" htmlFor="service">
            Choose workflow
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((serviceOption) => {
              const isActive = serviceOption.id === formState.service;
              return (
                <button
                  key={serviceOption.id}
                  type="button"
                  onClick={() => {
                    resetFeedback();
                    setFormState((prev) => ({ ...prev, service: serviceOption.id }));
                  }}
                  className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400/80 focus:ring-offset-2 focus:ring-offset-slate-900 ${isActive ? "border-sky-400/70 bg-sky-400/10 text-sky-100" : "border-white/10 bg-slate-900/70 text-slate-200 hover:border-slate-200/40"}`}
                >
                  <span className="text-sm font-semibold">{serviceOption.label}</span>
                  <span className="mt-1 text-xs text-slate-300/80">
                    {serviceOption.headline}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200" htmlFor="account">
              Account username or email
            </label>
            <input
              id="account"
              name="account"
              type="text"
              autoComplete="username"
              required
              value={formState.account}
              onChange={(event) => {
                resetFeedback();
                setFormState((prev) => ({ ...prev, account: event.target.value }));
              }}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/40 transition focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
              placeholder="operations@yourdomain.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200" htmlFor="password">
              Secure passphrase
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formState.password}
              onChange={(event) => {
                resetFeedback();
                setFormState((prev) => ({ ...prev, password: event.target.value }));
              }}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/40 transition focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
              placeholder="********"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-200" htmlFor="memo">
                Internal note (optional)
              </label>
              <span className="text-[11px] uppercase tracking-wide text-slate-400/70">
                Shared only with TDJS Ops
              </span>
            </div>
            <textarea
              id="memo"
              name="memo"
              rows={3}
              value={formState.memo}
              onChange={(event) => {
                resetFeedback();
                setFormState((prev) => ({ ...prev, memo: event.target.value }));
              }}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/40 transition focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
              placeholder="Example: Pin this device to the Pacific cluster."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-400/90 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-80"
        >
          {isSubmitting ? "Orchestrating..." : "Schedule activation"}
        </button>
      </form>

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-5 space-y-2 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          <p className="font-semibold">{result.message}</p>
          {result.details ? (
            <details className="rounded-xl border border-emerald-200/20 bg-emerald-950/30 px-3 py-2 text-[13px] text-emerald-50/90">
              <summary className="cursor-pointer select-none text-emerald-200/90">
                View execution details
              </summary>
              <pre className="mt-2 max-h-60 overflow-auto whitespace-pre-wrap break-words text-xs text-emerald-100/95">
                {JSON.stringify(result.details, null, 2)}
              </pre>
            </details>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
