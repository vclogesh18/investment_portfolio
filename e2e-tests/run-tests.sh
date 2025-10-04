#!/bin/bash

# Seven Boson Group E2E Test Runner
# Comprehensive test suite for website and admin panel consistency

set -e

echo "🚀 Seven Boson Group E2E Test Suite"
echo "==================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required services are running
check_services() {
    print_status "Checking required services..."
    
    # Check backend API
    if curl -s http://localhost:5001/api/team > /dev/null; then
        print_success "Backend API is running (port 5001)"
    else
        print_error "Backend API is not running on port 5001"
        print_status "Starting backend API..."
        cd ../backend && npm start &
        BACKEND_PID=$!
        sleep 5
    fi
    
    # Check frontend
    if curl -s http://localhost:5174 > /dev/null; then
        print_success "Frontend is running (port 5174)"
    else
        print_warning "Frontend not running on port 5174"
        print_status "Starting frontend..."
        cd .. && npm run dev &
        FRONTEND_PID=$!
        sleep 5
    fi
    
    # Check admin panel
    if curl -s http://localhost:3002 > /dev/null; then
        print_success "Admin panel is running (port 3002)"
    else
        print_warning "Admin panel not running on port 3002"
        print_status "Starting admin panel..."
        cd ../admin-panel && npm run dev &
        ADMIN_PID=$!
        sleep 5
    fi
}

# Install dependencies if needed
install_dependencies() {
    print_status "Installing test dependencies..."
    
    if [ ! -d "node_modules" ]; then
        npm install
        print_success "Dependencies installed"
    else
        print_success "Dependencies already installed"
    fi
    
    # Install Playwright browsers
    print_status "Installing Playwright browsers..."
    npx playwright install
}

# Run specific test suites
run_content_consistency_tests() {
    print_status "Running Content Consistency Tests..."
    echo "📊 Testing website vs admin panel data consistency"
    
    npx playwright test content-consistency.spec.ts --reporter=html
    
    if [ $? -eq 0 ]; then
        print_success "Content Consistency Tests PASSED"
    else
        print_error "Content Consistency Tests FAILED"
        return 1
    fi
}

run_crud_tests() {
    print_status "Running CRUD Operations Tests..."
    echo "🔄 Testing create, read, update, delete operations"
    
    npx playwright test crud-operations.spec.ts --reporter=html
    
    if [ $? -eq 0 ]; then
        print_success "CRUD Operations Tests PASSED"
    else
        print_error "CRUD Operations Tests FAILED"
        return 1
    fi
}

run_performance_tests() {
    print_status "Running Performance & Reliability Tests..."
    echo "⚡ Testing response times and data integrity"
    
    npx playwright test performance-reliability.spec.ts --reporter=html
    
    if [ $? -eq 0 ]; then
        print_success "Performance & Reliability Tests PASSED"
    else
        print_error "Performance & Reliability Tests FAILED"
        return 1
    fi
}

# Generate comprehensive test report
generate_report() {
    print_status "Generating comprehensive test report..."
    
    TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
    REPORT_DIR="test-reports/${TIMESTAMP}"
    mkdir -p "${REPORT_DIR}"
    
    # Copy test results
    if [ -d "playwright-report" ]; then
        cp -r playwright-report "${REPORT_DIR}/"
    fi
    
    if [ -f "test-results.json" ]; then
        cp test-results.json "${REPORT_DIR}/"
    fi
    
    # Generate summary
    cat > "${REPORT_DIR}/summary.md" << EOF
# Seven Boson Group E2E Test Report
Generated: $(date)

## Test Summary
- **Content Consistency**: Website vs Admin Panel data verification
- **CRUD Operations**: Create, Read, Update, Delete functionality
- **Performance**: API response times and page load speeds
- **Reliability**: Data integrity and error handling

## Services Tested
- Frontend: http://localhost:5174
- Admin Panel: http://localhost:3002  
- Backend API: http://localhost:5001

## Test Coverage
- ✅ Team Members CRUD
- ✅ Portfolio Companies CRUD
- ✅ Page Content Consistency
- ✅ API Performance
- ✅ Cross-browser Compatibility
- ✅ Data Integrity

## Files Included
- playwright-report/: Detailed HTML report
- test-results.json: Machine-readable results
- summary.md: This summary file

## View Results
Open playwright-report/index.html in your browser for detailed results.
EOF

    print_success "Test report generated: ${REPORT_DIR}"
    print_status "Open ${REPORT_DIR}/playwright-report/index.html to view detailed results"
}

# Cleanup function
cleanup() {
    print_status "Cleaning up test processes..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$ADMIN_PID" ]; then
        kill $ADMIN_PID 2>/dev/null || true
    fi
}

# Trap to cleanup on exit
trap cleanup EXIT

# Main execution
main() {
    print_status "Starting Seven Boson Group E2E Test Suite..."
    
    # Change to test directory
    cd "$(dirname "$0")"
    
    # Setup
    install_dependencies
    check_services
    
    # Wait for services to stabilize
    print_status "Waiting for services to stabilize..."
    sleep 10
    
    # Run test suites
    TESTS_PASSED=0
    TESTS_TOTAL=3
    
    if run_content_consistency_tests; then
        ((TESTS_PASSED++))
    fi
    
    if run_crud_tests; then
        ((TESTS_PASSED++))
    fi
    
    if run_performance_tests; then
        ((TESTS_PASSED++))
    fi
    
    # Generate report
    generate_report
    
    # Final summary
    echo ""
    echo "🎯 TEST SUITE COMPLETE"
    echo "====================="
    echo "Tests Passed: ${TESTS_PASSED}/${TESTS_TOTAL}"
    
    if [ $TESTS_PASSED -eq $TESTS_TOTAL ]; then
        print_success "All tests passed! 🎉"
        exit 0
    else
        print_error "Some tests failed. Check the report for details."
        exit 1
    fi
}

# Run with command line options
case "${1:-}" in
    "content")
        install_dependencies && check_services && run_content_consistency_tests
        ;;
    "crud")
        install_dependencies && check_services && run_crud_tests
        ;;
    "performance")
        install_dependencies && check_services && run_performance_tests
        ;;
    "report")
        npx playwright show-report
        ;;
    "install")
        install_dependencies
        ;;
    *)
        main
        ;;
esac