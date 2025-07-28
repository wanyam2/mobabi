import React from "react";
import RepositoryInfo from "../sidebar/RepositoryInfo";
import UserInfo from "../sidebar/UserInfo";
import logo from "../../asset/logo.png";

export default function Sidebar({ branches, activeRepoId, onRepoClick, user }) {
    return (
        <div className="sidebar" style={{ width: "240px" }}>
            <div style={{ textAlign: "center", padding: "16px" }}>
                <img src={logo} alt="Logo" style={{ width: "80%", height: "auto" }} />
            </div>

            <RepositoryInfo
                repositories={branches}
                activeRepoId={activeRepoId}
                onRepoClick={onRepoClick}
            />

            <hr className="divider" />

            <UserInfo user={user} />
        </div>
    );
}
