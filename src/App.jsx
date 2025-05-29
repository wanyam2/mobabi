import React, { useState } from "react";
import "./App.css";
import BranchContainer from "./page/BranchContainer/BranchContainer.jsx";
import ButtonContainer from "./page/ButtonContainer/ButtonContainer.jsx";
import SideBar from "./page/SideBar/SideBar.jsx";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
    const [branches, setBranches] = useState([
        {
            name: "main",
            pushedCommits: [{ id: 1, message: "initial commit" }],
        },
        {
            name: "develop",
            pushedCommits: [{ id: 1, message: "another commit" }],
        },
    ]);

    const [pullCommits, setPullCommits] = useState([]);

    return (
        <ChakraProvider>
            <div className="App">
                <div className="main-content">
                    <BranchContainer branches={branches} pullCommits={pullCommits} />
                    <ButtonContainer
                        branches={branches}
                        setBranches={setBranches}
                        setPullCommits={setPullCommits}
                    />
                    <SideBar />
                </div>
            </div>
        </ChakraProvider>
    );
}

export default App;
