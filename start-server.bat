@echo off
echo ===================================================
echo Starting Subham's Portfolio Local Server...
echo ===================================================
echo Opening http://localhost:8080 in your default browser...
start http://localhost:8080
python -m http.server 8080
pause
