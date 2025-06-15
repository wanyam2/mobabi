import React, { useState } from 'react';
import {
    Button, Input, VStack, Box, Step, StepDescription,
    StepIndicator, StepStatus, StepTitle, Stepper, StepSeparator,
    Select, useToast, Spinner, Progress, Text, Flex
} from "@chakra-ui/react";
import "./ButtonContainer.css";
import AddModal from "../AddModal.jsx";

const steps = [
    { title: "Pull", description: "새로 수정된 사항을 불러와요" },
    { title: "Add", description: "내가 수정한 파일을 추가해요" },
    { title: "Commit", description: "덧붙일 메세지를 작성해요" },
    { title: "Push", description: "레포지토리에 수정사항을 반영해요" },
];

function ButtonContainer({ branches, setBranches, setPullCommits }) {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [commitMessage, setCommitMessage] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('main');
    const [isPulling, setIsPulling] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const toast = useToast();

    const files = [
        { name: 'main.ts', status: '수정됨' },
        { name: 'file2.css', status: '추가됨' },
        { name: 'file3.html', status: '수정됨' }
    ];

    const handleFileSelect = (fileName) => {
        setSelectedFiles((prev) =>
            prev.includes(fileName)
                ? prev.filter(f => f !== fileName)
                : [...prev, fileName]
        );
    };

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

            await refreshBranches();
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

    const handleNext = async () => {
        if (activeStep === 1) {
            if (selectedFiles.length === 0) {
                toast({
                    title: "파일 선택 필요",
                    description: "스테이징할 파일을 선택하세요.",
                    status: "warning",
                    duration: 2000,
                    isClosable: true,
                });
                return;
            }

            try {
                const response = await fetch(`/repos/ba4a515c-3604-4294-a3cc-ba0b1ea05ebe/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ files: selectedFiles })
                });

                const data = await response.json();

                if (data.success) {
                    toast({
                        title: "Add 성공",
                        description: `${data.stagedFiles.length}개 파일이 스테이징 되었습니다.`,
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                    });
                    setActiveStep(prev => prev + 1);
                } else {
                    throw new Error("Add 실패");
                }
            } catch (err) {
                toast({
                    title: "Add 실패",
                    description: err.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
            return;
        }

        if (activeStep === 2) {
            if (commitMessage.trim() === '') {
                toast({
                    title: '커밋 메시지를 입력하세요',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                });
                return;
            }

            try {
                const res = await fetch(`/repos/ba4a515c-3604-4294-a3cc-ba0b1ea05ebe/commit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: commitMessage }),
                });
                const data = await res.json();
                if (!data.success) throw new Error('Commit 실패');
                toast({ title: 'Commit 성공', description: data.message, status: 'success' });
                setActiveStep(prev => prev + 1);
            } catch (err) {
                toast({ title: 'Commit 실패', description: err.message, status: 'error' });
            }
            return;
        }

        setActiveStep(prev => prev + 1);
    };

    const handlePull = () => {
        setIsPulling(true);
        setTimeout(() => {
            const newPullData = [
                {
                    id: 999,
                    message: "버그를 수정했어요",
                    author: "이은채",
                    committedAt: new Date().toISOString(),
                    files: ["bugfix.js"]
                }
            ];
            setPullCommits(newPullData);
            setIsPulling(false);
            toast({
                title: "Pull 완료",
                description: "최신 변경 사항을 불러왔습니다.",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            setActiveStep(prev => prev + 1);
        }, 2000);
    };

    const refreshBranches = async () => {
        const res = await fetch(`/repos/ba4a515c-3604-4294-a3cc-ba0b1ea05ebe/branches?limit=20`);
        const json = await res.json();
        if (json.branches?.length) setBranches(json.branches);
    };

    const handlePush = async () => {
        try {
            const res = await fetch(`/repos/ba4a515c-3604-4294-a3cc-ba0b1ea05ebe/push`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'myProject',
                    description: '테스트 저장소',
                    isPrivate: true,
                }),
            });
            const data = await res.json();

            if (!data.success) throw new Error('success=false');

            if (data.upToDate) {
                toast({
                    title: '이미 최신 상태예요',
                    status: 'info',
                    duration: 2500,
                    isClosable: true,
                });
            } else {
                const { local, remote } = data.pushed[0];
                toast({
                    title: 'Push 완료!',
                    description: `${local} → ${remote} 브랜치로 푸시되었습니다.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }

            setActiveStep(0);
            setSelectedFiles([]);
            setCommitMessage('');
            await refreshBranches();

        } catch (e) {
            toast({
                title: 'Push 실패',
                description: e.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box className="ButtonContainer">
            <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize="lg" fontWeight="bold"></Text>
                <Button colorScheme="purple" size="sm" onClick={handleRemoteCreate}>
                    Remote
                </Button>
            </Flex>

            <Stepper index={activeStep}>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepIndicator>
                            <StepStatus />
                        </StepIndicator>
                        <Box>
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription>{step.description}</StepDescription>
                        </Box>
                        <StepSeparator />
                        {activeStep === index && (
                            <Box mt={4}>
                                {index === 0 && (
                                    isPulling ? (
                                        <VStack>
                                            <Spinner />
                                            <Progress size="xs" isIndeterminate colorScheme="blue" w="50%" />
                                        </VStack>
                                    ) : (
                                        <Button colorScheme="blue" onClick={handlePull}>Pull</Button>
                                    )
                                )}
                                {index === 1 && (
                                    <>
                                        <Button colorScheme="gray" onClick={() => setIsAddModalOpen(true)}>Add</Button>
                                        <AddModal
                                            isOpen={isAddModalOpen}
                                            onClose={() => {
                                                setIsAddModalOpen(false);
                                                handleNext();
                                            }}
                                            files={files}
                                            selectedFiles={selectedFiles}
                                            onSelect={handleFileSelect}
                                        />
                                    </>
                                )}
                                {index === 2 && (
                                    <VStack spacing={2} align="start">
                                        <Select value={selectedBranch}
                                                onChange={(e) => setSelectedBranch(e.target.value)}>
                                            {branches.map(branch => (
                                                <option key={branch.name} value={branch.name}>{branch.name}</option>
                                            ))}
                                        </Select>
                                        <Input
                                            value={commitMessage}
                                            onChange={(e) => setCommitMessage(e.target.value)}
                                            placeholder="어떤 작업을 했는지 설명해주세요"
                                            size="sm"
                                        />
                                        <Button colorScheme="gray" onClick={handleNext}>Commit</Button>
                                    </VStack>
                                )}
                                {index === 3 && (
                                    <Button colorScheme="gray" onClick={handlePush}>Push</Button>
                                )}
                            </Box>
                        )}
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}

export default ButtonContainer;