import { useState } from "react";
import JobsPage from "./JobsPage";
import Challenge2 from "./Challenge2";

export default function MainApp() {
    const [challenge, setChallenge] = useState<1 | 2>(1);
    const [email, setEmail] = useState("");
    const [trigger, setTrigger] = useState(0);

    return (
        <div className="page">
            <div className="card">
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <h1 style={{ marginBottom: "20px" }}>Nimble Gravity - Challenges</h1>

                    <div className="toggle-container">
                        <span
                            className={`toggle-label ${challenge === 1 ? "active" : ""}`}
                            onClick={() => setChallenge(1)}
                        >
                            Desafío 1
                        </span>

                        <div
                            className={`toggle-switch ${challenge === 2 ? "active" : ""}`}
                            onClick={() => setChallenge(challenge === 1 ? 2 : 1)}
                        >
                            <div className="toggle-slider"></div>
                        </div>

                        <span
                            className={`toggle-label ${challenge === 2 ? "active" : ""}`}
                            onClick={() => setChallenge(2)}
                        >
                            Desafío 2
                        </span>
                    </div>
                </div>

                <div className="row">
                    <input
                        className="input"
                        placeholder="tu-email@dominio.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        className="btn"
                        onClick={() => setTrigger(t => t + 1)}
                    >
                        {challenge === 1 ? "Cargar candidato" : "Iniciar Challenge"}
                    </button>
                </div>

                {challenge === 1 ? (
                    <JobsPage email={email} trigger={trigger} />
                ) : (
                    <Challenge2 email={email} trigger={trigger} />
                )}
            </div>
        </div>
    );
}
