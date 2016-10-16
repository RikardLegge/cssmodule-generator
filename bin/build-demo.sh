#!/usr/bin/env bash

cd "$(dirname "$0")"

rm -rf ../demo-data/tmp
rm -rf ../demo-data/build

rsync -am --exclude='*.css' ../demo-data/src/ ../demo-data/tmp
./cssmodule-generate.sh --pattern="{unique}__{hash}__{random}__{namespace}__{name}" --modules=es6 --cssOutFile="../demo-data/build/demo.css" --jsOutDir="../demo-data/tmp" "../demo-data/src"
../node_modules/.bin/rollup -i ../demo-data/tmp/demo.js -o ../demo-data/build/demo.js

cp ../demo-data/src/demo.html ../demo-data/build/index.html

rm -rf ../demo-data/tmp