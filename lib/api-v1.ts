export const API_V1_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export function apiResponse(data: unknown, init: ResponseInit = {}) {
  return Response.json({ ok: true, data }, {
    ...init,
    headers: { ...API_V1_HEADERS, ...(init.headers ?? {}) },
  });
}

export function apiError(message: string, status = 400) {
  return Response.json({ ok: false, error: { message } }, {
    status,
    headers: API_V1_HEADERS,
  });
}

export function apiOptions() {
  return new Response(null, { status: 204, headers: API_V1_HEADERS });
}
