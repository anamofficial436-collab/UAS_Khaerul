FROM nginx:alpine

# Menyalin seluruh aset web statis ke folder default Nginx
COPY . /usr/share/nginx/html/

# Menyalin konfigurasi custom Nginx milikmu jika diperlukan
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]