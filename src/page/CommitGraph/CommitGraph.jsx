import React from "react";
import { useToast } from "@chakra-ui/react";

export default function CommitGraph({ branches = [] }) {
    const toast = useToast();

    const handleCommitClick = (commit) => {
        console.log("✅ 커밋 성공:", commit);
        toast({
            title: "커밋 성공!",
            description: `해시: ${commit.hash?.slice(0, 7)}\n메시지: ${commit.message}`,
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <div style={styles.graphContainer}>
            <h2 style={styles.title}>Git Commit Graph</h2>
            <div style={styles.graph}>
                {branches.map((branch, bIndex) => (
                    <div key={branch.name} style={styles.branch}>
                        <h3 style={{ color: branchColors[bIndex] }}>{branch.name}</h3>
                        <div style={styles.commitLine}>
                            {branch.pushedCommits.map((commit, index) => (
                                <React.Fragment key={commit.hash || commit.id}>
                                    <div
                                        style={{ ...styles.commit, backgroundColor: branchColors[bIndex] }}
                                        onClick={() => handleCommitClick(commit)}
                                    >
                                        <div>{commit.message}</div>
                                        {commit.hash && (
                                            <div style={styles.meta}>{commit.hash.slice(0, 6)}</div>
                                        )}
                                        {commit.committedAt && (
                                            <div style={styles.meta}>{new Date(commit.committedAt).toLocaleString()}</div>
                                        )}
                                    </div>
                                    {index < branch.pushedCommits.length - 1 && (
                                        <div style={styles.arrow}>↓</div>
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

const styles = {
    title: { color: "#fff", marginBottom: "10px" },
    graph: {
        display: "flex",
        justifyContent: "center",
        gap: "50px",
        alignItems: "flex-start",
    },
    branch: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    commitLine: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
    },
    commit: {
        padding: "10px",
        borderRadius: "5px",
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        minWidth: "150px",
        transition: "transform 0.2s ease-in-out",
        cursor: "pointer",
    },
    meta: {
        fontSize: "0.7rem",
        opacity: 0.7,
    },
    arrow: { fontSize: "20px", color: "#ccc" },
};

const branchColors = ["#ec7e5f", "#dd8bce", "#797f98", "#80516b", "#A833FF"];
