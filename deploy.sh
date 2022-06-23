#!/usr/bin/env sh

# abort on errors
set -e

# build
#npm run build

ossutil rm oss://bsformbuilder/ -rf
ossutil cp -rf ./index.html  oss://bsformbuilder/index.html
ossutil cp -rf ./custom.html  oss://bsformbuilder/custom.html
ossutil cp -rf ./build  oss://bsformbuilder/build
ossutil cp -rf ./dist  oss://bsformbuilder/dist
ossutil cp -rf ./src  oss://bsformbuilder/src
