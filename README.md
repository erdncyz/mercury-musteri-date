# 🚀 Mercury Müşteri ve İşlem Takip Sistemi

Mercury, işletmeler için geliştirilmiş modern ve kullanıcı dostu bir müşteri ve işlem takip sistemidir. Web tabanlı arayüzü ile müşteri bilgilerini, işlemleri ve ödemeleri kolayca yönetebilirsiniz.

## ✨ Özellikler

### 👥 Müşteri Yönetimi
- **Müşteri Ekleme**: Ad, telefon ve adres bilgileri ile müşteri kaydı
- **Müşteri Arama**: İsim, telefon veya adres ile hızlı arama
- **Müşteri Silme**: Güvenli müşteri ve ilgili veri silme
- **Müşteri Detayları**: Detaylı müşteri bilgileri ve işlem geçmişi

### 🔧 İşlem Yönetimi
- **İşlem Ekleme**: Tarih, malzeme türü, açıklama ve fiyat bilgileri
- **Malzeme Türü**: Serbest metin girişi ile malzeme türü belirleme
- **Adet ve Fiyat**: Otomatik toplam fiyat hesaplama
- **İşlem Silme**: Güvenli işlem silme işlemi

### 💰 Ödeme Yönetimi
- **Ödeme Ekleme**: Tarih, tutar, ödeme yöntemi ve not bilgileri
- **Ödeme Yöntemleri**: Nakit, Kredi Kartı, Banka Havalesi, Çek, Diğer
- **Borç Takibi**: Otomatik borç hesaplama ve takip

### 📊 Raporlama ve Analiz
- **Genel Özet**: Toplam müşteri, işlem, borç ve ödeme istatistikleri
- **Borç Takibi**: Müşteri bazında detaylı borç bilgileri
- **Filtreleme**: Borç durumuna göre müşteri filtreleme
- **Sıralama**: İsim, borç, işlem sayısı ve tarihe göre sıralama

### 📈 Excel Aktarma
- **İşlemler Excel**: Tüm işlem verilerini Excel formatında aktarma
- **Müşteri Listesi**: Müşteri bilgileri ve borç durumları
- **Borç Raporu**: Detaylı borç analizi raporu
- **Türkçe Karakter Desteği**: UTF-8 BOM ile Türkçe karakter desteği

## 🛠️ Teknik Özellikler

### Frontend
- **HTML5**: Modern semantik yapı
- **CSS3**: Responsive tasarım ve animasyonlar
- **JavaScript ES6+**: Modern JavaScript özellikleri
- **Font Awesome**: İkon kütüphanesi
- **Google Fonts**: Inter font ailesi

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing
- **JSON**: Veri saklama formatı

### Veri Yapısı
```json
{
  "customers": [
    {
      "id": 1234567890,
      "name": "Müşteri Adı",
      "phone": "0555 123 45 67",
      "address": "Adres Bilgisi",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "works": [
    {
      "id": 1234567890,
      "customerId": 123,
      "customerName": "Müşteri Adı",
      "date": "2024-01-15",
      "materialType": "Ahşap",
      "description": "Yapılan iş",
      "quantity": 2,
      "unitPrice": 150.00,
      "price": 300.00,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "payments": [
    {
      "id": 1234567890,
      "customerId": 123,
      "customerName": "Müşteri Adı",
      "date": "2024-01-15",
      "amount": 150.00,
      "method": "Nakit",
      "note": "Ödeme notu",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

## 🚀 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm (Node Package Manager)

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd mercury-musteri-takip
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Sunucuyu başlatın**
```bash
node server.js
```

4. **Tarayıcıda açın**
```
http://localhost:3000
```

## 📱 Kullanım

### Müşteri Ekleme
1. "Müşteri Ekle" sekmesine gidin
2. Müşteri adı, telefon ve adres bilgilerini girin
3. "Müşteriyi Kaydet" butonuna tıklayın

### İşlem Ekleme
1. "İşlem Ekle" sekmesine gidin
2. Müşteri seçin
3. Tarih, malzeme türü ve açıklama girin
4. Adet ve birim fiyat belirleyin
5. "İşlemi Kaydet" butonuna tıklayın

### Ödeme Ekleme
1. "Ödeme Ekle" sekmesine gidin
2. Müşteri seçin
3. Tarih, tutar ve ödeme yöntemi belirleyin
4. İsteğe bağlı not ekleyin
5. "Ödemeyi Kaydet" butonuna tıklayın

### Müşteri Arama ve Filtreleme
1. "İşlemler" sekmesine gidin
2. Arama kutusuna müşteri bilgisi girin
3. Filtre seçeneklerini kullanın
4. Sıralama seçeneklerini belirleyin

### Excel Aktarma
1. "İşlemler" sekmesine gidin
2. "Excel Aktar" butonuna tıklayın
3. Dosya otomatik olarak indirilecektir

## 🎨 Arayüz Özellikleri

### Responsive Tasarım
- **Desktop**: Tam özellikli arayüz
- **Tablet**: Optimize edilmiş düzen
- **Mobile**: Mobil uyumlu tasarım

### Renk Paleti
- **Primary**: #3498db (Mavi)
- **Success**: #27ae60 (Yeşil)
- **Warning**: #f39c12 (Turuncu)
- **Danger**: #e74c3c (Kırmızı)
- **Info**: #9b59b6 (Mor)

### Animasyonlar
- **Fade In**: Kartlar için yumuşak geçiş
- **Hover Effects**: Buton ve kart etkileşimleri
- **Slide In**: Bildirim animasyonları

## 🔧 API Endpoints

### Müşteri API
- `GET /api/data` - Tüm verileri getir
- `POST /api/data` - Verileri güncelle
- `POST /api/customers` - Müşteri ekle
- `DELETE /api/customers/:id` - Müşteri sil

### İşlem API
- `POST /api/works` - İşlem ekle
- `DELETE /api/works/:id` - İşlem sil

### Ödeme API
- `POST /api/payments` - Ödeme ekle

### Veri Yönetimi API
- `DELETE /api/data` - Tüm verileri temizle

## 📊 Veri Güvenliği

### Yerel Veri Saklama
- Tüm veriler `data.json` dosyasında saklanır
- Otomatik yedekleme sistemi
- Veri bütünlüğü korunur

### Güvenlik Önlemleri
- XSS koruması (HTML escape)
- CSRF koruması
- Input validasyonu
- Güvenli veri silme onayları

## 🐛 Hata Ayıklama

### Yaygın Sorunlar

1. **Port 3000 kullanımda**
```bash
# Mevcut süreci durdur
pkill -f "node server.js"
# Sunucuyu yeniden başlat
node server.js
```

2. **Veri dosyası bulunamıyor**
- `data.json` dosyası otomatik oluşturulur
- Dosya izinlerini kontrol edin

3. **Excel dosyası açılmıyor**
- Türkçe karakter desteği için UTF-8 BOM kullanılır
- Excel'de "Veri" > "Metin/Sütun" seçeneğini kullanın

## 🔄 Güncelleme Geçmişi

### v1.0.0 (2024-01-15)
- ✅ Temel müşteri yönetimi
- ✅ İşlem takibi
- ✅ Ödeme yönetimi
- ✅ Excel aktarma
- ✅ Responsive tasarım

### v1.1.0 (2024-01-15)
- ✅ Malzeme türü özelliği
- ✅ Gelişmiş arama ve filtreleme
- ✅ Müşteri silme özelliği
- ✅ Borç takibi iyileştirmeleri

## 📞 Destek

### Teknik Destek
- GitHub Issues: Hata bildirimi ve özellik istekleri
- Email: [destek@mercury.com](mailto:destek@mercury.com)

### Dokümantasyon
- API Dokümantasyonu: `/docs` klasörü
- Kullanım Kılavuzu: Bu README dosyası
- Video Eğitimler: [YouTube Kanalı](https://youtube.com/mercury)

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 👥 Geliştirici Ekibi

- **Lead Developer**: [Geliştirici Adı](https://github.com/developer)
- **UI/UX Designer**: [Tasarımcı Adı](https://github.com/designer)
- **Backend Developer**: [Backend Geliştirici](https://github.com/backend)

## 🙏 Teşekkürler

- [Font Awesome](https://fontawesome.com/) - İkonlar için
- [Google Fonts](https://fonts.google.com/) - Tipografi için
- [Express.js](https://expressjs.com/) - Web framework için
- [Node.js](https://nodejs.org/) - Runtime için

---

**Mercury Müşteri ve İşlem Takip Sistemi** - İşletmenizi dijitalleştirin! 🚀
