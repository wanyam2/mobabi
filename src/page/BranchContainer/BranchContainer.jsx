import React from "react";
import CommitGraph from "../CommitGraph/CommitGraph";
import "./BranchContainer.css";

export default function BranchContainer({ branches, pullCommits }) {
    return (
        <div className="BranchContainer">
            <CommitGraph branches={branches} pullCommits= {pullCommits} />
        </div>
    );
}