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

  // Emoji seçimi için kapsamlı emoji listesi
  const availableEmojis = [
    // Yüz ifadeleri ve duygular
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "🤣",
    "😂",
    "🙂",
    "🙃",
    "😉",
    "😊",
    "😇",
    "🥰",
    "😍",
    "🤩",
    "😘",
    "😗",
    "☺️",
    "😚",
    "😙",
    "🥲",
    "😋",
    "😛",
    "😜",
    "🤪",
    "😝",
    "🤑",
    "🤗",
    "🤭",
    "🤫",
    "🤔",
    "🤐",
    "🤨",
    "😐",
    "😑",
    "😶",
    "😏",
    "😒",
    "🙄",
    "😬",
    "🤥",
    "😌",
    "😔",
    "😪",
    "🤤",
    "😴",
    "😷",
    "🤒",
    "🤕",
    "🤢",
    "🤮",
    "🤧",
    "🥵",
    "🥶",
    "🥴",
    "😵",
    "🤯",
    "🤠",
    "🥳",
    "🥸",
    "😎",
    "🤓",
    "🧐",
    "😕",
    "😟",
    "🙁",
    "☹️",
    "😮",
    "😯",
    "😲",
    "😳",
    "🥺",
    "😦",
    "😧",
    "😨",
    "😰",
    "😥",
    "😢",
    "😭",
    "😱",
    "😖",
    "😣",
    "😞",
    "😓",
    "😩",
    "😫",
    "🥱",
    "😤",
    "😡",
    "😠",
    "🤬",
    "😈",
    "👿",
    "💀",
    "☠️",
    "💩",
    "🤡",
    "👹",
    "👺",
    "👻",
    "👽",
    "👾",
    "🤖",
    "😺",
    "😸",
    "😹",
    "😻",
    "😼",
    "😽",
    "🙀",
    "😿",
    "😾",

    // El işaretleri
    "👋",
    "🤚",
    "🖐️",
    "✋",
    "🖖",
    "👌",
    "🤌",
    "🤏",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👈",
    "👉",
    "👆",
    "🖕",
    "👇",
    "☝️",
    "👍",
    "👎",
    "👊",
    "✊",
    "🤛",
    "🤜",
    "👏",
    "🙌",
    "👐",
    "🤲",
    "🤝",
    "🙏",
    "✍️",
    "💅",
    "🤳",
    "💪",
    "🦾",
    "🦿",
    "🦵",
    "🦶",
    "👂",
    "🦻",
    "👃",
    "🧠",
    "🫀",
    "🫁",
    "🦷",
    "🦴",
    "👀",
    "👁️",
    "👅",
    "👄",
    "💋",
    "🩸",

    // İnsanlar ve aktiviteler
    "👶",
    "🧒",
    "👦",
    "👧",
    "🧑",
    "👱",
    "👨",
    "🧔",
    "👩",
    "🧓",
    "👴",
    "👵",
    "🙍",
    "🙎",
    "🙅",
    "🙆",
    "💁",
    "🙋",
    "🧏",
    "🙇",
    "🤦",
    "🤷",
    "👮",
    "🕵️",
    "💂",
    "🥷",
    "👷",
    "🤴",
    "👸",
    "👳",
    "👲",
    "🧕",
    "🤵",
    "👰",
    "🤰",
    "🤱",
    "👼",
    "🎅",
    "🤶",
    "🦸",
    "🦹",
    "🧙",
    "🧚",
    "🧛",
    "🧜",
    "🧝",
    "🧞",
    "🧟",
    "💆",
    "💇",
    "🚶",
    "🧍",
    "🏃",
    "💃",
    "🕺",
    "🕴️",
    "👯",
    "🧖",
    "🧗",
    "🤺",
    "🏇",
    "⛷️",
    "🏂",
    "🏌️",
    "🏄",
    "🚣",
    "🏊",
    "⛹️",
    "🏋️",
    "🚴",
    "🚵",
    "🤸",
    "🤼",
    "🤽",
    "🤾",
    "🤹",
    "🧘",
    "🛀",
    "🛌",

    // Kalpler ve aşk
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🤎",
    "🖤",
    "🤍",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "♥️",
    "💒",
    "💍",
    "💎",
    "🌹",
    "🌷",
    "🌺",
    "🌸",
    "🌼",
    "🌻",
    "💐",

    // Doğa ve hayvanlar
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐽",
    "🐸",
    "🐵",
    "🙈",
    "🙉",
    "🙊",
    "🐒",
    "🐔",
    "🐧",
    "🐦",
    "🐤",
    "🐣",
    "🐥",
    "🦆",
    "🦅",
    "🦉",
    "🦇",
    "🐺",
    "🐗",
    "🐴",
    "🦄",
    "🐝",
    "🐛",
    "🦋",
    "🐌",
    "🐞",
    "🐜",
    "🦟",
    "🦗",
    "🕷️",
    "🕸️",
    "🦂",
    "🐢",
    "🐍",
    "🦎",
    "🦖",
    "🦕",
    "🐙",
    "🦑",
    "🦐",
    "🦞",
    "🦀",
    "🐡",
    "🐠",
    "🐟",
    "🐬",
    "🐳",
    "🐋",
    "🦈",
    "🐊",
    "🐅",
    "🐆",
    "🦓",
    "🦍",
    "🦧",
    "🐘",
    "🦛",
    "🦏",
    "🐪",
    "🐫",
    "🦒",
    "🦘",
    "🐃",
    "🐂",
    "🐄",
    "🐎",
    "🐖",
    "🐏",
    "🐑",
    "🦙",
    "🐐",
    "🦌",
    "🐕",
    "🐩",
    "🦮",
    "🐕‍🦺",
    "🐈",
    "🐓",
    "🦃",
    "🦚",
    "🦜",
    "🦢",
    "🦩",
    "🕊️",
    "🐇",
    "🦝",
    "🦨",
    "🦡",
    "🦦",
    "🦥",
    "🐁",
    "🐀",
    "🐿️",
    "🦔",

    // Yiyecek ve içecek
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🫐",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
    "🍆",
    "🥑",
    "🥦",
    "🥬",
    "🥒",
    "🌶️",
    "🫑",
    "🌽",
    "🥕",
    "🧄",
    "🧅",
    "🥔",
    "🍠",
    "🥐",
    "🥖",
    "🍞",
    "🥨",
    "🥯",
    "🧀",
    "🥚",
    "🍳",
    "🧈",
    "🥞",
    "🧇",
    "🥓",
    "🥩",
    "🍗",
    "🍖",
    "🦴",
    "🌭",
    "🍔",
    "🍟",
    "🍕",
    "🥪",
    "🥙",
    "🧆",
    "🌮",
    "🌯",
    "🫔",
    "🥗",
    "🥘",
    "🫕",
    "🥫",
    "🍝",
    "🍜",
    "🍲",
    "🍛",
    "🍣",
    "🍱",
    "🥟",
    "🦪",
    "🍤",
    "🍙",
    "🍚",
    "🍘",
    "🍥",
    "🥠",
    "🥮",
    "🍢",
    "🍡",
    "🍧",
    "🍨",
    "🍦",
    "🥧",
    "🧁",
    "🍰",
    "🎂",
    "🍮",
    "🍭",
    "🍬",
    "🍫",
    "🍿",
    "🍩",
    "🍪",
    "🌰",
    "🥜",
    "🍯",
    "🥛",
    "🍼",
    "☕",
    "🫖",
    "🍵",
    "🧃",
    "🥤",
    "🧋",
    "🍶",
    "🍺",
    "🍻",
    "🥂",
    "🍷",
    "🥃",
    "🍸",
    "🍹",
    "🧉",
    "🍾",

    // Aktiviteler ve spor
    "⚽",
    "🏀",
    "🏈",
    "⚾",
    "🥎",
    "🎾",
    "🏐",
    "🏉",
    "🥏",
    "🎱",
    "🪀",
    "🏓",
    "🏸",
    "🏒",
    "🏑",
    "🥍",
    "🏏",
    "🪃",
    "🥅",
    "⛳",
    "🪁",
    "🏹",
    "🎣",
    "🤿",
    "🥊",
    "🥋",
    "🎽",
    "🛹",
    "🛷",
    "⛸️",
    "🥌",
    "🎿",
    "⛷️",
    "🏂",
    "🪂",
    "🏋️‍♀️",
    "🏋️",
    "🏋️‍♂️",
    "🤼‍♀️",
    "🤼",
    "🤼‍♂️",
    "🤸‍♀️",
    "🤸",
    "🤸‍♂️",
    "⛹️‍♀️",
    "⛹️",
    "⛹️‍♂️",
    "🤺",
    "🤾‍♀️",
    "🤾",
    "🤾‍♂️",
    "🏌️‍♀️",
    "🏌️",
    "🏌️‍♂️",
    "🏇",
    "🧘‍♀️",
    "🧘",
    "🧘‍♂️",
    "🏄‍♀️",
    "🏄",
    "🏄‍♂️",
    "🏊‍♀️",
    "🏊",
    "🏊‍♂️",
    "🤽‍♀️",
    "🤽",
    "🤽‍♂️",
    "🚣‍♀️",
    "🚣",
    "🚣‍♂️",
    "🧗‍♀️",
    "🧗",
    "🧗‍♂️",
    "🚵‍♀️",
    "🚵",
    "🚵‍♂️",
    "🚴‍♀️",
    "🚴",
    "🚴‍♂️",

    // Nesneler ve semboller
    "🎨",
    "🖌️",
    "🖍️",
    "📝",
    "✏️",
    "🖊️",
    "🖋️",
    "✒️",
    "🖇️",
    "📎",
    "📐",
    "📏",
    "📌",
    "📍",
    "🧮",
    "🔗",
    "⛓️",
    "🧲",
    "🔬",
    "🔭",
    "📡",
    "💉",
    "🩹",
    "🩺",
    "🏺",
    "🗿",
    "🪨",
    "🪵",
    "🛎️",
    "🔔",
    "🔕",
    "🎵",
    "🎶",
    "🎼",
    "🎹",
    "🥁",
    "🎷",
    "🎺",
    "🎸",
    "🪕",
    "🎻",
    "🎤",
    "🎧",
    "📻",
    "🎬",
    "🎭",
    "🎪",
    "🎨",
    "🎯",
    "🎳",
    "🎮",
    "🎰",
    "🧩",
    "🃏",
    "🀄",
    "🎴",
    "🎲",
    "♠️",
    "♥️",
    "♦️",
    "♣️",
    "♟️",
    "🏆",
    "🥇",
    "🥈",
    "🥉",
    "🏅",
    "🎖️",
    "🏵️",
    "🎗️",
    "🎫",
    "🎟️",
    "🎪",
    "🤹",
    "🤹‍♀️",
    "🤹‍♂️",
    "🎨",
    "🎭",
    "🩰",
    "🎪",

    // Doğa ve hava
    "🌍",
    "🌎",
    "🌏",
    "🌐",
    "🗺️",
    "🗾",
    "🧭",
    "🏔️",
    "⛰️",
    "🌋",
    "🗻",
    "🏕️",
    "🏖️",
    "🏜️",
    "🏝️",
    "🏞️",
    "🏟️",
    "🏛️",
    "🏗️",
    "🧱",
    "🪨",
    "🪵",
    "🛖",
    "🏘️",
    "🏚️",
    "🏠",
    "🏡",
    "🏢",
    "🏣",
    "🏤",
    "🏥",
    "🏦",
    "🏨",
    "🏩",
    "🏪",
    "🏫",
    "🏬",
    "🏭",
    "🏯",
    "🏰",
    "💒",
    "🗼",
    "🗽",
    "⛪",
    "🕌",
    "🛕",
    "🕍",
    "⛩️",
    "🕋",
    "⛲",
    "⛺",
    "🌁",
    "🌃",
    "🏙️",
    "🌄",
    "🌅",
    "🌆",
    "🌇",
    "🌉",
    "♨️",
    "🎠",
    "🎡",
    "🎢",
    "💈",
    "🎪",
    "🚂",
    "🚃",
    "🚄",
    "🚅",
    "🚆",
    "🚇",
    "🚈",
    "🚉",
    "🚊",
    "🚝",
    "🚞",
    "🚋",
    "🚌",
    "🚍",
    "🚎",
    "🚐",
    "🚑",
    "🚒",
    "🚓",
    "🚔",
    "🚕",
    "🚖",
    "🚗",
    "🚘",
    "🚙",
    "🛻",
    "🚚",
    "🚛",
    "🚜",
    "🏎️",
    "🏍️",
    "🛵",
    "🦽",
    "🦼",
    "🛺",
    "🚲",
    "🛴",
    "🛹",
    "🛼",
    "🚁",
    "🛸",
    "✈️",
    "🛩️",
    "🛫",
    "🛬",
    "🪂",
    "💺",
    "🚀",
    "🛰️",
    "🚢",
    "⛵",
    "🚤",
    "🛥️",
    "🛳️",
    "⛴️",
    "🚧",
    "⚓",
    "⛽",
    "🚨",
    "🚥",
    "🚦",
    "🛑",
    "🚏",
    "🗺️",
    "⛱️",
    "🗿",
    "🗽",
    "🗼",
    "🏰",
    "🎡",
    "🎢",
    "🎠",

    // Semboller ve işaretler
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "☮️",
    "✝️",
    "☪️",
    "🕉️",
    "☸️",
    "✡️",
    "🔯",
    "🕎",
    "☯️",
    "☦️",
    "🛐",
    "⛎",
    "♈",
    "♉",
    "♊",
    "♋",
    "♌",
    "♍",
    "♎",
    "♏",
    "♐",
    "♑",
    "♒",
    "♓",
    "🆔",
    "⚛️",
    "🉑",
    "☢️",
    "☣️",
    "📴",
    "📳",
    "🈶",
    "🈚",
    "🈸",
    "🈺",
    "🈷️",
    "✴️",
    "🆚",
    "💮",
    "🉐",
    "㊙️",
    "㊗️",
    "🈴",
    "🈵",
    "🈹",
    "🈲",
    "🅰️",
    "🅱️",
    "🆎",
    "🆑",
    "🅾️",
    "🆘",
    "❌",
    "⭕",
    "🛑",
    "⛔",
    "📛",
    "🚫",
    "💯",
    "💢",
    "♨️",
    "🚷",
    "🚯",
    "🚳",
    "🚱",
    "🔞",
    "📵",
    "🚭",
    "❗",
    "❕",
    "❓",
    "❔",
    "‼️",
    "⁉️",
    "🔅",
    "🔆",
    "〽️",
    "⚠️",
    "🚸",
    "🔱",
    "⚜️",
    "🔰",
    "♻️",
    "✅",
    "🈯",
    "💹",
    "❇️",
    "✳️",
    "❎",
    "🌐",
    "💠",
    "Ⓜ️",
    "🌀",
    "💤",
    "🏧",
    "🚾",
    "♿",
    "🅿️",
    "🈳",
    "🈂️",
    "🛂",
    "🛃",
    "🛄",
    "🛅",
    "🚹",
    "🚺",
    "🚼",
    "🚻",
    "🚮",
    "🎦",
    "📶",
    "🈁",
    "🔣",
    "ℹ️",
    "🔤",
    "🔡",
    "🔠",
    "🆖",
    "🆗",
    "🆙",
    "🆒",
    "🆕",
    "🆓",
    "0️⃣",
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
    "🔟",
    "🔢",
    "#️⃣",
    "*️⃣",
    "⏏️",
    "▶️",
    "⏸️",
    "⏯️",
    "⏹️",
    "⏺️",
    "⏭️",
    "⏮️",
    "⏩",
    "⏪",
    "⏫",
    "⏬",
    "◀️",
    "🔼",
    "🔽",
    "➡️",
    "⬅️",
    "⬆️",
    "⬇️",
    "↗️",
    "↘️",
    "↙️",
    "↖️",
    "↕️",
    "↔️",
    "↪️",
    "↩️",
    "⤴️",
    "⤵️",
    "🔀",
    "🔁",
    "🔂",
    "🔄",
    "🔃",
    "🎵",
    "🎶",
    "➕",
    "➖",
    "➗",
    "✖️",
    "♾️",
    "💲",
    "💱",
    "™️",
    "©️",
    "®️",
    "〰️",
    "➰",
    "➿",
    "🔚",
    "🔙",
    "🔛",
    "🔝",
    "🔜",
    "✔️",
    "☑️",
    "🔘",
    "🔴",
    "🟠",
    "🟡",
    "🟢",
    "🔵",
    "🟣",
    "⚫",
    "⚪",
    "🟤",
    "🔺",
    "🔻",
    "🔸",
    "🔹",
    "🔶",
    "🔷",
    "🔳",
    "🔲",
    "▪️",
    "▫️",
    "◾",
    "◽",
    "◼️",
    "◻️",
    "🟥",
    "🟧",
    "🟨",
    "🟩",
    "🟦",
    "🟪",
    "⬛",
    "⬜",
    "🟫",
    "🔈",
    "🔇",
    "🔉",
    "🔊",
    "🔔",
    "🔕",
    "📣",
    "📢",
    "👁️‍🗨️",
    "💬",
    "💭",
    "🗯️",
    "♠️",
    "♣️",
    "♥️",
    "♦️",
    "🃏",
    "🎴",
    "🀄",
    "🕐",
    "🕑",
    "🕒",
    "🕓",
    "🕔",
    "🕕",
    "🕖",
    "🕗",
    "🕘",
    "🕙",
    "🕚",
    "🕛",
    "🕜",
    "🕝",
    "🕞",
    "🕟",
    "🕠",
    "🕡",
    "🕢",
    "🕣",
    "🕤",
    "🕥",
    "🕦",
    "🕧",

    // Özel emojiler
    "⭐",
    "🌟",
    "✨",
    "🎇",
    "🎆",
    "🌠",
    "🌌",
    "🌙",
    "🌛",
    "🌜",
    "🌚",
    "🌝",
    "🌞",
    "🪐",
    "💫",
    "⚡",
    "☄️",
    "💥",
    "🔥",
    "🌪️",
    "🌈",
    "☀️",
    "🌤️",
    "⛅",
    "🌦️",
    "🌧️",
    "⛈️",
    "🌩️",
    "🌨️",
    "❄️",
    "☃️",
    "⛄",
    "🌬️",
    "💨",
    "💧",
    "💦",
    "☔",
    "☂️",
    "🌊",
    "🌫️",
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-r from-[#aa2d3a] to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error && !recipient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-white to-red-50 rounded-xl shadow-xl p-8 max-w-md w-full text-center border border-red-100 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Hata
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-[#aa2d3a] to-pink-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-xl p-8 max-w-md w-full text-center border border-green-100 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
            Mesaj Gönderildi!
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Mesajın başarıyla{" "}
            <span className="font-semibold text-green-600">
              {recipient?.name}
            </span>
            'in defterine eklendi.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200 mb-4">
            <p className="text-sm text-blue-600 font-medium">
              3 saniye içinde ana sayfaya yönlendirileceksin...
            </p>
          </div>
          <div className="flex justify-center">
            <CheckCircle className="w-12 h-12 text-green-500 animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#aa2d3a] via-red-600 to-pink-600 shadow-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center animate-fade-in">
              <button
                onClick={() => navigate("/")}
                className="mr-4 p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg mr-3 animate-pulse">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
                  İSTÜN Hatıra Defteri
                </h1>
                <p className="text-xs sm:text-sm text-white/90 font-medium">
                  Mesaj Yazma
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Recipient Info */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-6 border border-blue-100 animate-fade-in">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-[#aa2d3a] to-pink-600 rounded-full flex items-center justify-center mr-4 shadow-lg animate-pulse">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold bg-gradient-to-r from-[#aa2d3a] to-pink-600 bg-clip-text text-transparent">
                {recipient?.name}'in Hatıra Defteri
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Bu kişiye özel bir mesaj yazıyorsun
              </p>
            </div>
          </div>
        </div>

        {/* Write Form */}
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100 animate-fade-in">
          <div className="p-6 border-b border-purple-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                  <Send className="w-4 h-4 text-white" />
                </div>
                Mesajını Yaz
              </h3>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center text-sm px-3 py-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:from-blue-200 hover:to-purple-200 transition-all duration-300 transform hover:scale-105 border border-blue-200"
              >
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? "Düzenle" : "Önizle"}
              </button>
            </div>
            <p className="text-gray-600 text-sm mt-3 leading-relaxed bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg border border-gray-200">
              <strong>İpucu:</strong> Markdown formatını kullanabilirsin (kalın
              yazı için **metin**, italik için *metin*)
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
              <div className="mb-3 p-2 sm:p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-xs text-gray-600 mb-2 text-center sm:text-left">
                  Seçilen Emojiler ({selectedEmojis.length}/3):
                </p>
                <div className="flex justify-center sm:justify-start space-x-2 flex-wrap">
                  {selectedEmojis.length === 0 ? (
                    <span className="text-gray-400 text-sm text-center">
                      Henüz emoji seçilmedi
                    </span>
                  ) : (
                    selectedEmojis.map((emoji, index) => (
                      <span key={index} className="text-xl sm:text-2xl">
                        {emoji}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Emoji Grid with Categories */}
              <div className="border border-gray-300 rounded-lg max-h-60 sm:max-h-72 overflow-y-auto">
                <div className="p-2 sm:p-3">
                  {/* Yüz İfadeleri ve Duygular */}
                  <div id="category-yuz-ifadeleri" className="mb-4">
                    <h4 className="text-sm font-semibold text-[#aa2d3a] mb-2 px-1 border-b border-[#aa2d3a] pb-1">
                      😊 Yüz İfadeleri ve Duygular
                    </h4>
                    <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-1 sm:gap-2">
                      {availableEmojis.slice(0, 93).map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className={`text-lg sm:text-2xl p-1 sm:p-2 rounded-lg transition-all hover:bg-gray-100 ${
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
                  </div>

                  {/* El İşaretleri */}
                  <div id="category-el-isaretleri" className="mb-4">
                    <h4 className="text-sm font-semibold text-[#aa2d3a] mb-2 px-1 border-b border-[#aa2d3a] pb-1">
                      👋 El İşaretleri
                    </h4>
                    <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-1 sm:gap-2">
                      {availableEmojis.slice(93, 116).map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className={`text-lg sm:text-2xl p-1 sm:p-2 rounded-lg transition-all hover:bg-gray-100 ${
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
                  </div>

                  {/* İnsanlar ve Aktiviteler */}
                  <div id="category-insanlar" className="mb-4">
                    <h4 className="text-sm font-semibold text-[#aa2d3a] mb-2 px-1 border-b border-[#aa2d3a] pb-1">
                      👨‍👩‍👧‍👦 İnsanlar ve Aktiviteler
                    </h4>
                    <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-1 sm:gap-2">
                      {availableEmojis.slice(116, 155).map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className={`text-lg sm:text-2xl p-1 sm:p-2 rounded-lg transition-all hover:bg-gray-100 ${
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
                  </div>

                  {/* Kalpler ve Aşk */}
                  <div id="category-kalpler" className="mb-4">
                    <h4 className="text-sm font-semibold text-[#aa2d3a] mb-2 px-1 border-b border-[#aa2d3a] pb-1">
                      ❤️ Kalpler ve Aşk
                    </h4>
                    <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-1 sm:gap-2">
                      {availableEmojis.slice(155, 185).map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className={`text-lg sm:text-2xl p-1 sm:p-2 rounded-lg transition-all hover:bg-gray-100 ${
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
                  </div>

                  {/* Doğa ve Hayvanlar */}
                  <div id="category-hayvanlar" className="mb-4">
                    <h4 className="text-sm font-semibold text-[#aa2d3a] mb-2 px-1 border-b border-[#aa2d3a] pb-1">
                      🐶 Doğa ve Hayvanlar
                    </h4>
                    <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-1 sm:gap-2">
                      {availableEmojis.slice(185, 252).map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className={`text-lg sm:text-2xl p-1 sm:p-2 rounded-lg transition-all hover:bg-gray-100 ${
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
                  </div>

                  {/* Yiyecek ve İçecek */}
                  <div id="category-yiyecek" className="mb-4">
                    <h4 className="text-sm font-semibold text-[#aa2d3a] mb-2 px-1 border-b border-[#aa2d3a] pb-1">
                      🍔 Yiyecek ve İçecek
                    </h4>
                    <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-1 sm:gap-2">
                      {availableEmojis.slice(252, 332).map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className={`text-lg sm:text-2xl p-1 sm:p-2 rounded-lg transition-all hover:bg-gray-100 ${
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
                  </div>

                  {/* Aktiviteler ve Spor */}
                  <div id="category-spor" className="mb-4">
                    <h4 className="text-sm font-semibold text-[#aa2d3a] mb-2 px-1 border-b border-[#aa2d3a] pb-1">
                      ⚽ Aktiviteler ve Spor
                    </h4>
                    <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-1 sm:gap-2">
                      {availableEmojis.slice(332, 380).map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className={`text-lg sm:text-2xl p-1 sm:p-2 rounded-lg transition-all hover:bg-gray-100 ${
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
                  </div>

                  {/* Nesneler ve Semboller */}
                  <div id="category-nesneler" className="mb-4">
                    <h4 className="text-sm font-semibold text-[#aa2d3a] mb-2 px-1 border-b border-[#aa2d3a] pb-1">
                      🎨 Nesneler ve Semboller
                    </h4>
                    <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-1 sm:gap-2">
                      {availableEmojis.slice(380, 439).map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className={`text-lg sm:text-2xl p-1 sm:p-2 rounded-lg transition-all hover:bg-gray-100 ${
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
                  </div>

                  {/* Doğa ve Hava */}
                  <div id="category-doga" className="mb-4">
                    <h4 className="text-sm font-semibold text-[#aa2d3a] mb-2 px-1 border-b border-[#aa2d3a] pb-1">
                      🌍 Doğa ve Hava
                    </h4>
                    <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-1 sm:gap-2">
                      {availableEmojis.slice(439, 514).map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className={`text-lg sm:text-2xl p-1 sm:p-2 rounded-lg transition-all hover:bg-gray-100 ${
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
                  </div>

                  {/* Semboller ve İşaretler */}
                  <div id="category-semboller" className="mb-4">
                    <h4 className="text-sm font-semibold text-[#aa2d3a] mb-2 px-1 border-b border-[#aa2d3a] pb-1">
                      💠 Semboller ve İşaretler
                    </h4>
                    <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-1 sm:gap-2">
                      {availableEmojis.slice(514, 644).map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className={`text-lg sm:text-2xl p-1 sm:p-2 rounded-lg transition-all hover:bg-gray-100 ${
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
                  </div>

                  {/* Özel Emojiler */}
                  <div id="category-ozel" className="mb-4">
                    <h4 className="text-sm font-semibold text-[#aa2d3a] mb-2 px-1 border-b border-[#aa2d3a] pb-1">
                      ✨ Özel Emojiler
                    </h4>
                    <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-1 sm:gap-2">
                      {availableEmojis.slice(644).map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className={`text-lg sm:text-2xl p-1 sm:p-2 rounded-lg transition-all hover:bg-gray-100 ${
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
                  </div>
                </div>
              </div>

              {selectedEmojis.length !== 3 && (
                <p className="text-red-500 text-sm mt-2">
                  {selectedEmojis.length === 0
                    ? "Lütfen 3 emoji seçin"
                    : `${3 - selectedEmojis.length} emoji daha seçmelisiniz`}
                </p>
              )}
            </div>

            <div className="flex justify-center sm:justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-[#aa2d3a] text-white px-4 sm:px-6 py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
