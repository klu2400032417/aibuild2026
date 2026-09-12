import os
import re

# Directory to scan (backend root)
root_dir = os.path.dirname(os.path.abspath(__file__))

def refactor_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Remove com.networkiq.supplychain root package line
    new_content = re.sub(r"package com\.networkiq\.supplychain;\s*", "", content)

    # 2. Refactor subpackages (e.g., package com.networkiq.supplychain.config; -> package config;)
    new_content = re.sub(r"package com\.networkiq\.supplychain\.", "package ", new_content)

    # 3. Refactor imports (e.g., import com.networkiq.supplychain.entity.Inventory; -> import entity.Inventory;)
    new_content = re.sub(r"import com\.networkiq\.supplychain\.", "import ", new_content)

    # If changes made, write back
    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Refactored: {os.path.relpath(file_path, root_dir)}")

# Walk through all directories
for dirpath, _, filenames in os.walk(root_dir):
    # Skip Maven bin or target folders
    if ".maven_bin" in dirpath or "target" in dirpath:
        continue
    for f in filenames:
        if f.endswith(".java"):
            refactor_file(os.path.join(dirpath, f))

print("Java files package refactoring complete!")
