@echo off
echo ==========================================
echo Publishing Website Updates to Cloudflare...
echo ==========================================
echo.

git add .
git commit -m "Content update via local CMS"
git push -u origin main

echo.
echo ==========================================
echo Updates pushed successfully! 
echo Cloudflare will now build and deploy your changes.
echo This usually takes about 1 minute.
echo ==========================================
pause
