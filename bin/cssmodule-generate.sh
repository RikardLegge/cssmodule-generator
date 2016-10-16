#!/usr/bin/env bash

WORKINGDIRECTORY="$(pwd)"
cd "$(dirname "$0")"

node ../index.js --workningDirectory="$WORKINGDIRECTORY" $@