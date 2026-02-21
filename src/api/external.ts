import { BASE_URL } from "../config/app";

async function request(path: string, init?: RequestInit) {

    const defaultHeaders: any = {};
    if (init?.method === "POST") {
        defaultHeaders["Content-Type"] = "application/json";
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers: { ...defaultHeaders, ...(init?.headers || {}) },
    });

    const text = await res.text();
    let data: any = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text || null;
    }

    if (!res.ok) {
        const msg =
            (data && typeof data === "object" && (data.message || data.error)) ||
            (typeof data === "string" && data) ||
            `Request failed (${res.status})`;

        throw new Error(msg);
    }
    return data;
}

export type Candidate = {
    uuid: string;
    candidateId: string;
    applicationId: string;
    firstName: string;
    lastName: string;
    email: string;
};

export type Job = {
    id: string;
    title: string
};

export const getCandidateByEmail = (email: string) =>
    request(`/api/candidate/get-by-email?email=${encodeURIComponent(email)}`);

export const getJobs = () => request(`/api/jobs/get-list`);

export const applyToJob = (body: {
    uuid: string;
    jobId: string;
    candidateId: string;
    applicationId: string;
    repoUrl: string;
}) =>
    request(`/api/candidate/apply-to-job`, {
        method: "POST",
        body: JSON.stringify(body),
    });