%ydbguiRegions ; YottaDB Regions; 05-07-2021
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
; getRegionStruct:(regionName,regionData)
;
; PARAMS:
; regionName			string
; regionsData			array byRef
; warnings				array byRef 
; ****************************************************************
getRegionStruct(regionName,regionData,warnings)
	new buffer,res,segmentFilename,journalFilename,fhead,cnt,deviceInfo
	new fheadOk,dataCnt,map,newNames,name,regionMap,mapCnt,lsof,lockBuffer,record
	;
	set fheadOk=0,segmentFilename=""
	;
	set regionName=$zconvert(regionName,"u")
	;
	; Start getting the GDE info
	do getRegion^%ydbguiGde(regionName,.buffer)
	;
	;Quit if region name is bad
	quit:$data(buffer("region"))=0
	;	
	; Begin computing the flags
	if $get(buffer("segments","FILE_NAME"))="" do  
	. ; no file specified
	. set regionData("dbFile","flags","fileExist")="false"
	. set regionData("dbFile","flags","fileBad")="true"
	else  do
	. ; Process segment flags
	. set segmentFilename=$zsearch(-1)
	. set segmentFilename=$zsearch(buffer("segments","FILE_NAME"))
	. if segmentFilename="" do  
	. . ; no file found on file system
	. . set regionData("dbFile","flags","fileExist")="false"
	. . set regionData("dbFile","flags","fileBad")="true"
	. set regionData("dbAccess","data",1,"AUTO_DB")=$select(buffer("region","AUTODB")=0:"false",1:"true")
	. else  do
	. . set regionData("dbFile","flags","file")=segmentFilename
	. . ; file found on file system
	. . set regionData("dbFile","flags","fileExist")="true"
	. . ;
	. . ;execute FHEAD and try to read the header
	. . set ret=$$runShell^%ydbguiUtils("mupip dumpfhead -r "_regionName,.fhead) 
	. . if ret'=0 do
	. . . ; error while executing dumpfhead
	. . . set warnings($increment(warnings))="Error occurred while fetching the FHEAD for region: "_regionName_" error is: "_ret
	. . . set regionData("dbFile","flags","fileBad")="true"
	. . else  do
	. . . ; dumfhead was ok, parse it
	. . . set fheadOk=1
	. . . set regionData("dbFile","flags","fileBad")="false"
	. . . for cnt=3:1 quit:$get(fhead(cnt))=""  set @fhead(cnt)
	. . . ;
	. . . ; extract the device mountpoint
	. . . set ret=$$runShell^%ydbguiUtils("df "_segmentFilename,.deviceInfo) 
	. . . if ret'=0 do
	. . . . ;error handler for device, need to think about it
	. . . . set warnings($increment(warnings))="Error occurred while fetching the database device for region: "_regionName_" error is: "_ret
	. . . . set deviceInfo="error"
	. . . . set regionData("dbFile","flags","mountpoint")="error"
	. . . . set regionData("dbFile","flags","device")="error"
	. . . else  do
	. . . . set deviceInfo=$$strRemoveExtraSpaces^%ydbguiUtils(deviceInfo(2))
	. . . . set regionData("dbFile","flags","mountpoint")=$piece(deviceInfo," ",6)
	. . . . set regionData("dbFile","flags","device")=deviceInfo
	. . . ; compute the # of users, if possible
	. . . set ret=$$dbnopen(segmentFilename),regionData("dbFile","flags","shmenHealthy")="true"
	. . . if ret>-1 set regionData("dbFile","flags","sessions")=ret quit
	. . . if ret=-999999 set regionData("dbFile","flags","sessions")="n/a",regionData("dbFile","flags","shmenHealthy")="false" quit
	. . . if ret=-130 set regionData("dbFile","flags","fileBad")="true" quit
	. . . ; process extra errors
	. . . set warnings($increment(warnings))="Error occurred while fetching the users for region: "_regionName_" error is: "_ret
	. . . set regionData("dbFile","flags","sessions")="n/a"
	. ;
	;
	goto:regionData("dbFile","flags","fileExist")="false" getRegionStructQuit
	;
	; Process journal flags
	set journalFilename=$zsearch(-1)
	set journalFilename=$zsearch($translate(record("sgmnt_data.jnl_file_name"),$char(0),""))
	; extract the device mountpoint
	do:journalFilename'=""
	. set ret=$$runShell^%ydbguiUtils("df "_journalFilename,.deviceInfo) 
	. if ret'=0 do
	. . ;error handler 
	. . set warnings($increment(warnings))="Error occurred while fetching the journal device for region: "_regionName_" error is: "_ret
	. . set regionData("journal","flags","file")="error"
	. . set regionData("journal","flags","mountpoint")="error"
	. . set regionData("journal","flags","device")="error"
	. . set regionData("journal","flags","file")="error"
	. else  do
	. . set deviceInfo=$$strRemoveExtraSpaces^%ydbguiUtils(deviceInfo(2))
	. . set regionData("journal","flags","file")=journalFilename
	. . set regionData("journal","flags","mountpoint")=$piece(deviceInfo," ",6)
	. . set regionData("journal","flags","device")=deviceInfo
	. . set regionData("journal","flags","file")=journalFilename
	;
	set regionData("journal","flags","state")=record("sgmnt_data.jnl_state")
	set:regionData("journal","flags","state")=2 regionData("journal","flags","state")=$select(+$get(record("node_local.jnl_file.u.inode"),0):3,1:2) ;status 2: on, but inactive, status 3: on and active
	set regionData("journal","flags","inode")=$get(record("node_local.jnl_file.u.inode"),0)
	set regionData("replication","flags","status")=record("sgmnt_data.repl_state") ;0: closed/inactive 1: open/active 2: wasOn (was on but now not active)
	; 
	; fill the dbFile/data section
	set dataCnt=0
	set regionData("dbFile","data",$increment(dataCnt),"FILE_NAME")=segmentFilename
	;
	; Using dataCnt makes an object returned to the GUI an array, which lets us control the order in which the data is presented. ;
	set regionData("dbFile","data",$increment(dataCnt),"currentSize")=(record("sgmnt_data.trans_hist.total_blks")*record("sgmnt_data.blk_size"))
	set regionData("dbFile","data",$increment(dataCnt),"extensionLeft")=(record("sgmnt_data.trans_hist.free_blocks")*record("sgmnt_data.blk_size"))
	set regionData("dbFile","data",$increment(dataCnt),"maximumSize")=(regionData("dbFile","data",dataCnt-2,"currentSize")+regionData("dbFile","data",dataCnt-1,"extensionLeft"))
	set regionData("dbFile","usage","totalBlocks")=record("sgmnt_data.trans_hist.total_blks")+record("sgmnt_data.trans_hist.free_blocks")
	set regionData("dbFile","usage","usedBlocks")=record("sgmnt_data.trans_hist.total_blks")
	set regionData("dbFile","usage","freeBlocks")=record("sgmnt_data.trans_hist.free_blocks")
	set regionData("dbFile","usage","usedPercent")=$justify(record("sgmnt_data.trans_hist.free_blocks")/regionData("dbFile","usage","totalBlocks")*100.0,1,1)
	set regionData("dbFile","data",$increment(dataCnt),"ACCESS_METHOD")=$select(record("sgmnt_data.acc_meth")=1:"BG",1:"MM") ;1:BG 2:MM
	set:record("sgmnt_data.acc_meth")=1 regionData("dbFile","data",$increment(dataCnt),"GLOBAL_BUFFER_COUNT")=record("sgmnt_data.n_bts")
	set regionData("dbFile","data",$increment(dataCnt),"LOCK_SPACE")=record("sgmnt_data.lock_space_size")
	set:record("sgmnt_data.acc_meth")=1 regionData("dbFile","data",$increment(dataCnt),"ASYNCIO")=$select(record("sgmnt_data.asyncio")=0:"false",1:"true")
	set regionData("dbFile","data",$increment(dataCnt),"DEFER_ALLOCATE")=$select(record("sgmnt_data.defer_allocate")=0:"false",1:"true")
	set regionData("dbFile","data",$increment(dataCnt),"EXTENSION_COUNT")=record("sgmnt_data.extension_size")
	set regionData("dbFile","data",$increment(dataCnt),"TRANSACTION_NUMBER")=record("sgmnt_data.trans_hist.curr_tn")
	set regionData("dbFile","data",$increment(dataCnt),"LAST_BACKUP")=record("sgmnt_data.last_com_backup")
	set regionData("dbFile","data",$increment(dataCnt),"ALLOCATION")=buffer("region","ALLOCATION")
	set regionData("dbFile","data",$increment(dataCnt),"BLOCK_SIZE")=record("sgmnt_data.blk_size")
	;
	; fill the dbAccess/data section
	set dataCnt=0
	set regionData("dbAccess","data",$increment(dataCnt),"RECORD_SIZE")=record("sgmnt_data.max_rec_size")
	set regionData("dbAccess","data",$increment(dataCnt),"KEY_SIZE")=record("sgmnt_data.max_key_size")
	set regionData("dbAccess","data",$increment(dataCnt),"AUTO_DB")=$select(buffer("region","AUTODB")=0:"false",1:"true")
	;
	; fill the journal/data section
	set dataCnt=0
	set regionData("journal","data",$increment(dataCnt),"JFILE_NAME")=journalFilename
	set regionData("journal","data",$increment(dataCnt),"BEFORE")=$select(record("sgmnt_data.jnl_before_image"):"true",1:"false")
	set regionData("journal","data",$increment(dataCnt),"EPOCH_INTERVAL")=record("sgmnt_data.epoch_interval")
	set regionData("journal","data",$increment(dataCnt),"EPOCH_TAPER")=$select(record("sgmnt_data.epoch_taper"):"true",1:"false")
	set regionData("journal","data",$increment(dataCnt),"SYNC_IO")=$select(record("sgmnt_data.jnl_sync_io"):"true",1:"false")
	set regionData("journal","data",$increment(dataCnt),"BUFFER_SIZE")=record("sgmnt_data.jnl_buffer_size")
	;
	; Statistical data
	set dataCnt=0
	set regionData("stats","logicalOperations","caption")="Logical Database operations"
	set regionData("stats","logicalOperations","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_set")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_set"))
	set regionData("stats","logicalOperations","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_kill")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_kill"))
	set regionData("stats","logicalOperations","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_get")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_get"))
	set regionData("stats","logicalOperations","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_data")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_data"))
	set regionData("stats","logicalOperations","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_order")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_order"))
	set regionData("stats","logicalOperations","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_zprev")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_zprev"))
	set regionData("stats","logicalOperations","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_query")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_query"))
	;
	set dataCnt=0
	set regionData("stats","locks","caption")="M Lock Operations"
	set regionData("stats","locks","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_lock_success")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_lock_success"))
	set regionData("stats","locks","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_lock_fail")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_lock_fail"))
	;
	set dataCnt=0
	set regionData("stats","transactions","caption")="Transactions"
	set regionData("stats","transactions","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_nontp_retries_0")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_nontp_retries_0"))
	set regionData("stats","transactions","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_nontp_retries_1")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_nontp_retries_1"))
	set regionData("stats","transactions","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_nontp_retries_2")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_nontp_retries_2"))
	set regionData("stats","transactions","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_nontp_retries_3")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_nontp_retries_3"))
	;
	set dataCnt=0
	set regionData("stats","journal","caption")="Journal information"
	set regionData("stats","journal","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_jfile_bytes")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_jfile_bytes"))
	set regionData("stats","journal","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_jnl_flush")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_jnl_flush"))
	set:+record("sgmnt_data.jnl_sync_io")=0 regionData("stats","journal","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_jnl_fsync")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_jnl_fsync"))
	set regionData("stats","journal","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_jrec_epoch_regular")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_jrec_epoch_regular"))
	;
	set dataCnt=0
	set regionData("stats","csa","caption")="Critical Section Aquisition"
	set regionData("stats","csa","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_crit_success")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_crit_success"))
	set regionData("stats","csa","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_crit_fail")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_crit_failed"))
	set regionData("stats","csa","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_crit_in_epch")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_crits_in_epch"))
	;
	; Now process the maps
	set cnt=0
	set map="" for  set map=$order(buffer("map",map)) quit:map=""  do
	. if $get(buffer("map",map,"region"))=regionName do
	. . set name="" for  set name=$order(buffer("names",name)) quit:name=""  do
	. . . if $extract(name,1,$length(name)-1)=$get(buffer("map",map,"from"))!(name=$get(buffer("map",map,"from"))) do
	. . . . set cnt=cnt+1
	. . . . set newNames(name,cnt,"from")=$get(buffer("map",map,"from"))
	. . . . set newNames(name,cnt,"to")=$get(buffer("map",map,"to"))
	;
	set (cnt,name)=""
	for  set name=$order(newNames(name)) quit:name=""  do
	. set cnt=$increment(cnt)
	. set regionMap(cnt,"name")=name
	. set mapCnt=0
	. for  set mapCnt=$order(newNames(name,mapCnt)) quit:mapCnt=""  do
	. . set regionMap(cnt,"ranges",mapCnt,"from")=newNames(name,mapCnt,"from")
	. . set regionMap(cnt,"ranges",mapCnt,"to")=newNames(name,mapCnt,"to")
	. . set regionMap(cnt,"type")=$extract(newNames(name,mapCnt,"from"),1,1)
	;
	merge regionData("names")=regionMap
	;
	; locks
	set *lockBuffer=$$getLocksData(regionName)
	if $data(lockBuffer) merge regionData("locks")=lockBuffer
	else  do
	. set warnings($increment(warnings))="Error occurred while fetching the locks for region: "_regionName_" error is: "_ret
	. set regionData("locks","processesOnQueue")="error"
	. set regionData("locks","slotsInUse")="error"
	. set regionData("locks","slotsBytesInUse")="error"
	. set regionData("locks","estimatedFreeLockSpace")="error"
	;
getRegionStructQuit	
	quit
	;
	;
; ------------------------------------------------------------------------------
; LOCAL ROUTINES
; ------------------------------------------------------------------------------
;
dbnopen:(dbfile)	; Report number of processes accessing a YottaDB database file
	; Return value:
	; - >=0: file is a database file, number of processes that have it open
	; - <0: errors
	;   - -999999: file is a database file that is not open by any processes, but has a shared memory segment
	;   - -130 file does not exist or is not a database file
	;   - other: other error return codes from processes in PIPE devices
	new i,io,line,nproc,shmid
	;
	set io=$io
	open "mupip":(shell="/bin/sh":command="$ydb_dist/mupip ftok "_dbfile:readonly)::"pipe"
	use "mupip" for i=1:1 read line(i) quit:$zeof
	use io close "mupip"
	quit:$zclose $select(0<$zclose:-$zclose,1:$zclose)
	;
	set shmid=+$ztranslate($zpiece(line(3),"::",3)," ")
	quit:-1=shmid 0
	open "ipcs":(shell="/bin/sh":command="ipcs -m -i "_shmid:readonly)::"pipe"
	kill line use "ipcs" for i=1:1 read line quit:$zfind(line,"nattch=")!$zeof
	use io close "ipcs"
	;
	set nproc=$zpiece(line,"nattch=",2)
	quit $select(nproc:nproc,1:-999999)
	;
	;
; ****************************************************************
; getLocksData(regionName,lockData)	; returns a JDOM (JSON global structure) with the lock structure
; ;
; PARAMS:
; regionName		string
; lockData			array byRef
; RETURNS:
; 0					OK
; negative number	Error executing shell
; positive number 	Error returned from shell
; ****************************************************************
getLocksData:(regionName)
	new lockBuffer,ret,cnt,lockCnt,waiterCnt,lockData
	;
	kill lockData
	;
	set ret=$$runShell^%ydbguiUtils("lke show -all -wait -region="_regionName,.lockBuffer) 
	quit:ret'=0 ret
	;
	if $find($get(lockBuffer(1)),"%YDB-I-LOCKSPACEINFO") do  goto getLocksDataQuit
	. ;no locks found,
	. do parseLockSpaceInfo(lockBuffer(1))
	. do parseLockSpaceUse(lockBuffer(3))
	;
	set (lockCnt,waiterCnt)=0
	for cnt=3:1 quit:$find($get(lockBuffer(cnt)),"%YDB-I-LOCKSPACEINFO")  do
	. if $extract(lockBuffer(cnt),1)=" " do  quit
	. . ;waiter found
	. . set waiterCnt=waiterCnt+1
	. . set lockData("locks",lockCnt,"waiters",waiterCnt,"pid")=$piece($piece(lockBuffer(cnt),"=",2)," ",2)
	. if $extract(lockBuffer(cnt),1)="^" do
	. . ;Lock found
	. . set lockCnt=lockCnt+1,waiter=0
	. . set lockData("locks",lockCnt,"node")=$piece(lockBuffer(cnt)," ")
	. . set lockData("locks",lockCnt,"pid")=$piece(lockBuffer(cnt)," ",5)
	;
	do parseLockSpaceInfo(lockBuffer(cnt))
	do parseLockSpaceUse(lockBuffer(cnt+1))
	;
getLocksDataQuit
	quit *lockData
	;
	;
parseLockSpaceInfo:(string)	
	set lockData("processesOnQueue")=$extract($piece($piece(string,":",4),";"),2,100)
	set lockData("slotsInUse")=$extract($piece($piece(string,":",5),";"),2,100)
	set lockData("slotsBytesInUse")=$extract($piece($piece(string,":",6),";"),2,100)
	;
	quit
	;
	;
parseLockSpaceUse:(string)
	set lockData("estimatedFreeLockSpace")=$extract($piece(string,":",2),2,100)
	;
	quit
