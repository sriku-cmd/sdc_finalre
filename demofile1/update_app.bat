@echo off
echo ========================================
echo Updating Application
echo ========================================
echo.
echo Rebuilding server and client...
docker-compose -f docker-compose.lite.yml up --build -d

echo.
echo ========================================
echo Update complete!
echo ========================================
pause
