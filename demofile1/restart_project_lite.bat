@echo off
echo Stopping all containers...
docker-compose -f docker-compose.lite.yml down

echo Removing old client build cache...
docker-compose -f docker-compose.lite.yml rm -f client

echo Starting fresh build...
docker-compose -f docker-compose.lite.yml up --build --force-recreate
pause
