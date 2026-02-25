import { useEffect, useState } from "react";
import { type Candidate, type Job, getCandidateByEmail, getJobs } from "../api/external";
import JobItem from "./JobItem";

export default function JobsPage({ email, trigger }: { email: string, trigger: number }) {
    const [candidate, setCandidate] = useState<Candidate | null>(null);

    const [candLoading, setCandLoading] = useState(false);
    const [candError, setCandError] = useState("");

    const [jobs, setJobs] = useState<Job[]>([]);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [jobsError, setJobsError] = useState("");

    useEffect(() => {
        let alive = true;
        (async () => {
            setJobsLoading(true);
            setJobsError("");
            try {
                const list = await getJobs();
                if (!alive) return;
                setJobs(Array.isArray(list) ? list : []);
            } catch (e: any) {
                if (!alive) return;
                setJobsError(e?.message || "No se pudo cargar la lista de jobs.");
            } finally {
                if (!alive) return;
                setJobsLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    useEffect(() => {
        if (trigger > 0) {
            loadCandidate();
        }
    }, [trigger]);

    async function loadCandidate() {
        setCandidate(null);
        setCandError("");
        const e = email.trim();
        if (!e) {
            setCandError("Ingresá tu email.");
            return;
        }

        setCandLoading(true);
        try {
            const data = await getCandidateByEmail(e);
            setCandidate(data as Candidate);
        } catch (err: any) {
            setCandError(err?.message || "No se pudo obtener el candidato.");
        } finally {
            setCandLoading(false);
        }
    }

    return (
        <div>
            <p className="muted">
                1) Ingresá tu email arriba. 2) Elegí una posición y pegá la URL de tu repositorio.
            </p>

            {candLoading && <div className="banner">Cargando candidato...</div>}
            {candError && <div className="banner err">{candError}</div>}

            {candidate && (
                <div className="banner ok">
                    Candidato: <b>{candidate.firstName} {candidate.lastName}</b> —{" "}
                    <code>{candidate.candidateId}</code>
                </div>
            )}

            {candidate && (
                <>
                    <hr />

                    <h2>Posiciones abiertas</h2>

                    {jobsLoading && <div className="banner">Cargando posiciones...</div>}
                    {jobsError && <div className="banner err">{jobsError}</div>}

                    {!jobsLoading && !jobsError && jobs.length === 0 && (
                        <div className="banner">No hay posiciones.</div>
                    )}

                    <div className="list">
                        {jobs.map((j) => (
                            <JobItem key={j.id} job={j} candidate={candidate} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}