#!/bin/bash
clear
npm run build-app
#node --max_old_space_size=10000 dist/admin-reports.js

if [ "$#" -eq "0" ]; then
    node --max_old_space_size=10000 dist/admin-reports.js
else
    node --max_old_space_size=10000 dist/admin-reports.js $1 $2 $3 $4
fi
