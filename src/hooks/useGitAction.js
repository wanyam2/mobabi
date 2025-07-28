export async function fetchBranches(setBranches) {
    const res = await fetch(`/repos/ba4a515c-3604-4294-a3cc-ba0b1ea05ebe/branches?limit=20`);
    const json = await res.json();
    if (json.branches?.length) setBranches(json.branches);
}

export async function createRemoteBranch(name, onSuccess, onError) {
    try {
        const res = await fetch(`/repos/ba4a515c-3604-4294-a3cc-ba0b1ea05ebe/branches`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        const data = await res.json();
        if (data.success) onSuccess(data);
        else throw new Error("브랜치 생성 실패");
    } catch (err) {
        onError(err);
    }
}