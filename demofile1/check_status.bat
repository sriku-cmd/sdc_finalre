@echo off
echo ========================================
echo Checking Docker Containers Status
echo ========================================
docker ps --format "table {{.Names}}\t{{.Status}}"
echo.
echo ========================================
echo Checking Server Logs (last 20 lines)
echo ========================================
docker-compose -f docker-compose.lite.yml logs --tail 20 server
echo.
echo ========================================
echo Testing Server Connection
echo ========================================
curl http://localhost:5000 2>nul || echo Server not responding on port 5000
echo.
pause
