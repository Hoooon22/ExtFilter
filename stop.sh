#!/bin/bash

# ExtFilter Application Stop Script
# This script stops the integrated Spring Boot application

echo "Stopping ExtFilter Application..."

# Function to stop a service by PID file
stop_service() {
    SERVICE_NAME=$1
    PID_FILE=$2
    
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo "Stopping $SERVICE_NAME (PID: $PID)..."
            kill -9 $PID
            if [ $? -eq 0 ]; then
                echo "$SERVICE_NAME stopped successfully"
            else
                echo "Failed to stop $SERVICE_NAME"
            fi
        else
            echo "$SERVICE_NAME is not running"
        fi
        rm -f "$PID_FILE"
    else
        echo "No PID file found for $SERVICE_NAME"
    fi
}

# Stop application
stop_service "Application" "logs/application.pid"

# Kill any remaining processes on port 8080
echo "Checking for any remaining processes..."
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Killing remaining processes on port 8080..."
    kill -9 $(lsof -Pi :8080 -sTCP:LISTEN -t) 2>/dev/null
fi

echo ""
echo "================================="
echo "ExtFilter Application Stopped!"
echo "================================="