import { parseNumber } from "./geo";

// Endpoint oficial (GET)
const API_URL =
    "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";

// Si usas proxy (ver final), cambia a: const API_URL = "/api/EstacionesTerrestres";
export const FUEL_KEYS = {
    "Gasóleo A": "Precio Gasoleo A",
    "Gasolina 95 E5": "Precio Gasolina 95 E5",
    "Gasolina 98 E5": "Precio Gasolina 98 E5",
    "Gasóleo Premium": "Precio Gasoleo Premium",
};


export async function fetchStations() {
    const res = await fetch(API_URL, { method: "GET" });
    if (!res.ok) throw new Error(`HTTP ${res.status} al consultar la API`);

    const data = await res.json();
    const list =
        data?.ListaEESSPrecio ??
        data?.listaEESSPrecio ??
        data?.ListaEESS ??
        data?.results ??
        [];


    return list.map((s) => ({
        id: s.IDEESS ?? `${s.Provincia}-${s.Municipio}-${s["Dirección"]}`,
        brand: (s["Rótulo"] ?? "").trim(),
        address: (s["Dirección"] ?? "").trim(),
        town: (s.Municipio ?? "").trim(),
        province: (s.Provincia ?? "").trim(),
        schedule: (s.Horario ?? "").trim(),
        lat: parseNumber(s.Latitud),
        lon: parseNumber(
            s["Longitud (WGS84)"] ??
            s.Longitud ??
            s["Longitud"] ??
            s["Longitud_x0020__x0028_WGS84_x0029_"] ??
            s["Longitud_x0020__x0028_WGS84_x0029"]
        ),
        raw: s,
    }));
}
