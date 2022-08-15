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
	do portIsOpen(options("port"))
	do setzd
	;
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
	do portIsOpen(options("port"))
	do setzd
	;
	; params: port, debug, tlsconfig, nogbl, trace, user:pass, nogzip
	do start^%webreq(options("port"),0,"",1,0,"",1)
	quit
	;
stop	; [Public] Stop Web Server
	; Find PID first using fuser
	new pids,pid,fuserOutput,shellStatus
	new utf8subdir set utf8subdir=$select($zchset="UTF-8":"utf8/",1:"")
	set shellStatus=$$runShell^%ydbguiUtils("fuser $ydb_dist/plugin/o/"_utf8subdir_"_ydbgui.so",.fuserOutput)
	if shellStatus=1 write "`fuser` reports no web server is running",! quit
	else  if shellStatus>1 write "Failed to run fuser",! quit
	;
	set pids=$piece(fuserOutput(1),": ",2)
	;
	new i for i=1:1:$length(pids," ") set pid=$piece(pids," ",i) do
	. set pid=+pid ; remove the m at the end
	. if pid=$job quit  ; this is us. Don't terminate self.
	. ;
	. new mupipOutput
	. set shellStatus=$$runShell^%ydbguiUtils("$ydb_dist/mupip stop "_pid,.mupipOutput)
	. if shellStatus write "Failed to run mupip stop",! quit
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
	;
portIsOpen(port) ; [$$ Private] Check if port is open
	open "porttest":(connect="127.0.0.1:"_options("port")_":TCP":delim=$char(13,10):attach="client"):0:"SOCKET"
	if $test do  quit
	. write "Port "_options("port")_" is currently being used.",!
	. write "Checking if it is the YDBGUI.",!
	. ;
	. use "porttest"
	. write "GET /ping HTTP/1.1"_$char(13,10)
	. write "Host: localhost:"_options("port")_$char(13,10)
	. write "User-Agent: "_$zposition_$char(13,10)
	. write "Accept: */*"_$char(13,10)_$char(13,10)
	. new httpstatus read httpstatus
	. use $principal
	. write httpstatus,!
	. use "porttest"
	. new body 
	. do  close "porttest"
	. . if httpstatus'["200 OK" use $principal write "Not a YottaDB GUI Server",! quit
	. . new i for i=1:1 read header(i) quit:header(i)=""  set headerByType($piece(header(i),": "))=$piece(header(i),": ",2,99)
	. . if '$data(headerByType("Content-Length")) use $principal write "No Content-Length header",! quit
	. . read body#headerByType("Content-Length"):0
	. use $principal
	. write body,!
	. new parsedBody,error do decode^%webjson($na(body),$na(parsedBody),$na(error))
	. if $data(error) write "Error parsing Web Server response",!
	. ;
	. write "YDBGUI Server is currently running",!
	. new shellStatus,fuserOutput
	. set shellStatus=$$runShell^%ydbguiUtils("fuser "_options("port")_"/tcp",.fuserOutput)
	. if shellStatus=1 write "Something went wrong... Contact YottaDB Support.",! quit
	. new pid set pid=$$FUNC^%TRIM($piece(fuserOutput(1),":",2))
	. write "fuser says that this is the PID: "_pid,!
	. ;
	. write "Now going to stop it...",!
	. new mupipOutput
	. set shellStatus=$$runShell^%ydbguiUtils("$ydb_dist/mupip stop "_pid,.mupipOutput)
	. if shellStatus write "Failed to run mupip stop",! quit
	. write mupipOutput(1),!
	quit
