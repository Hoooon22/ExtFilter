#!/bin/bash

# ExtFilter Application Startup Script
# This script starts the integrated Spring Boot application with embedded frontend

echo "Starting ExtFilter Application..."

# Set environment variables for database connection
export DB_URL=${DB_URL:-jdbc:mysql://localhost:3306/extfilter}
export DB_USERNAME=${DB_USERNAME:-root}
export DB_PASSWORD=${DB_PASSWORD:-password}

# Create logs directory if it doesn't exist
mkdir -p logs

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "Port $1 is already in use. Stopping existing process..."
        kill -9 $(lsof -Pi :$1 -sTCP:LISTEN -t) 2>/dev/null
        sleep 2
    fi
}

# Stop existing processes
echo "Checking for existing processes..."
check_port 8080  # Application port

# Frontend is now permanently located in Backend/src/main/frontend
echo "Frontend is integrated in Backend/src/main/frontend"

# Build and start integrated application
echo "Building and starting integrated application..."
cd Backend
nohup ./gradlew bootRun > ../logs/application.log 2>&1 &
APP_PID=$!
echo $APP_PID > ../logs/application.pid
echo "Application started with PID: $APP_PID"
cd ..

# Display status
echo ""
echo "==========================================="
echo "ExtFilter Application Started Successfully!"
echo "==========================================="
echo "Application: http://localhost:8080"
echo ""
echo "Logs:"
echo "  Application: tail -f logs/application.log"
echo ""
echo "To stop services: ./stop.sh"
echo "==========================================="