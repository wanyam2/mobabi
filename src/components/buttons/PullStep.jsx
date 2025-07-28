import { useState } from "react";
import { Button, Spinner, VStack, Progress, useToast } from "@chakra-ui/react";

export default function PullStep({ setPullCommits, onComplete }) {
    const [isPulling, setIsPulling] = useState(false);
    const toast = useToast();

    const handlePull = () => {
        setIsPulling(true);
        setTimeout(() => {
            setPullCommits([
                {
                    id: 999,
                    message: "버그를 수정했어요",
                    author: "이은채",
                    committedAt: new Date().toISOString(),
                    files: ["bugfix.js"]
                }
            ]);
            setIsPulling(false);
            toast({
                title: "Pull 완료",
                description: "최신 변경 사항을 불러왔습니다.",
                status: "success",
                duration: 2000,
                isClosable: true
            });
            onComplete();
        }, 2000);
    };

    return isPulling ? (
        <VStack>
            <Spinner />
            <Progress size="xs" isIndeterminate colorScheme="blue" w="50%" />
        </VStack>
    ) : (
        <Button colorScheme="blue" onClick={handlePull}>Pull</Button>
    );
}