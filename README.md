# Smart Home Center

## Prerequisites

* Node.js
* Redis Server

## Development

### frontend-assets

```
npm install
npm run scripts:dev
npm run scss:dev
```

### backend

npm install
npm run dev

## Production

### frontend-assets

```
npm ci
npm run build
```

### backend

npm ci
npm start

## nginx reverse proxy config

```
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name smart-home.dev.langn.es;
    ssl_certificate /etc/letsencrypt/live/smart-home.dev.langn.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/smart-home.dev.langn.es/privkey.pem;
    ssl_protocols TLSv1.2;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_buffering off;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:8010;
    }
}
```
