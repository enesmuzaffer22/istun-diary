import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard/Dashboard";
import WriteEntry from "./components/WriteEntry/WriteEntry";
import Login from "./components/Auth/Login";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Ana sayfa - Dashboard (korumalı) */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Davet linki ile mesaj yazma sayfası (korumalı) */}
            <Route
              path="/write/:inviteCode"
              element={
                <ProtectedRoute>
                  <WriteEntry />
                </ProtectedRoute>
              }
            />

            {/* Giriş sayfası */}
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
