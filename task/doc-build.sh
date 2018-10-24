#!/bin/bash
path=$1
files=$(ls $path)
for filename in $files
do
	cmd="./node_modules/documentation/bin/documentation.js build ./packages/$filename/index.js -f md -o ./docs/packages/$filename.md --markdown-toc false --np";
	$cmd
done
