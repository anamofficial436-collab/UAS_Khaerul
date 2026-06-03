#!/bin/bash
# ============================================================
# LAPOR.ID — EC2 Ubuntu Setup Script
# Jalankan sekali saat pertama kali setup server
# chmod +x scripts/setup-ec2.sh && ./scripts/setup-ec2.sh
# ============================================================

set -e

echo "🚀 Setup LAPOR.ID di AWS EC2..."

# ============================================================
# 1. Update sistem
# ============================================================
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# ============================================================
# 2. Install Docker
# ============================================================
echo "🐳 Installing Docker..."
sudo apt install -y ca-certificates curl gnupg lsb-release

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Tambahkan user ke grup docker
sudo usermod -aG docker $USER
echo "✅ Docker installed. Run 'newgrp docker' to apply group change."

# ============================================================
# 3. Install Nginx
# ============================================================
echo "🌐 Installing Nginx..."
sudo apt install -y nginx

# ============================================================
# 4. Install Certbot (untuk SSL)
# ============================================================
echo "🔒 Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# ============================================================
# 5. Buat direktori project
# ============================================================
echo "📁 Creating project directory..."
mkdir -p ~/lapor-id/sql
mkdir -p ~/lapor-id/nginx

# ============================================================
# 6. Konfigurasi firewall (ufw)
# ============================================================
echo "🔥 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

echo "
✅ Setup selesai!

Langkah selanjutnya:
1. Upload file ke server:
   scp docker-compose.yml ubuntu@<IP>:~/lapor-id/
   scp sql/init.sql ubuntu@<IP>:~/lapor-id/sql/
   scp nginx/lapor-id.conf ubuntu@<IP>:~/lapor-id/nginx/

2. Buat file .env di server:
   nano ~/lapor-id/.env

3. Setup Nginx:
   sudo cp ~/lapor-id/nginx/lapor-id.conf /etc/nginx/sites-available/lapor-id
   sudo ln -s /etc/nginx/sites-available/lapor-id /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx

4. Setup SSL:
   sudo certbot --nginx -d yourdomain.com

5. Jalankan aplikasi:
   cd ~/lapor-id && docker compose up -d
"
