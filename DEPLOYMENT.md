# Deployment Guide - Matchmaking Frontend

This guide will help you deploy the Matchmaking Frontend application using Docker.

## Prerequisites

- Docker installed on your server
- MySQL database server accessible from your deployment server

## Deployment Steps

### 1. Build the Docker Image

```bash
# Navigate to the project directory
cd matchmaking-front

# Build the Docker image
docker build -t matchmaking-frontend:latest .
```

### 2. Run the Docker Container

```bash
# Run the container on port 8080
docker run -d --name matchmaking-frontend -p 8080:8080 matchmaking-frontend:latest
```

### 3. Configure Database Connection

Once your application is running, you can configure the database connection through the web interface:

1. Navigate to `http://your-server-ip:8080/settings/database`
2. Enter your MySQL database connection details
3. Click "Test Connection" to verify connectivity
4. Save the configuration

The application will immediately use the new configuration without requiring a restart.

## Environment Variables (Optional)

You can also set default database configuration using environment variables when starting the container:

```bash
docker run -d --name matchmaking-frontend \
  -p 8080:8080 \
  -e MYSQL_HOST=your-db-host \
  -e MYSQL_PORT=3306 \
  -e MYSQL_USER=your-db-user \
  -e MYSQL_PASSWORD=your-db-password \
  -e MYSQL_DATABASE=your-db-name \
  matchmaking-frontend:latest
```

## Deployment Considerations

### Data Persistence

The database configuration is stored in the browser's localStorage, which means:

1. Users will need to configure database connection once per browser
2. If the user clears their browser storage, they'll need to re-configure

For more robust production deployments, consider:
- Setting environment variables on the server
- Implementing a backend service to store and retrieve database configurations

### Security

1. In production, consider adding authentication to the database configuration page
2. Use HTTPS to encrypt database credentials in transit
3. Store sensitive credentials in secure environment variables rather than code

### Monitoring

Monitor your application for:
- Database connection errors
- Memory usage
- Response times

## Troubleshooting

If you encounter database connection issues:

1. Check if your database server is accessible from the Docker container
2. Verify the connection details are correct
3. Check the application logs:
   ```bash
   docker logs matchmaking-frontend
   ```
4. Test your database connection from outside the container

## Scaling

For horizontal scaling:
1. Use a load balancer in front of multiple containers
2. Consider implementing a centralized configuration service
3. Use a database connection pool to manage connections efficiently 