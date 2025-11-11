@echo off
set folder="C:\Users\erwomack\Documents\WORKDOCS_DOSSIER_SYNC\obsidian_whistle"

if exist %folder% (
    rmdir /s /q %folder%
    echo Obsidian Whistle folder wiped.
) else (
    echo Target folder not found.
)
