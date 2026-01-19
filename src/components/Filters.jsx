import { FUEL_KEYS } from "../services/fuelApi";

export default function Filters({
                                    radiusKm,
                                    setRadiusKm,
                                    fuelLabel,
                                    setFuelLabel,
                                    brandWhitelistText,
                                    setBrandWhitelistText,
                                    onSearch,
                                    loading,
                                }) {
    return (
        <section style={box}>
            <h2 style={h2}>2) Filtros</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label style={label}>
                    Radio (km)
                    <input
                        style={input}
                        type="number"
                        min={1}
                        step={1}
                        value={radiusKm}
                        onChange={(e) => setRadiusKm(Number(e.target.value))}
                    />
                </label>

                <label style={label}>
                    Carburante
                    <select style={input} value={fuelLabel} onChange={(e) => setFuelLabel(e.target.value)}>
                        {Object.keys(FUEL_KEYS).map((k) => (
                            <option key={k} value={k}>
                                {k}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <label style={{ ...label, marginTop: 12 }}>
                Lista blanca de marcas (separadas por coma)
                <input
                    style={input}
                    value={brandWhitelistText}
                    onChange={(e) => setBrandWhitelistText(e.target.value)}
                    placeholder='Ej: REPSOL, CEPSA, BP (vacío = todas)'
                />
            </label>

            <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
                <button onClick={onSearch} style={btn} disabled={loading}>
                    {loading ? "Buscando..." : "Buscar gasolineras"}
                </button>
                <span style={{ opacity: 0.8 }}>
          Se ordena por distancia y se calcula la más barata dentro del radio.
        </span>
            </div>
        </section>
    );
}

const box = {
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 16,
};

const h2 = { margin: "0 0 12px" };
const label = { display: "grid", gap: 6, fontSize: 14 };
const input = { padding: 10, borderRadius: 10, border: "1px solid #ccc" };
const btn = { padding: "10px 12px", borderRadius: 10, border: "1px solid #ccc", cursor: "pointer" };
