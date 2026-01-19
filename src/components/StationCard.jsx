export default function StationCard({ s, highlight }) {
    return (
        <div style={{ ...card, outline: highlight ? "2px solid #333" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                <strong>{s.brand || "(Sin rótulo)"}</strong>
                <span style={{ opacity: 0.8 }}>
          {s.distKm.toFixed(2)} km · {Number.isFinite(s.price) ? `${s.price.toFixed(3)} €/L` : "Sin precio"}
        </span>
            </div>

            <div style={{ marginTop: 6, opacity: 0.9 }}>
                {s.address} — {s.town} ({s.province})
            </div>

            <div style={{ marginTop: 6, fontSize: 13, opacity: 0.8 }}>
                Horario: {s.schedule || "No disponible"}
            </div>
        </div>
    );
}

const card = {
    border: "1px solid #e2e2e2",
    borderRadius: 12,
    padding: 12,
    background: "white",
};
