export async function generateSessionHash(request, data) {
  const rawIp = request.headers.get("cf-connecting-ip") || "";
  const country = request.cf?.country || "";
  const city = request.cf?.city || "";

  const fingerprintRaw = `${rawIp}-${data.userAgent}-${data.screenRes}-${data.language}-${data.deviceMemory}-${data.cores}-${data.timezone}-${country}-${city}`;
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(fingerprintRaw));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}
