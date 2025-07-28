import { VStack, Select, Input, Button, useToast } from "@chakra-ui/react";

export default function CommitStep({ branches, selectedBranch, setSelectedBranch, commitMessage, setCommitMessage, onComplete }) {
    const toast = useToast();

    const handleCommit = async () => {
        if (!commitMessage.trim()) {
            toast({ title: '커밋 메시지를 입력하세요', status: 'warning', duration: 2000, isClosable: true });
            return;
        }
        try {
            const res = await fetch(`/repos/ba4a515c-3604-4294-a3cc-ba0b1ea05ebe/commit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: commitMessage })
            });
            const data = await res.json();
            if (!data.success) throw new Error();
            toast({ title: 'Commit 성공', description: data.message, status: 'success' });
            onComplete();
        } catch {
            toast({ title: 'Commit 실패', status: 'error' });
        }
    };

    return (
        <VStack spacing={2} align="start">
            <Select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                {branches.map(branch => <option key={branch.name} value={branch.name}>{branch.name}</option>)}
            </Select>
            <Input
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="어떤 작업을 했는지 설명해주세요"
                size="sm"
            />
            <Button colorScheme="gray" onClick={handleCommit}>Commit</Button>
        </VStack>
    );
}