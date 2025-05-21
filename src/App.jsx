import React, { useState } from "react";
import "./App.css";
import BranchContainer from "./page/BranchContainer/BranchContainer.jsx";
import ButtonContainer from "./page/ButtonContainer/ButtonContainer.jsx";
import SideBar from "./page/SideBar/SideBar.jsx"; // 경로에 맞게 수정
import { ChakraProvider } from "@chakra-ui/react";

function App() {
    const [branches, setBranches] = useState([
        {
            name: "main",
            pushedCommits: [{ id: 1, message: "첫 번째 커밋" }],
        },
        {
            name: "develop",
            pushedCommits: [{ id: 1, message: "다른 브랜치" }],
        },
    ]);

    const [pullCommits, setPullCommits] = useState([]);

    return (
        <ChakraProvider>
            <div className="App">
                <SideBar />
                <div className="main-content">
                    <BranchContainer branches={branches} pullCommits={pullCommits} />
                    <ButtonContainer
                        branches={branches}
                        setBranches={setBranches}
                        setPullCommits={setPullCommits}
                    />
                </div>
            </div>
        </ChakraProvider>
    );
}

export default App;
