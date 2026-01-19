import { useState } from "react";

export default function LocationPicker({ value, onChange }) {
    const [status, setStatus] = useState("");

    function setManual(field, v) {
        onChange({ ...value, [field]: v });
    }

    function humanGeoError(err) {
        if (!err) return "Error desconocido.";
        if (err.code === 1) return "Permiso denegado. Activa la ubicación para este sitio.";
        if (err.code === 2) return "Posición no disponible (CoreLocation/servicios de localización no disponibles).";
        if (err.code === 3) return "Tiempo de espera agotado al obtener la posición.";
        return err.message || "Error desconocido.";
    }

    function requestPosition(options) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    }

    async function useGeolocation() {
        if (!("geolocation" in navigator)) {
            setStatus("Tu navegador no soporta geolocalización.");
            return;
        }
        if (!window.isSecureContext) {
            setStatus("La geolocalización requiere HTTPS.");
            return;
        }

        setStatus("Obteniendo ubicación (GPS/servicios del sistema)…");

        // Intento 1: alta precisión
        try {
            const pos = await requestPosition({
                enableHighAccuracy: true,
                timeout: 12000,
                maximumAge: 0,
            });
            onChange({ lat: pos.coords.latitude, lon: pos.coords.longitude });
            setStatus("Ubicación detectada (alta precisión).");
            return;
        } catch (e1) {
            // Intento 2: precisión estándar
            try {
                setStatus("Reintentando con precisión estándar…");
                const pos = await requestPosition({
                    enableHighAccuracy: false,
                    timeout: 20000,
                    maximumAge: 300000,
                });
                onChange({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                setStatus("Ubicación detectada (precisión estándar).");
                return;
            } catch (e2) {
                setStatus(`${humanGeoError(e2)} Puedes usar ubicación aproximada por IP o introducir coordenadas.`);
            }
        }
    }

    async function useIpLocation() {
        setStatus("Obteniendo ubicación aproximada por IP…");
        try {
            const res = await fetch("https://ipwho.is/");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message || "El servicio IP no pudo determinar la ubicación.");
            }

            const lat = Number(data.latitude);
            const lon = Number(data.longitude);

            if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
                throw new Error("No se recibieron coordenadas válidas desde el servicio IP.");
            }

            onChange({ lat, lon });
            setStatus(`Ubicación aproximada aplicada (IP): ${data.city || "?"}, ${data.region || "?"}. \n IP puede ser inexacta; usa GPS o introduce coordenadas`);
        } catch (e) {
            setStatus(`No se pudo obtener ubicación por IP: ${String(e?.message || e)}`);
        }
    }


    return (
        <section className="card">
            <h2 className="card__title">1) Ubicación</h2>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <button className="btn" onClick={useGeolocation} type="button">
                    Usar mi ubicación (GPS)
                </button>

                <button className="btn" onClick={useIpLocation} type="button" style={{ background: "#fff", color: "#111" }}>
                    Usar ubicación aproximada (IP)
                </button>

                <span className="help">{status}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                <label className="field">
                    Latitud
                    <input
                        className="input"
                        type="number"
                        step="any"
                        value={value.lat ?? ""}
                        onChange={(e) => setManual("lat", e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="Ej: 40.4168"
                    />
                </label>

                <label className="field">
                    Longitud
                    <input
                        className="input"
                        type="number"
                        step="any"
                        value={value.lon ?? ""}
                        onChange={(e) => setManual("lon", e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="Ej: -3.7038"
                    />
                </label>
            </div>

            <p className="help" style={{ marginTop: 10 }}>
                Si el GPS falla (por ejemplo, CoreLocation “LocationUnknown”), puedes usar IP (aproximado) o introducir coordenadas manualmente.
            </p>
        </section>
    );
}
