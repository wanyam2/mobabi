import { Button, useToast } from "@chakra-ui/react";

export default function PushStep({ setBranches, onComplete }) {
    const toast = useToast();

    const handlePush = async () => {
        try {
            const res = await fetch(`/repos/ba4a515c-3604-4294-a3cc-ba0b1ea05ebe/push`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'myProject', description: '테스트 저장소', isPrivate: true })
            });
            const data = await res.json();
            if (!data.success) throw new Error();
            if (data.upToDate) {
                toast({ title: '이미 최신 상태예요', status: 'info', duration: 2500, isClosable: true });
            } else {
                const { local, remote } = data.pushed[0];
                toast({ title: 'Push 완료!', description: `${local} → ${remote} 브랜치로 푸시되었습니다.`, status: 'success', duration: 3000, isClosable: true });
            }
            onComplete();
            const updated = await fetch(`/repos/ba4a515c-3604-4294-a3cc-ba0b1ea05ebe/branches?limit=20`).then(res => res.json());
            if (updated.branches?.length) setBranches(updated.branches);
        } catch (e) {
            toast({ title: 'Push 실패', description: e.message, status: 'error', duration: 3000, isClosable: true });
        }
    };

    return <Button colorScheme="gray" onClick={handlePush}>Push</Button>;
}
