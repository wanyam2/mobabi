import React from "react";
import { useToast } from "@chakra-ui/react";
import "./CommitGraph.css";

export default function CommitGraph({ branches = [], pullCommits = [] }) {
    const toast = useToast();

    const handleCommitClick = (commit) => {
        console.log("✅ 커밋 성공:", commit);
        toast({
            title: "커밋 성공!",
            description: `메시지: ${commit.message}`,
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <div className="graph-container">
            {pullCommits.length > 0 && (
                <div className="pull-commits">
                    {pullCommits.map((commit) => (
                        <div key={commit.id} className="pull-commit">

                        </div>
                    ))}
                </div>
            )}

            <div className="graph">
                <div className="graph">
                    {branches.map((branch, bIndex) => {
                        const allCommits =
                            branch.name === "main"
                                ? [...branch.pushedCommits, ...pullCommits]
                                : branch.pushedCommits;

                        return (
                            <div key={branch.name} className="branch">
                                <h3 style={{ color: branchColors[bIndex] }}>{branch.name}</h3>
                                <div className="commit-line">
                                    {allCommits.map((commit, index) => (
                                        <React.Fragment key={commit.hash || commit.id}>
                                            <div
                                                className="commit"
                                                style={{ backgroundColor: branchColors[bIndex] }}
                                                onClick={() => handleCommitClick(commit)}
                                                title={`메시지: ${commit.message}\n파일: ${(commit.files || []).join(", ")}`}
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
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const branchColors = ["#fda189", "#e1aedc", "#797f98", "#748868", "#A833FF"];