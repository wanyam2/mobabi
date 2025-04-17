import React, { useState } from 'react';
import {
    Button, Input, VStack, Box, Step, StepDescription,
    StepIndicator, StepStatus, StepTitle, Stepper, StepSeparator,
    Select, useToast, Spinner, Progress
} from "@chakra-ui/react";
import "./ButtonContainer.css";
import AddModal from "../AddModal.jsx";

const steps = [
    { title: "Pull", description: "Pull the latest changes" },
    { title: "Add", description: "Select files to add" },
    { title: "Commit", description: "Enter commit message" },
    { title: "Push", description: "Push changes to repository" },
];

function ButtonContainer({ branches, setBranches }) {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [commitMessage, setCommitMessage] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('main');
    const [isPulling, setIsPulling] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // ✅ 모달 상태
    const toast = useToast();

    // ✅ 파일 상태를 포함한 예시 데이터
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

    const handleNext = async () => {
        // Add 단계
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
                const response = await fetch(`/repos/:id/add`, {
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

        // Commit 단계
        if (activeStep === 2 && commitMessage.trim() === '') {
            alert("커밋 메시지를 입력하세요!");
            return;
        }

        setActiveStep(prev => prev + 1);
    };

    const handlePull = () => {
        setIsPulling(true);
        setTimeout(() => {
            toast({
                title: "Pull 완료",
                description: "최신 변경 사항을 불러왔습니다.",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            setIsPulling(false);
            handleNext();
        }, 2000);
    };

    const handlePush = () => {
        setBranches(prevBranches =>
            prevBranches.map(branch =>
                branch.name === selectedBranch
                    ? {
                        ...branch,
                        pushedCommits: [
                            ...branch.pushedCommits,
                            { id: branch.pushedCommits.length + 1, message: commitMessage }
                        ]
                    }
                    : branch
            )
        );

        toast({
            title: "Push 완료!",
            description: "커밋이 원격 저장소로 푸시되었습니다.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "bottom-right",
        });

        setActiveStep(0);
        setSelectedFiles([]);
        setCommitMessage('');
    };

    return (
        <Box className="ButtonContainer">
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
                                    <>
                                        {isPulling ? (
                                            <VStack>
                                                <Spinner />
                                                <Progress size="xs" isIndeterminate colorScheme="blue" w="100%" />
                                            </VStack>
                                        ) : (
                                            <Button colorScheme="blue" onClick={handlePull}>Pull</Button>
                                        )}
                                    </>
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
                                        <Select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                                            {branches.map(branch => (
                                                <option key={branch.name} value={branch.name}>{branch.name}</option>
                                            ))}
                                        </Select>
                                        <Input
                                            value={commitMessage}
                                            onChange={(e) => setCommitMessage(e.target.value)}
                                            placeholder="Enter commit message"
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
