// AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import ResetPassword from "../Components/ResetPassword";

function AppRoutes() {
  return (
    <Router basename="/WebGIS-React">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;