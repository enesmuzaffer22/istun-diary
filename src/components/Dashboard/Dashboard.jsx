import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
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
  Calendar,
  Settings,
  Menu,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import ProfileSettings from "./ProfileSettings";

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
      where("recipientId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const entriesData = [];
        querySnapshot.forEach((doc) => {
          entriesData.push({ id: doc.id, ...doc.data() });
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-[#aa2d3a] mr-3" />
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                İSTÜN Hatıra Defteri
              </h1>
              <h1 className="text-lg font-bold text-gray-900 sm:hidden">
                İSTÜN
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hoş geldin, {userProfile?.name}
              </span>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center transition-colors ${
                  activeTab === "dashboard"
                    ? "text-[#aa2d3a]"
                    : "text-gray-600 hover:text-[#aa2d3a]"
                }`}
                title="Hatıra Defteri"
              >
                <BookOpen className="w-5 h-5 mr-1" />
                <span className="hidden lg:inline">Hatıra Defteri</span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center transition-colors ${
                  activeTab === "settings"
                    ? "text-[#aa2d3a]"
                    : "text-gray-600 hover:text-[#aa2d3a]"
                }`}
                title="Profil Ayarları"
              >
                <Settings className="w-5 h-5 mr-1" />
                <span className="hidden lg:inline">Ayarlar</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-[#aa2d3a] transition-colors"
              >
                <LogOut className="w-5 h-5 mr-1" />
                <span className="hidden lg:inline">Çıkış</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMobileMenu(!showMobileMenu);
                }}
                className="text-gray-600 hover:text-[#aa2d3a] transition-colors"
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
              className="md:hidden border-t border-gray-200 py-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col space-y-3">
                {/* User Greeting */}
                <div className="px-2 py-2 text-sm text-gray-600 border-b border-gray-100">
                  Hoş geldin,{" "}
                  <span className="font-medium">{userProfile?.name}</span>
                </div>

                {/* Hatıra Defteri */}
                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    setShowMobileMenu(false);
                  }}
                  className={`flex items-center px-2 py-2 hover:bg-gray-50 transition-colors rounded-lg ${
                    activeTab === "dashboard"
                      ? "text-[#aa2d3a]"
                      : "text-gray-600 hover:text-[#aa2d3a]"
                  }`}
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  Hatıra Defteri
                </button>

                {/* Profile Settings */}
                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setShowMobileMenu(false);
                  }}
                  className={`flex items-center px-2 py-2 hover:bg-gray-50 transition-colors rounded-lg ${
                    activeTab === "settings"
                      ? "text-[#aa2d3a]"
                      : "text-gray-600 hover:text-[#aa2d3a]"
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Profil Ayarları
                </button>

                {/* Logout */}
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center px-2 py-2 text-gray-600 hover:text-[#aa2d3a] hover:bg-gray-50 transition-colors rounded-lg"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Çıkış Yap
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
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Share2 className="w-5 h-5 mr-2 text-[#aa2d3a]" />
                  Defterini Paylaş
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Arkadaşlarının defterine yazı yazabilmesi için davet linkini
                  paylaş.
                </p>

                {!showInviteLink ? (
                  <button
                    onClick={generateInviteLink}
                    className="w-full bg-[#aa2d3a] text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Davet Linki Oluştur
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <p className="text-xs text-gray-500 mb-1">
                        Davet Linkin:
                      </p>
                      <p className="text-sm font-mono break-all">
                        {inviteLink}
                      </p>
                    </div>
                    <button
                      onClick={copyInviteLink}
                      className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          Kopyalandı!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Linki Kopyala
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* İstatistikler */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  İstatistikler
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-gray-600">
                      Toplam Mesaj
                    </span>
                    <span className="font-semibold text-[#aa2d3a] text-lg">
                      {entries.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-gray-600">
                      Benzersiz Yazarlar
                    </span>
                    <span className="font-semibold text-[#aa2d3a] text-lg">
                      {new Set(entries.map((entry) => entry.authorEmail)).size}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Panel - Mesajlar */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 sm:p-6 border-b">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Hatıra Defterim
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Arkadaşlarının sana yazdığı mesajlar
                  </p>
                </div>

                <div className="divide-y">
                  {entries.length === 0 ? (
                    <div className="p-6 sm:p-8 text-center">
                      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Henüz mesaj yok
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Davet linkini paylaşarak arkadaşlarının sana mesaj
                        yazmasını sağla!
                      </p>
                    </div>
                  ) : (
                    entries.map((entry) => (
                      <div key={entry.id} className="p-4 sm:p-6">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-[#aa2d3a] rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-gray-900">
                                {entry.authorName}
                              </h4>
                              <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {entry.createdAt
                                  ?.toDate()
                                  .toLocaleDateString("tr-TR")}
                              </div>
                            </div>
                            <div className="prose prose-sm max-w-none">
                              <ReactMarkdown>{entry.content}</ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
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
