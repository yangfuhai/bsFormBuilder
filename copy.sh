#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

cp ./dist/* /Users/michael/work/git/jpress5/jpress-web/src/main/webapp/static/components/bs-form-builder
