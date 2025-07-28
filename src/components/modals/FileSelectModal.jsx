import {
    Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalFooter, ModalBody, ModalCloseButton,
    Button, Checkbox, VStack, Badge
} from "@chakra-ui/react";

function FileSelectModal({ isOpen, onClose, files, selectedFiles, onSelect }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>파일 선택</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack align="start">
                        {files.map(file => (
                            <Checkbox
                                key={file.name}
                                isChecked={selectedFiles.includes(file.name)}
                                onChange={() => onSelect(file.name)}
                            >
                                {file.name} {" "}
                                <Badge colorScheme={getStatusColor(file.status)}>
                                    {file.status}
                                </Badge>
                            </Checkbox>
                        ))}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>Add</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

const getStatusColor = (status) => {
    switch (status) {
        case '수정됨':
            return 'orange';
        case '추가됨':
            return 'green';
        default:
            return 'gray';
    }
};

export default FileSelectModal;