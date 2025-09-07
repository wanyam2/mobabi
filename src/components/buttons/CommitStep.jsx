// src/components/buttons/CommitStep.jsx
import React, { useState } from "react";
import { VStack, Select, Input, Button, useToast } from "@chakra-ui/react";
import { api } from "../../api";

export default function CommitStep({
                                       repoId,
                                       branches,
                                       selectedBranch,
                                       setSelectedBranch,
                                       commitMessage,
                                       setCommitMessage,
                                       onComplete,
                                   }) {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCommit = async () => {
        if (!commitMessage.trim()) {
            toast({ title: "커밋 메시지를 입력하세요", status: "warning", duration: 2000, isClosable: true });
            return;
        }
        if (!repoId) {
            toast({ title: "repoId가 없습니다", status: "error", duration: 2000, isClosable: true });
            return;
        }
        setIsSubmitting(true);
        try {
            if (selectedBranch) await api.branches.switch(repoId, selectedBranch);
            const res = await api.repos.commit(repoId, commitMessage);
            const msg = res?.message || res?.msg || "커밋이 완료되었습니다.";
            toast({ title: "Commit 성공", description: msg, status: "success", duration: 2000, isClosable: true });
            onComplete?.();
        } catch (e) {
            toast({ title: "Commit 실패", description: e?.message || "요청에 실패했습니다.", status: "error", duration: 2400, isClosable: true });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <VStack spacing={2} align="start" w="100%">
            <Select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                isDisabled={!branches?.length || isSubmitting}
            >
                {(branches ?? []).map((branch) => (
                    <option key={branch.name} value={branch.name}>{branch.name}</option>
                ))}
            </Select>
            <Input
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="어떤 작업을 했는지 설명해주세요"
                size="sm"
                isDisabled={isSubmitting}
            />
            <Button colorScheme="gray" onClick={handleCommit} isLoading={isSubmitting}>
                Commit
            </Button>
        </VStack>
    );
}
