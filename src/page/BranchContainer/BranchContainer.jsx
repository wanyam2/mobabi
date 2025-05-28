import React from "react";
import { useToast } from "@chakra-ui/react";
import "./BranchContainer.css";

export default function CommitGraph({ branches = [], pullCommits = [] }) {
    const toast = useToast();

    const handleCommitClick = (commit) => {
        toast({
            title: "커밋 정보",
            description: `메시지: ${commit.message}`,
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <div className="graph-container">
            <h2 className="graph-title">Git Commit Graph</h2>

            <div className="graph">
                {branches.map((branch, bIndex) => (
                    <div key={branch.name} className="branch">
                        <h3 style={{ color: branchColors[bIndex] }}>{branch.name}</h3>
                        <div className="commit-line">
                            {branch.pushedCommits.map((commit, index) => (
                                <React.Fragment key={commit.hash || commit.id}>
                                    <div
                                        className="commit"
                                        style={{ backgroundColor: branchColors[bIndex] }}
                                        onClick={() => handleCommitClick(commit)}
                                        title={`메시지: ${commit.message}\n파일: ${(commit.files || []).join(', ')}`}
                                    >
                                        <div>{commit.message}</div>
                                        {commit.committedAt && (
                                            <div className="meta">{new Date(commit.committedAt).toLocaleString()}</div>
                                        )}
                                    </div>
                                    <div className="arrow">↓</div>
                                </React.Fragment>
                            ))}

                            {/* 🔽 main 브랜치 하단에 pull 커밋 추가 */}
                            {branch.name === "main" && pullCommits.map((commit, index) => (
                                <React.Fragment key={`pull-${commit.id}`}>
                                    <div
                                        className="commit"
                                        style={{ backgroundColor: branchColors[0] }}
                                        onClick={() => handleCommitClick(commit)}
                                        title={`메시지: ${commit.message}\n작성자: ${commit.author}`}
                                    >
                                        <div>{commit.message}</div>
                                        <div className="meta">{commit.date}</div>
                                    </div>
                                    {index < pullCommits.length - 1 && <div className="arrow">↓</div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const branchColors = ["#fda189", "#e1aedc", "#797f98", "#748868", "#A833FF"];
