import { Routes, Route } from "react-router-dom";
import MovieInfo from "./pages/movieInfo.jsx";
import Home from "./pages/home.jsx"; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/movie/:id" element={<MovieInfo/>} />
    </Routes>
  );
}

export default App;