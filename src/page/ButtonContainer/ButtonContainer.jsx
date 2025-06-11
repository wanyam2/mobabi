import React, {useEffect, useState} from 'react';
import {
    Button, Input, VStack, Box, Step, StepDescription,
    StepIndicator, StepStatus, StepTitle, Stepper, StepSeparator,
    Select, useToast, Spinner, Progress
} from "@chakra-ui/react";
import "./ButtonContainer.css";
import AddModal from "../AddModal.jsx";

const repoId = 'e8e143f1-5865-4020-bb09-5f7cd45739a9';
const token = 'dummy-jwt-token';

const steps = [
    {title: 'Pull', description: '새로 수정된 사항을 불러와요'},
    {title: 'Add', description: '내가 수정한 파일을 추가해요'},
    {title: 'Commit', description: '덧붙일 메세지를 작성해요'},
    {title: 'Push', description: '레포지토리에 수정사항을 반영해요'},
];

const fetchGraphAndApply = async (setBranches, setPullCommits) => {
    const res = await fetch(`/repos/${repoId}/graph`, {
        headers: {Authorization: `Bearer ${token}`},
    });
    const graph = await res.json();

    setBranches(
        Object.entries(graph.branches).map(([name, hash]) => ({name, hash}))
    );
    setPullCommits(graph.commits);
};


function ButtonContainer({branches, setBranches, setPullCommits}) {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [commitMessage, setCommitMessage] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('main');
    const [isPulling, setIsPulling] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const toast = useToast();

    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`/repos/${repoId}/status`);
                const json = await res.json();
                setFiles(json.files ?? []);
            } catch (e) {
                console.error('status 불러오기 실패', e);
            }
        };
        fetchStatus();
    }, []); // repoId 고정값 → 의존성 필요X

    const handleFileSelect = (fileName) => {
        setSelectedFiles((prev) =>
            prev.includes(fileName)
                ? prev.filter((f) => f !== fileName)
                : [...prev, fileName]
        );
    };

    const handleNext = async () => {
        if (activeStep === 1) {
            if (selectedFiles.length === 0) {
                toast({
                    title: '파일 선택 필요',
                    description: '스테이징할 파일을 선택하세요.',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                });
                return;
            }

            try {
                const response = await fetch(`/repos/${repoId}/add`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({files: selectedFiles}),
                });

                const data = await response.json();

                if (data.success) {
                    toast({
                        title: 'Add 성공',
                        description: `${data.stagedFiles.length}개 파일이 스테이징 되었습니다.`,
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                    });
                    setActiveStep((prev) => prev + 1);
                } else {
                    throw new Error('Add 실패');
                }
            } catch (err) {
                toast({
                    title: 'Add 실패',
                    description: err.message,
                    status: 'error',
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
                const res = await fetch(`/repos/${repoId}/commit`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({message: commitMessage, branch: selectedBranch}),
                });
                const data = await res.json();
                if (!data.success) throw new Error('Commit 실패');
                toast({title: 'Commit 성공', description: data.message, status: 'success'});
                setActiveStep((prev) => prev + 1);
            } catch (err) {
                toast({title: 'Commit 실패', description: err.message, status: 'error'});
            }
            return;
        }

        setActiveStep((prev) => prev + 1);
    };

    const handlePull = async () => {
        setIsPulling(true);
        try {
            const pullRes = await fetch(`/repos/${repoId}/pull`, {
                method: 'POST',
                headers: {Authorization: `Bearer ${token}`},
            });

            if (!pullRes.ok && pullRes.status !== 204) {
                throw new Error(await pullRes.text());
            }

            await fetchGraphAndApply(setBranches, setPullCommits);

            toast({
                title: pullRes.status === 204 ? '이미 최신입니다' : 'Pull 완료',
                status: pullRes.status === 204 ? 'info' : 'success',
            });
            setActiveStep((p) => p + 1);
        } catch (e) {
            toast({title: 'Pull 실패', description: String(e), status: 'error'});
        } finally {
            setIsPulling(false);
        }
    };

    const handlePush = async () => {
        try {
            const res = await fetch(`/repos/${repoId}/push`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: 'myProject',
                    description: '테스트 저장소',
                    isPrivate: true,
                }),
            });
            const data = await res.json();

            if (!data.success) {
                toast({ title:'Push 실패', description:data.message ?? '알 수 없는 오류', status:'error' });
                return;
            }

            const isLatest = data.upToDate;

            toast({
                title: isLatest ? '이미 최신 상태예요' : 'Push 완료!',
                status: isLatest ? 'info' : 'success',
            });

            await fetchGraphAndApply(setBranches, setPullCommits);

            setActiveStep(0);
            setSelectedFiles([]);
            setCommitMessage('');
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
            <Stepper index={activeStep}>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepIndicator>
                            <StepStatus/>
                        </StepIndicator>
                        <Box>
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription>{step.description}</StepDescription>
                        </Box>
                        <StepSeparator/>

                        {activeStep === index && (
                            <Box mt={4}>
                                {/* Pull */}
                                {index === 0 &&
                                    (isPulling ? (
                                        <VStack>
                                            <Spinner/>
                                            <Progress size="xs" isIndeterminate colorScheme="blue" w="50%"/>
                                        </VStack>
                                    ) : (
                                        <Button colorScheme="blue" onClick={handlePull}>
                                            Pull
                                        </Button>
                                    ))}

                                {/* Add */}
                                {index === 1 && (
                                    <>
                                        <Button colorScheme="gray" onClick={() => setIsAddModalOpen(true)}>
                                            Add
                                        </Button>
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

                                {/* Commit */}
                                {index === 2 && (
                                    <VStack spacing={2} align="start">
                                        <Select value={selectedBranch}
                                                onChange={(e) => setSelectedBranch(e.target.value)}>
                                            {branches.map((branch) => (
                                                <option key={branch.name} value={branch.name}>
                                                    {branch.name}
                                                </option>
                                            ))}
                                        </Select>
                                        <Input
                                            value={commitMessage}
                                            onChange={(e) => setCommitMessage(e.target.value)}
                                            placeholder="어떤 작업을 했는지 설명해주세요"
                                            size="sm"
                                        />
                                        <Button colorScheme="gray" onClick={handleNext}>
                                            Commit
                                        </Button>
                                    </VStack>
                                )}

                                {/* Push */}
                                {index === 3 && (
                                    <Button colorScheme="gray" onClick={handlePush}>
                                        Push
                                    </Button>
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