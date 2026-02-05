
# 🎬 Ryusufx Streaming

Ryusufx Streaming adalah platform streaming film dan series modern yang dirancang dengan antarmuka pengguna yang elegan (Disney+ Style). Platform ini menyediakan berbagai konten mulai dari Film Indonesia, K-Drama, Anime, hingga Serial TV Barat dengan pengalaman menonton yang mulus dan bebas gangguan iklan popup yang berlebihan.

## ✨ Fitur Utama

- **Modern Dark UI**: Desain responsif dengan tema gelap yang nyaman di mata.
- **Multi-Category Support**: Mendukung berbagai kategori (Trending, Indo Movie, Western TV, Anime, dll).
- **Ad-Shield Protection**: Integrasi video player dengan fitur sandbox untuk meminimalisir iklan popup/tab baru yang mengganggu.
- **Smart Search**: Fitur pencarian cepat untuk menemukan konten favorit Anda.
- **Responsive Layout**: Optimal untuk perangkat Mobile, Tablet, maupun Desktop.
- **Detail Page & Episode List**: Informasi lengkap mengenai konten dan daftar episode untuk serial TV.

## 🚀 Tech Stack

- **Frontend**: React.js / Next.js (Conceptual)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API Integration**: Native Fetch API dengan penanganan error yang robust.

---

## 🛠️ Tutorial Penggunaan & Integrasi API

Website ini menggunakan sistem routing berbasis parameter untuk mengambil data dari backend. Berikut adalah cara kerja integrasi API-nya:

### 1. Struktur Base URL
API utama berlokasi di: `https://zeldvorik.ru/apiv3/api.php`

### 2. Cara Menambah atau Mengubah Endpoint
Semua logika pengambilan data berada di file `src/services/api.ts`. Jika Anda ingin menambahkan kategori baru:

1.  **Buka `types.ts`**: Tambahkan aksi baru ke dalam `enum CategoryAction`.
    ```typescript
    export enum CategoryAction {
      NEW_CATEGORY = 'new-action-name',
    }
    ```
2.  **Update UI**: Tambahkan link di `Navbar.tsx` atau `Home.tsx` yang mengarah ke `/category/new-action-name`.

### 3. Endpoint yang Tersedia
| Nama Kategori | Action Parameter |
| :--- | :--- |
| Trending | `trending` |
| Film Indonesia | `indonesian-movies` |
| Serial TV Indonesia | `indonesian-drama` |
| Western TV | `western-tv` |
| K-Drama | `kdrama` |
| Canda Dewasa | `adult-comedy` |
| Anime | `anime` |
| Short TV | `short-tv` |

### 4. Penjelasan Response API
Data dikembalikan dalam format JSON dengan struktur:
- `items`: Array berisi objek film (id, title, poster, detailPath, dll).
- `hasMore`: Boolean untuk menentukan apakah masih ada halaman berikutnya (untuk fitur Infinite Scroll/Load More).

---

## 📦 Cara Instalasi (Lokal)

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/ryusufx-streaming.git
   ```
2. **Masuk ke Direktori**
   ```bash
   cd ryusufx-streaming
   ```
3. **Instal Dependensi**
   ```bash
   npm install
   ```
4. **Jalankan Project**
   ```bash
   npm run dev
   ```

---

## 🛡️ Catatan Tentang Video Player
Untuk kenyamanan pengguna, iframe video player di file `pages/Detail.tsx` telah ditambahkan atribut `sandbox`:
```html
<iframe 
  src={url} 
  sandbox="allow-forms allow-scripts allow-same-origin allow-fullscreen"
></iframe>
```
Atribut ini berfungsi untuk mencegah script iklan membuka tab baru atau window baru secara otomatis tanpa persetujuan pengguna.

## 📝 Lisensi
Project ini dibuat untuk tujuan edukasi dan portofolio. Konten video disediakan oleh pihak ketiga melalui API eksternal.

---
Dibuat dengan ❤️ oleh **Ryusufx Team**.
