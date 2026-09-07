#!/bin/sh
# Bring the Shadow Shinobi preview back after hibernate/revive.
set -eu
cd /workspace
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev > /tmp/shadow-shinobi-dev.log 2>&1 &
exit 0
