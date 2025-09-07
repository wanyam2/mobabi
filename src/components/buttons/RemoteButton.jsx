// src/components/buttons/RemoteButton.jsx
import React, { useEffect, useState } from "react";
import {
    Button, useToast,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Input, useDisclosure
} from "@chakra-ui/react";
import { api } from "../../api";

export default function RemoteButton({ repoId, setBranches, onCreated, isDisabled }) {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [branchName, setBranchName] = useState("");
    const [recent, setRecent] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!recent) return;
        const t = setTimeout(() => {
            setBranches((prev) => (prev || []).map((b) => (b.name === recent ? { ...b, _justCreated: false } : b)));
            setRecent(null);
        }, 1200);
        return () => clearTimeout(t);
    }, [recent, setBranches]);

    const handleCreate = async () => {
        const name = branchName.trim();
        if (!name) return;
        if (!repoId) {
            toast({ title: "repoId가 없습니다", status: "error", duration: 2000, isClosable: true });
            return;
        }
        setSubmitting(true);
        try {
            await api.branches.create(repoId, name);
            const data = await api.branches.list(repoId, { limit: 50 });
            const list = Array.isArray(data?.branches) ? data.branches : Array.isArray(data) ? data : [];
            setBranches(list.map((b) => (b.name === name ? { ...b, _justCreated: true } : b)));
            setRecent(name);
            onCreated?.(name);
            toast({ title: "브랜치 생성", description: `"${name}" 생성됨`, status: "success", duration: 1600, isClosable: true });
            setBranchName("");
            onClose();
        } catch (e) {
            toast({ title: "브랜치 생성 실패", description: e.message, status: "error", duration: 2200, isClosable: true });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Button colorScheme="purple" size="sm" onClick={onOpen} isDisabled={isDisabled}>Remote</Button>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent rounded="2xl">
                    <ModalHeader>새 브랜치 생성</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input
                            placeholder="feature/login"
                            value={branchName}
                            onChange={(e) => setBranchName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !submitting && handleCreate()}
                            autoFocus
                            isDisabled={submitting}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose} isDisabled={submitting}>취소</Button>
                        <Button colorScheme="purple" onClick={handleCreate} isLoading={submitting}>생성</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
