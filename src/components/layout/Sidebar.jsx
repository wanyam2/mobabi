import React from "react";
import UserInfo from "../sidebar/UserInfo";
import logo from "../../asset/logo.png";
import "./Sidebar.css";

export default function Sidebar({ branches: projects = [], activeRepoId, onRepoClick, user }) {
    const activeProject = projects.find(p => p.id === activeRepoId);

    return (
        <aside className="sidebar">
            <div className="sidebar__logo">
                <img src={logo} alt="Logo" />
            </div>

            <section className="sidebar__section">
                <div className="sidebar__sectionTitle">Repository</div>
                <div className="sidebar__repoName" title={activeProject?.name || "-"}>
                    {activeProject?.name || "-"}
                </div>
            </section>

            <hr className="sidebar__divider" />

            <div className="sidebar__user">
                <UserInfo user={user} />
            </div>
        </aside>
    );
}
