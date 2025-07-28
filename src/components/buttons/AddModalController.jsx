import { Button } from "@chakra-ui/react";
import FileSelectModal from "../modals/FileSelectModal";
import "./AddModalController.css";

export default function AddModalController({ isOpen, onOpen, onClose, files, selectedFiles, onSelect }) {
    return (
        <>
            <Button colorScheme="gray" onClick={onOpen}>Add</Button>
            <FileSelectModal
                isOpen={isOpen}
                onClose={onClose}
                files={files || []}
                selectedFiles={selectedFiles}
                onSelect={onSelect}
            />
        </>
    );
}