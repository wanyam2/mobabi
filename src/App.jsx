import React, { useState } from "react";
import BranchView from "./components/git/BranchView.jsx";
import BranchContainer from "./page/BranchContainer/BranchContainer.jsx";
import ButtonContainer from "./page/ButtonContainer/ButtonContainer.jsx";
import SideBar from "./page/SideBar/SideBar.jsx";
import {ChakraProvider} from "@chakra-ui/react";

function App() {
    const [branches, setBranches] = useState([
        {
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
    return (
        <ChakraProvider>
            <div className="App">
                <div className="main-content">
                    <SideBar />
                    <BranchContainer
                        branches={branches}
                        pullCommits={pullCommits}
                    />
                    <ButtonContainer
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

