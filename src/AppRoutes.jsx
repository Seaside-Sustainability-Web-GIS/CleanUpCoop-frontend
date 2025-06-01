// AppRoutes.jsx
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import App from "./App";
import ResetPasswordFromKey from "../components/ResetPasswordFromKey"
import VerifyEmailPage from "../components/VerifyEmailPage";

function AppRoutes() {
    return (
        <Router basename="/">
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="/verify-email/:key" element={<VerifyEmailPage/>}/>
                <Route path="/reset-password/key/:key" element={<ResetPasswordFromKey/>}/>
                <Route path="*" element={<div>404 Not Found</div>}/>
            </Routes>
        </Router>
    );
}

export default AppRoutes;
