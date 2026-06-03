# LAPOR.ID — Sistem Pengaduan Masyarakat

Platform pengaduan masyarakat digital berbasis Next.js 15, MariaDB, Docker Compose, dan GitHub Actions CI/CD.

---

## 🗂 Struktur Folder

```
lapor-id/
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # GitHub Actions CI/CD pipeline
├── public/                     # Static assets
├── scripts/
│   └── generate-hash.js        # Helper generate bcrypt hash
├── sql/
│   └── init.sql                # Schema + seed data MariaDB
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── logout/route.ts
│   │   │   └── pengaduan/
│   │   │       ├── route.ts          # GET, POST
│   │   │       └── [id]/route.ts     # GET, PUT, DELETE
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # Dashboard layout + auth guard
│   │   │   ├── page.tsx              # Dashboard overview
│   │   │   └── pengaduan/
│   │   │       ├── page.tsx          # List + filter
│   │   │       ├── PengaduanActions.tsx
│   │   │       └── detail/[id]/page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── pengaduan-baru/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx              # Landing page
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── DashboardSidebar.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/
│   │       ├── StatusBadge.tsx
│   │       └── KategoriBadge.tsx
│   ├── lib/
│   │   ├── db.ts               # MariaDB connection pool
│   │   ├── session.ts          # iron-session management
│   │   └── utils.ts            # Utility functions
│   └── types/
│       └── index.ts            # TypeScript types & constants
├── .dockerignore
├── .env.local                  # Environment variables (lokal)
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Cara Menjalankan

### 1. Development Lokal (tanpa Docker)

**Prasyarat:** Node.js 20+, MariaDB/MySQL aktif

```bash
# Clone dan install
git clone <repo-url>
cd lapor-id
npm install

# Setup database
# Jalankan sql/init.sql di MariaDB Anda:
mysql -u root -p < sql/init.sql

# Konfigurasi environment
cp .env.local .env.local
# Edit .env.local sesuai konfigurasi database Anda

# Jalankan dev server
npm run dev
```

Buka: [http://localhost:3000](http://localhost:3000)

---

### 2. Menjalankan dengan Docker Compose

```bash
# Build dan jalankan semua service
docker compose up -d --build

# Lihat logs
docker compose logs -f app
docker compose logs -f db

# Stop
docker compose down
```

Buka: [http://localhost:3000](http://localhost:3000)

---

### 3. Akun Admin Default

| Field    | Value     |
|----------|-----------|
| Username | `admin`   |
| Password | `admin123`|
| URL      | `/login`  |

---

## 🌐 API Endpoints

| Method | Endpoint              | Auth    | Keterangan            |
|--------|-----------------------|---------|-----------------------|
| GET    | `/api/pengaduan`      | Public  | List semua pengaduan  |
| POST   | `/api/pengaduan`      | Public  | Submit pengaduan baru |
| GET    | `/api/pengaduan/:id`  | Public  | Detail pengaduan      |
| PUT    | `/api/pengaduan/:id`  | Admin   | Update status         |
| DELETE | `/api/pengaduan/:id`  | Admin   | Hapus pengaduan       |
| POST   | `/api/auth/login`     | Public  | Login admin           |
| POST   | `/api/auth/logout`    | Admin   | Logout                |

---

## ⚙️ GitHub Actions CI/CD ke AWS EC2

### Setup Secrets GitHub

Tambahkan secrets berikut di repo → Settings → Secrets:

| Secret         | Keterangan                              |
|----------------|-----------------------------------------|
| `EC2_HOST`     | IP/hostname EC2                         |
| `EC2_USER`     | User SSH (biasanya `ubuntu`)            |
| `EC2_SSH_KEY`  | Private key PEM untuk SSH               |

### Setup EC2

```bash
# Install Docker di EC2 Ubuntu
sudo apt update && sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker ubuntu

# Buat direktori project
mkdir -p /home/ubuntu/lapor-id

# Copy docker-compose.yml ke EC2
# (lakukan via scp atau manual)
scp docker-compose.yml ubuntu@<EC2-IP>:/home/ubuntu/lapor-id/
scp sql/init.sql ubuntu@<EC2-IP>:/home/ubuntu/lapor-id/sql/
```

### Alur CI/CD

```
Push ke main
    ↓
Lint & Type Check
    ↓
Build Next.js
    ↓
Build & Push Docker Image ke GHCR
    ↓
SSH ke EC2 → docker compose pull → docker compose up
```

---

## 🔐 Catatan Keamanan untuk Production

1. **Ganti SESSION_SECRET** dengan string random panjang (min. 32 karakter)
2. **Ganti password database** di `docker-compose.yml`
3. **Gunakan HTTPS** — pasang Nginx + Let's Encrypt di EC2
4. **Batasi port 3306** hanya untuk internal network

---

## 🛠 Teknologi

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MariaDB 11.2
- **Auth:** iron-session + bcrypt
- **Container:** Docker + Docker Compose
- **CI/CD:** GitHub Actions → AWS EC2
