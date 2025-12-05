@echo off
echo ===================================================
echo      SOCIOSPHERE MASTER RESET SCRIPT
echo ===================================================
echo.
echo This script will:
echo 1. Stop all running parts of the app.
echo 2. DELETE all data (users, posts) for a fresh start.
echo 3. Rebuild the application with the new designs.
echo 4. Start everything up.
echo.
echo Please wait... this might take 3-5 minutes.
echo ===================================================
echo.

echo [1/4] Stopping containers and removing old data...
docker-compose -f docker-compose.lite.yml down -v

echo [2/4] Cleaning up old builds...
docker system prune -f

echo [3/4] Rebuilding and starting the application...
docker-compose -f docker-compose.lite.yml up --build -d

echo.
echo ===================================================
echo [4/4] DONE!
echo.
echo Please wait about 30 seconds for the server to initialize.
echo Then open your browser to: http://192.168.29.204:3000
echo ===================================================
pause
