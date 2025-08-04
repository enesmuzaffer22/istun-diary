import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  BookOpen,
  Share2,
  Plus,
  LogOut,
  Copy,
  CheckCircle,
  User,
  Clock,
  Calendar,
  Settings,
  Menu,
  X,
  Gift,
  Sparkles,
  Eye,
  QrCode,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import ProfileSettings from "./ProfileSettings";
import QRCode from "qrcode";

// Sürpriz mesajların açılacağı tarih - 4 Ağustos 2025, 11:30
const REVEAL_DATE = new Date("2025-08-04T11:30:00").getTime();

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [entries, setEntries] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [inviteLink, setInviteLink] = useState("");
  const [showInviteLink, setShowInviteLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" veya "settings"
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [revealedEntries, setRevealedEntries] = useState(() => {
    // localStorage'dan açılmış mesajları yükle
    const saved = localStorage.getItem(`revealedEntries_${currentUser?.uid}`);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [showQRCode, setShowQRCode] = useState(false);
  const qrCodeRef = useRef(null);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isRevealTime, setIsRevealTime] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    // Kullanıcı profilini oluştur/getir
    const initializeUser = async () => {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const userData = {
            email: currentUser.email,
            name: currentUser.displayName || currentUser.email.split("@")[0],
            createdAt: new Date(),
            inviteCode: generateInviteCode(),
          };
          await setDoc(userRef, userData);
          setUserProfile(userData);
        } else {
          setUserProfile(userSnap.data());
        }
      } catch (error) {
        console.error("Kullanıcı profili oluşturulurken hata:", error);
        // Firestore erişim hatası durumunda varsayılan profil oluştur
        const defaultProfile = {
          email: currentUser.email,
          name: currentUser.displayName || currentUser.email.split("@")[0],
          createdAt: new Date(),
          inviteCode: generateInviteCode(),
        };
        setUserProfile(defaultProfile);
      }
    };

    initializeUser();

    // Kullanıcının defterine yazılan mesajları dinle
    const q = query(
      collection(db, "entries"),
      where("recipientId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const entriesData = [];
        querySnapshot.forEach((doc) => {
          entriesData.push({ id: doc.id, ...doc.data() });
        });
        // Client-side'da sıralama yap
        entriesData.sort((a, b) => {
          const aDate = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const bDate = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return bDate - aDate;
        });
        setEntries(entriesData);
        setLoading(false);
      },
      (error) => {
        console.error("Mesajlar dinlenirken hata:", error);
        setEntries([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // currentUser değiştiğinde localStorage'dan açılmış mesajları yükle
  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`revealedEntries_${currentUser.uid}`);
      if (saved) {
        setRevealedEntries(new Set(JSON.parse(saved)));
      }
    }
  }, [currentUser]);

  // Geri sayım timer'ı
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = REVEAL_DATE - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
        setIsRevealTime(false);
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsRevealTime(true);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateInviteCode = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const generateInviteLink = () => {
    if (userProfile) {
      const link = `${window.location.origin}/write/${userProfile.inviteCode}`;
      setInviteLink(link);
      setShowInviteLink(true);
    }
  };

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Kopyalama başarısız:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error);
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile(updatedProfile);
  };

  const revealSurprise = (entryId) => {
    // Eğer henüz açılış zamanı gelmemişse, açmaya izin verme
    if (!isRevealTime) {
      return;
    }

    setRevealedEntries((prev) => {
      const newSet = new Set([...prev, entryId]);
      // localStorage'a kaydet
      localStorage.setItem(
        `revealedEntries_${currentUser.uid}`,
        JSON.stringify([...newSet])
      );
      return newSet;
    });
  };

  const generateQRCode = async () => {
    console.log("QR kod oluşturma başladı", {
      inviteLink,
      hasRef: !!qrCodeRef.current,
    });

    if (!inviteLink) {
      console.error("Davet linki bulunamadı");
      alert("Önce davet linki oluşturmalısınız!");
      return;
    }

    // Önce state'i true yap ki container görünsün
    setShowQRCode(true);

    // setTimeout kullanarak DOM'un güncellenmesini bekle
    setTimeout(async () => {
      if (!qrCodeRef.current) {
        console.error("QR kod ref bulunamadı");
        return;
      }

      try {
        // QR kod container'ını temizle
        qrCodeRef.current.innerHTML = "QR kod oluşturuluyor...";
        console.log("QR kod container temizlendi");

        // QR kod oluştur
        console.log("QR kod oluşturuluyor...");
        const qrCodeDataURL = await QRCode.toDataURL(inviteLink, {
          width: 200,
          margin: 2,
          color: {
            dark: "#aa2d3a",
            light: "#ffffff",
          },
          errorCorrectionLevel: "H",
        });

        console.log(
          "QR kod DataURL oluşturuldu:",
          qrCodeDataURL.substring(0, 50) + "..."
        );

        // Container'ı tekrar temizle ve QR kodu ekle
        qrCodeRef.current.innerHTML = "";

        // QR kodu img elementi olarak ekle
        const img = document.createElement("img");
        img.src = qrCodeDataURL;
        img.className = "rounded-lg w-full h-auto";
        img.alt = "QR Kod";
        qrCodeRef.current.appendChild(img);

        console.log("QR kod DOM'a eklendi");
      } catch (error) {
        console.error("QR kod oluşturulamadı:", error);
        if (qrCodeRef.current) {
          qrCodeRef.current.innerHTML =
            "QR kod oluşturulamadı. Hata: " + error.message;
        }
      }
    }, 100); // 100ms gecikme ile DOM'un güncellenmesini bekle
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showMobileMenu) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMobileMenu]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#aa2d3a] mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#aa2d3a] via-red-600 to-pink-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo and Title */}
            <div className="flex items-center animate-fade-in">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg mr-3 hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md hidden sm:block">
                  İSTÜN Hatıra Defteri
                </h1>
                <h1 className="text-lg font-bold text-white drop-shadow-md sm:hidden">
                  İSTÜN
                </h1>
                <p className="text-xs sm:text-sm text-white/90 font-medium hidden sm:block">
                  Hoş geldin, {userProfile?.name}
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "dashboard"
                    ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                title="Hatıra Defteri"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                <span className="hidden lg:inline font-medium">
                  Hatıra Defteri
                </span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "settings"
                    ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                title="Profil Ayarları"
              >
                <Settings className="w-5 h-5 mr-2" />
                <span className="hidden lg:inline font-medium">Ayarlar</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-red-500/20 transition-all duration-300 transform hover:scale-105"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span className="hidden lg:inline font-medium">Çıkış</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMobileMenu(!showMobileMenu);
                }}
                className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {showMobileMenu && (
            <div
              className="md:hidden border-t border-white/30 py-4 animate-slide-down"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col space-y-2">
                {/* Hatıra Defteri */}
                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    setShowMobileMenu(false);
                  }}
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    activeTab === "dashboard"
                      ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  <span className="font-medium">Hatıra Defteri</span>
                </button>

                {/* Profile Settings */}
                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setShowMobileMenu(false);
                  }}
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    activeTab === "settings"
                      ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  <span className="font-medium">Profil Ayarları</span>
                </button>

                {/* Logout */}
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center px-3 py-3 text-white/80 hover:text-white hover:bg-red-500/20 transition-all duration-300 transform hover:scale-105 rounded-lg"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span className="font-medium">Çıkış Yap</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Dashboard İçeriği */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Sol Panel - Davet Linki */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-100 animate-fade-in">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-[#aa2d3a] to-pink-600 bg-clip-text text-transparent mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#aa2d3a] to-pink-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  Defterini Paylaş
                </h2>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Arkadaşlarının defterine yazı yazabilmesi için davet linkini
                  paylaş.
                </p>

                {!showInviteLink ? (
                  <button
                    onClick={generateInviteLink}
                    className="w-full bg-gradient-to-r from-[#aa2d3a] to-pink-600 text-white py-3 px-4 rounded-xl hover:scale-105 transition-all duration-300 flex items-center justify-center font-medium shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Davet Linki Oluştur
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200 shadow-inner">
                      <p className="text-xs text-blue-600 mb-2 font-medium">
                        Davet Linkin:
                      </p>
                      <p className="text-sm font-mono break-all text-gray-700 bg-white p-2 rounded-lg border">
                        {inviteLink}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={copyInviteLink}
                        className={`py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center font-medium shadow-md hover:shadow-lg transform hover:scale-105 ${
                          copied
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"
                        }`}
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">
                              Kopyalandı!
                            </span>
                            <span className="sm:hidden">✓</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Kopyala</span>
                            <span className="sm:hidden">Kopyala</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          console.log("QR kod butonuna tıklandı");
                          generateQRCode();
                        }}
                        className="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <QrCode className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">QR Kod</span>
                        <span className="sm:hidden">QR</span>
                      </button>
                    </div>

                    {/* QR Kod Gösterimi */}
                    {showQRCode && (
                      <div className="mt-4 p-4 bg-white rounded-xl border-2 border-dashed border-purple-300 text-center animate-fade-in">
                        <p className="text-xs text-purple-600 mb-3 font-medium">
                          QR Kodu Tarayarak Linke Git:
                        </p>
                        <div className="flex justify-center">
                          <div
                            ref={qrCodeRef}
                            className="bg-white p-2 rounded-lg shadow-inner"
                          ></div>
                        </div>
                        <button
                          onClick={() => setShowQRCode(false)}
                          className="mt-3 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          QR Kodu Gizle
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* İstatistikler */}
              <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-purple-100 animate-fade-in">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  İstatistikler
                </h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200 hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base text-gray-700 font-medium flex items-center">
                        <BookOpen className="w-4 h-4 mr-2 text-orange-600" />
                        Toplam Mesaj
                      </span>
                      <span className="font-bold text-2xl bg-gradient-to-r from-[#aa2d3a] to-red-600 bg-clip-text text-transparent">
                        {entries.length}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base text-gray-700 font-medium flex items-center">
                        <User className="w-4 h-4 mr-2 text-blue-600" />
                        Benzersiz Yazarlar
                      </span>
                      <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {
                          new Set(entries.map((entry) => entry.authorEmail))
                            .size
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Panel - Mesajlar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Geri Sayım Kartı */}
              {!isRevealTime ? (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl shadow-lg border border-purple-200 animate-fade-in">
                  <div className="p-4 sm:p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent mb-2">
                        Sürpriz Mesajlar Yakında Açılacak!
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-6">
                        4 Ağustos 2025, Saat 11:30'da tüm sürpriz mesajlar
                        açılacak
                      </p>

                      {/* Geri Sayım */}
                      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
                        <div className="bg-white rounded-lg p-2 sm:p-3 shadow-md border border-purple-100">
                          <div className="text-xl sm:text-2xl font-bold text-purple-600">
                            {countdown.days}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 font-medium">
                            Gün
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-2 sm:p-3 shadow-md border border-purple-100">
                          <div className="text-xl sm:text-2xl font-bold text-purple-600">
                            {countdown.hours}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 font-medium">
                            Saat
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-2 sm:p-3 shadow-md border border-purple-100">
                          <div className="text-xl sm:text-2xl font-bold text-purple-600">
                            {countdown.minutes}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 font-medium">
                            Dakika
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-2 sm:p-3 shadow-md border border-purple-100">
                          <div className="text-xl sm:text-2xl font-bold text-purple-600">
                            {countdown.seconds}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 font-medium">
                            Saniye
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-lg border border-green-200 animate-fade-in">
                  <div className="p-4 sm:p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Gift className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-2">
                        🎉 Geri Sayım Bitti! 🎉
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4">
                        Artık tüm sürpriz mesajlarını açabilirsin!
                      </p>
                      <div className="bg-white rounded-lg p-3 border border-green-200 shadow-sm">
                        <p className="text-sm text-green-700 font-medium">
                          Aşağıdaki "Sürprizi Aç!" butonlarına tıklayarak
                          mesajlarını keşfet
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-white to-pink-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100 animate-fade-in">
                <div className="p-4 sm:p-6 border-b border-pink-200/50">
                  <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-[#aa2d3a] to-pink-600 bg-clip-text text-transparent flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#aa2d3a] to-pink-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    Hatıra Defterim
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
                    Arkadaşlarının sana yazdığı özel mesajlar
                  </p>
                </div>

                <div className="divide-y">
                  {entries.length === 0 ? (
                    <div className="p-6 sm:p-8 text-center animate-fade-in">
                      <h3 className="text-lg font-medium bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-3">
                        Henüz mesaj yok
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        Davet linkini paylaşarak arkadaşlarının sana özel
                        mesajlar yazmasını sağla!
                      </p>
                    </div>
                  ) : (
                    entries.map((entry) => {
                      const isRevealed = revealedEntries.has(entry.id);
                      return (
                        <div key={entry.id} className="p-3 sm:p-6">
                          <div className="flex items-start space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#aa2d3a] rounded-full flex items-center justify-center flex-shrink-0">
                              {isRevealed ? (
                                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              ) : (
                                <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                                <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate pr-2">
                                  {isRevealed
                                    ? entry.authorName
                                    : "Sürpriz Mesaj"}
                                </h4>
                                <div className="flex items-center text-xs text-gray-500 flex-shrink-0">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  <span className="text-xs sm:text-xs">
                                    {entry.createdAt
                                      ?.toDate()
                                      .toLocaleDateString("tr-TR")}
                                  </span>
                                </div>
                              </div>

                              {!isRevealed ? (
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-dashed border-purple-200 rounded-lg p-3 sm:p-4 text-center">
                                  <div className="mb-3">
                                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mx-auto mb-2" />
                                    <p className="text-xs sm:text-sm text-gray-600 mb-1 leading-relaxed">
                                      <span className="font-medium">
                                        Birileri
                                      </span>{" "}
                                      sana özel bir sürpriz mesaj gönderdi!
                                    </p>
                                    <p className="text-xs text-gray-500 leading-relaxed px-2">
                                      Kimden geldiğini, mesajı ve
                                      arkadaşlığınızı temsil eden emojileri
                                      görmek için butona tıkla
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => revealSurprise(entry.id)}
                                    disabled={!isRevealTime}
                                    className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center mx-auto ${
                                      isRevealTime
                                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                  >
                                    {isRevealTime ? (
                                      <>
                                        <Gift className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        <span>Sürprizi Aç!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        <span>Yakında Açılacak</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-2 sm:space-y-3">
                                  {/* Gönderen Bilgisi */}
                                  <div className="p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                                    <p className="text-xs sm:text-sm text-blue-800">
                                      <span className="font-bold text-sm sm:text-lg">
                                        🎉 Sürpriz! 🎉
                                      </span>
                                    </p>
                                    <p className="text-xs sm:text-sm text-blue-700 mt-1 leading-relaxed">
                                      Bu mesaj{" "}
                                      <span className="font-semibold">
                                        {entry.authorName}
                                      </span>{" "}
                                      tarafından gönderildi!
                                    </p>
                                  </div>

                                  {/* Emojiler */}
                                  {entry.emojis && entry.emojis.length > 0 && (
                                    <div className="p-2 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                        <span className="text-xs sm:text-sm font-medium text-yellow-800 text-center sm:text-left">
                                          Arkadaşlık Emojileri:
                                        </span>
                                        <div className="flex justify-center sm:justify-start space-x-1 flex-wrap">
                                          {entry.emojis.map((emoji, index) => (
                                            <span
                                              key={index}
                                              className="text-lg sm:text-xl animate-bounce inline-block"
                                              style={{
                                                animationDelay: `${
                                                  index * 0.1
                                                }s`,
                                              }}
                                            >
                                              {emoji}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Mesaj İçeriği */}
                                  <div className="prose prose-sm sm:prose max-w-none text-sm sm:text-base">
                                    <ReactMarkdown>
                                      {entry.content}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profil Ayarları İçeriği */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <ProfileSettings
                userProfile={userProfile}
                onUpdate={handleProfileUpdate}
                isEmbedded={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
