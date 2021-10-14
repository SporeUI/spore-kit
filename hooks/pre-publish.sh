#!/bin/sh
branch=$(git rev-parse --symbolic --abbrev-ref HEAD)
if [ "master" != "$branch" ]; then
  echo ".git/hooks: Must publish package from branch: master"
  exit 1
fi
