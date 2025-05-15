import React, { useState } from "react";
import "./App.css";
import BranchContainer from "./page/BranchContainer/BranchContainer.jsx";
import ButtonContainer from "./page/ButtonContainer/ButtonContainer.jsx";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
    const [branches, setBranches] = useState([
        {
            name: "main",
            pushedCommits: [{ id: 1, message: "Initial commit" }],
        },
        {
            name: "develop",
            pushedCommits: [{ id: 1, message: "Started new feature Y" }],
        },
    ]);

    const [pullCommits, setPullCommits] = useState([]);

    return (
        <ChakraProvider>
            <div className="App">
                <BranchContainer branches={branches} pullCommits={pullCommits} />
                <ButtonContainer
                    branches={branches}
                    setBranches={setBranches}
                    setPullCommits={setPullCommits}
                />
            </div>
        </ChakraProvider>
    );
}

export default App;