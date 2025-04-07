import React from "react";

export default function CommitGraph({ branches = [] }) {
    return (
        <div style={styles.graphContainer}>
            <h2 style={styles.title}>Git Commit Graph</h2>
            <div style={styles.graph}>
                {branches.map((branch, bIndex) => (
                    <div key={branch.name} style={styles.branch}>
                        <h3 style={{ color: branchColors[bIndex] }}>{branch.name}</h3>
                        <div style={styles.commitLine}>
                            {branch.pushedCommits.map((commit, index) => (
                                <React.Fragment key={commit.id}>
                                    <div style={{ ...styles.commit, backgroundColor: branchColors[bIndex] }}>
                                        {commit.message}
                                    </div>
                                    {index < branch.pushedCommits.length - 1 && <div style={styles.arrow}>↓</div>}
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
    graph: { display: "flex", justifyContent: "center", gap: "50px", alignItems: "flex-start" },
    branch: { display: "flex", flexDirection: "column", alignItems: "center" },
    commitLine: { display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" },
    commit: {
        padding: "10px",
        borderRadius: "5px",
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        minWidth: "150px",
        transition: "transform 0.2s ease-in-out",
    },
    arrow: { fontSize: "20px", color: "#ccc" },
};

const branchColors = ["#ec7e5f", "#dd8bce", "#797f98", "#80516b", "#A833FF"];
