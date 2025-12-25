@echo off
cd /d "%~dp0"
echo Copying evidence files from .idea\update-files to evidence...

if not exist "evidence" mkdir "evidence"

xcopy /y ".idea\update-files\Jon_Con.pdf" "evidence\"
xcopy /y ".idea\update-files\Nail-In-Coffin.PDF" "evidence\"
xcopy /y ".idea\update-files\please_provide.pdf" "evidence\"
xcopy /y ".idea\update-files\ethics_manifest.csv" "evidence\"
xcopy /y ".idea\update-files\Luke_Seely_RME_Map.pdf" "evidence\"
xcopy /y ".idea\update-files\Sara_Wright_RME_Map.pdf" "evidence\"
xcopy /y ".idea\update-files\Jon_Templeton_RME_Map.pdf" "evidence\"
xcopy /y ".idea\update-files\Ethan_Womack_TPA4_Log_copy.pdf" "evidence\"
xcopy /y ".idea\update-files\Rme Case Study Training Slides.pdf" "evidence\"

echo.
echo Copy process complete.
pause