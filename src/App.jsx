import React, { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import BranchView from "./components/git/BranchView";
import RepositoryInfo from "./components/sidebar/RepositoryInfo";
import UserInfo from "./components/sidebar/UserInfo";
import GitController from "./components/buttons/GitController";

function App() {
    const [branches, setBranches] = useState([
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
    ]);

    const [pullCommits, setPullCommits] = useState([]);
    const [activeRepoId, setActiveRepoId] = useState("main");
    const user = { name: "홍길동", email: "test@example.com", avatar: "/avatar.png" };

    return (
        <ChakraProvider>
            <div className="App" style={{ display: "flex" }}>
                <div className="sidebar" style={{ width: "240px" }}>
                    <RepositoryInfo
                        repositories={branches}
                        activeRepoId={activeRepoId}
                        onRepoClick={setActiveRepoId}
                    />
                    <hr className="divider" />
                    <UserInfo user={user} />
                </div>
                <div className="main" style={{ flex: 1 }}>
                    <BranchView branches={branches} pullCommits={pullCommits} />
                    <GitController
                        branches={branches}
                        setBranches={setBranches}
                        pullCommits={pullCommits}
                        setPullCommits={setPullCommits}
                    />
                </div>
            </div>
        </ChakraProvider>
    );
}

export default App;
