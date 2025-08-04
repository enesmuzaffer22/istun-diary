# İSTÜN Hatıra Defteri

İstanbul Sağlık ve Teknoloji Üniversitesi Bilgisayar Mühendisliği mezuniyet töreni için özel olarak geliştirilmiş hatıra defteri web uygulaması.

## 🎓 Proje Hakkında

Bu uygulama, mezuniyet töreninde arkadaşlarınızın size özel mesajlar yazabilmesi için tasarlanmış modern bir web platformudur. Kullanıcılar kendi hatıra defterlerini oluşturabilir, davet linkleri paylaşabilir ve arkadaşlarından gelen mesajları görüntüleyebilir.

## ✨ Özellikler

### 🔐 Güvenlik & Kimlik Doğrulama

- **İSTÜN E-posta Kontrolü**: Sadece @istun.edu.tr uzantılı e-posta adresleri ile kayıt
- **E-posta Doğrulama**: Kayıt sonrası otomatik e-posta doğrulama sistemi
- **Güçlü Şifre Kuralları**: En az 6 karakter, harf, rakam ve özel karakter gereksinimleri
- **Anlık Şifre Doğrulama**: Kayıt sırasında şifre gereksinimlerinin canlı kontrolü

### 🎁 Sürpriz Mesaj Sistemi

- **Emoji Seçimi**: Her mesajla birlikte 3 adet emoji seçimi
- **Sürpriz Açılış**: Mesajlar ve gönderen bilgileri sürpriz olarak açılır
- **Zamanlı Açılış**: Tüm sürpriz mesajlar belirli bir tarihte açılır
- **Geri Sayım Timer**: Açılış tarihine kadar canlı geri sayım
- **Kalıcı Durum**: Açılan mesajlar localStorage ile hatırlanır

### 📱 Kullanıcı Deneyimi

- **QR Kod Oluşturma**: Davet linkleri için otomatik QR kod üretimi
- **Responsive Tasarım**: Mobil ve masaüstü tamamen uyumlu
- **Modern Animasyonlar**: Fade-in, slide-down, gradient efektleri
- **Glassmorphism Tasarım**: Modern cam efektli UI elementleri
- **Canlı Arayüz**: Gradient arka planlar ve hover efektleri

### 🔗 Paylaşım & Davet

- **Benzersiz Davet Linkleri**: Her kullanıcı için özel link oluşturma
- **Link Kopyalama**: Tek tıkla link kopyalama özelliği
- **QR Kod Paylaşımı**: Davet linkini QR kod olarak paylaşma
- **Anlık Bildirimler**: Kopyalama ve işlem onayları

### 📊 İstatistikler & Yönetim

- **Mesaj İstatistikleri**: Toplam mesaj ve benzersiz gönderen sayısı
- **Profil Yönetimi**: Kullanıcı profil bilgileri düzenleme
- **Gerçek Zamanlı Güncellemeler**: Firebase ile anlık veri senkronizasyonu

## 🛠️ Teknolojiler

### Frontend

- **React 19**: Modern React özellikleri ile geliştirilmiş
- **Vite**: Hızlı geliştirme ve build araç
- **Tailwind CSS**: Utility-first CSS framework
- **React Router DOM**: SPA routing yönetimi
- **React Hook Form**: Form yönetimi ve validasyon

### Backend & Veritabanı

- **Firebase Authentication**: Kullanıcı kimlik doğrulama
- **Firestore**: NoSQL gerçek zamanlı veritabanı
- **Firebase Hosting**: Web hosting (opsiyonel)

### UI/UX Kütüphaneleri

- **Lucide React**: Modern ikon seti
- **React Markdown**: Markdown içerik render
- **QRCode**: QR kod oluşturma kütüphanesi

### Geliştirme Araçları

- **ESLint**: Kod kalitesi kontrolü
- **PostCSS**: CSS işleme
- **Autoprefixer**: CSS vendor prefix'leri

## 🚀 Kurulum

1. **Projeyi klonlayın:**

   ```bash
   git clone <repository-url>
   cd istun-diary-frontend
   ```

2. **Bağımlılıkları yükleyin:**

   ```bash
   npm install
   ```

3. **Firebase konfigürasyonu:**

   - `.env` dosyasını oluşturun
   - Firebase proje bilgilerinizi ekleyin:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Uygulamayı başlatın:**
   ```bash
   npm run dev
   ```

## 📱 Kullanım

### 🔐 Kayıt Olma & Giriş

1. **Kayıt Ol** sekmesine tıklayın
2. **Ad, Soyad** bilgilerinizi girin
3. **@istun.edu.tr** uzantılı e-posta adresinizi girin
4. **Güçlü şifre** oluşturun (en az 6 karakter, harf, rakam, özel karakter)
5. Şifre gereksinimlerinin yeşil tik aldığını kontrol edin
6. **Kayıt Ol** butonuna tıklayın
7. E-posta adresinize gelen **doğrulama linkine** tıklayın
8. **Giriş Yap** ile sisteme giriş yapın

### 🎁 Hatıra Defteri Oluşturma

1. Dashboard'da **"Davet Linki Oluştur"** butonuna tıklayın
2. Oluşan linki **kopyala** butonuyla panoya kopyalayın
3. Alternatif olarak **QR Kod** butonuyla QR kodu oluşturun
4. Davet linkini veya QR kodu arkadaşlarınızla paylaşın

### ✍️ Sürpriz Mesaj Yazma

1. Arkadaşınızın **davet linkine** tıklayın veya QR kodu okutun
2. **Ad ve Soyad** bilgilerinizi girin
3. **3 adet emoji** seçin (arkadaşlığınızı temsil eden)
4. **Mesajınızı** yazın (Markdown formatı desteklenir)
5. **Önizleme** ile mesajınızı kontrol edin
6. **"Mesajı Gönder"** butonuna tıklayın

### 🎉 Sürpriz Mesajları Açma

1. **Geri sayım** tarihini bekleyin
2. **Geri sayım** tamamlandığında kutlama mesajı görünecek
3. Mesajlarınızın yanındaki **"Sürprizi Aç!"** butonuna tıklayın
4. **Gönderen adı, emojiler ve mesaj** sürpriz olarak açılacak
5. Açılan mesajlar **kalıcı olarak** görünür kalacak

## 🔧 Firebase Kurulumu

1. [Firebase Console](https://console.firebase.google.com/)'da yeni proje oluşturun
2. Authentication'ı etkinleştirin ve Email/Password provider'ını açın
3. Firestore Database oluşturun
4. Web uygulaması ekleyin ve config bilgilerini alın

### Firestore Güvenlik Kuralları

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - Kullanıcı profilleri
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }

    // Entries collection - Hatıra defteri mesajları
    match /entries/{entryId} {
      allow read: if request.auth != null &&
        (request.auth.uid == resource.data.authorId ||
         request.auth.uid == resource.data.recipientId);
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.authorId &&
        // Emoji array kontrolü
        request.resource.data.emojis is list &&
        request.resource.data.emojis.size() == 3 &&
        // isRevealed field kontrolü
        request.resource.data.isRevealed == false;
      allow update: if request.auth != null &&
        request.auth.uid == resource.data.recipientId &&
        // Sadece isRevealed field'ını güncellemeye izin ver
        request.resource.data.keys().hasOnly(['isRevealed']) &&
        request.resource.data.isRevealed == true;
    }
  }
}
```

### Firestore Veri Yapısı

#### Users Collection

```javascript
{
  uid: "user_id",
  email: "user@istun.edu.tr",
  firstName: "Ad",
  lastName: "Soyad",
  inviteCode: "unique_invite_code",
  createdAt: timestamp
}
```

#### Entries Collection

```javascript
{
  id: "entry_id",
  authorId: "sender_user_id",
  recipientId: "recipient_user_id",
  senderName: "Gönderen Adı Soyadı",
  message: "Mesaj içeriği (Markdown destekli)",
  emojis: ["😊", "🎉", "❤️"], // Tam 3 adet emoji
  isRevealed: false, // Sürpriz açılış durumu
  createdAt: timestamp
}
```

## 🎨 Tasarım & UI/UX

### Renk Paleti

- **Ana Renk**: `#aa2d3a` (İSTÜN kurumsal kırmızısı)
- **Gradient Temalar**: Purple/indigo (geri sayım), green/emerald (başarı), pink (mesajlar)
- **Glassmorphism**: Şeffaf cam efektli kartlar
- **Modern Gradients**: Dinamik arka plan geçişleri

### Animasyonlar

- **Fade-in**: Sayfa yüklenme efektleri
- **Slide-down**: Mobil menü animasyonları
- **Hover Efektleri**: Buton ve kart etkileşimleri
- **Bounce**: Emoji animasyonları
- **Shimmer**: Yükleme efektleri

### Responsive Tasarım

- **Mobile-first**: Önce mobil, sonra desktop yaklaşımı
- **Breakpoints**: sm, md, lg, xl responsive noktaları
- **Flexible Grid**: CSS Grid ve Flexbox kullanımı
- **Touch-friendly**: Mobil dokunmatik optimizasyonu

## 🚀 Deployment

### Netlify Deployment

```bash
# Build komutu
npm run build

# Netlify _redirects dosyası (public/ klasöründe mevcut)
/*    /index.html   200
```

### Firebase Hosting (Alternatif)

```bash
# Firebase CLI kurulumu
npm install -g firebase-tools

# Giriş yapın
firebase login

# Projeyi başlatın
firebase init hosting

# Deploy edin
firebase deploy
```

## 📊 Proje Durumu

### ✅ Tamamlanan Özellikler

- [x] İSTÜN e-posta doğrulama sistemi
- [x] Güçlü şifre gereksinimleri ve canlı validasyon
- [x] Sürpriz mesaj sistemi (emoji seçimi ile)
- [x] Zamanlı mesaj açılış sistemi
- [x] Geri sayım timer'ı
- [x] QR kod oluşturma ve paylaşım
- [x] Responsive tasarım ve modern animasyonlar
- [x] Glassmorphism UI tasarımı
- [x] LocalStorage ile kalıcı mesaj durumu

## 📄 Lisans

Bu proje İstanbul Sağlık ve Teknoloji Üniversitesi Bilgisayar Mühendisliği mezuniyet töreni için özel olarak geliştirilmiştir.
