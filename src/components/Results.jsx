import StationCard from "./StationCard";

export default function Results({ candidates, nearest, cheapest, fuelLabel, radiusKm }) {
    return (
        <section style={box}>
            <h2 style={h2}>3) Resultados</h2>

            <p style={{ marginTop: 0, opacity: 0.8 }}>
                Carburante: <strong>{fuelLabel}</strong> · Radio: <strong>{radiusKm} km</strong> · Coincidencias:{" "}
                <strong>{candidates.length}</strong>
            </p>

            <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
                {nearest ? (
                    <div style={pill}>
                        <strong>Más cercana:</strong> {nearest.brand} ({nearest.distKm.toFixed(2)} km) — {nearest.price.toFixed(3)} €/L
                    </div>
                ) : (
                    <div style={pill}>No hay resultados dentro del radio con precio disponible.</div>
                )}

                {cheapest ? (
                    <div style={pill}>
                        <strong>Más barata (en el radio):</strong> {cheapest.brand} ({cheapest.distKm.toFixed(2)} km) —{" "}
                        {cheapest.price.toFixed(3)} €/L
                    </div>
                ) : null}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
                {candidates.map((s) => (
                    <StationCard
                        key={s.id}
                        s={s}
                        highlight={nearest && s.id === nearest.id}
                    />
                ))}
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
const pill = {
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 12,
    background: "#fafafa",
};
