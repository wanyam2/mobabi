import {
    Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalFooter, ModalBody, ModalCloseButton,
    Button, Checkbox, VStack, Badge, Flex, Text
} from "@chakra-ui/react";

const STATUS_LABEL = {
    modified:  '수정됨',
    untracked: '추가됨',
    added:     '스테이징됨',
    deleted:   '삭제됨',
    renamed:   '이름 변경',
};

const STATUS_COLOR = {
    modified:  'orange',
    untracked: 'green',
    added:     'blue',
    deleted:   'red',
    renamed:   'purple',
};

const HIDE_PATTERNS = [/^\.idea\//, /\.iml$/];

function AddModal({ isOpen, onClose, files, selectedFiles, onSelect }) {
    // 필터링된 파일 목록
    const visibleFiles = files.filter(
        f => !HIDE_PATTERNS.some(p => p.test(f.name)),
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>파일 선택</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    {visibleFiles.length === 0 ? (
                        <Text color="gray.500" py={8}>변경된 파일이 없습니다.</Text>
                    ) : (
                        <VStack align="start" spacing={3}>
                            {visibleFiles.map(file => (
                                <Flex key={file.name} align="center" gap={2}>
                                    <Checkbox
                                        isChecked={selectedFiles.includes(file.name)}
                                        onChange={() => onSelect(file.name)}
                                    />
                                    <Text>{file.name}</Text>
                                    <Badge colorScheme={STATUS_COLOR[file.status] ?? 'gray'}>
                                        {STATUS_LABEL[file.status] ?? file.status}
                                    </Badge>
                                </Flex>
                            ))}
                        </VStack>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Add
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default AddModal;
