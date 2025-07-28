import { useState } from "react";
import { Button, useToast } from "@chakra-ui/react";

const dummyFiles = [
    { name: 'main.ts', status: '수정됨' },
    { name: 'file2.css', status: '추가됨' },
    { name: 'file3.html', status: '수정됨' },
];

export default function AddStep({ selectedFiles, setSelectedFiles, onComplete }) {
    const [isOpen, setIsOpen] = useState(false);
    const toast = useToast();

    const handleFileSelect = (fileName) => {
        setSelectedFiles((prev) =>
            prev.includes(fileName) ? prev.filter(f => f !== fileName) : [...prev, fileName]
        );
    };

    const handleAdd = async () => {
        if (selectedFiles.length === 0) {
            toast({
                title: "파일 선택 필요",
                description: "스테이징할 파일을 선택하세요.",
                status: "warning",
                duration: 2000,
                isClosable: true
            });
            return;
        }
        try {
            const res = await fetch(`/repos/ba4a515c-3604-4294-a3cc-ba0b1ea05ebe/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ files: selectedFiles })
            });
            const data = await res.json();
            if (!data.success) throw new Error();
            toast({
                title: "Add 성공",
                description: `${data.stagedFiles.length}개 파일이 스테이징 되었습니다.`,
                status: "success",
                duration: 2000,
                isClosable: true
            });
            onComplete();
        } catch {
            toast({ title: "Add 실패", status: "error", duration: 2000, isClosable: true });
        }
    };

    return (
        <>
            <Button onClick={() => setIsOpen(true)} colorScheme="gray">Add</Button>
            <AddModal
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    handleAdd();
                }}
                files={dummyFiles}
                selectedFiles={selectedFiles}
                onSelect={handleFileSelect}
            />
        </>
    );
}
