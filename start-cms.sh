#!/bin/bash

echo "🚀 Starting Seven Boson Group CMS..."
echo ""

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found. Please run this from the project root."
    exit 1
fi

# Check if admin-panel directory exists
if [ ! -d "admin-panel" ]; then
    echo "❌ Admin panel directory not found. Please run this from the project root."
    exit 1
fi

echo "📦 Installing any missing dependencies..."

# Install backend dependencies
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi
cd ..

# Install admin panel dependencies
cd admin-panel
if [ ! -d "node_modules" ]; then
    echo "Installing admin panel dependencies..."
    npm install
fi
cd ..

echo ""
echo "🔥 Starting servers..."
echo ""

# Start backend in background
echo "Starting backend API server on port 5001..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start admin panel in background
echo "Starting admin panel on port 3001..."
cd admin-panel
npm run dev &
ADMIN_PID=$!
cd ..

echo ""
echo "✅ Seven Boson Group CMS is starting up!"
echo ""
echo "🌐 Backend API: http://localhost:5001"
echo "🖥️  Admin Panel: http://localhost:3001"
echo ""
echo "📧 Login credentials:"
echo "   Email: admin@sevenboson.com"
echo "   Password: admin123"
echo ""
echo "⚡ Press Ctrl+C to stop all servers"
echo ""

# Function to handle cleanup
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $ADMIN_PID 2>/dev/null
    echo "✅ All servers stopped."
    exit 0
}

# Set trap to handle Ctrl+C
trap cleanup INT

# Wait for user to press Ctrl+C
wait