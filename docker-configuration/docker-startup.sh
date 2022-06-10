#!/bin/bash
#################################################################
#                                                               #
# Copyright (c) 2022 YottaDB LLC and/or its subsidiaries.       #
# All rights reserved.                                          #
#                                                               #
#	This source code contains the intellectual property         #
#	of its copyright holder(s), and is made available           #
#	under a license.  If you do not know the terms of           #
#	the license, please stop and do not read further.           #
#                                                               #
#################################################################
cd /YDBGUI/wwwroot
export ydb_routines="/YDBGUI/objects*(/YDBGUI/routines)"
source /opt/yottadb/current/ydb_env_set
yottadb -run %XCMD 'do start^%webreq(8089,0,"",1,0,"",1)'