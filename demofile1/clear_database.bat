@echo off
echo ========================================
echo CLEARING ALL USER DATA
echo ========================================
echo.
echo WARNING: This will delete ALL users and posts!
echo.
pause

echo Connecting to MongoDB and clearing collections...
docker exec demofile1-mongo-1 mongosh sociosphere --eval "db.users.deleteMany({}); db.posts.deleteMany({}); print('All users and posts deleted!');"

echo.
echo ========================================
echo Database cleared successfully!
echo You can now start fresh with new registrations.
echo ========================================
pause
