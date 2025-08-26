// components/buttons/GitController.jsx
import React, { useEffect, useState } from "react";
import {
    Box, HStack, Spacer, Select,
    Stepper, Step, StepIndicator, StepStatus, StepTitle, StepDescription, StepSeparator,
} from "@chakra-ui/react";
import PullStep from "./PullStep";
import AddStep from "./AddStep";
import CommitStep from "./CommitStep";
import PushStep from "./PushStep";
import RemoteButton from "./RemoteButton";
import { steps } from "../../utils/constants.js";
import "./GitController.css";

export default function GitController({
                                          projectId,          // ⬅️ 현재 프로젝트
                                          branches,           // ⬅️ 현재 프로젝트의 브랜치 배열
                                          setBranches,        // ⬅️ 현재 프로젝트 브랜치만 갱신하는 setter
                                          pullCommits,
                                          setPullCommits,
                                      }) {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [commitMessage, setCommitMessage] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("main");

    useEffect(() => {
        if (!branches?.length) return;
        const names = branches.map(b => b.name);
        if (!names.includes(selectedBranch)) {
            setSelectedBranch(names[0]);
        }
    }, [branches, selectedBranch]);

    return (
        <Box className="ButtonContainer">
            <HStack mb={3} spacing={3}>
                <Select
                    size="sm"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    width="220px"
                >
                    {(branches ?? []).map(b => (
                        <option key={b.id ?? b.name} value={b.name}>{b.name}</option>
                    ))}
                </Select>

                <Spacer />

                <RemoteButton
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
                                case 0:
                                    return (
                                        <PullStep
                                            setPullCommits={setPullCommits}
                                            onComplete={() => setActiveStep(p => p + 1)}
                                        />
                                    );
                                case 1:
                                    return (
                                        <AddStep
                                            selectedFiles={selectedFiles}
                                            setSelectedFiles={setSelectedFiles}
                                            onComplete={() => setActiveStep(p => p + 1)}
                                        />
                                    );
                                case 2:
                                    return (
                                        <CommitStep
                                            branches={branches}
                                            selectedBranch={selectedBranch}
                                            setSelectedBranch={setSelectedBranch}
                                            commitMessage={commitMessage}
                                            setCommitMessage={setCommitMessage}
                                            onComplete={() => setActiveStep(p => p + 1)}
                                        />
                                    );
                                case 3:
                                    return (
                                        <PushStep
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
