import { useEffect, useState } from "react";
import { getSecondChallenge, submitSecondChallenge } from "../api/external";

export default function Challenge2({ email, trigger }: { email: string, trigger: number }) {
    const [challengeData, setChallengeData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [pastebinUrl, setPastebinUrl] = useState("");
    const [answer, setAnswer] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        if (trigger > 0 && challengeData === null) {
            loadChallenge();
        }
    }, [trigger]);

    async function loadChallenge() {
        setChallengeData(null);
        setError("");
        const e = email.trim();
        if (!e) {
            setError("Ingresá tu email arriba.");
            return;
        }

        setLoading(true);
        try {
            const data = await getSecondChallenge(e);
            setChallengeData(data);
        } catch (err: any) {
            setError(err?.message || "No se pudo iniciar el challenge.");
        } finally {
            setLoading(false);
        }
    }

    async function submitChallenge() {
        setSubmitError("");
        setSubmitSuccess(false);

        if (!pastebinUrl.trim() || !answer.trim()) {
            setSubmitError("Ingresá la URL de Pastebin y el resultado.");
            return;
        }

        const numAnswer = Number(answer);
        if (isNaN(numAnswer)) {
            setSubmitError("El resultado (answer) debe ser numérico.");
            return;
        }

        setSubmitLoading(true);
        try {
            await submitSecondChallenge({
                applicationId: challengeData.applicationId,
                pastebinUrl: pastebinUrl.trim(),
                answer: numAnswer,
            });
            setSubmitSuccess(true);
        } catch (err: any) {
            setSubmitError(err?.message || "Error al enviar la respuesta.");
        } finally {
            setSubmitLoading(false);
        }
    }

    return (
        <div>
            <p className="muted" style={{ color: "#d97706", fontWeight: "bold" }}>
                ⚠ ATENCIÓN: Tenés 30 minutos desde que iniciás el challenge. El timer arranca cuando hacés clic en Iniciar.
            </p>
            <p className="muted">
                Ingresá tu email arriba y presioná "Iniciar Challenge" para obtener las credenciales de la BD.
            </p>

            {loading && <div className="banner">Iniciando...</div>}
            {error && <div className="banner err">{error}</div>}

            {challengeData && (
                <>
                    <hr />
                    <h2>Instrucciones y Credenciales</h2>
                    <div className="banner ok" style={{ textAlign: "left", overflowX: "auto" }}>
                        <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>
                            {JSON.stringify(challengeData, null, 2)}
                        </pre>
                    </div>

                    <hr />
                    <h2>Enviar Respuesta</h2>
                    <p className="muted">Pegá la URL de tu código SQL en Pastebin y el resultado numérico obtenido.</p>

                    <div className="row" style={{ flexDirection: "column", gap: "10px", alignItems: "stretch" }}>
                        <input
                            className="input"
                            placeholder="URL de Pastebin (ej: https://pastebin.com/...)"
                            value={pastebinUrl}
                            onChange={(e) => setPastebinUrl(e.target.value)}
                            disabled={submitLoading || submitSuccess}
                        />
                        <input
                            className="input"
                            type="number"
                            placeholder="Resultado numérico (answer)"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            disabled={submitLoading || submitSuccess}
                        />
                        <button className="btn" onClick={submitChallenge} disabled={submitLoading || submitSuccess}>
                            {submitLoading ? "Enviando..." : submitSuccess ? "Enviado con éxito" : "Enviar Respuesta"}
                        </button>
                    </div>

                    {submitError && <div className="banner err">{submitError}</div>}
                    {submitSuccess && (
                        <div className="banner ok">
                            ¡Respuesta enviada correctamente! Ya podés dar por finalizado el challenge de forma correcta.
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
