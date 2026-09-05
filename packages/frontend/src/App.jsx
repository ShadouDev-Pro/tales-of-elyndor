import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage.jsx";
import PlayPage from "./pages/PlayPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/jugar/:id" element={<PlayPage />} />
    </Routes>
  );
}

export default App;