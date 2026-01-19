import { useState } from "react";

export default function LocationPicker({ value, onChange }) {
    const [status, setStatus] = useState("");

    function setManual(field, v) {
        onChange({ ...value, [field]: v });
    }

    function useGeolocation() {
        if (!navigator.geolocation) {
            setStatus("Tu navegador no soporta geolocalización.");
            return;
        }

        setStatus("Obteniendo ubicación...");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                onChange({ lat, lon });
                setStatus("Ubicación detectada.");
            },
            (err) => {
                setStatus(`No se pudo obtener ubicación: ${err.message}`);
                if (err.code === 1) msg = "Permiso denegado: permite la ubicación en el navegador.";
                if (err.code === 2) msg = "Ubicación no disponible: revisa GPS/Wi-Fi o servicios de localización.";
                if (err.code === 3) msg = "Tiempo de espera agotado: vuelve a intentarlo.";

                setStatus(`${msg} (${err.message})`);
            },
            { enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0, }
        );
    }

    return (
        <section className="card">
            <h2 className="card__title" >1) Ubicación</h2>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <button onClick={useGeolocation} style={btn}>
                    Usar mi ubicación
                </button>
                <span style={{ opacity: 0.8 }}>{status}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                <label style={label}>
                    Latitud
                    <input
                        style={input}
                        type="number"
                        step="any"
                        value={value.lat ?? ""}
                        onChange={(e) => setManual("lat", e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="Ej: 40.4168"
                    />
                </label>

                <label style={label}>
                    Longitud
                    <input
                        style={input}
                        type="number"
                        step="any"
                        value={value.lon ?? ""}
                        onChange={(e) => setManual("lon", e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="Ej: -3.7038"
                    />
                </label>
            </div>

            <p style={{ marginTop: 10, opacity: 0.8 }}>
                Consejo: si pruebas desde PC sin GPS, mete coordenadas manuales (por ejemplo Madrid:
                40.4168, -3.7038).
            </p>
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
