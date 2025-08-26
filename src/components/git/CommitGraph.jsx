import React from "react";
import { useToast } from "@chakra-ui/react";
import "./CommitGraph.css";

const branchColors = ["#fda189", "#e1aedc", "#797f98", "#748868", "#A833FF"];

export default function CommitGraph({ branches = [], pullCommits = [] }) {
    const toast = useToast();

    const handleCommitClick = (commit) => {
        if (commit._placeholder) return;
        toast({
            title: "커밋",
            description: commit.message,
            status: "success",
            duration: 2000,
            isClosable: true,
        });
    };

    return (
        <div className="graph-container">
            <div className="graph">
                {branches.map((branch, bIndex) => {
                    const pushedKeys = new Set((branch.pushedCommits || []).map(c => c.id || c.hash));
                    const pullOnly = branch.name === "main"
                        ? (pullCommits || []).filter(c => !pushedKeys.has(c.id || c.hash))
                        : [];
                    let allCommits = [...(branch.pushedCommits || []), ...pullOnly];

                    if (allCommits.length === 0) {
                        allCommits = [{
                            id: `placeholder-${branch.name}`,
                            message: "(빈 브랜치)",
                            date: new Date().toLocaleString(),
                            _placeholder: true
                        }];
                    }

                    return (
                        <div
                            key={branch.name}
                            className={`branch ${branch._justCreated ? "new-branch" : ""}`}
                        >
                            <h3 style={{ color: branchColors[bIndex % branchColors.length] }}>
                                {branch.name}
                                {branch._justCreated && <span className="badge-new">NEW</span>}
                            </h3>

                            <div className="commit-line">
                                {allCommits.map((commit, index) => {
                                    const key = commit.id || commit.hash || `${branch.name}-${index}`;
                                    const isPullCommit = pullCommits.some(pc => (pc.id || pc.hash) === (commit.id || commit.hash))
                                        && !pushedKeys.has(commit.id || commit.hash);

                                    return (
                                        <React.Fragment key={key}>
                                            <div
                                                className={`commit ${isPullCommit ? "pulled" : ""} ${commit._placeholder ? "placeholder" : ""}`}
                                                style={{
                                                    backgroundColor: (isPullCommit || commit._placeholder)
                                                        ? undefined
                                                        : branchColors[bIndex % branchColors.length]
                                                }}
                                                onClick={() => handleCommitClick(commit)}
                                            >
                                                <div>{commit.message}</div>
                                                <div className="meta">
                                                    {commit.committedAt
                                                        ? new Date(commit.committedAt).toLocaleString()
                                                        : commit.date}
                                                </div>
                                            </div>
                                            {index < allCommits.length - 1 && <div className="arrow">↓</div>}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
