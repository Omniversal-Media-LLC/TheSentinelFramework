#!/bin/bash

FOLDER_PATH="C:\Users\erwomack\Documents\WORKDOCS_DOSSIER_SYNC\obsidian_whistle"

if [ -d "$FOLDER_PATH:]; then
    rm -rf "$FOLDER_PATH"
    echo "Obsidian Whistle folder wiped."
else
    echo "Target folder not found."
fi
