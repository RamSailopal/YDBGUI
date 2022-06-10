%weburl ;YottaDB/CJE -- URL Matching routine;2019-11-14  11:14 AM
	;#################################################################
	;#                                                               #
	;# Copyright (c) 2022 YottaDB LLC and/or its subsidiaries.       #
	;# All rights reserved.                                          #
	;#                                                               #
	;#   This source code contains the intellectual property         #
	;#   of its copyright holder(s), and is made available           #
	;#   under a license.  If you do not know the terms of           #
	;#   the license, please stop and do not read further.           #
	;#                                                               #
	;#################################################################
	;
	quit
	;
	; This routine is used to map URLs to entry points under
	; the URLMAP entry point. ;
	;
URLMAP ;
	;;GET ping ping^%webapi
	;;GET api/regions/{region}/ getRegion^%ydbguiRest
	;;GET api/dashboard/getAll getDashboard^%ydbguiRest
	;;DELETE api/regions/{region}/ deleteRegion^%ydbguiRest
	;;POST api/regions/{region}/createDb createDb^%ydbguiRest
	;;POST api/regions/{region}/extend extendRegion^%ydbguiRest
	;;POST api/regions/{region}/journalSwitch journalSwitch^%ydbguiRest
	;;zzzzz
