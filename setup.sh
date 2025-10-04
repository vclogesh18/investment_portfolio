#!/bin/bash

echo "🚀 Seven Boson Group - Project Setup Script"
echo "============================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 12+ and ensure it's running"
    echo "📚 Installation guide: ./database/README.md"
    exit 1
fi

echo "✅ PostgreSQL found"

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL service"
    echo "   macOS: brew services start postgresql"
    echo "   Linux: sudo systemctl start postgresql"
    exit 1
fi

echo "✅ PostgreSQL is running"

echo ""
echo "📦 Installing dependencies..."

# Install main project dependencies
echo "Installing main website dependencies..."
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install admin panel dependencies
echo "Installing admin panel dependencies..."
cd admin-panel
npm install
cd ..

echo ""
echo "⚙️ Setting up environment configuration..."

# Copy environment file template
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from template"
    echo "⚠️  Please edit backend/.env with your database credentials"
else
    echo "⚠️  backend/.env already exists - skipping"
fi

echo ""
echo "🗄️ Database setup..."

read -p "Do you want to set up the database now? (y/N): " setup_db

if [[ $setup_db =~ ^[Yy]$ ]]; then
    echo ""
    echo "📋 Database setup options:"
    echo "1. I have already created the database and user"
    echo "2. I need help creating the database and user"
    echo "3. Skip database setup for now"
    echo ""
    
    read -p "Choose an option (1-3): " db_option
    
    case $db_option in
        1)
            echo "Importing database schema..."
            read -p "Database user name [seven_boson]: " db_user
            db_user=${db_user:-seven_boson}
            
            read -p "Database name [seven_boson_cms]: " db_name
            db_name=${db_name:-seven_boson_cms}
            
            if psql -U "$db_user" -d "$db_name" -f database/schema.sql; then
                echo "✅ Database schema imported successfully"
            else
                echo "❌ Failed to import database schema"
                echo "📚 See database/README.md for manual setup instructions"
            fi
            ;;
        2)
            echo ""
            echo "📚 Please follow the database setup guide:"
            echo "   ./database/README.md"
            echo ""
            echo "Then run this script again or import the schema manually:"
            echo "   psql -U seven_boson -d seven_boson_cms -f database/schema.sql"
            ;;
        3)
            echo "⚠️  Skipping database setup"
            echo "📚 Setup guide: ./database/README.md"
            ;;
    esac
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit backend/.env with your database credentials"
echo "2. Ensure your database is set up (see database/README.md)"
echo "3. Start the application:"
echo "   ./start-cms.sh"
echo ""
echo "🌐 Access points after starting:"
echo "   • Main Website: http://localhost:5173"
echo "   • Admin Panel: http://localhost:3001"
echo "   • Backend API: http://localhost:5001"
echo ""
echo "🔐 Default admin login:"
echo "   • Email: admin@sevenboson.com"
echo "   • Password: admin123"
echo "   ⚠️  Change these credentials after first login!"
echo ""
echo "📚 Documentation:"
echo "   • Project README: ./README.md"
echo "   • Database Setup: ./database/README.md"
echo "   • AI Guidelines: ./.github/copilot-instructions.md"