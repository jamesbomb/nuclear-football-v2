#!/bin/bash

# Directory to search for .vue files
DIRECTORY=$1

# Temporary file to store the output
TEMP_FILE=$(mktemp)

# Find all .vue files in the specified directory and subdirectories
find "$DIRECTORY" -type f -name "*.vue" | while read -r FILE; do
    echo "File: $FILE" >> "$TEMP_FILE"
    echo "------" >> "$TEMP_FILE"
    cat "$FILE" >> "$TEMP_FILE"
    echo -e "\n\n" >> "$TEMP_FILE"
done

# Copy the content of the temporary file to the clipboard
cat "$TEMP_FILE" | pbcopy

# Remove the temporary file
rm "$TEMP_FILE"

echo "All .vue files have been copied to the clipboard."

