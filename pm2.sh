#!/bin/bash
pm2 start ./dist/src/main.js --watch --ignore-watch="node_modules" -i -2 --max-memory-restart <100MB>
