import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useForm } from "react-hook-form";
import {
  BookOpen,
  Send,
  ArrowLeft,
  User,
  AlertCircle,
  CheckCircle,
  Eye,
  Heart,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function WriteEntry() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();
  const watchedContent = watch("content", "");

  useEffect(() => {
    const findRecipient = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("inviteCode", "==", inviteCode)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setRecipient({ id: querySnapshot.docs[0].id, ...userData });
        } else {
          setError("Geçersiz davet linki. Bu link artık geçerli değil.");
        }
      } catch (err) {
        setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        console.error("Error finding recipient:", err);
      }
      setLoading(false);
    };

    if (inviteCode) {
      findRecipient();
    }
  }, [inviteCode]);

  // Emoji seçimi için sabit emoji listesi
  const availableEmojis = [
    "😊",
    "😄",
    "🥰",
    "😍",
    "🤗",
    "😎",
    "🤝",
    "💫",
    "⭐",
    "✨",
    "🎉",
    "🎊",
    "🎈",
    "🎁",
    "🌟",
    "💖",
    "💕",
    "❤️",
    "💙",
    "💜",
    "🌈",
    "🦋",
    "🌸",
    "🌺",
    "🌻",
    "🎯",
    "🏆",
    "👑",
    "🎭",
    "🎨",
    "📚",
    "✏️",
    "🎓",
    "🚀",
    "💎",
    "🔥",
    "💯",
    "👏",
    "🙌",
    "✌️",
  ];

  const handleEmojiSelect = (emoji) => {
    if (selectedEmojis.includes(emoji)) {
      setSelectedEmojis(selectedEmojis.filter((e) => e !== emoji));
    } else if (selectedEmojis.length < 3) {
      setSelectedEmojis([...selectedEmojis, emoji]);
    }
  };

  const onSubmit = async (data) => {
    if (!currentUser || !recipient) return;

    // 3 emoji seçimi kontrolü
    if (selectedEmojis.length !== 3) {
      setError("Lütfen arkadaşlığınızı temsil eden tam 3 emoji seçin.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await addDoc(collection(db, "entries"), {
        content: data.content,
        authorId: currentUser.uid,
        authorEmail: currentUser.email,
        authorName:
          data.authorName ||
          currentUser.displayName ||
          currentUser.email.split("@")[0],
        recipientId: recipient.id,
        recipientEmail: recipient.email,
        emojis: selectedEmojis, // Emoji'leri kaydet
        isRevealed: false, // Sürpriz için başlangıçta gizli
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      reset();
      setSelectedEmojis([]);

      // 3 saniye sonra ana sayfaya yönlendir
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError("Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
      console.error("Error submitting entry:", err);
    }
    setSubmitting(false);
  };

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

  if (error && !recipient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Hata</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#aa2d3a] text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Mesaj Gönderildi!
          </h2>
          <p className="text-gray-600 mb-6">
            Mesajın başarıyla {recipient?.name}'in defterine eklendi.
          </p>
          <p className="text-sm text-gray-500">
            3 saniye içinde ana sayfaya yönlendirileceksin...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="mr-4 p-2 text-gray-600 hover:text-[#aa2d3a] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <BookOpen className="w-8 h-8 text-[#aa2d3a] mr-3" />
              <h1 className="text-xl font-bold text-gray-900">
                İSTÜN Hatıra Defteri
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Recipient Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-[#aa2d3a] rounded-full flex items-center justify-center mr-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {recipient?.name}'in Hatıra Defteri
              </h2>
              <p className="text-gray-600 text-sm">
                Bu kişiye özel bir mesaj yazıyorsun
              </p>
            </div>
          </div>
        </div>

        {/* Write Form */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Mesajını Yaz
              </h3>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center text-sm text-gray-600 hover:text-[#aa2d3a] transition-colors"
              >
                <Eye className="w-4 h-4 mr-1" />
                {previewMode ? "Düzenle" : "Önizle"}
              </button>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              Markdown formatını kullanabilirsin (kalın yazı için **metin**,
              italik için *metin*)
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adın (İsteğe bağlı)
              </label>
              <input
                type="text"
                {...register("authorName")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aa2d3a] focus:border-transparent"
                placeholder="Mesajında görünecek ismin"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mesajın *
              </label>
              {previewMode ? (
                <div className="min-h-[200px] p-4 border border-gray-300 rounded-lg bg-gray-50">
                  {watchedContent ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{watchedContent}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      Önizleme için mesaj yazın...
                    </p>
                  )}
                </div>
              ) : (
                <textarea
                  {...register("content", {
                    required: "Mesaj içeriği gerekli",
                    minLength: {
                      value: 10,
                      message: "Mesaj en az 10 karakter olmalı",
                    },
                  })}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aa2d3a] focus:border-transparent resize-none"
                  placeholder="Hatıra defterine yazacağın mesajı buraya yaz...

Örnek markdown kullanımı:
**Kalın yazı**
*İtalik yazı*
- Liste öğesi
> Alıntı"
                />
              )}
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

            {/* Emoji Seçici */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arkadaşlığınızı Temsil Eden 3 Emoji Seçin *
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Seçtiğiniz emojiler arkadaşınıza sürpriz olarak gösterilecek!
              </p>

              {/* Seçilen Emojiler */}
              <div className="mb-3 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-xs text-gray-600 mb-2">
                  Seçilen Emojiler ({selectedEmojis.length}/3):
                </p>
                <div className="flex space-x-2">
                  {selectedEmojis.length === 0 ? (
                    <span className="text-gray-400 text-sm">
                      Henüz emoji seçilmedi
                    </span>
                  ) : (
                    selectedEmojis.map((emoji, index) => (
                      <span key={index} className="text-2xl">
                        {emoji}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Emoji Grid - Mobile Responsive */}
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1 sm:gap-2 p-2 sm:p-3 border border-gray-300 rounded-lg max-h-32 sm:max-h-40 overflow-y-auto">
                {availableEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleEmojiSelect(emoji)}
                    className={`text-lg sm:text-xl md:text-2xl p-1 sm:p-2 rounded-lg transition-all hover:bg-gray-100 ${
                      selectedEmojis.includes(emoji)
                        ? "bg-[#aa2d3a] bg-opacity-10 ring-1 sm:ring-2 ring-[#aa2d3a]"
                        : "hover:scale-110"
                    } ${
                      selectedEmojis.length >= 3 &&
                      !selectedEmojis.includes(emoji)
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    disabled={
                      selectedEmojis.length >= 3 &&
                      !selectedEmojis.includes(emoji)
                    }
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {selectedEmojis.length !== 3 && (
                <p className="text-red-500 text-sm mt-2">
                  {selectedEmojis.length === 0
                    ? "Lütfen 3 emoji seçin"
                    : `${3 - selectedEmojis.length} emoji daha seçmelisiniz`}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#aa2d3a] text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Mesajı Gönder
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
