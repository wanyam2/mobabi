// components/buttons/RemoteButton.jsx
import React, { useEffect, useState } from "react";
import {
    Button, useToast,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Input, useDisclosure
} from "@chakra-ui/react";

export default function RemoteButton({ setBranches, onCreated }) {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [branchName, setBranchName] = useState("");
    const [recent, setRecent] = useState(null);

    useEffect(() => {
        if (!recent) return;
        const t = setTimeout(() => {
            setBranches(prev => prev.map(b => b.name === recent ? { ...b, _justCreated: false } : b));
            setRecent(null);
        }, 1200);
        return () => clearTimeout(t);
    }, [recent, setBranches]);

    const createBranchLocally = (name) => {
        setBranches(prev => {
            const list = Array.isArray(prev) ? prev : [];
            if (list.some(b => (b.name || b.id) === name)) return list;
            const id = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `local-${Date.now()}`;
            return [...list, { id, name, pushedCommits: [], _justCreated: true }];
        });
        setRecent(name);
        queueMicrotask(() => onCreated?.(name));
        toast({ title: "브랜치 생성", description: `"${name}" 생성됨`, status: "success", duration: 1600, isClosable: true });
    };

    const handleCreate = () => {
        const name = branchName.trim();
        if (!name) return;
        createBranchLocally(name);
        setBranchName("");
        onClose();
    };

    return (
        <>
            <Button colorScheme="purple" size="sm" onClick={onOpen}>Remote</Button>
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
                            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                            autoFocus
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>취소</Button>
                        <Button colorScheme="purple" onClick={handleCreate}>생성</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
