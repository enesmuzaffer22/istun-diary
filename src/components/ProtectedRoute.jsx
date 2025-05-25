import { useAuth } from "../contexts/AuthContext";
import Login from "./Auth/Login";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  // Kullanıcı giriş yapmamışsa login sayfasını göster
  if (!currentUser) {
    return <Login />;
  }

  // E-posta doğrulanmamışsa uyarı göster
  if (!currentUser.emailVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            E-posta Doğrulaması Gerekli
          </h2>
          <p className="text-gray-600 mb-6">
            Hesabınıza gönderilen doğrulama e-postasındaki linke tıklayarak
            e-posta adresinizi doğrulayın.
          </p>
          <p className="text-sm text-gray-500">
            E-postayı bulamıyor musunuz? Spam klasörünüzü kontrol edin.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
