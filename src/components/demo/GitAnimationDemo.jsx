import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Button, VStack, HStack, Text, Badge } from "@chakra-ui/react";

const C = {
    pull: "#38BDF8",    // 파랑: 가져오기
    add: "#84CC16",     // 초록: 담기
    commit: "#A855F7",  // 보라: 저장
    push: "#F59E0B",    // 주황: 올리기
    merge: "#14B8A6",   // 청록: 합치기
    box: "#F1F5F9",
    border: "#CBD5E1",
};

const steps = [
    { key: "pull", color: C.pull, label: "가져오기", desc: "원격에서 최신 파일 가져오기", icon: "⬇️" },
    { key: "add", color: C.add, label: "담기", desc: "변경된 파일을 임시 보관함에 담기", icon: "📂" },
    { key: "commit", color: C.commit, label: "저장", desc: "스냅샷(버전)으로 저장", icon: "📸" },
    { key: "push", color: C.push, label: "올리기", desc: "원격 저장소로 업로드", icon: "⬆️" },
    { key: "merge", color: C.merge, label: "합치기", desc: "메인 브랜치에 병합", icon: "🔀" },
];

export default function GitWorkflowEasyDemo() {
    const [current, setCurrent] = useState(0);
    const [files, setFiles] = useState(["file1.txt", "file2.txt"]);
    const [commits, setCommits] = useState([]);
    const [remote, setRemote] = useState([]);
    const [flash, setFlash] = useState(null);

    const next = () => {
        const step = steps[current].key;
        if (step === "add") {
            // Add: 파일을 Staging 영역으로 이동
            setFlash({ text: "파일을 임시 보관함에 담았어요!", color: C.add, icon: "📂" });
        }
        if (step === "commit") {
            // Commit: 버블 생성
            const newCommit = { id: Date.now(), files };
            setCommits([...commits, newCommit]);
            setFiles([]);
            setFlash({ text: "변경 내용을 버전으로 저장했어요!", color: C.commit, icon: "📸" });
        }
        if (step === "push") {
            // Push: 커밋을 원격으로 이동
            setRemote([...remote, ...commits]);
            setCommits([]);
            setFlash({ text: "원격 저장소로 업로드했어요!", color: C.push, icon: "⬆️" });
        }
        if (step === "merge") {
            // Merge: 원격 커밋을 main에 합치기
            setFlash({ text: "메인 브랜치에 합쳤어요!", color: C.merge, icon: "🔀" });
        }

        // 다음 단계로 이동
        setCurrent((prev) => (prev < steps.length - 1 ? prev + 1 : 0));

        // 안내 말풍선 1.5초 후 사라짐
        setTimeout(() => setFlash(null), 1500);
    };

    return (
        <Box p={5} borderWidth={1} borderRadius="md" bg="white">
            <HStack justify="space-between" mb={3}>
                <Text fontWeight="bold">쉬운 Git 흐름 데모</Text>
                <Button
                    onClick={next}
                    size="sm"
                    color="white"
                    bg={steps[current].color}
                    _hover={{ opacity: 0.9 }}
                >
                    다음: {steps[current].label}
                </Button>
            </HStack>

            {/* 안내 배너 */}
            <AnimatePresence>
                {flash && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            marginBottom: "12px",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            background: flash.color + "22",
                            border: `1px solid ${flash.color}`,
                            textAlign: "center",
                            fontWeight: 500,
                        }}
                    >
                        {flash.icon} {flash.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <HStack align="flex-start" spacing={4}>
                {/* 로컬 영역 */}
                <VStack
                    align="stretch"
                    p={3}
                    borderWidth={1}
                    borderColor={C.border}
                    borderRadius="md"
                    flex={1}
                    spacing={2}
                >
                    <Text fontSize="sm" fontWeight="semibold">
                        내 컴퓨터 (Local)
                    </Text>
                    {files.map((f) => (
                        <motion.div
                            key={f}
                            initial={{ x: 0, opacity: 1 }}
                            animate={{ x: current >= 1 ? 50 : 0 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                padding: "4px 8px",
                                background: "white",
                                borderRadius: "6px",
                                border: `1px solid ${C.border}`,
                                fontSize: "0.85rem",
                            }}
                        >
                            {f}
                        </motion.div>
                    ))}

                    {/* 커밋 버블 */}
                    <HStack mt={2} spacing={2}>
                        {commits.map((c) => (
                            <motion.div
                                key={c.id}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4 }}
                                style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    background: C.commit,
                                }}
                            />
                        ))}
                    </HStack>
                </VStack>

                {/* 원격 영역 */}
                <VStack
                    align="stretch"
                    p={3}
                    borderWidth={1}
                    borderColor={C.border}
                    borderRadius="md"
                    flex={1}
                    spacing={2}
                >
                    <Text fontSize="sm" fontWeight="semibold">
                        원격 저장소 (Remote)
                    </Text>
                    <HStack spacing={2}>
                        {remote.map((c) => (
                            <motion.div
                                key={c.id}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.4 }}
                                style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    background: C.push,
                                }}
                            />
                        ))}
                    </HStack>
                </VStack>
            </HStack>

            <Text fontSize="xs" color="gray.500" mt={3}>
                {steps[current].icon} {steps[current].desc}
            </Text>
        </Box>
    );
}
