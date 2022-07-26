#!/bin/bash
#################################################################
#                                                               #
# Copyright (c) 2022 YottaDB LLC and/or its subsidiaries.       #
# All rights reserved.                                          #
#                                                               #
#	This source code contains the intellectual property	#
#	of its copyright holder(s), and is made available	#
#	under a license.  If you do not know the terms of	#
#	the license, please stop and do not read further.	#
#                                                               #
#################################################################
source /YDBGUI/dev

if [ "$1" = "test" ]; then 
	if [ ! -f /YDBGUI/wwwroot/index.html ]; then
		echo "You must mount wwwroot to /YDBGUI/wwwroot to run tests"
		exit -1
	fi
	cd /YDBGUI/wwwroot
	yottadb -run job^%ydbgui
	echo "Running tests..."
	echo "Ctrl-C twice to stop..."
	exec npm test
elif [ "$1" = "shell" ] || [ "$1" = "bash" ]; then
	echo "Starting shell..."
	exec /bin/bash
else
	echo "Starting the Server..."
	echo "Ctrl-\ to stop"
	if [ -f /YDBGUI/wwwroot/index.html ]; then
		cd /YDBGUI/wwwroot
	fi
	exec yottadb -run start^%ydbgui
fi
