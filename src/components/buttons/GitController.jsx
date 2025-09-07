// src/components/buttons/GitController.jsx
import { api } from "../../api";
import React, { useEffect, useState } from "react";
import {
    Box, HStack, Spacer, Select,
    Stepper, Step, StepIndicator, StepStatus, StepTitle, StepDescription, StepSeparator,
    useToast
} from "@chakra-ui/react";
import PullStep from "./PullStep";
import AddStep from "./AddStep";
import CommitStep from "./CommitStep";
import PushStep from "./PushStep";
import RemoteButton from "./RemoteButton";
import { steps } from "../../utils/constants.js";
import "./GitController.css";

export default function GitController({
                                          projectId,          // ← 상위(App)에서 넘겨주는 repoId
                                          branches,
                                          setBranches,
                                          pullCommits,
                                          setPullCommits,
                                      }) {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [commitMessage, setCommitMessage] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("main");
    const toast = useToast();

    // 브랜치 목록 로드
    useEffect(() => {
        if (!projectId) return;
        let cancelled = false;
        (async () => {
            try {
                const data = await api.branches.list(projectId, { limit: 100 });
                if (cancelled) return;

                // 응답 형태 유연 처리
                // 예시: { branches: [...] } | [...] | { data: [...] }
                const list =
                    Array.isArray(data?.branches) ? data.branches :
                        Array.isArray(data)            ? data :
                            Array.isArray(data?.data)      ? data.data :
                                [];

                setBranches(list); // App에서 래핑해온 setter: 배열도 OK, 함수도 OK
            } catch (e) {
                if (cancelled) return;
                toast({
                    title: "브랜치 목록 불러오기 실패",
                    description: e.message,
                    status: "error",
                    duration: 2200,
                    isClosable: true,
                });
            }
        })();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    // 선택된 브랜치 유효성 보정
    useEffect(() => {
        if (!branches?.length) return;
        const names = branches.map((b) => b.name);
        if (!names.includes(selectedBranch)) setSelectedBranch(names[0]);
    }, [branches, selectedBranch]);

    const handleBranchChange = async (e) => {
        const next = e.target.value;
        const prev = selectedBranch;
        setSelectedBranch(next);
        try {
            await api.branches.switch(projectId, next);
        } catch (err) {
            setSelectedBranch(prev);
            toast({
                title: "브랜치 전환 실패",
                description: err.message,
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    return (
        <Box className="ButtonContainer">
            <HStack mb={3} spacing={3}>
                <Select size="sm" value={selectedBranch} onChange={handleBranchChange} width="220px">
                    {(branches ?? []).map((b) => (
                        <option key={b.id ?? b.name} value={b.name}>{b.name}</option>
                    ))}
                </Select>
                <Spacer />
                <RemoteButton
                    repoId={projectId}
                    setBranches={setBranches}
                    onCreated={(name) => setSelectedBranch(name)}
                />
            </HStack>

            <Stepper index={activeStep}>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepIndicator><StepStatus /></StepIndicator>
                        <Box>
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription>{step.description}</StepDescription>
                        </Box>
                        <StepSeparator />
                        {activeStep === index && (() => {
                            switch (index) {
                                // 0: Pull
                                case 0:
                                    return (
                                        <PullStep
                                            repoId={projectId}
                                            setPullCommits={setPullCommits}
                                            onComplete={() => {/* 필요 시 pull 완료 후 처리 */}}
                                            onSuggestACP={() => setActiveStep(1)}
                                        />
                                    );
                                // 1: Add
                                case 1:
                                    return (
                                        <AddStep
                                            repoId={projectId}
                                            selectedFiles={selectedFiles}
                                            setSelectedFiles={setSelectedFiles}
                                            onComplete={() => setActiveStep((p) => p + 1)}
                                        />
                                    );
                                // 2: Commit
                                case 2:
                                    return (
                                        <CommitStep
                                            repoId={projectId}
                                            branches={branches}
                                            selectedBranch={selectedBranch}
                                            setSelectedBranch={setSelectedBranch}
                                            commitMessage={commitMessage}
                                            setCommitMessage={setCommitMessage}
                                            onComplete={() => setActiveStep((p) => p + 1)}
                                        />
                                    );
                                // 3: Push
                                case 3:
                                    return (
                                        <PushStep
                                            repoId={projectId}
                                            setBranches={setBranches}
                                            onComplete={() => {
                                                setActiveStep(0);
                                                setSelectedFiles([]);
                                                setCommitMessage("");
                                            }}
                                        />
                                    );
                                default:
                                    return null;
                            }
                        })()}
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}
