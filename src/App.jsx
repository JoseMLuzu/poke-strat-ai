import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Pokedex from "./pages/Pokedex";
import TeamPage from "./pages/TeamPage";
import PokemonDetail from "./pages/PokemonDetail";

function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-100 flex gap-4">
        <Link to="/">Pokédex</Link>
        <Link to="/team">Team Builder</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
