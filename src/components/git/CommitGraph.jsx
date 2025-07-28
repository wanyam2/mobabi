import React from "react";
import { useToast } from "@chakra-ui/react";
import "./CommitGraph.css";

const branchColors = ["#fda189", "#e1aedc", "#797f98", "#748868", "#A833FF"];

export default function CommitGraph({ branches = [], pullCommits = [] }) {
    const toast = useToast();

    const handleCommitClick = (commit) => {
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
                    const pushedKeys = new Set(branch.pushedCommits.map(c => c.id || c.hash));
                    const pullOnly = branch.name === "main"
                        ? pullCommits.filter(c => !pushedKeys.has(c.id || c.hash))
                        : [];

                    const allCommits = [...branch.pushedCommits, ...pullOnly];

                    return (
                        <div key={branch.name} className="branch">
                            <h3 style={{ color: branchColors[bIndex] }}>{branch.name}</h3>
                            <div className="commit-line">
                                {allCommits.map((commit, index) => {
                                    const key = commit.id || commit.hash;
                                    const isPullCommit = pullCommits.some(pc => (pc.id || pc.hash) === key) &&
                                        !pushedKeys.has(key);

                                    return (
                                        <React.Fragment key={key}>
                                            <div
                                                className={`commit ${isPullCommit ? "pulled" : ""}`}
                                                style={{
                                                    backgroundColor: isPullCommit ? undefined : branchColors[bIndex]
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