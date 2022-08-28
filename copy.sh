#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

cp ./src/* /Users/michael/work/git/jpress5/jpress-web/src/main/webapp/static/components/bs-form-builder
cp ./dist/* /Users/michael/work/git/jpress5/jpress-web/src/main/webapp/static/components/bs-form-builder

cp ./src/* /Users/michael/work/git/JPressPro/jpress-web/jpress-web-admin/src/main/webapp/static/components/bs-form-builder
cp ./dist/* /Users/michael/work/git/JPressPro/jpress-web/jpress-web-admin/src/main/webapp/static/components/bs-form-builder
