import './App.css';
import SideBar from "./components/SideBar/SideBar.jsx";
import BranchContainer from "./components/BranchContainer/BranchContainer.jsx";
import ButtonContainer from "./components/ButtonContainer/ButtonContainer.jsx";
import { ChakraProvider } from '@chakra-ui/react'

function App() {

    return (
        <ChakraProvider>
            <div className="App">
                <SideBar/>
                <BranchContainer />
                <ButtonContainer />
            </div>
        </ChakraProvider>
    );
}

export default App;
