# UAS-Kaherul Anam — Administrasi Server

> **Nama**: Khaerul Anam
> **NIM**: 2388010021
> **Kelas**: INF B
> **Mata Kuliah**: Administrasi Server

---

## 📐 Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPER (Lokal)                        │
│  git push → branch main                                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              GITHUB ACTIONS (CI/CD Pipeline)                │
│                                                             │
│  ┌─────────────────┐       ┌──────────────────────────┐    │
│  │  detect-changes │──────▶│  Paths Filter             │    │
│  │  (dorny/filter) │       │  web-statis/** → Job 2   │    │
│  └─────────────────┘       │  web-dinamis/** → Job 3  │    │
│                             └──────────────────────────┘    │
│                                                             │
│  ┌────────────────┐   ┌────────────────────────────────┐   │
│  │ build-web-     │   │ build-web-dinamis               │   │
│  │ statis         │   │ ① npm ci → lint → tsc → build  │   │
│  │ ① Docker build │   │ ② Docker build                 │   │
│  │ ② Push ke Hub  │   │ ③ Push ke Docker Hub           │   │
│  └───────┬────────┘   └──────────────┬─────────────────┘   │
│          └──────────────┬────────────┘                      │
│                         ▼                                    │
│               ┌─────────────────┐                           │
│               │   deploy job    │                           │
│               │  SSH ke EC2     │                           │
│               │  docker pull    │                           │
│               │  docker compose │                           │
│               │  up -d          │                           │
│               └─────────────────┘                           │
└──────────────────────┬──────────────────────────────────────┘
                       │ SSH + docker compose up
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  AWS EC2 (Ubuntu 22.04)                     │
│  Instance: UAS-NIM | Type: t2.micro                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Docker Network: uas_network              │  │
│  │                                                       │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │  web-statis │  │ web-dinamis  │  │     db      │ │  │
│  │  │  Nginx:80   │  │  Next.js     │  │  MariaDB    │ │  │
│  │  │  Port: 80   │  │  Port: 3000  │  │  Internal   │ │  │
│  │  │  CV/Portofo │  │  LAPOR.ID    │  │  Port 3306  │ │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Volume: db_data (MariaDB persistent)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂 Struktur Repository

```
UAS_ANAM/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          ← CI/CD pipeline utama
├── web-statis/                ← CV / Portfolio (Nginx)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── nginx.conf
│   └── Dockerfile
├── web-dinamis/               ← LAPOR.ID (Next.js + MariaDB)
│   ├── src/
│   │   ├── app/               ← Next.js App Router pages
│   │   ├── components/        ← React components
│   │   ├── lib/               ← db, session, utils
│   │   └── types/             ← TypeScript types
│   ├── sql/
│   │   └── init.sql           ← Schema + seeding otomatis
│   ├── Dockerfile
│   └── ...
├── docker-compose.yml         ← Orkestrasi semua service
├── .env.example               ← Template environment variables
├── .gitignore
└── README.md
```

---

## 🚀 Cara Menjalankan

### Opsi 1 — Docker Compose (Rekomendasi)

```bash
# 1. Clone repository
git clone https://github.com/USERNAME/A6_UAS_2388010021.git
cd A6_UAS_2388010021

# 2. Buat file .env
cp .env.example .env
# Edit .env sesuai konfigurasi kamu (minimal DOCKER_USERNAME)

# 3. Jalankan semua service
docker compose up -d --build

# 4. Cek status
docker compose ps
```

Akses:

- **Web Statis (CV)**: http://localhost:80
- **Web Dinamis (LAPOR.ID)**: http://localhost:3000

---

### Opsi 2 — Development Lokal (Next.js)

```bash
cd web-dinamis
npm install
# Edit .env.local sesuai DB lokal
npm run dev
```

---

## 🔐 GitHub Actions Secrets

Tambahkan secrets berikut di **GitHub → Settings → Secrets and variables → Actions**:

| Secret            | Nilai               | Keterangan                         |
| ----------------- | ------------------- | ---------------------------------- |
| `DOCKER_USERNAME` | `userkamu`          | Username Docker Hub                |
| `DOCKER_PASSWORD` | `•••••••`           | Password / Access Token Docker Hub |
| `EC2_HOST`        | `xx.xx.xx.xx`       | IP Publik EC2                      |
| `EC2_USER`        | `ubuntu`            | User SSH EC2                       |
| `EC2_SSH_KEY`     | `-----BEGIN RSA...` | Isi file `.pem` (private key)      |

---

## ⚙️ Setup EC2 (Pertama Kali)

```bash
# 1. SSH ke EC2
ssh -i your-key.pem ubuntu@<EC2-IP>

# 2. Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
newgrp docker

# 3. Install Docker Compose plugin
sudo apt install -y docker-compose-plugin

# 4. Buat direktori project
mkdir -p ~/uas

# 5. Buka port di Security Group AWS:
#    Port 22  (SSH)
#    Port 80  (Web Statis)
#    Port 3000 (Web Dinamis)
```

---

## 🌐 URL Akses (Production)

| Service                | URL                              |
| ---------------------- | -------------------------------- |
| Web Statis (CV)        | `http://<EC2-IP>:80`             |
| Web Dinamis (LAPOR.ID) | `http://<EC2-IP>:3000`           |
| Login Admin            | `http://<EC2-IP>:3000/login`     |
| Dashboard              | `http://<EC2-IP>:3000/dashboard` |

---

## 👤 Akun Admin Default

| Field    | Value      |
| -------- | ---------- |
| Username | `admin`    |
| Password | `admin123` |

---

## 🔄 Alur CI/CD

Setiap kali `git push` ke branch `main`:

1. **detect-changes** — cek folder mana yang berubah (paths filter)
2. **build-web-statis** — berjalan _hanya_ jika `web-statis/**` berubah
3. **build-web-dinamis** — berjalan _hanya_ jika `web-dinamis/**` berubah
   - lint → TypeScript check → build → docker push
4. **deploy** — SSH ke EC2, `docker pull` + `docker compose up -d`

> Zero-touch deployment: dari `git push` hingga live di EC2 **tanpa intervensi manual**.

---

## 📦 Docker Images

| Image                                  | Registry   | Keterangan        |
| -------------------------------------- | ---------- | ----------------- |
| `{DOCKER_USERNAME}/web-statis:latest`  | Docker Hub | Nginx + CV static |
| `{DOCKER_USERNAME}/web-dinamis:latest` | Docker Hub | Next.js LAPOR.ID  |

---

## 🛠 Teknologi

| Kategori    | Stack                                |
| ----------- | ------------------------------------ |
| Web Dinamis | Next.js 15, TypeScript, Tailwind CSS |
| Database    | MariaDB 11.2                         |
| Web Statis  | HTML5, CSS3, JavaScript (Vanilla)    |
| Container   | Docker, Docker Compose               |
| CI/CD       | GitHub Actions                       |
| Cloud       | AWS EC2 (Ubuntu 22.04)               |
| Registry    | Docker Hub                           |
| Web Server  | Nginx (web-statis)                   |
