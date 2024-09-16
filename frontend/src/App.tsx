import "./App.css";
import { Route, Routes } from "react-router-dom";
// import { Home } from "./pages/Home";
import { Editor } from "./pages/Editor";

function App() {
  return (
    <Routes>
      {/* <Route index element={<Home />} /> */}
      <Route index element={<Editor />} />
    </Routes>
  );
}

export default App;
