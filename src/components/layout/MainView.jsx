import React, { useState } from "react";
import BranchView from "../git/BranchView";
import GitStepContent from "../buttons/GitStepContent";

export default function MainView({ branches, setBranches, pullCommits, setPullCommits }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [commitMessage, setCommitMessage] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('main');

    return (
        <>
            <BranchView branches={branches} pullCommits={pullCommits} />
            <GitStepContent
                branches={branches}
                setBranches={setBranches}
                pullCommits={pullCommits}
                setPullCommits={setPullCommits}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                commitMessage={commitMessage}
                setCommitMessage={setCommitMessage}
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
            />
        </>
    );
}
