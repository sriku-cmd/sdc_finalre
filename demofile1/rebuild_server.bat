@echo off
echo Rebuilding Server...
docker-compose -f docker-compose.lite.yml up -d --build server
echo.
echo Server Rebuilt!
echo Please wait 10-20 seconds for it to start, then refresh your browser.
pause
