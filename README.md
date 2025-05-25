# İSTÜN Hatıra Defteri

İstanbul Sağlık ve Teknoloji Üniversitesi Bilgisayar Mühendisliği mezuniyet töreni için özel olarak geliştirilmiş hatıra defteri web uygulaması.

## 🎓 Proje Hakkında

Bu uygulama, mezuniyet töreninde arkadaşlarınızın size özel mesajlar yazabilmesi için tasarlanmış modern bir web platformudur. Kullanıcılar kendi hatıra defterlerini oluşturabilir, davet linkleri paylaşabilir ve arkadaşlarından gelen mesajları görüntüleyebilir.

## ✨ Özellikler

- **Güvenli Giriş**: Sadece @istun.edu.tr uzantılı e-posta adresleri ile kayıt
- **E-posta Doğrulama**: Kayıt sonrası otomatik e-posta doğrulama
- **Davet Sistemi**: Benzersiz davet linkleri ile mesaj yazma
- **Markdown Desteği**: Zengin metin formatı ile mesaj yazma
- **Gerçek Zamanlı**: Anlık mesaj güncellemeleri
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Modern UI**: Tailwind CSS ile şık arayüz

## 🛠️ Teknolojiler

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication & Firestore)
- **Routing**: React Router DOM
- **Form Yönetimi**: React Hook Form
- **Markdown**: React Markdown
- **İkonlar**: Lucide React

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

### Kayıt Olma

1. @istun.edu.tr uzantılı e-posta adresinizle kayıt olun
2. E-posta adresinize gelen doğrulama linkine tıklayın
3. Giriş yapın

### Hatıra Defteri Oluşturma

1. Dashboard'da "Davet Linki Oluştur" butonuna tıklayın
2. Oluşan linki arkadaşlarınızla paylaşın

### Mesaj Yazma

1. Arkadaşınızın davet linkine tıklayın
2. Mesajınızı Markdown formatında yazın
3. "Mesajı Gönder" butonuna tıklayın

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
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }

    // Entries collection
    match /entries/{entryId} {
      allow read: if request.auth != null &&
        (request.auth.uid == resource.data.authorId ||
         request.auth.uid == resource.data.recipientId);
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.authorId;
    }
  }
}
```

## 🎨 Tasarım

Uygulama İSTÜN'ün kurumsal rengi olan `#aa2d3a` (koyu kırmızı) ile tasarlanmıştır. Modern ve kullanıcı dostu arayüz ile mezuniyet anınızı özel kılmak için tasarlanmıştır.

## 📄 Lisans

Bu proje İstanbul Sağlık ve Teknoloji Üniversitesi Bilgisayar Mühendisliği mezuniyet töreni için özel olarak geliştirilmiştir.

## 🎉 Mezuniyet Kutlu Olsun!

Bu özel günde arkadaşlarınızdan gelen mesajlarla hatıralarınızı ölümsüzleştirin! 🎓✨
