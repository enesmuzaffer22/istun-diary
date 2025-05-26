import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db, auth } from "../../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import {
  updateProfile,
  updateEmail,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import {
  User,
  Mail,
  Lock,
  Save,
  X,
  Eye,
  EyeOff,
  Key,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function ProfileSettings({
  userProfile,
  onClose,
  onUpdate,
  isEmbedded = false,
}) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    email: currentUser?.email || "",
    currentPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Eğer email değişmişse, yeniden kimlik doğrulama gerekli
      const emailChanged = formData.email !== currentUser.email;

      if (emailChanged && !formData.currentPassword) {
        showMessage(
          "error",
          "Email değiştirmek için mevcut şifrenizi girmelisiniz."
        );
        setLoading(false);
        return;
      }

      // Yeniden kimlik doğrulama (email değişikliği için)
      if (emailChanged) {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          formData.currentPassword
        );
        await reauthenticateWithCredential(currentUser, credential);
      }

      // Firebase Auth profilini güncelle
      await updateProfile(currentUser, {
        displayName: formData.name,
      });

      // Email güncelle (gerekirse)
      if (emailChanged) {
        await updateEmail(currentUser, formData.email);
      }

      // Firestore'daki kullanıcı dokümanını güncelle
      if (userProfile) {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
          name: formData.name,
          email: formData.email,
          updatedAt: new Date(),
        });
      }

      showMessage("success", "Profil başarıyla güncellendi!");

      // Parent component'e güncellenmiş profili bildir
      if (onUpdate) {
        onUpdate({
          ...userProfile,
          name: formData.name,
          email: formData.email,
        });
      }

      // Şifre alanını temizle
      setFormData((prev) => ({ ...prev, currentPassword: "" }));
    } catch (error) {
      console.error("Profil güncellenirken hata:", error);
      if (error.code === "auth/wrong-password") {
        showMessage("error", "Mevcut şifre yanlış.");
      } else if (error.code === "auth/email-already-in-use") {
        showMessage("error", "Bu email adresi zaten kullanımda.");
      } else if (error.code === "auth/invalid-email") {
        showMessage("error", "Geçersiz email adresi.");
      } else {
        showMessage("error", "Profil güncellenirken bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setPasswordResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      showMessage(
        "success",
        "Şifre sıfırlama linki email adresinize gönderildi!"
      );
    } catch (error) {
      console.error("Şifre sıfırlama hatası:", error);
      showMessage(
        "error",
        "Şifre sıfırlama linki gönderilirken bir hata oluştu."
      );
    } finally {
      setPasswordResetLoading(false);
    }
  };

  // Profil ayarları içeriğini oluştur
  const profileSettingsContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <User className="w-5 h-5 mr-2 text-[#aa2d3a]" />
          Profil Ayarları
        </h2>
        {!isEmbedded && onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`mb-4 p-3 rounded-lg flex items-center ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-4 h-4 mr-2" />
          ) : (
            <AlertCircle className="w-4 h-4 mr-2" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleProfileUpdate} className="space-y-4">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ad Soyad
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#aa2d3a] focus:border-[#aa2d3a] transition-colors"
              placeholder="Adınız ve soyadınız"
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Adresi
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#aa2d3a] focus:border-[#aa2d3a] transition-colors"
              placeholder="email@istun.edu.tr"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Sadece @istun.edu.tr uzantılı email adresleri kabul edilir
          </p>
        </div>

        {/* Current Password Field (for email changes) */}
        {formData.email !== currentUser?.email && (
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mevcut Şifre <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-[#aa2d3a] focus:border-[#aa2d3a] transition-colors"
                placeholder="Mevcut şifreniz"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-red-500 mt-1">
              Email değişikliği için mevcut şifreniz gerekli
            </p>
          </div>
        )}

        {/* Update Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#aa2d3a] text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Profili Güncelle
            </>
          )}
        </button>
      </form>

      {/* Password Reset Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <Key className="w-4 h-4 mr-2 text-[#aa2d3a]" />
          Şifre Sıfırlama
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Şifrenizi değiştirmek için email adresinize sıfırlama linki
          gönderilecek.
        </p>
        <button
          type="button"
          onClick={handlePasswordReset}
          disabled={passwordResetLoading}
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {passwordResetLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Şifre Sıfırlama Linki Gönder
            </>
          )}
        </button>
      </div>
    </>
  );

  // İki farklı render modu: Modal veya gömülü
  if (isEmbedded) {
    // Gömülü mod - sadece içerik
    return profileSettingsContent;
  }

  // Modal mod - tam ekran overlay
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">{profileSettingsContent}</div>
      </div>
    </div>
  );
}
