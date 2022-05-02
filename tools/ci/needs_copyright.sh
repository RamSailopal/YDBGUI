#!/bin/sh

#################################################################
#								#
# Copyright (c) 2022 YottaDB LLC and/or its subsidiaries.	#
# All rights reserved.						#
#								#
#	This source code contains the intellectual property	#
#	of its copyright holder(s), and is made available	#
#	under a license.  If you do not know the terms of	#
#	the license, please stop and do not read further.	#
#								#
#################################################################

set -eu

if ! [ $# = 1 ]; then
	echo "usage: $0 <filename>"
	exit 2
fi

file="$1"

# Don't require deleted files to have a copyright
if ! [ -e "$file" ]; then
       exit 1
fi

skipextensions="ref png zwr html ci gif eot woff woff2 ico svg ttf"	# List of extensions that cannot have copyrights.
	# .png .ico .svg gif-> these are images (i.e. binary files) used in the documentation.
	#		Same reason as .rst for not requiring a copyright.
	# .ref  -> reference files used by the test cases (e.g. tests/outref/T0001.ref).
	#		Those have a fixed format and should not go through copyright changes.
	# .zwr  -> zwrite format extract file (does not currently allow a comment character).
	# .html -> there are a couple of files currently under doc/templates which don't need copyrights.
	# .ci   -> e.g. calltab.ci stores the call-in table which does not currently have a provision for comment characters.
	# .eot .woff .woff2 .ttf are font files
if echo "$skipextensions" | grep -q -w "$(echo "$file" | awk -F . '{print $NF}')"; then
	exit 1
fi

# Determines whether a file should need a copyright by its name
# Returns 0 if it needs a copyright and 1 otherwise.
skiplist="COPYING
    README.md
    LICENSE
    .gitignore
    wwwroot/libs/bootstrap-icons.1.8.0/bootstrap-icons.css
    wwwroot/libs/bootstrap.4.6.1/default.min.css
    wwwroot/libs/bootstrap.4.6.1/bootstrap.min.js
    wwwroot/css/bootstrap-icons.css
    wwwroot/libs/jquery.3.5.1/jquery.3.5.1.min.js
    wwwroot/libs/popper.1.16.1/popper.min.js
    package.json"
    for skipfile in $skiplist; do
	if [ "$file" = "$skipfile" ]; then
		exit 1
	fi
done
