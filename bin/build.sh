#!/usr/bin/env bash

cd "$(dirname "$0")"

rm -rf ../test/*
rm -rf ../lib/*

../node_modules/.bin/babel -d ../test ../src/test
../node_modules/.bin/babel -d ../lib ../src/lib