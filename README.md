# Zıp Zıp Cevahir

Kısa açıklama
----------------
Basit, tarayıcıda çalışan bir `HTML/CSS/JavaScript` zıplama oyunu. Oyuncu platformlar arasında zıplayarak puan toplar, platformlardaki paraları alır ve mağazadan kostüm/arkaplan satın alıp seçebilir. Oyun verileri (kasa, yüksek skor, sahip olunan öğeler) `localStorage` içinde saklanır.

Özellikler
----------------
- Tamamen istemci tarafı (tek dosya: `index.html`).
- Dokunmatik ve klavye kontrollere uygun.
- Mağaza sistemi: kostümler ve arkaplanlar (satın alma / seçme).
- Oyun bitiminde basit bir yapay-zeka yorumu için Google Gemini (API anahtarı gerektirir, opsiyonel).

Hızlı Başlangıç (Yerel)
----------------
1. Depoyu klonlayın veya bu klasöre gelin.
2. Basit bir HTTP sunucusu ile çalıştırın (tarayıcıda `file://` yerine sunucu kullanmak daha güvenilirdir):

Python 3 kullanıyorsanız:

```bash
python3 -m http.server 8000
```

Sonra tarayıcıda `http://localhost:8000` adresini açın ve `index.html` dosyasını yükleyin.

Alternatif olarak `live-server` (npm) kullanabilirsiniz:

```bash
npm install -g live-server
live-server
```

Notlar
----------------
- Oyun tek bir dosya (`index.html`) içinde yer alır; kodu değiştirmeden oynayabilirsiniz.
- Yerel veriler `localStorage` içinde tutulur. Tarayıcı verileri temizlerseniz tüm oyun ilerlemesi sıfırlanır.

Gemini API (opsiyonel)
----------------
Oyun, oyun sonu ekranında Cevahir için kısa bir yapay zeka yorumu almak amacıyla Google Gemini API isteği gönderebilir. Bunu etkinleştirmek için `index.html` içinde üstteki `apiKey` değişkenine kendi API anahtarınızı yerleştirin:

```js
const apiKey = "YOUR_API_KEY_HERE"; // index.html içinde
```

Eğer anahtar girilmezse veya istek başarısız olursa oyun normal şekilde çalışmaya devam eder.

Kontroller
----------------
- Klavye: `←` / `A` ile sola, `→` / `D` ile sağa hareket.
- Dokunmatik: Ekranın sol / sağ yarısına dokunarak yönlendirme.

Mağaza
----------------
- Mağaza ekranından kostüm ve arkaplanları görüntüleyebilir, yeterli paranız varsa satın alıp seçebilirsiniz.
- Oyun içi para (`🪙`) platformlardaki paraları topladıkça artar.

Dağıtım (Örnek: GitHub Pages)
----------------
1. `index.html` dosyasını doğrudan kök (root) olarak kullanabilirsiniz.
2. GitHub Pages kullanıyorsanız repoyu push ettikten sonra repository ayarlarından GitHub Pages'ı etkinleştirip `main` veya `gh-pages` dalını seçin.

Geliştirme ve Katkı
----------------
- Küçük değişiklikler veya düzeltmeler için pull request açabilirsiniz.
- Lütfen oyun davranışını etkileyecek büyük değişiklikleri tartışmak için önce issue açın.

Telif & Lisans
----------------
Bu proje basit bir demo oyunudur. Kullanım, dağıtım ve değiştirme özgürdür; açık kaynak lisansı olarak MIT veya projenin sahibinin tercih ettiği bir lisans eklemek iyi olur.

İletişim
----------------
Proje sahibi: `hfcilek` (depo sahibi). Sorularınız veya istekleriniz için repo üzerinden issue açabilirsiniz.

Not: Bu README sadece dokümantasyon amaçlıdır; istenildiği takdirde ek kullanım talimatları veya dağıtım adımları eklenebilir.