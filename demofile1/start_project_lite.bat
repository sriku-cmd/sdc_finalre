@echo off
echo Starting SocioSphere (Lite Mode)...
echo This mode runs ONLY the App, Database, and Worker.
echo Monitoring tools (Elasticsearch, Grafana, etc.) are disabled to save memory.
docker-compose -f docker-compose.lite.yml up --build
pause
