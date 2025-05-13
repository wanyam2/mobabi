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
            <h2 className="graph-title">Git Commit Graph</h2>

            {pullCommits.length > 0 && (
                <div className="pull-commits">
                    <h4>📥 Pull 받은 커밋</h4>
                    {pullCommits.map((commit) => (
                        <div key={commit.id} className="pull-commit">
                            <strong>{commit.message}</strong>
                            <div>Author: {commit.author}</div>
                            <div>Date: {commit.date}</div>
                        </div>
                    ))}
                </div>
            )}

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
                                    {index < branch.pushedCommits.length - 1 && (
                                        <div className="arrow">↓</div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const branchColors = ["#ec7e5f", "#dd8bce", "#797f98", "#80516b", "#A833FF"];