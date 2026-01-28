import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Pokedex from "./pages/Pokedex.jsx";

function App() {
  return (
    <div className="App">
      <Pokedex />
    </div>
  );
}

export default App;
