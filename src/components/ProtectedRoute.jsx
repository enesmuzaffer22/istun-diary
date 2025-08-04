import { useAuth } from "../contexts/AuthContext";
import Login from "./Auth/Login";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  // Kullanıcı giriş yapmamışsa login sayfasını göster
  if (!currentUser) {
    return <Login />;
  }

  // Kullanıcı email doğrulaması yapmamışsa uyarı göster
  if (!currentUser.emailVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#aa2d3a] to-red-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            E-posta Doğrulaması Gerekli
          </h1>
          <p className="text-gray-600 mb-6">
            Lütfen {currentUser.email} adresine gönderilen doğrulama e-postasını
            onaylayın. Doğrulama işleminden sonra sayfayı yenileyin.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-[#aa2d3a] text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }

  return children;
}
