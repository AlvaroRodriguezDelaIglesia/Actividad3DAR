

import { useMemo, useState } from "react";
import LocationPicker from "./components/LocationPicker";
import Filters from "./components/Filters";
import Results from "./components/Results";
import { fetchStations, FUEL_KEYS } from "./services/fuelApi";
import { haversineKm, parseNumber } from "./services/geo";

export default function App() {
    const [userPos, setUserPos] = useState({ lat: 40.4168, lon: -3.7038 }); // Madrid por defecto
    const [radiusKm, setRadiusKm] = useState(10);
    const [fuelLabel, setFuelLabel] = useState("Gasolina 95 E5");
    const [brandWhitelistText, setBrandWhitelistText] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [stations, setStations] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    async function onSearch() {
        setError("");
        setLoading(true);
        setHasSearched(true);

        try {
            const data = await fetchStations();
            console.log("Total estaciones recibidas:", data.length);
            console.log("Primera estación normalizada:", data[0]);
            console.log("Claves raw de la primera estación:", data[0]?.raw ? Object.keys(data[0].raw) : "sin raw");

            setStations(data);
        } catch (e) {
            setError(String(e?.message || e));
            setStations([]);
        } finally {
            setLoading(false);
        }
    }

    const whitelist = useMemo(() => {
        const arr = brandWhitelistText
            .split(",")
            .map((s) => s.trim().toUpperCase())
            .filter(Boolean);
        return arr;
    }, [brandWhitelistText]);

    const candidates = useMemo(() => {
        if (!hasSearched) return [];

        const latU = parseNumber(userPos.lat);
        const lonU = parseNumber(userPos.lon);
        if (!Number.isFinite(latU) || !Number.isFinite(lonU)) return [];

        const priceKey = FUEL_KEYS[fuelLabel];

        return stations
            .map((s) => {
                const distKm = haversineKm(latU, lonU, s.lat, s.lon);
                const priceStr = s.raw?.[priceKey];
                const price = parseNumber(priceStr);
                return { ...s, distKm, price };
            })
            .filter((s) => Number.isFinite(s.distKm) && s.distKm <= radiusKm)
            .filter((s) => (whitelist.length ? whitelist.includes((s.brand || "").toUpperCase()) : true))
            .filter((s) => Number.isFinite(s.price) && s.price > 0)
            .sort((a, b) => a.distKm - b.distKm);
    }, [stations, userPos, radiusKm, fuelLabel, whitelist, hasSearched]);

    const nearest = useMemo(() => candidates[0] ?? null, [candidates]);

    const cheapest = useMemo(() => {
        if (!candidates.length) return null;
        return [...candidates].sort((a, b) => a.price - b.price)[0] ?? null;
    }, [candidates]);

    return (
        <div style={page}>
            <header style={{ marginBottom: 16 }}>
                <h1 style={{ margin: 0 }}>Gasolineras cercanas (API Precios Carburantes)</h1>
            </header>

            <div style={grid}>
                <LocationPicker value={userPos} onChange={setUserPos} />
                <Filters
                    radiusKm={radiusKm}
                    setRadiusKm={setRadiusKm}
                    fuelLabel={fuelLabel}
                    setFuelLabel={setFuelLabel}
                    brandWhitelistText={brandWhitelistText}
                    setBrandWhitelistText={setBrandWhitelistText}
                    onSearch={onSearch}
                    loading={loading}
                />
            </div>

            {error && (
                <div style={errorBox}>
                    <strong>Error:</strong> {error}
                    <div style={{ marginTop: 6, opacity: 0.9 }}>
                        Si ves un error de CORS, usa el proxy que te dejo al final.
                    </div>
                </div>
            )}

            <div style={{ marginTop: 16 }}>
                <Results
                    candidates={candidates}
                    nearest={nearest}
                    cheapest={cheapest}
                    fuelLabel={fuelLabel}
                    radiusKm={radiusKm}
                />
            </div>
        </div>
    );
}

const page = { maxWidth: 980, margin: "0 auto", padding: 16, fontFamily: "system-ui" };
const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 };
const errorBox = {
    marginTop: 12,
    border: "1px solid #f1b4b4",
    background: "#fff5f5",
    borderRadius: 12,
    padding: 12,
};
