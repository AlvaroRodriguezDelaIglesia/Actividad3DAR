
import { useMemo, useState } from "react";
import LocationPicker from "./components/LocationPicker";
import Filters from "./components/Filters";
import Results from "./components/Results";
import { fetchStations, FUEL_KEYS } from "./services/fuelApi";
import { haversineKm, parseNumber } from "./services/geo";

export default function App() {
    const [userPos, setUserPos] = useState({ lat: 40.4168, lon: -3.7038 });
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
            setStations(data);
        } catch (e) {
            setError(String(e?.message || e));
            setStations([]);
        } finally {
            setLoading(false);
        }
    }

    const whitelist = useMemo(
        () =>
            brandWhitelistText
                .split(",")
                .map((s) => s.trim().toUpperCase())
                .filter(Boolean),
        [brandWhitelistText]
    );

    const candidates = useMemo(() => {
        if (!hasSearched) return [];

        const latU = parseNumber(userPos.lat);
        const lonU = parseNumber(userPos.lon);
        const priceKey = FUEL_KEYS[fuelLabel];

        return stations
            .map((s) => {
                const distKm = haversineKm(latU, lonU, s.lat, s.lon);
                const price = parseNumber(s.raw?.[priceKey]);
                return { ...s, distKm, price };
            })
            .filter((s) => Number.isFinite(s.distKm) && s.distKm <= radiusKm)
            .filter((s) =>
                whitelist.length ? whitelist.includes((s.brand || "").toUpperCase()) : true
            )
            .filter((s) => Number.isFinite(s.price) && s.price > 0)
            .sort((a, b) => a.distKm - b.distKm);
    }, [stations, userPos, radiusKm, fuelLabel, whitelist, hasSearched]);

    const nearest = candidates[0] ?? null;
    const cheapest = candidates.length
        ? [...candidates].sort((a, b) => a.price - b.price)[0]
        : null;

    return (
        <div className="page">
            <header className="header">
                <div className="brand">
                    <img src="./logo.svg" alt="Logo" className="brand__logo" />
                    <div>
                        <h1 className="brand__title">Gasolineras cercanas</h1>
                        <p className="brand__subtitle">
                            Consulta precios y localiza la estación más cercana o la más barata en tu zona
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid">
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

            {error && <div className="errorBox">{error}</div>}

            <div className="section">
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
