const BASE_URL =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
    (typeof window !== "undefined" && window.__API_BASE_URL__) ||
    "";

const DEBUG = String(import.meta.env?.VITE_API_DEBUG ?? import.meta.env?.DEV)
    .toLowerCase() === "true";

// --- Token storage ---
const tokenKey = "gitgui_token";
export function getToken() {
    try {
        return localStorage.getItem(tokenKey) || "";
    } catch {
        return "";
    }
}
export function setToken(t) {
    try {
        t
            ? localStorage.setItem(tokenKey, t)
            : localStorage.removeItem(tokenKey);
    } catch {}
}
export function clearToken() {
    setToken("");
}

// --- Helpers ---
function qs(params) {
    const q = params ? new URLSearchParams(params).toString() : "";
    return q ? `?${q}` : "";
}

async function request(method, path, body, options = {}) {
    const authToken = getToken();

    if (DEBUG) {
        console.info("[API →]", method, (BASE_URL || "") + path, {
            hasToken: !!authToken,
            body,
        });
    }

    const headers = {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(options.headers || {}),
    };

    // 빈 바디일 땐 Content-Type 강제하지 않음
    if (body != null && headers["Content-Type"] == null) {
        headers["Content-Type"] = "application/json";
    }

    const res = await fetch((BASE_URL || "") + path, {
        method,
        headers,
        body: body != null ? JSON.stringify(body) : undefined,
        ...options,
    });

    let data = null;
    try {
        data = await res.json();
    } catch {}

    if (DEBUG) {
        console.info(res.ok ? "[API ← OK]" : "[API ← ERR]", res.status, data);
    }

    if (!res.ok || (data && data.success === false)) {
        if (res.status === 401) clearToken();
        const msg =
            (data && (data.message || data.error)) ||
            `HTTP ${res.status} ${res.statusText}`;
        const err = new Error(msg);
        err.status = res.status;
        err.data = data;
        throw err;
    }
    return data;
}

export const api = {
    // 이메일/비번 회원가입 & 로그인
    auth: {
        signup: (payload) => request("POST", "/auth/signup", payload),
        signin: async (payload) => {
            const data = await request("POST", "/auth/signin", payload);
            const token =
                data?.token ||
                data?.accessToken ||
                data?.access_token ||
                data?.jwt ||
                data?.id_token;
            if (!token) throw new Error("로그인 응답에 token이 없습니다.");
            setToken(token);
            if (DEBUG) console.info("[AUTH] token stored?", !!token);
            return data;
        },
        signout: async () => {
            clearToken();
            return true;
        },
        getToken,
    },

    user: {
        me: () => request("GET", "/users/me"),
    },

    repos: {
        create: (payload) => request("POST", `/repos`, payload),
        list:   (params)  => request("GET", `/repos${qs(params)}`),
        connectRemote: (id, payload) =>
            request("POST", `/repos/${id}/remote`, payload),
        connectRemoteLocal: (id, payload) =>
            request("POST", `/repos/${id}/remote-local`, payload),
        status: (id) => request("GET", `/repos/${id}/status`),
        add: (id, files) => request("POST", `/repos/${id}/add`, { files }),
        commit: (id, message) =>
            request("POST", `/repos/${id}/commit`, { message }),
        // ✅ body 없이 호출
        pull: (id) => request("POST", `/repos/${id}/pull`),
        push: (id) => request("POST", `/repos/${id}/push`),
        graph: (id) => request("GET", `/repos/${id}/graph`),
    },

    branches: {
        list: (id, params) =>
            request("GET", `/repos/${id}/branches${qs(params)}`),
        create: (id, name) =>
            request("POST", `/repos/${id}/branches`, { name }),
        switch: (id, name) =>
            request("POST", `/repos/${id}/branches/switch`, { name }),
    },

    request,
};

// 디버깅용 전역 노출
if (import.meta.env.DEV && typeof window !== "undefined") {
    window.__api = api;
    window.__setToken = setToken;
    window.__getToken = getToken;
    window.__clearToken = clearToken;
    window.__API_BASE_URL__ = BASE_URL;
}
