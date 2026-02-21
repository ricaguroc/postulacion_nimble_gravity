import { useMemo, useState } from "react";
import { applyToJob, type Candidate, type Job } from "../api/external";

type Props = {
    job: Job;
    candidate: Candidate | null;
};

export default function JobItem({ job, candidate }: Props) {
    const [repoUrl, setRepoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

    const canSubmit = useMemo(() => {
        if (!candidate) return false;
        const val = repoUrl.trim();
        if (!val) return false;
        try {
            const u = new URL(val);
            return u.hostname.includes("github.com");
        } catch {
            return false;
        }
    }, [candidate, repoUrl]);

    async function onSubmit() {
        setMsg(null);
        if (!candidate) {
            setMsg({ ok: false, text: "Primero cargá tu email (candidate)." });
            return;
        }
        if (!repoUrl.trim()) {
            setMsg({ ok: false, text: "Ingresá la URL del repo." });
            return;
        }

        setLoading(true);
        try {
            await applyToJob({
                uuid: candidate.uuid,
                candidateId: candidate.candidateId,
                jobId: job.id,
                repoUrl: repoUrl.trim(),
            });
            setMsg({ ok: true, text: "Aplicación enviada ✅" });
        } catch (e: any) {
            setMsg({ ok: false, text: e?.message || "Error al enviar." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="job">
            <div className="jobTop">
                <div>
                    <div className="jobTitle">{job.title}</div>
                </div>
            </div>

            <div className="jobActions">
                <input
                    className="input"
                    placeholder="https://github.com/tu-usuario/tu-repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    disabled={loading}
                />
                <button className="btn" onClick={onSubmit} disabled={!canSubmit || loading}>
                    {loading ? "Enviando..." : "Enviar postulación"}
                </button>
            </div>

            {msg && <div className={`msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
        </div>
    );
}