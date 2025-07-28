import {
    Box, Button, Input, VStack, Step, StepDescription,
    StepIndicator, StepStatus, StepTitle, Stepper, StepSeparator,
    Select, Spinner, Progress
} from "@chakra-ui/react";

export const steps = [
    { title: "Pull", description: "새로 수정된 사항을 불러와요" },
    { title: "Add", description: "내가 수정한 파일을 추가해요" },
    { title: "Commit", description: "덧붙일 메세지를 작성해요" },
    { title: "Push", description: "레포지토리에 수정사항을 반영해요" },
];

export default function GitStepContent({
                                           activeStep,
                                           isPulling,
                                           handlePull,
                                           handleAddOpen,
                                           handleCommit,
                                           handlePush,
                                           isAddModalOpen,
                                           AddModalComponent,
                                           files,
                                           selectedFiles,
                                           handleFileSelect,
                                           selectedBranch,
                                           setSelectedBranch,
                                           commitMessage,
                                           setCommitMessage,
                                           branches
                                       }) {
    return (
        <Box className="ButtonContainer">
            <Stepper index={activeStep} colorScheme="purple">
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
                                        <Button colorScheme="gray" onClick={handleAddOpen}>Add</Button>
                                        {AddModalComponent}
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
                                        <Button colorScheme="gray" onClick={handleCommit}>Commit</Button>
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
