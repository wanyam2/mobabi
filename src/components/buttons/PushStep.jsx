// components/buttons/PushStep.jsx
import React, { useState } from "react";
import { Button, useToast } from "@chakra-ui/react";
import { api } from "../../api";

export default function PushStep({ repoId, setBranches, onComplete }) {
    const toast = useToast();
    const [isPushing, setIsPushing] = useState(false);

    const handlePush = async () => {
        if (!repoId) {
            toast({ title: "repoId가 없습니다", status: "error", duration: 2500, isClosable: true });
            return;
        }
        setIsPushing(true);
        try {
            const res = await api.repos.push(repoId);

            if (res?.upToDate) {
                toast({ title: "이미 최신 상태예요", status: "info", duration: 2500, isClosable: true });
            } else {
                const pushedItem = Array.isArray(res?.pushed) ? res.pushed[0] : null;
                const local = pushedItem?.local || res?.local || res?.branch || "local";
                const remote = pushedItem?.remote || res?.remote || "origin";
                toast({
                    title: "Push 완료!",
                    description: `${local} → ${remote} 브랜치로 푸시되었습니다.`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            }

            onComplete?.();

            const updated = await api.branches.list(repoId, { limit: 50 });
            const list = Array.isArray(updated?.branches) ? updated.branches : Array.isArray(updated) ? updated : [];
            if (list.length) setBranches(list);
        } catch (e) {
            toast({
                title: "Push 실패",
                description: e?.message || "요청에 실패했습니다.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsPushing(false);
        }
    };

    return (
        <Button colorScheme="gray" onClick={handlePush} isLoading={isPushing}>
            Push
        </Button>
    );
}
