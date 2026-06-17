# Website Informasi Padukuhan Sambeng

Saya ingin membangun sebuah website informasi resmi untuk Padukuhan Sambeng yang berfungsi sebagai pusat informasi digital bagi masyarakat padukuhan maupun masyarakat luar yang ingin mengetahui informasi terkait Padukuhan Sambeng.

Website ini harus memiliki dua bagian utama:

## 1. Website Publik

Website publik dapat diakses oleh semua pengunjung tanpa perlu login.

### Beranda

Berisi informasi umum mengenai Padukuhan Sambeng, seperti:

* Banner atau hero section
* Sambutan Dukuh
* Ringkasan profil padukuhan
* Statistik singkat (jumlah organisasi, jumlah UMKM, dll.)
* Berita terbaru
* Acara terdekat
* UMKM unggulan

Seluruh konten pada beranda harus dapat dikelola melalui dashboard admin.

---

### Organisasi dan Lembaga

Website harus menyediakan informasi mengenai organisasi atau lembaga yang ada di Padukuhan Sambeng, seperti:

* Pemerintahan Padukuhan
* Karang Taruna
* PKK
* Posyandu
* Kelompok Tani
* RT/RW
* Organisasi lain yang ada di padukuhan

Setiap organisasi memiliki informasi:

* Nama organisasi
* Deskripsi
* Visi
* Misi
* Kontak
* Foto/logo
* Struktur organisasi

Struktur organisasi harus ditampilkan dalam bentuk diagram atau tree hierarchy.

---

### UMKM

Website harus memiliki katalog UMKM yang ada di Padukuhan Sambeng.

Informasi yang ditampilkan:

* Nama usaha
* Nama pemilik
* Deskripsi usaha
* Kategori usaha
* Alamat
* Nomor WhatsApp
* Foto usaha atau produk

Pengunjung dapat melihat seluruh daftar UMKM dan detail masing-masing UMKM.

---

### Berita

Website harus memiliki fitur berita yang dapat digunakan untuk mempublikasikan informasi dan kegiatan padukuhan.

Informasi berita:

* Judul
* Thumbnail
* Ringkasan
* Konten lengkap
* Tanggal publikasi
* Penulis

Berita harus dapat dikelompokkan berdasarkan kategori.

---

### Acara

Website harus memiliki halaman acara atau agenda kegiatan.

Informasi acara:

* Judul acara
* Deskripsi
* Lokasi
* Tanggal mulai
* Tanggal selesai
* Poster atau gambar acara

Acara yang akan datang dapat ditampilkan pada beranda.

---

## 2. Dashboard Admin

Website harus memiliki dashboard admin yang digunakan untuk mengelola seluruh konten website.

Admin harus dapat login menggunakan email dan password.

### Manajemen Beranda

Admin dapat:

* Mengubah banner
* Mengubah judul dan deskripsi website
* Mengubah sambutan Dukuh
* Mengatur konten yang ditampilkan pada beranda

---

### Manajemen Organisasi

Admin dapat:

* Menambah organisasi
* Mengubah informasi organisasi
* Menghapus organisasi
* Mengelola visi dan misi
* Mengelola kontak organisasi
* Mengelola struktur organisasi

Struktur organisasi harus dapat diedit dalam bentuk tree hierarchy menggunakan parent-child relationship.

---

### Manajemen UMKM

Admin dapat:

* Menambah UMKM
* Mengubah data UMKM
* Menghapus UMKM
* Mengunggah foto UMKM

---

### Manajemen Berita

Admin dapat:

* Menambah berita
* Mengubah berita
* Menghapus berita
* Menyimpan berita sebagai draft
* Mempublikasikan berita

Konten berita menggunakan rich text editor.

---

### Manajemen Acara

Admin dapat:

* Menambah acara
* Mengubah acara
* Menghapus acara
* Menampilkan atau menyembunyikan acara

---

## Teknologi

Arsitektur yang diinginkan:

* Frontend: Next.js
* Styling: Tailwind CSS
* Authentication: Firebase Authentication
* Database: Cloud Firestore
* File Storage: Cloudinary
* Hosting: Firebase Hosting

Website harus responsif, mudah digunakan oleh perangkat padukuhan, dan memungkinkan seluruh informasi diperbarui tanpa perlu mengubah kode aplikasi.
