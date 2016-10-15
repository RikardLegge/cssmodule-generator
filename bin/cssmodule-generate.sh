#!/usr/bin/env bash

FILEPATH=$(pwd)/$1
cd "$(dirname "$0")"

node ../index.js "$FILEPATH" $2 $3