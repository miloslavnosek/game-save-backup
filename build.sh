#!/bin/sh

npm run pkg

for file in build/app-*; do
    mv "$file" "build/game-save-backup-${file#build/app-}"
done
