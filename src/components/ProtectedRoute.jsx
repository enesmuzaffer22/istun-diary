import { useAuth } from "../contexts/AuthContext";
import Login from "./Auth/Login";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  // Kullanıcı giriş yapmamışsa login sayfasını göster
  if (!currentUser) {
    return <Login />;
  }

  return children;
}
