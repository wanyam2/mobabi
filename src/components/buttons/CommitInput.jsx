import { Input, VStack, Select, Button } from "@chakra-ui/react";

export default function CommitInput({ commitMessage, setCommitMessage, branches, selectedBranch, setSelectedBranch, onCommit }) {
    return (
        <VStack spacing={2} align="start">
            <Select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
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
            <Button colorScheme="gray" onClick={onCommit}>Commit</Button>
        </VStack>
    );
}