# Matchmaking Frontend

A Next.js application for matchmaking services.

## Prerequisites

- Node.js 18 or later
- npm, yarn, or pnpm
- MySQL database (for production deployment)

## Running Locally

### 1. Install Dependencies

```bash
# Using npm (use --force flag to ensure all dependencies install correctly)
npm install --force

# Using yarn
yarn

# Using pnpm
pnpm install
```

### 2. Start Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Production Deployment

### Option 1: Deploying to an Existing VPS with a Subdomain

If you already have a Node.js server running on a VPS with a subdomain like `node.aibotsite.com`, follow these steps:

1. **SSH into your VPS**

```bash
ssh username@your-vps-ip
```

2. **Navigate to your web directory**

```bash
# This might be different depending on your server setup
cd /var/www/ 
```

3. **Clone the repository**

```bash
git clone https://your-repository-url/matchmaking-front.git
cd matchmaking-front
```

4. **Install dependencies with the force flag**

```bash
npm install --force
```

5. **Build the Next.js application**

```bash
npm run build
```

6. **Run the application using PM2 (if not already installed, run `npm install -g pm2` first)**

```bash
# Start the app on port 3000 (or your preferred port)
pm2 start npm --name "matchmaking-frontend" -- start
```

7. **Configure Nginx for your subdomain**

Create or edit the Nginx configuration file for your subdomain:

```bash
sudo nano /etc/nginx/sites-available/node.aibotsite.com
```

Add this configuration (adjust as needed):

```nginx
server {
    listen 80;
    server_name node.aibotsite.com;

    location / {
        proxy_pass http://localhost:3000;  # Change port if needed
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. **Enable the site and restart Nginx**

```bash
sudo ln -s /etc/nginx/sites-available/node.aibotsite.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

The application will now be accessible at `http://node.aibotsite.com`.

### Option 2: Using Docker

1. **Build the Docker image**

```bash
docker build -t matchmaking-frontend:latest .
```

2. **Run the Docker container**

```bash
docker run -d --name matchmaking-frontend -p 8080:8080 matchmaking-frontend:latest
```

The application will be available at port 8080 on your server.

### Option 3: Manual Deployment

1. **Build the application**

```bash
# Remember to install dependencies first with --force
npm install --force
npm run build
```

2. **Start the production server**

```bash
npm run start
```

By default, the server will run on port 3000. You can change this by setting the `PORT` environment variable.

## Database Configuration

This application provides a web interface for configuring the database connection. No environment variables are required as all configuration can be done through the application itself.

## Troubleshooting

If you encounter any issues:

1. Check your Node.js version (must be 18+)
2. Make sure you've used `npm install --force` to install dependencies
3. Verify your server is correctly configured to forward requests to the Next.js application
4. Check application logs:
   ```bash
   # For PM2 deployment
   pm2 logs matchmaking-frontend
   
   # For Docker deployment
   docker logs matchmaking-frontend
   ```
