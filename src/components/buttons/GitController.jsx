import React, { useState } from "react";
import { Box, Stepper, Step, StepIndicator, StepStatus, StepTitle, StepDescription, StepSeparator } from "@chakra-ui/react";
import PullStep from "./PullStep";
import AddStep from "./AddStep";
import CommitStep from "./CommitStep";
import PushStep from "./PushStep";
import RemoteButton from "./RemoteButton";
import { steps } from "../../utils/constants.js";
import "./GitController.css";

export default function GitController({ branches, setBranches, setPullCommits }) {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [commitMessage, setCommitMessage] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('main');

    return (
        <Box className="ButtonContainer">
            <RemoteButton setBranches={setBranches} />

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
                                            onComplete={() => setActiveStep(prev => prev + 1)}
                                        />
                                    );
                                case 1:
                                    return (
                                        <AddStep
                                            selectedFiles={selectedFiles}
                                            setSelectedFiles={setSelectedFiles}
                                            onComplete={() => setActiveStep(prev => prev + 1)}
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
                                            onComplete={() => setActiveStep(prev => prev + 1)}
                                        />
                                    );
                                case 3:
                                    return (
                                        <PushStep
                                            setBranches={setBranches}
                                            onComplete={() => {
                                                setActiveStep(0);
                                                setSelectedFiles([]);
                                                setCommitMessage('');
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
