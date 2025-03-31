import React from "react";
import CommitGraph from "../CommitGraph/CommitGraph"; // CommitGraph 컴포넌트 임포트
import "./BranchContainer.css";

export default function BranchContainer({ branches }) {
    return (
        <div className="BranchContainer">
            <CommitGraph branches={branches} />
        </div>
    );
}
