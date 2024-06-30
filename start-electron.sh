#!/bin/bash
export DISPLAY=:0
export XAUTHORITY=$HOME/.Xauthority
sleep 1
#/usr/bin/env electron /var/nuclear-football-v2 
cd /var/nuclear-football-v2
npm start
#npx electron . --no-sandbox --trace-warnings > /var/nuclear-football-v2/electron.log 2>&1
