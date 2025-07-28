import CommitGraph from "./CommitGraph";
import "./BranchView.css";

export default function BranchView({ branches, pullCommits }) {
    return (
        <div className="BranchContainer">
            <CommitGraph branches={branches} pullCommits={pullCommits} />
        </div>
    );
}