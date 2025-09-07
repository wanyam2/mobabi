import {
    Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalFooter, ModalBody, ModalCloseButton,
    Button, Checkbox, VStack, Badge, Text, HStack, Spacer
} from "@chakra-ui/react";

function FileSelectModal({
                             isOpen,
                             onClose,
                             files = [],
                             selectedFiles = [],
                             onSelect,
                             onConfirm,
                             isSubmitting = false,
                         }) {
    const handleSubmit = (e) => {
        e?.preventDefault?.(); // 폼 기본 동작 방지
        onConfirm?.();
    };

    const hasSelection = selectedFiles.length > 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            {/* form으로 감싸서 Enter/Submit 지원 */}
            <ModalContent as="form" onSubmit={handleSubmit}>
                <ModalHeader>파일 선택</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    {files.length === 0 ? (
                        <Text color="gray.500">표시할 파일이 없습니다.</Text>
                    ) : (
                        <VStack align="start" spacing={3}>
                            {files.map((file) => (
                                <HStack key={file.name} w="full">
                                    <Checkbox
                                        isChecked={selectedFiles.includes(file.name)}
                                        onChange={() => onSelect(file.name)}
                                    >
                                        {file.name}
                                    </Checkbox>
                                    <Spacer />
                                    <Badge colorScheme={getStatusColor(file.status)}>
                                        {file.status}
                                    </Badge>
                                </HStack>
                            ))}
                        </VStack>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        취소
                    </Button>
                    <Button
                        colorScheme="blue"
                        type="submit"                  // ✅ 제출 시 onConfirm 호출
                        isLoading={isSubmitting}
                        isDisabled={!hasSelection || isSubmitting || files.length === 0}
                    >
                        Add
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

const getStatusColor = (status) => {
    switch (status) {
        case "수정됨":
            return "orange";
        case "추가됨":
            return "green";
        default:
            return "gray";
    }
};

export default FileSelectModal;
