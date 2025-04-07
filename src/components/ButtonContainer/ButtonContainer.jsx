import React, { useState } from 'react';
import { Button, Checkbox, Input, VStack, Box, Step, StepDescription, StepIndicator, StepStatus, StepTitle, Stepper, StepSeparator, Select, useToast } from "@chakra-ui/react";
import "./ButtonContainer.css";

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
    const toast = useToast();

    const files = ['file1.js', 'file2.css', 'file3.html'];

    const handleFileSelect = (file) => {
        setSelectedFiles((prev) =>
            prev.includes(file) ? prev.filter(f => f !== file) : [...prev, file]
        );
    };

    const handleNext = () => {
        if (activeStep === 1 && selectedFiles.length === 0) {
            alert("파일을 선택하세요!");
            return;
        }
        if (activeStep === 2 && commitMessage.trim() === '') {
            alert("커밋 메시지를 입력하세요!");
            return;
        }
        setActiveStep((prev) => prev + 1);
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

        setActiveStep(0); // 스텝 초기화
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
                                    <Button colorScheme="blue" onClick={handleNext}>Pull</Button>
                                )}
                                {index === 1 && (
                                    <VStack spacing={2} align="start">
                                        {files.map((file) => (
                                            <Checkbox key={file} isChecked={selectedFiles.includes(file)} onChange={() => handleFileSelect(file)}>
                                                {file}
                                            </Checkbox>
                                        ))}
                                        <Button colorScheme="gray" onClick={handleNext}>Add</Button>
                                    </VStack>
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
