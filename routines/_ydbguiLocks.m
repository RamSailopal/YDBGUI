%ydbguiLocks ; YottaDB Regions; 05-07-2021
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
; ****************************************************************
; getLocksData(regionName)	; returns a JDOM (JSON global structure) with the lock structure
; ;
; PARAMS:
; regionName		string
; lockData			array byRef
; RETURNS:
; Array with data
; ****************************************************************
getLocksData(regionName)
	new lockBuffer,ret,cnt,lockCnt,waiterCnt,lockData,cnt,noRegion
	;
	set ret=$$runShell^%ydbguiUtils("$ydb_dist/lke show -all -wait -region="_regionName,.lockBuffer)
	quit:ret'=0 ret
	;
	if $find($get(lockBuffer(3)),"%YDB-E-NOREGION") goto getLocksDataQuit
	;
	set noRegion=0
	for cnt=1:1 quit:$data(lockBuffer(cnt))=0  set:$find(lockBuffer(cnt),"%YDB-E-NOREGION") noRegion=1  if ($find(lockBuffer(cnt),"%YDB-E-DBFILERR")=0&($find(lockBuffer(cnt),"%SYSTEM-E-ENO2")=0))!(noRegion=1) quit
	if noRegion goto getLocksDataQuit
	;
	if $find($get(lockBuffer(cnt)),"%YDB-I-LOCKSPACEINFO") do  goto getLocksDataQuit
	. ;no locks found,
	. do parseLockSpaceInfo(lockBuffer(cnt))
	. do parseLockSpaceUse(lockBuffer(cnt+2))
	;
	set (lockCnt,waiterCnt)=0
	for cnt=cnt+1:1 quit:$find($get(lockBuffer(cnt)),"%YDB-I-LOCKSPACEINFO")!($get(lockBuffer(cnt))="")  do
	. if $find(lockBuffer(cnt),"Request")'=0 do  quit
	. . ;waiter found
	. . set waiterCnt=waiterCnt+1
	. . set lockData("locks",lockCnt,"waiters",waiterCnt,"pid")=$piece($piece(lockBuffer(cnt),"=",2)," ",2)
	. if $find(lockBuffer(cnt),"Owned")'=0 do
	. . ;Lock found
	. . set lockCnt=lockCnt+1,waiter=0
	. . set lockData("locks",lockCnt,"node")=$piece(lockBuffer(cnt)," Owned")
	. . set lockData("locks",lockCnt,"pid")=$piece($piece(lockBuffer(cnt),"PID= ",2)," ")
	;
	if $get(lockBuffer(cnt))'="" do
	. do parseLockSpaceInfo(lockBuffer(cnt))
	. set cnt=cnt+$select($find(lockBuffer(cnt+1),"%YDB-I-NOLOCKMATCH"):2,1:1)
	. do parseLockSpaceUse(lockBuffer(cnt))
	;
getLocksDataQuit
	quit *lockData
	;
	;
parseLockSpaceInfo:(string)
	set lockData("processesOnQueue")=$extract($piece($piece(string,":",4),";"),2,999)
	set lockData("slotsInUse")=$extract($piece($piece(string,":",5),";"),2,999)
	set lockData("slotsBytesInUse")=$extract($piece($piece(string,":",6),";"),2,999)
	;
	quit
	;
	;
parseLockSpaceUse:(string)
	set lockData("estimatedFreeLockSpace")=$extract($piece(string,":",2),2,999)
	;
	quit
	;
	;
; ****************************************************************
; getAll()	; returns a JDOM (JSON global structure) with the lock structure
; ;
; PARAMS:
; regionName		string
; lockData			array byRef
; RETURNS:
; Array with data
; ****************************************************************
getAll()
	new lockData,regions,region,lockData,locksData,res,lockNode,pidNode,lock
	new tmpPids,tmpRegions,waiter,waiterCnt,lockCnt,pidCnt,regionCnt,pid
	new ret,shellResult,pidData
	;
	; Collect the data
	do enumRegions^%ydbguiGde(.regions)
	set region="" for  set region=$order(regions(region)) quit:region=""  do
	. set *lockData=$$getLocksData(region)
	. merge:$data(lockData) res("tmp",region)=lockData
	;
	; And reorganize it
	set (lockCnt,regionCnt,pidCnt)=0
	;
	set region="" for  set region=$order(res("tmp",region)) quit:region=""  do
	. if $data(res("tmp",region,"locks")) do
	. . ; We have locks, update region DISTINCT
	. . set tmpRegions(region,"name")=region
	. . set tmpRegions(region,"estimatedFreeLockSpace")=$get(res("tmp",region,"estimatedFreeLockSpace"))
	. . set tmpRegions(region,"processesOnQueue")=$get(res("tmp",region,"processesOnQueue"))
	. . set tmpRegions(region,"slotsBytesInUse")=$get(res("tmp",region,"slotsBytesInUse"))
	. . set tmpRegions(region,"slotsInUse")=$get(res("tmp",region,"slotsInUse"))
	. . ; enum locks
	. . set lock="" for  set lock=$order(res("tmp",region,"locks",lock)) quit:lock=""  do
	. . . ; build lock node
	. . . kill lockNode
	. . . set lockNode("namespace")=res("tmp",region,"locks",lock,"node")
	. . . set lockNode("pid")=res("tmp",region,"locks",lock,"pid")
	. . . set tmpPids(lockNode("pid"))=""	; This updates the DISTINCT pid list
	. . . set lockNode("region")=region
	. . . ; Check for waiters
	. . . set waiterCnt=0
	. . . set waiter="" for  set waiter=$order(res("tmp",region,"locks",lock,"waiters",waiter)) quit:waiter=""  do
	. . . . set lockNode("waiters",$increment(waiterCnt))=res("tmp",region,"locks",lock,"waiters",waiter,"pid")
	. . . . ; Update the DISTINCT pid list
	. . . . set tmpPids(res("tmp",region,"locks",lock,"waiters",waiter,"pid"))=""
	. . . merge res("locks",$increment(lockCnt))=lockNode
	;
	; Finalize the processes by organizing the regions as array
	set region="" for  set region=$order(tmpRegions(region)) quit:region=""  do
	. merge res("regions",$increment(regionCnt))=tmpRegions(region)
	;
	; Then the pids
	set pid="" for  set pid=$order(tmpPids(pid)) quit:pid=""  do
	. merge res("pids",$increment(pidCnt),"pid")=pid
	;
	; And finally fetching the pid's properties
	set pidCnt=0 for  set pidCnt=$order(res("pids",pidCnt)) quit:pidCnt=""  do
	. set pid=res("pids",pidCnt,"pid")
	. set ret=$$runShell^%ydbguiUtils("ps -F --no-header -p "_pid,.shellResult)
	. if $data(shellResult(1)) do
	. . set *pidData=$$SPLIT^%MPIECE(shellResult(1))
	. . set res("pids",pidCnt,"PPID")=$get(pidData(3))
	. . set res("pids",pidCnt,"userId")=$get(pidData(1))
	. . set res("pids",pidCnt,"processName")=$get(pidData(11))
	. . set res("pids",pidCnt,"time")=$get(pidData(10))
	;
	kill res("tmp")
	set res("result")="OK"
	;
getAllQuit
	;
	quit *res
	;
	;
; ****************************************************************
; clear(namespace)	; clears a single lock by namespace
; ;
; PARAMS:
; regionName		string
; lockData			array byRef
; RETURNS:
; Array with REST response
; ****************************************************************
clear(namespace)
	new res,shellResult,ret,cnt,cmd
	;
	set cmd="clear -nointeractive -lock="_$zwrite(namespace)
	set ret=$$runIntShell^%ydbguiUtils("$ydb_dist/lke",cmd,.shellResult)
	if ret=1 do  goto clearQuit
	. set res("result")="ERROR"
	. set res("error","description")="Operation not successful"
	;
	if ret'=0 do  goto clearQuit
	. set res("result")="ERROR"
	. set res("error","description")="The shell returned the following error: "_ret
	;
	set cnt="" for  set cnt=$order(shellResult(cnt)) quit:cnt=""!(ret)  do
	. if $find(shellResult(cnt),"Lock removed") set ret=1
	if ret set res("result")="OK"
	else  do
	. set res("result")="ERROR"
	. set res("error","description")="Action couldn't be completed."
	. merge res("error","dump")=shellResult
	;
clearQuit
	quit *res
