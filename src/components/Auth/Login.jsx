import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setError("");
      setMessage("");
      setLoading(true);

      if (isLogin) {
        await login(data.email, data.password);
      } else {
        await signup(data.email, data.password, data.firstName, data.lastName);
        setMessage("Kayıt başarılı! Giriş yapabilirsiniz.");
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setMessage("");
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#aa2d3a] to-red-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#aa2d3a] rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            İSTÜN Hatıra Defteri
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? "Hesabınıza giriş yapın" : "Yeni hesap oluşturun"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-700 text-sm">{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    {...register("firstName", {
                      required: isLogin ? false : "Ad gerekli",
                      minLength: {
                        value: 2,
                        message: "Ad en az 2 karakter olmalı",
                      },
                    })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aa2d3a] focus:border-transparent"
                    placeholder="Adınız"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soyad
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    {...register("lastName", {
                      required: isLogin ? false : "Soyad gerekli",
                      minLength: {
                        value: 2,
                        message: "Soyad en az 2 karakter olmalı",
                      },
                    })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aa2d3a] focus:border-transparent"
                    placeholder="Soyadınız"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                {...register("email", {
                  required: "E-posta adresi gerekli",
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aa2d3a] focus:border-transparent"
                placeholder="E-posta adresiniz"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                {...register("password", {
                  required: "Şifre gerekli",
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aa2d3a] focus:border-transparent"
                placeholder="Şifrenizi girin"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Şifre Tekrarı
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: isLogin ? false : "Şifre tekrarı gerekli",
                    validate: (value) => {
                      const password = watch("password");
                      return password === value || "Şifreler eşleşmiyor";
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aa2d3a] focus:border-transparent"
                  placeholder="Şifrenizi tekrar girin"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#aa2d3a] text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "İşlem yapılıyor..."
              : isLogin
              ? "Giriş Yap"
              : "Kayıt Ol"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-[#aa2d3a] hover:text-red-700 font-medium"
          >
            {isLogin
              ? "Hesabınız yok mu? Kayıt olun"
              : "Zaten hesabınız var mı? Giriş yapın"}
          </button>
        </div>
      </div>
    </div>
  );
}
