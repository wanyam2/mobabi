import React from "react";
import { Button, useToast } from "@chakra-ui/react";

export default function RemoteButton({ setBranches }) {
    const toast = useToast();

    const handleRemoteCreate = async () => {
        const newBranch = prompt("새 브랜치 이름을 입력하세요:");
        if (!newBranch) return;

        try {
            const res = await fetch(`/repos/ba4a515c-3604-4294-a3cc-ba0b1ea05ebe/branches`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newBranch }),
            });
            const data = await res.json();

            if (!data.success) throw new Error("브랜치 생성 실패");

            toast({
                title: "브랜치 생성 성공",
                description: `"${newBranch}" 브랜치가 생성되었습니다.`,
                status: "success",
                duration: 2000,
                isClosable: true,
            });

            const updated = await fetch(`/repos/ba4a515c-3604-4294-a3cc-ba0b1ea05ebe/branches?limit=20`);
            const updatedData = await updated.json();
            if (updatedData.branches?.length) setBranches(updatedData.branches);

        } catch (err) {
            toast({
                title: "브랜치 생성 실패",
                description: err.message,
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    return (
        <Button colorScheme="purple" size="sm" onClick={handleRemoteCreate}>
            Remote
        </Button>
    );
}
