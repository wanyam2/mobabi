import React, { useState } from "react";
import { Button, Spinner, VStack, Progress, useToast } from "@chakra-ui/react";
import { api } from "../../api";

/**
 * PullStep
 * - repoId: string (필수)
 * - setPullCommits?: (commits[]) => void
 * - onComplete?: () => void
 * - onSuggestACP?: () => void   // ← NEW: add→commit→push 단계로 전환 요청 콜백
 */
export default function PullStep({ repoId, setPullCommits, onComplete, onSuggestACP }) {
    const [isPulling, setIsPulling] = useState(false);
    const toast = useToast();

    const normalize = (arr = []) =>
        arr.map((c, i) => ({
            id: c.id || c.hash || c.sha || i,
            message: c.message || c.msg || c.subject || "(no message)",
            author: c.author || c.authorName || c.committer || c.user || "unknown",
            committedAt: c.committedAt || c.date || c.timestamp || new Date().toISOString(),
            files: c.files || c.changedFiles || [],
        }));

    const doPull = async (opts) => {
        const res = await api.repos.pull(repoId, opts ?? {}); // opts 없을 때도 {}로 일관
        const raw = Array.isArray(res)
            ? res
            : Array.isArray(res?.commits)
                ? res.commits
                : Array.isArray(res?.pullCommits)
                    ? res.pullCommits
                    : [];
        setPullCommits?.(normalize(raw));
    };

    // 백엔드 /status 응답을 최대한 관대하게 해석
    const readStatus = async () => {
        try {
            const s = await api.repos.status(repoId);
            // 흔히 올 수 있는 필드 이름들을 모두 고려
            const hasRemote = !!(s?.remote || s?.remoteUrl || s?.hasRemote);
            const remoteBranches = s?.remoteBranches ?? s?.branchesOnRemote ?? [];
            const hasRemoteBranch =
                typeof s?.hasRemoteBranch === "boolean"
                    ? s.hasRemoteBranch
                    : Array.isArray(remoteBranches) && remoteBranches.length > 0;

            const remoteEmpty =
                s?.remoteEmpty === true ||
                (!hasRemoteBranch && Array.isArray(remoteBranches) && remoteBranches.length === 0);

            const ahead = s?.ahead ?? s?.aheadBehind?.ahead ?? s?.localAhead ?? 0;
            const behind = s?.behind ?? s?.aheadBehind?.behind ?? s?.remoteBehind ?? 0;

            return { hasRemote, hasRemoteBranch, remoteEmpty, ahead, behind, raw: s };
        } catch {
            return {};
        }
    };

    const handlePull = async () => {
        if (!repoId) {
            toast({ title: "repoId가 없습니다", status: "error", duration: 1800, isClosable: true });
            return;
        }
        setIsPulling(true);
        try {
            // 0) 선행 조건 점검
            const st = await readStatus();

            // 원격이 없거나, 원격 브랜치가 없거나, 원격이 비어있는 경우 → add→commit→push 먼저
            if (st?.remoteEmpty || st?.hasRemote === false || st?.hasRemoteBranch === false) {
                toast({
                    title: "원격 저장소 준비 필요",
                    description: "원격 저장소가 비어있거나 브랜치가 없습니다. 먼저 add → commit → push 를 수행하세요.",
                    status: "warning",
                    duration: 3200,
                    isClosable: true,
                });
                // 부모가 단계 전환하도록 힌트 제공
                onSuggestACP?.();
                return;
            }

            // 1) 기본 pull
            await doPull();
            toast({ title: "Pull 완료", status: "success", duration: 1600, isClosable: true });
            onComplete?.();
        } catch (e1) {
            const msg1 = e1?.data?.message || e1?.message || "Internal Server Error";

            // 2) 과거 스펙 호환: 전략 요구 시 자동 재시도
            const tryWith = async (payload, label) => {
                try {
                    await doPull(payload);
                    toast({ title: "Pull 완료", description: label, status: "success", duration: 1800 });
                    onComplete?.();
                    return true;
                } catch {
                    return false;
                }
            };

            const r = await tryWith({ strategy: "rebase", rebase: true }, "Rebase로 병합");
            if (!r) {
                const m = await tryWith({ strategy: "merge", rebase: false }, "Merge로 병합");
                if (!m) {
                    const f = await tryWith({ strategy: "ff-only", ffOnly: true }, "Fast-forward only");
                    if (!f) {
                        toast({
                            title: "Pull 실패",
                            description: msg1,
                            status: "error",
                            duration: 3200,
                            isClosable: true,
                        });
                    }
                }
            }
        } finally {
            setIsPulling(false);
        }
    };

    return isPulling ? (
        <VStack>
            <Spinner />
            <Progress size="xs" isIndeterminate w="50%" />
        </VStack>
    ) : (
        <Button colorScheme="blue" onClick={handlePull}>Pull</Button>
    );
}
