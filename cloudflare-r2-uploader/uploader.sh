#!/bin/bash
DIRECTORY="fontawesome"

# Check if the directory exists
if [ -d "$DIRECTORY" ]; then
    # Use find to list all files in directory and subdirectories
    find "$DIRECTORY" -type f | while read file; do
        echo "File: $file"
        # Upload each file using wrangler
        wrangler r2 object put "$file" --file "$file"
    done
else
    echo "Directory does not exist."
fi