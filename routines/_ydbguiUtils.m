%ydbguiUtils ; YottaDB Utils entry points; 05-07-2021
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
; --------------------------------------------
; --------------------------------------------
; OS
; --------------------------------------------
; --------------------------------------------
runShell(command,return,shell)
	; The shell parameter is used to use an alternative shell (like bash)
	new device,counter,string,currentdevice
	;
	set shell=$get(shell,"/bin/sh")
	set counter=0
	set currentdevice=$io
	set device="runshellcommmandpipe"_$job
	;
	open device:(shell=shell:command=command:readonly)::"pipe"
	use device for  quit:$zeof=1  read string:2 set return($increment(counter))=string quit:'$test
	close device if $get(return(counter))="" kill return(counter)
	use currentdevice
	quit $zclose
	;
	;
runIntShell(command,sendCmd,return)
	new device,counter,string,currentdevice
	;
	set counter=0
	set currentdevice=$io
	set device="runshellcommmandpipe"_$job
	;
	open device:(shell="/bin/sh":command=command)::"pipe"
	use device 
	for  quit:$zeof=1  read string:.015 set return($increment(counter))=string quit:'$test
	write sendCmd,!
	for  quit:$zeof=1  read string:.015 set return($increment(counter))=string quit:'$test
	close device if $get(return(counter))="" kill return(counter)
	use currentdevice
	quit $zclose
	;
	;
; ****************************************************************
; tryCreateFile(filename)
;
; PARAMS:
; filename		string
; RETURNS:
; >0				OK
; 0					Could NOT create the file
; ****************************************************************
tryCreateFile(dir)
	new ret,io,file
	new $ztrap,$etrap
	;
	set ret=0
	set $ztrap="goto tryCreateFileQuit"
	;
	; Create the file
	set file=dir_"/~tmp"
	open file:NEWVERSION
	close file:DELETE
	;
	set ret=1
	;
tryCreateFileQuit
	quit ret
	;
	;
; ****************************************************************
; terminateProcess(pid)
;
; PARAMS:
; pid		number
; RETURNS:
; <0 				Shell error
; >0 <99996			Shell error
; 99997				Not enough rights
; 99998				Not a YDB process
; 99999				No such process
; 0					Ok
; ****************************************************************
terminateProcess(pid)
	new ret,shellResult
	;
	; And it is a yottadb process
	kill shellResult
	set ret=$$runShell^%ydbguiUtils("grep libyottadb.so /proc/"_pid_"/maps",.shellResult)
	; Not a YDB process
	if $data(shellResult)=0 set ret=99998 goto terminateProcessQuit
	; Process not running
	if $find($get(shellResult(1)),"No such") set ret=99999 goto terminateProcessQuit
	;
	; Terminate it
	set ret=$$runShell^%ydbguiUtils("$ydb_dist/mupip stop "_pid,.shellResult)
	if $find($get(shellResult(1)),"not permitted") set ret=99997
	;
terminateProcessQuit
	quit ret
	;
	;
; --------------------------------------------
; --------------------------------------------
; STRINGS
; --------------------------------------------
; --------------------------------------------
strRemoveExtraSpaces(string)
	new cnt,newString,toggle,char
	;
	set toggle=0,newString=""
	for cnt=1:1:$length(string) do
	. set char=$extract(string,cnt)
	. if char=" " do
	. . if toggle=0 set newString=newString_char,toggle=1
	. else  set newString=newString_char,toggle=0
	;
	quit newString
