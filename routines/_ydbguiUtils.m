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
runShell(command,return)
	new device,counter,string,currentdevice
	;
	set counter=0
	set currentdevice=$io
	set device="runshellcommmandpipe"_$job
	;
	open device:(shell="/bin/sh":command=command:readonly)::"pipe"
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
	use device for  quit:$zeof=1  read string:.015 set return($increment(counter))=string quit:'$test
	write sendCmd,!
	close device if $get(return(counter))="" kill return(counter)
	use currentdevice
	quit $zclose
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
	;
