import React from "react";
import CommitGraph from "../CommitGraph/CommitGraph";

export default function BranchContainer({ branches }) {
    return (
        <div>
            <CommitGraph branches={branches} />
        </div>
    );
}
