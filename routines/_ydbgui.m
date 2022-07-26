%ydbgui ; Start-up code
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
job	; [Public, Default] Non-blocking entry point (server runs in a jobbed off process)
	new options do cmdline(.options)
	if '$data(options("port")) set options("port")=8089
	do setzd
	; params: port, tlsconfig, nogblmode, user:pass, nogzip
	do job^%webreq(options("port"),"",1,"",1)
	quit
	;
start	; [Public] Blocking entry point (listener runs in the foreground)
	; Stop with Ctrl-C
	; Note that Ctrl-C doesn't work in docker... not sure why yet
	use $principal:(ctrap=$char(3):nocenable:exception="halt")
	new options do cmdline(.options)
	if '$data(options("port")) set options("port")=8089
	do setzd
	; params: port, debug, tlsconfig, nogbl, trace, user:pass, nogzip
	do start^%webreq(options("port"),0,"",1,0,"",1)
	quit
	;
stop	; [Public] Stop Web Server
	; Find PID first using fuser
	new pids,pid,fuserOutput
	do runShell^%ydbguiUtils("fuser $ydb_dist/plugin/o/_ydbgui.so",.fuserOutput)
	set pids=$piece(fuserOutput(1),": ",2)
	;
	new i for i=1:1:$length(pids," ") set pid=$piece(pids," ",i) do
	. set pid=+pid ; remove the m at the end
	. if pid=$job quit  ; this is us. Don't terminate self.
	. ;
	. new mupipOutput
	. do runShell^%ydbguiUtils("$ydb_dist/mupip stop "_pid,.mupipOutput)
	. write mupipOutput(1),!
	quit
	;
setzd	; [Private] Set default directory
	; If current directory has an index.html, use that; otherwise,
	; switch to $ydb_dist/plugin/etc/ydbgui
	if $zsearch("index.html")'="" quit  ; Leave $zdirectory to the current directory
	new runtimeDir set runtimeDir=$zsearch("$ydb_dist/plugin/etc/ydbgui")
	if runtimeDir="" set $ecode=",U-directory-not-found,"
	set $zdirectory=runtimeDir
	write "Starting server in directory: "_$zdirectory,!
	quit
	;
cmdline(options) ; [Private] Process command line options
	; Input: .options("port") server port
	new cmdline set cmdline=$zcmdline
	if cmdline="" quit
	do trimleadingstr^%XCMD(.cmdline," ")
	if cmdline="" quit
	for  quit:'$$trimleadingstr^%XCMD(.cmdline,"--")  do ; process options
	. if $$trimleadingstr^%XCMD(.cmdline,"port") do
	.. do trimleadingstr^%XCMD(.cmdline," ")
	.. set options("port")=cmdline
	quit
