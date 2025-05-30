import React, { useState } from "react";
import logo from "../../asset/logo.png";
import "./SideBar.css";

export default function SideBar() {
    const [activeRepoId, setActiveRepoId] = useState("repo1");

    const repositories = [
        { name: "캡스톤디자인", id: "repo1" },
        { name: "산학협력", id: "repo2" },
        { name: "과제", id: "repo3" },
    ];

    const handleRepoClick = (repoId) => {
        setActiveRepoId(repoId);
        console.log("📁 이동할 레포:", repoId);
    };

    const user = {
        name: "은채 이",
        email: "eunchae@example.com",
        avatar: "https://ui-avatars.com/api/?name=Eunchae+Lee",
    };

    return (
        <div className="sidebar">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>

            <hr className="divider" />

            <div className="menu">
                {repositories.map((repo) => (
                    <a
                        key={repo.id}
                        onClick={() => handleRepoClick(repo.id)}
                        className={`menu-item ${activeRepoId === repo.id ? "active" : ""}`}
                    >
                        {repo.name}
                    </a>
                ))}
            </div>

            <div className="bottom-section">
                <hr className="divider" />
                <div className="profile">
                    <img src={user.avatar} alt="avatar" className="avatar" />
                    <div className="user-info">
                        <strong>{user.name}</strong>
                        <div className="email">{user.email}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
