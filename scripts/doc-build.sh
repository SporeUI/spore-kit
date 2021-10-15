#!/bin/bash
path=$1
files=$(ls $path)
for filename in $files
do
	cmd="npx documentation build ./index.js -f md -o ./docs/docs.md --markdown-toc false --np";
	$cmd
done
