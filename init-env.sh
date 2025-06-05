#!/bin/bash
find . -name "example.env" | while read f; do
  target="$(dirname "$f")/.env"
  if [ ! -f "$target" ]; then
    cp "$f" "$target"
    # echo "Copied $f -> $target"
  fi
done