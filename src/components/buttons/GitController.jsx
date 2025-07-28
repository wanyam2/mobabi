import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import AddModal from "./AddModalController.jsx";
import GitStepContent from "./GitStepContent";

export default function GitController({ branches, setBranches, pullCommits, setPullCommits }) {
    const [activeStep, setActiveStep] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [commitMessage, setCommitMessage] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('main');
    const [isPulling, setIsPulling] = useState(false);
    const toast = useToast();

    const files = [
        { name: "main.ts", status: "수정됨" },
        { name: "file2.css", status: "추가됨" },
        { name: "file3.html", status: "수정됨" }
    ];

    const handleFileSelect = (fileName) => {
        setSelectedFiles((prev) =>
            prev.includes(fileName)
                ? prev.filter(f => f !== fileName)
                : [...prev, fileName]
        );
    };

    const handlePull = () => {
        setIsPulling(true);
        setTimeout(() => {
            setPullCommits([{
                id: 999,
                message: "버그 수정",
                author: "이은채",
                committedAt: new Date().toISOString(),
                files: ["bugfix.js"]
            }]);
            toast({ title: "Pull 완료", status: "success" });
            setIsPulling(false);
            setActiveStep(prev => prev + 1);
        }, 2000);
    };

    const handleCommit = () => {
        if (!commitMessage.trim()) {
            toast({ title: "커밋 메시지를 입력하세요", status: "warning" });
            return;
        }
        toast({ title: "Commit 완료", status: "success" });
        setActiveStep(prev => prev + 1);
    };

    const handlePush = () => {
        toast({ title: "Push 완료", status: "success" });
        setActiveStep(0);
        setSelectedFiles([]);
        setCommitMessage('');
    };

    return (
        <GitStepContent
            activeStep={activeStep}
            isPulling={isPulling}
            handlePull={handlePull}
            handleAddOpen={() => setIsAddModalOpen(true)}
            handleCommit={handleCommit}
            handlePush={handlePush}
            isAddModalOpen={isAddModalOpen}
            AddModalComponent={
                <AddModal
                    isOpen={isAddModalOpen}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setActiveStep(prev => prev + 1);
                    }}
                    files={files}
                    selectedFiles={selectedFiles}
                    onSelect={handleFileSelect}
                />
            }
            files={files}
            selectedFiles={selectedFiles}
            handleFileSelect={handleFileSelect}
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
            commitMessage={commitMessage}
            setCommitMessage={setCommitMessage}
            branches={branches}
        />
    );
}
