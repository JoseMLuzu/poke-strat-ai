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
      {/* Test: design tokens conectados a Tailwind */}
      <div className="bg-background text-foreground border border-border p-3 rounded mb-2">
        Tokens OK: bg-background, text-foreground, border-border
      </div>
      <Link to="/">Pokédex</Link>
      <Link to="/team">Team Builder</Link>

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
