import shutil
import os

folder_path = "C:\Users\erwomack\Documents\WORKDOCS_DOSSIER_SYNC\obsidian_whistle"

if os.path.exists(folder_path):
    shutil.rmtree(folder_path)
    print("Obsidian Whistle folder wiped.")
else:
    print("Target folder not found.")
