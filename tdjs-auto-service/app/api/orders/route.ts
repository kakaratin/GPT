import { NextRequest, NextResponse } from "next/server";

const PROVIDER_ENDPOINT = "https://meows.io.vn/api/buy-cloud-phone" as const;
const SUPPORTED_SERVICES = new Set(["Vsphone", "Vmos"]);

type IncomingBody = {
  service?: unknown;
  account?: unknown;
  password?: unknown;
  memo?: unknown;
};

const TRANSLATION_DICTIONARY = [
  {
    patterns: [/thanh\s*cong/i, /thang\s*cong/i, /success/i],
    english: "Order processed successfully.",
  },
  {
    patterns: [/het\s*hang/i, /khong\s*du/i, /out\s*of\s*stock/i],
    english: "The requested inventory is temporarily unavailable.",
  },
  {
    patterns: [/sai\s*mat\s*khau/i, /khong\s*chinh\s*xac/i, /invalid\s*credentials/i],
    english: "Credentials were rejected. Double-check the account and password you supplied.",
  },
  {
    patterns: [/dang\s*xu\s*ly/i, /processing/i, /queue/i],
    english: "Request accepted and processing. Check back for status updates shortly.",
  },
  {
    patterns: [/that\s*bai/i, /failure/i, /error/i],
    english: "The orchestrator could not finish this request.",
  },
  {
    patterns: [/loi\s*he\s*thong/i, /server\s*error/i, /co\s*loi/i],
    english: "Upstream system error. Please retry in a moment.",
  },
];

function removeDiacritics(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function translateText(
  rawText: string,
  options: { isSuccess: boolean; status: number },
): string {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return options.isSuccess
      ? "Order processed successfully."
      : "We could not finalise that request. Please try again.";
  }

  const asciiOnly = /^[\x00-\x7F]*$/.test(trimmed);
  if (asciiOnly) {
    return trimmed;
  }

  const normalized = removeDiacritics(trimmed).toLowerCase();

  for (const entry of TRANSLATION_DICTIONARY) {
    if (entry.patterns.some((pattern) => pattern.test(normalized))) {
      return entry.english;
    }
  }

  if (normalized.includes("error") || normalized.includes("loi")) {
    return "The orchestrator reported a temporary error. Please try once more.";
  }

  return options.isSuccess
    ? "Order processed successfully."
    : `We could not complete that request (status ${options.status}).`;
}

function translateStrings(value: unknown, options: { isSuccess: boolean; status: number }): unknown {
  if (typeof value === "string") {
    return translateText(value, options);
  }

  if (Array.isArray(value)) {
    return value.map((item) => translateStrings(item, options));
  }

  if (value && typeof value === "object") {
    const translated: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      if (/pass(word)?/i.test(key)) {
        translated[key] = "******";
        continue;
      }
      translated[key] = translateStrings(val, options);
    }
    return translated;
  }

  return value;
}

function extractMessage(payload: unknown): string | null {
  if (!payload) return null;
  if (typeof payload === "string") return payload;
  if (typeof payload === "object") {
    const candidates = [
      (payload as Record<string, unknown>).message,
      (payload as Record<string, unknown>).status,
      (payload as Record<string, unknown>).error,
      (payload as Record<string, unknown>).reason,
      (payload as Record<string, unknown>).note,
    ];
    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate;
      }
    }
  }
  return null;
}

function sanitizeAndTranslatePayload(
  payload: unknown,
  options: { isSuccess: boolean; status: number },
): unknown {
  return translateStrings(payload, options);
}

function buildSuccessResponse(data: {
  message: string;
  executionSummary: Record<string, unknown>;
  status: number;
}) {
  return NextResponse.json(
    {
      success: true,
      message: data.message,
      details: {
        controlPlaneStatus: data.status,
        executionSummary: data.executionSummary,
        timestamp: new Date().toISOString(),
      },
    },
    { status: 200 },
  );
}

function buildErrorResponse(data: {
  message: string;
  executionSummary: Record<string, unknown>;
  status: number;
}) {
  return NextResponse.json(
    {
      success: false,
      message: data.message,
      details: {
        controlPlaneStatus: data.status,
        executionSummary: data.executionSummary,
        timestamp: new Date().toISOString(),
      },
    },
    { status: data.status },
  );
}

export async function POST(request: NextRequest) {
  let body: IncomingBody;

  try {
    body = (await request.json()) as IncomingBody;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "We could not parse your request payload. Please resubmit with valid JSON.",
      },
      { status: 400 },
    );
  }

  const service = typeof body.service === "string" ? body.service.trim() : "";
  const account = typeof body.account === "string" ? body.account.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const memo = typeof body.memo === "string" ? body.memo.trim() : "";

  if (!SUPPORTED_SERVICES.has(service)) {
    return NextResponse.json(
      {
        success: false,
        message: "Unsupported workflow. Choose an available TDJS automation path.",
      },
      { status: 422 },
    );
  }

  if (!account || !password) {
    return NextResponse.json(
      {
        success: false,
        message: "Account username/email and passphrase are required to trigger deployment.",
      },
      { status: 422 },
    );
  }

  const payload = {
    service,
    accounts: [
      {
        account,
        password,
      },
    ],
  };

  const controllerPayload: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
      Referer: "https://meows.io.vn/buy-cloud-phone",
    },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(PROVIDER_ENDPOINT, controllerPayload);
    const rawText = await response.text();

    let parsedPayload: unknown = null;
    try {
      parsedPayload = rawText ? JSON.parse(rawText) : null;
    } catch {
      parsedPayload = rawText;
    }

    const messageFromProvider = extractMessage(parsedPayload);
    const translatedMessage = translateText(
      messageFromProvider ?? (response.ok ? "" : rawText),
      { isSuccess: response.ok, status: response.status },
    );

    const translatedPayload = sanitizeAndTranslatePayload(parsedPayload, {
      isSuccess: response.ok,
      status: response.status,
    });

    const executionSummary: Record<string, unknown> = {
      workflow: service,
      controlPlaneFeedback: translatedPayload,
    };

    if (memo) {
      executionSummary.internalMemo = memo;
    }

    if (account) {
      executionSummary.account = account;
    }

    if (response.ok) {
      return buildSuccessResponse({
        message: translatedMessage,
        executionSummary,
        status: response.status,
      });
    }

    return buildErrorResponse({
      message: translatedMessage,
      executionSummary,
      status: response.status || 502,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Our control plane is unavailable right now. Please try again in a moment.",
        details: {
          controlPlaneStatus: 502,
          executionSummary: null,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 502 },
    );
  }
}

export const dynamic = "force-dynamic";
