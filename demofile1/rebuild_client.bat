@echo off
echo ========================================
echo Quick Rebuild - Client Only
echo ========================================
echo Stopping client container...
docker-compose -f docker-compose.lite.yml stop client

echo Rebuilding client...
docker-compose -f docker-compose.lite.yml build --no-cache client

echo Starting client...
docker-compose -f docker-compose.lite.yml up -d client

echo.
echo ========================================
echo Client rebuilt! Refresh your browser.
echo ========================================
pause
