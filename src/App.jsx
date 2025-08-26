// App.js
import React, { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import BranchView from "./components/git/BranchView";
import Sidebar from "./components/layout/Sidebar";
import GitController from "./components/buttons/GitController";

function App() {
    const [projects, setProjects] = useState([
        {
            id: "proj-1",
            name: "My Repo",
            branches: [
                {
                    id: "main",
                    name: "main",
                    pushedCommits: [
                        {
                            id: 1,
                            message: "처음 커밋입니다!",
                            committedAt: new Date().toISOString(),
                            files: ["README.md"]
                        }
                    ]
                },
                {
                    id: "feature/login",
                    name: "feature/login",
                    pushedCommits: [
                        {
                            id: 2,
                            message: "로그인 UI 개발",
                            committedAt: new Date().toISOString(),
                            files: ["Login.jsx"]
                        },
                        {
                            id: 3,
                            message: "로그인 API 연동",
                            committedAt: new Date().toISOString(),
                            files: ["auth.js"]
                        }
                    ]
                }
            ]
        },
        // 필요하면 다른 프로젝트 추가
        // { id: "proj-2", name: "Docs Site", branches: [...] }
    ]);

    const [pullCommits, setPullCommits] = useState([]);
    const [activeProjectId, setActiveProjectId] = useState("proj-1");

    const user = { name: "홍길동", email: "test@example.com", avatar: "/avatar.png" };

    const activeProject = projects.find(p => p.id === activeProjectId);
    const projectBranches = activeProject?.branches ?? [];

    // 특정 프로젝트의 branches만 갱신
    const setProjectBranches = (projectId, updater) => {
        setProjects(prev =>
            prev.map(p => {
                if (p.id !== projectId) return p;
                const nextBranches = typeof updater === "function" ? updater(p.branches) : updater;
                return { ...p, branches: nextBranches };
            })
        );
    };

    return (
        <ChakraProvider>
            <div className="App" style={{ display: "flex" }}>
                <Sidebar
                    projects={projects}           // ⬅️ 프로젝트 목록만 표시
                    activeProjectId={activeProjectId}
                    onProjectClick={setActiveProjectId}
                    user={user}
                />
                <div className="main" style={{ flex: 1 }}>
                    <BranchView
                        branches={projectBranches}   // ⬅️ 선택한 프로젝트의 브랜치들만 시각화
                        pullCommits={pullCommits}
                    />
                    <GitController
                        projectId={activeProjectId}
                        branches={projectBranches}   // ⬅️ 선택한 프로젝트의 브랜치들만 제어
                        setBranches={(updater) => setProjectBranches(activeProjectId, updater)}
                        pullCommits={pullCommits}
                        setPullCommits={setPullCommits}
                    />
                </div>
            </div>
        </ChakraProvider>
    );
}

export default App;
