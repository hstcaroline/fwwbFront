#!/bin/sh

ROOT=$(dirname "${BASH_SOURCE}")/../..

cd $ROOT
# Kill the process.
pkill node
# Pull the code.
git pull
## Restart the server.
http-server -a 0.0.0.0 -p 8000 &
cd - > /dev/null
