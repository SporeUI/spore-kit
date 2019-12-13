#!/bin/bash
path=$1
files=$(ls $path)
for filename in $files
do
	cmd="npx documentation build ./packages/$filename/index.js -f md -o ./docs-src/packages/$filename.md --markdown-toc false --np";
	$cmd
done
