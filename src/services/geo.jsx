export function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const toRad = (d) => (d * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.asin(Math.sqrt(a));
}

export function parseNumber(v) {
    if (v == null) return NaN;
    const s = String(v).trim().replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
}
