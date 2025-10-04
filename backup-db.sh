#!/bin/bash

# Seven Boson Group - Database Backup Script
# Creates a timestamped backup of the PostgreSQL database

echo "📦 Seven Boson Group - Database Backup"
echo "======================================"

# Default values
DB_USER="seven_boson"
DB_NAME="seven_boson_cms"
DB_HOST="localhost"
BACKUP_DIR="./database/backups"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/seven_boson_backup_$TIMESTAMP.sql"

echo "📋 Backup Configuration:"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   Host: $DB_HOST"
echo "   Output: $BACKUP_FILE"
echo ""

# Check if PostgreSQL is available
if ! command -v pg_dump &> /dev/null; then
    echo "❌ Error: pg_dump not found. Please ensure PostgreSQL is installed."
    exit 1
fi

# Perform backup
echo "🔄 Creating backup..."
if pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_FILE"; then
    echo "✅ Backup created successfully!"
    echo "📁 Location: $BACKUP_FILE"
    
    # Get file size
    if command -v stat &> /dev/null; then
        SIZE=$(stat -f%z "$BACKUP_FILE" 2>/dev/null || stat -c%s "$BACKUP_FILE" 2>/dev/null)
        if [ ! -z "$SIZE" ]; then
            SIZE_MB=$((SIZE / 1024 / 1024))
            echo "📊 Size: ${SIZE_MB}MB"
        fi
    fi
    
    echo ""
    echo "💡 Restore command:"
    echo "   psql -U $DB_USER -d $DB_NAME < $BACKUP_FILE"
    
else
    echo "❌ Backup failed!"
    echo "Please check:"
    echo "   - PostgreSQL is running"
    echo "   - Database credentials are correct"
    echo "   - You have read permissions on the database"
    exit 1
fi

# Clean up old backups (keep last 10)
echo ""
echo "🧹 Cleaning up old backups (keeping last 10)..."
cd "$BACKUP_DIR"
ls -t seven_boson_backup_*.sql 2>/dev/null | tail -n +11 | xargs rm -f
REMAINING=$(ls seven_boson_backup_*.sql 2>/dev/null | wc -l)
echo "📁 $REMAINING backup files remaining"

echo ""
echo "✨ Backup completed successfully!"