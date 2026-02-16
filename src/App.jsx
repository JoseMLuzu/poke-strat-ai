import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Pokedex from "./pages/Pokedex";
import TeamPage from "./pages/TeamPage";
import PokemonDetail from "./pages/PokemonDetail";
import TypeChart from "./pages/TypeChart";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
        <Route path="/type-chart" element={<TypeChart />} />
      </Routes>
    </Router>
  );
}

export default App;
