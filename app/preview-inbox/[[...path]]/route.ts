export const dynamic = "force-dynamic";

async function proxy(request: Request) {
  if (process.env.PREVIEW_EMAIL_INBOX !== "true") return new Response("Not found", { status: 404 });
  const incoming = new URL(request.url);
  const target = new URL(incoming.pathname + incoming.search, "http://mail:8025");
  const headers = new Headers();
  for (const name of ["content-type", "accept", "last-event-id"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const response = await fetch(target, {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
    redirect: "manual",
    cache: "no-store",
    signal: request.signal,
  });
  const outgoing = new Headers();
  for (const name of ["content-type", "location", "content-disposition"]) {
    const value = response.headers.get(name);
    if (value) outgoing.set(name, value);
  }
  outgoing.set("Cache-Control", "no-store");
  outgoing.set("Referrer-Policy", "no-referrer");
  return new Response(response.body, { status: response.status, headers: outgoing });
}
export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };
