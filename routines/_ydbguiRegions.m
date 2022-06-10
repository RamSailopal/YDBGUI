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
	new gdeData,res,segmentFilename,journalFilename,fhead,cnt,deviceInfo
	new fheadOk,dataCnt,map,newNames,name,regionMap,mapCnt,lsof,lockBuffer,record,devInfo
	;
	set fheadOk=0,segmentFilename=""
	;
	set regionName=$zconvert(regionName,"u")
	;
	; Start getting the GDE info
	do getRegion^%ydbguiGde(regionName,.gdeData)
	;
	;Quit if region name is bad
	quit:$data(gdeData("region"))=0
	;
	; Begin computing the flags
	if $get(gdeData("segments","FILE_NAME"))="" do
	. ; no file specified
	. set regionData("dbFile","flags","fileExist")="false"
	. set regionData("dbFile","flags","fileBad")="true"
	. set regionData("dbFile","data",1,"FILE_NAME")=""
	else  do
	. ; Process segment flags
	. set segmentFilename=$zsearch(-1)
	. set segmentFilename=$zsearch(gdeData("segments","FILE_NAME"))
	. if segmentFilename="" do
	. . ; no file found on file system, fill data from GDE for the GUI to create file
	. . set dataCnt=0
	. . set regionData("dbFile","flags","fileExist")="false"
	. . set regionData("dbFile","flags","fileBad")="true"
	. . set regionData("dbFile","data",$increment(dataCnt),"FILE_NAME")=gdeData("segments","FILE_NAME")
	. . set regionData("dbFile","data",$increment(dataCnt),"ALLOCATION")=gdeData("segments","ALLOCATION")
	. . set regionData("dbFile","data",$increment(dataCnt),"BLOCK_SIZE")=gdeData("segments","BLOCK_SIZE")
	. . set regionData("dbFile","data",$increment(dataCnt),"AUTO_DB")=$select(gdeData("region","AUTODB")=0:"false",1:"true")
	. . set ret=$$runShell^%ydbguiUtils("df "_$zparse(gdeData("segments","FILE_NAME"),"DIRECTORY"),.deviceInfo)
	. . if ret'=0 do
	. . . ;error handler for device
	. . . set warnings($increment(warnings))="Error occurred while fetching the database device for region: "_regionName_" error is: "_ret
	. . . set deviceInfo="error"
	. . . set regionData("dbFile","flags","mountpoint")="error"
	. . . set regionData("dbFile","flags","device")="error"
	. . else  do
	. . . set deviceInfo=$$strRemoveExtraSpaces^%ydbguiUtils(deviceInfo(2))
	. . . set regionData("dbFile","flags","mountpoint")=$piece(deviceInfo," ",6)
	. . . set regionData("dbFile","flags","device")=deviceInfo
	. . . ; get extra info
	. . . kill deviceInfo
	. . . set ret=$$runShell^%ydbguiUtils("stat -fc %s_%i_%c_%d "_$zparse(gdeData("segments","FILE_NAME"),"DIRECTORY"),.deviceInfo)
	. . . if ret'=0 do
	. . . . ;error handler for device
	. . . . set warnings($increment(warnings))="Error occurred while fetching the database device for region: "_regionName_" error is: "_ret
	. . . else  do
	. . . . set *devInfo=$$SPLIT^%MPIECE(deviceInfo(1),"_")
	. . . . set regionData("dbFile","flags","fsBlockSize")=devInfo(1)
	. . . . set regionData("dbFile","flags","deviceId")=devInfo(2)
	. . . . set regionData("dbFile","flags","iNodesTotal")=devInfo(3)
	. . . . set regionData("dbFile","flags","iNodesFree")=devInfo(4)
	. ;
	. else  do
	. . set regionData("dbFile","flags","file")=segmentFilename
	. . ; file found on file system
	. . set regionData("dbFile","flags","fileExist")=$select(segmentFilename="":"false",1:"true")
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
	. . . . ;error handler for device
	. . . . set warnings($increment(warnings))="Error occurred while fetching the database device for region: "_regionName_" error is: "_ret
	. . . . set deviceInfo="error"
	. . . . set regionData("dbFile","flags","mountpoint")="error"
	. . . . set regionData("dbFile","flags","device")="error"
	. . . else  do
	. . . . set deviceInfo=$$strRemoveExtraSpaces^%ydbguiUtils(deviceInfo(2))
	. . . . set regionData("dbFile","flags","mountpoint")=$piece(deviceInfo," ",6)
	. . . . set regionData("dbFile","flags","device")=deviceInfo
	. . . . kill deviceInfo
	. . . . set ret=$$runShell^%ydbguiUtils("stat -fc %s_%i_%c_%d "_segmentFilename,.deviceInfo)
	. . . . if ret'=0 do
	. . . . . ;error handler for device
	. . . . . set warnings($increment(warnings))="Error occurred while fetching the database device for region: "_regionName_" error is: "_ret
	. . . . . set deviceInfo="error"
	. . . . . set regionData("dbFile","flags","mountpoint")="error"
	. . . . . set regionData("dbFile","flags","device")="error"
	. . . . else  do
	. . . . . set *devInfo=$$SPLIT^%MPIECE(deviceInfo(1),"_")
	. . . . . set regionData("dbFile","flags","fsBlockSize")=devInfo(1)
	. . . . . set regionData("dbFile","flags","deviceId")=devInfo(2)
	. . . . . set regionData("dbFile","flags","iNodesTotal")=devInfo(3)
	. . . . . set regionData("dbFile","flags","iNodesFree")=devInfo(4)
	. . . ; compute the # of users, if possible
	. . . set ret=$$dbnopen(segmentFilename),regionData("dbFile","flags","shmenHealthy")="true"
	. . . if ret>-1 set regionData("dbFile","flags","sessions")=ret quit
	. . . if ret=-999999 do  quit
	. . . . ; shmem error, try to open the region and check if it got fixed
	. . . . set ret=$$tryOpenRegion(regionName)
	. . . . if ret=0 set regionData("dbFile","flags","sessions")="n/a",regionData("dbFile","flags","shmenHealthy")="false"
	. . . . else  set ret=$$dbnopen(segmentFilename) if ret=999999 set regionData("dbFile","flags","shmenHealthy")="false" quit
	. . . ;
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
	. set regionData("journal","flags","fileExist")=$select($zsearch(journalFilename,-1)="":"false",1:"true")
	. if regionData("journal","flags","fileExist")="true" do
	. . set ret=$$runShell^%ydbguiUtils("df "_journalFilename,.deviceInfo)
	. . if ret'=0 do
	. . . ;error handler
	. . . set warnings($increment(warnings))="Error occurred while fetching the journal device for region: "_regionName_" error is: "_ret
	. . . set regionData("journal","flags","file")="error"
	. . . set regionData("journal","flags","mountpoint")="error"
	. . . set regionData("journal","flags","device")="error"
	. . . set regionData("journal","flags","file")="error"
	. . else  do
	. . . set deviceInfo=$$strRemoveExtraSpaces^%ydbguiUtils(deviceInfo(2))
	. . . set regionData("journal","flags","file")=journalFilename
	. . . set regionData("journal","flags","mountpoint")=$piece(deviceInfo," ",6)
	. . . set regionData("journal","flags","device")=deviceInfo
	. . . set regionData("journal","flags","file")=journalFilename
	. . . kill deviceInfo
	. . . set ret=$$runShell^%ydbguiUtils("stat -fc %s_%i_%c_%d "_journalFilename,.deviceInfo)
	. . . if ret'=0 do
	. . . . ;error handler for device
	. . . . set warnings($increment(warnings))="Error occurred while fetching the database device for region: "_regionName_" error is: "_ret
	. . . . set deviceInfo="error"
	. . . . set regionData("journal","flags","mountpoint")="error"
	. . . . set regionData("journal","flags","device")="error"
	. . . else  do
	. . . . set *devInfo=$$SPLIT^%MPIECE(deviceInfo(1),"_")
	. . . . set regionData("journal","flags","fsBlockSize")=devInfo(1)
	. . . . set regionData("journal","flags","deviceId")=devInfo(2)
	. . . . set regionData("journal","flags","iNodesTotal")=devInfo(3)
	. . . . set regionData("journal","flags","iNodesFree")=devInfo(4)
	;
	set regionData("journal","flags","state")=record("sgmnt_data.jnl_state")
	set:regionData("journal","flags","state")=2 regionData("journal","flags","state")=$select(+$get(record("node_local.jnl_file.u.inode"),0):3,1:2) ;status 2: on, but inactive, status 3: on and active
	set regionData("journal","flags","inode")=$get(record("node_local.jnl_file.u.inode"),0)
	set regionData("replication","flags","status")=record("sgmnt_data.repl_state") ;0: closed/inactive 1: open/active 2: wasOn (was on but now not active)
	;
	; FREEZE status
	set regionData("dbFile","flags","freeze")=record("sgmnt_data.freeze")
	;
	; Using dataCnt makes an object returned to the GUI an array, which lets us control the order in which the data is presented. ;
	;
	; fill the dbFile/data section
	set dataCnt=0
	set regionData("dbFile","data",$increment(dataCnt),"FILE_NAME")=segmentFilename
	set regionData("dbFile","usage","totalBlocks")=record("sgmnt_data.trans_hist.total_blks")
	set regionData("dbFile","usage","usedBlocks")=record("sgmnt_data.trans_hist.total_blks")-record("sgmnt_data.trans_hist.free_blocks")
	set regionData("dbFile","usage","freeBlocks")=record("sgmnt_data.trans_hist.free_blocks")
	set regionData("dbFile","usage","usedPercent")=100-$justify(record("sgmnt_data.trans_hist.free_blocks")/regionData("dbFile","usage","totalBlocks")*100.0,1,1)
	set regionData("dbFile","data",$increment(dataCnt),"AUTO_DB")=$select(gdeData("region","AUTODB")=0:"false",1:"true")
	set regionData("dbFile","data",$increment(dataCnt),"ACCESS_METHOD")=$select(record("sgmnt_data.acc_meth")=1:"BG",1:"MM") ;1:BG 2:MM
	set:record("sgmnt_data.acc_meth")=1 regionData("dbFile","data",$increment(dataCnt),"GLOBAL_BUFFER_COUNT")=record("sgmnt_data.n_bts")
	set regionData("dbFile","data",$increment(dataCnt),"LOCK_SPACE")=record("sgmnt_data.lock_space_size")/512
	set:record("sgmnt_data.acc_meth")=1 regionData("dbFile","data",$increment(dataCnt),"ASYNCIO")=$select(record("sgmnt_data.asyncio")=0:"false",1:"true")
	set regionData("dbFile","data",$increment(dataCnt),"DEFER_ALLOCATE")=$select(record("sgmnt_data.defer_allocate")=0:"false",1:"true")
	set regionData("dbFile","data",$increment(dataCnt),"EXTENSION_COUNT")=record("sgmnt_data.extension_size")
	set regionData("dbFile","data",$increment(dataCnt),"TRANSACTION_NUMBER")=record("sgmnt_data.trans_hist.curr_tn")
	set regionData("dbFile","data",$increment(dataCnt),"LAST_BACKUP")=record("sgmnt_data.last_com_backup")
	set regionData("dbFile","data",$increment(dataCnt),"ALLOCATION")=gdeData("segments","ALLOCATION")
	set regionData("dbFile","data",$increment(dataCnt),"BLOCK_SIZE")=record("sgmnt_data.blk_size")
	set regionData("dbFile","data",$increment(dataCnt),"ENCRYPTION_FLAG")=$select(record("sgmnt_data.is_encrypted"):"true",1:"false")
	set:record("sgmnt_data.acc_meth")=1 regionData("dbFile","data",$increment(dataCnt),"MUTEX_SLOTS")=record("sgmnt_data.mutex_spin_parms.mutex_que_entry_space_size")
	;
	; fill the dbAccess/data section
	set dataCnt=0
	set regionData("dbAccess","data",$increment(dataCnt),"RECORD_SIZE")=record("sgmnt_data.max_rec_size")
	set regionData("dbAccess","data",$increment(dataCnt),"KEY_SIZE")=record("sgmnt_data.max_key_size")
	set regionData("dbAccess","data",$increment(dataCnt),"COLLATION_DEFAULT")=record("sgmnt_data.def_coll")
	set regionData("dbAccess","data",$increment(dataCnt),"INST_FREEZE_ON_ERROR")=$select(record("sgmnt_data.freeze_on_fail"):"false",1:"true")
	set regionData("dbAccess","data",$increment(dataCnt),"LOCK_CRIT_SEPARATE")=$select(record("sgmnt_data.lock_crit_with_db"):"false",1:"true")
	set regionData("dbAccess","data",$increment(dataCnt),"NULL_SUBSCRIPTS")=$select(record("sgmnt_data.null_subs")=0:"Not allowed",record("sgmnt_data.null_subs")=1:"Allowed",1:"Allow existing")
	set regionData("dbAccess","data",$increment(dataCnt),"QDBRUNDOWN")=$select(record("sgmnt_data.mumps_can_bypass"):"false",1:"true")
	set regionData("dbAccess","data",$increment(dataCnt),"STATS")=$select(record("sgmnt_data.reservedDBFlags")=0:"true",1:"false")
	;
	; fill the journal/data section
	set dataCnt=0
	set regionData("journal","data",$increment(dataCnt),"JFILE_NAME")=journalFilename
	set regionData("journal","data",$increment(dataCnt),"BEFORE")=$select(record("sgmnt_data.jnl_before_image"):"true",1:"false")
	set regionData("journal","data",$increment(dataCnt),"EPOCH_INTERVAL")=record("sgmnt_data.epoch_interval")
	set regionData("journal","data",$increment(dataCnt),"EPOCH_TAPER")=$select(record("sgmnt_data.epoch_taper"):"true",1:"false")
	set regionData("journal","data",$increment(dataCnt),"SYNC_IO")=$select(record("sgmnt_data.jnl_sync_io"):"true",1:"false")
	set regionData("journal","data",$increment(dataCnt),"AUTO_SWITCH_LIMIT")=record("sgmnt_data.autoswitchlimit")
	set regionData("journal","data",$increment(dataCnt),"ALIGNSIZE")=record("sgmnt_data.alignsize")
	set regionData("journal","data",$increment(dataCnt),"BUFFER_SIZE")=record("sgmnt_data.jnl_buffer_size")
	set regionData("journal","data",$increment(dataCnt),"YIELD_LIMIT")=record("sgmnt_data.yield_lmt")
	;
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
	set map="" for  set map=$order(gdeData("map",map)) quit:map=""  do
	. if $get(gdeData("map",map,"region"))=regionName do
	. . set name="" for  set name=$order(gdeData("names",name)) quit:name=""  do
	. . . if $extract(name,1,$length(name)-1)=$get(gdeData("map",map,"from"))!(name=$get(gdeData("map",map,"from"))) do
	. . . . set cnt=cnt+1
	. . . . set newNames(name,cnt,"from")=$get(gdeData("map",map,"from"))
	. . . . set newNames(name,cnt,"to")=$get(gdeData("map",map,"to"))
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
	. set regionData("locks","processesOnQueue")="N/A"
	. set regionData("locks","slotsInUse")="N/A"
	. set regionData("locks","slotsBytesInUse")="N/A"
	. set regionData("locks","estimatedFreeLockSpace")="N/A"
	;
getRegionStructQuit
	quit
	;
	;
; ****************************************************************
; create(req)
;
; PARAMS:
; body					array byRef
; RETURN
; res					array byRef (response JDOM)
; ****************************************************************
create(body)
	new res,NL,ix,postProcessing,verifyStatus,postCmd,warningFlag
	new segmentCmd,regionCmd,segmentTcmd,regionTcmd,cmdHeader,cmdExit,cmdQuit,cmd
	new gldPath,gldFilename,cpCmd,autoDbFlag
	;
	; init main vars
	set NL=$char(10)
	set (segmentCmd,regionCmd,segmentTcmd,regionTcmd,cmd)=""
	set (autoDbFlag,warningFlag)=0
	;
	; create backup of the .gld file
	set gldPath=$zparse($zgbldir,"DIRECTORY")
	set gldFilename=$zparse($zgbldir,"NAME")_".bak"
	set cpCmd="cp "_$zgbldir_" "_gldPath_"/"_gldFilename
	set ret=$$runShell^%ydbguiUtils(cpCmd,.shellResult)
	do:ret<0
	. set res("result")="WARNING"
	. set warningFlag=warningFlag+1
	. set res("error",warningFlag,"description")="Couldn't create the backup file. Error: "_ret
	. merge res("error",warningFlag,"dump")=shellResult
	;
	; create command header and terminators
	set cmdHeader="$ydb_dist/yottadb -r GDE"
	set cmdExit=" exit"_NL
	set cmdQuit=" quit"_NL
	;
	; create templates commands if needed
	if body("templates","updateTemplateDb")="true",$data(body("segmentData")) set segmentTcmd=$$buildSegmentCommand(.body)
	if (body("templates","updateTemplateDb")="true")&($data(body("dbAccess","region")))!(body("templates","updateTemplateJournal")="true"&($data(body("dbAccess","journal")))) set regionTcmd=$$buildRegionCommand(.body,.autoDbFlag)
	;
	; create now the commands for the region
	if (body("templates","updateTemplateDb")="false"&($data(body("segmentData"))))!(body("segmentTypeBg")="false") set segmentCmd=$$buildSegmentCommand(.body)
	if (body("templates","updateTemplateDb")="false"&($data(body("dbAccess","region"))))!(body("templates","updateTemplateJournal")="false"&($data(body("dbAccess","journal")))) set regionCmd=$$buildRegionCommand(.body,.autoDbFlag)
	;
	; if any template update... update them first ;
	if segmentTcmd'=""!(regionTcmd'="") do  goto:$data(verifyStatus)>9 createQuit
	. set:segmentTcmd'="" segmentTcmd="TEMPLATE -SEGMENT "_segmentTcmd,cmd=cmd_segmentTcmd_NL
	. set:regionTcmd'="" regionTcmd="TEMPLATE -REGION "_regionTcmd,cmd=cmd_regionTcmd_NL
	. ;
	. ; temp debug line
	. s res("templateCmd")=cmd
	. ;finalize command
	. if $get(body("debugMode")) set cmd=cmd_"VERIFY"_NL_cmdQuit_NL ;this will verify and exit without saving:
	. else  set cmd=cmd_NL_cmdExit_NL
	. ;
	. ; execute the shell
	. set (cnt,verifyStatus)=0
	. kill shellResult
	. set ret=$$runIntShell^%ydbguiUtils(cmdHeader,cmd,.shellResult)
	. ; and parse the result
	. set ix="" for  set ix=$order(shellResult(ix)) quit:ix=""!(verifyStatus=1)  do
	. . quit:ix<4
	. . if shellResult(ix)="%GDE-I-VERIFY, Verification OK" set verifyStatus=1 quit
	. . if shellResult(ix)'="",shellResult(ix)'="GDE> " set cnt=cnt+1,verifyStatus(cnt)=shellResult(ix)
	. ;
	. if $data(verifyStatus)>9 do
	. . set res("result")="ERROR"
	. . set res("error","description")="Error updating templates"
	. . zkill verifyStatus
	. . merge res("error","dump")=verifyStatus
	;
	set cmd=""
	; segment creation params
	set cmd=cmd_"ADD -SEGMENT "_body("regionName")_" -file_name="""_body("segmentFilename")_""" "_segmentCmd_NL
	;
	; process journal params
	do:body("journalEnabled")="true"
	. ; if the string already had a -j=() section, append it, otherwise create a new one
	. if $extract(regionCmd,$length(regionCmd))=")" set regionCmd=$extract(regionCmd,1,$length(regionCmd)-1)_",FILE_NAME="""_body("journalFilename")_""")"
	. else  set regionCmd=regionCmd_" -JOURNAL=(FILE_NAME="""_body("journalFilename")_""")"
	;
	; region creation params
	set cmd=cmd_"ADD -REGION "_body("regionName")_" -DYNAMIC="_body("regionName")_" "_regionCmd_NL
	;
	;names
	set ix="" for  set ix=$order(body("names",ix)) quit:ix=""  do
	. set cmd=cmd_"ADD -NAME "_body("names",ix,"value")_" -REGION="_body("regionName")_NL
	;
	;finalize command
	if $get(body("debugMode")) set cmd=cmd_"VERIFY"_NL_cmdQuit_NL ;this will verify and exit without saving:
	else  set cmd=cmd_NL_cmdExit_NL
	;
	; temp debug line
	s res("cmd")=cmd
	;
	; execute it
	set (cnt,verifyStatus)=0
	kill shellResult
	set ret=$$runIntShell^%ydbguiUtils(cmdHeader,cmd,.shellResult)
	; and parse the result
	set ix="" for  set ix=$order(shellResult(ix)) quit:ix=""!(verifyStatus=1)  do
	. quit:ix<4
	. if shellResult(ix)="%GDE-I-VERIFY, Verification OK" set verifyStatus=1 quit
	. if shellResult(ix)'="",shellResult(ix)'="GDE> " set cnt=cnt+1,verifyStatus(cnt)=shellResult(ix)
	;
	; Check for errors
	if $data(verifyStatus)<9 do
	. ; perform post-creation operations
	. do:body("postProcessing","createDbFile")="true"&(autoDbFlag=0)
	. . set postCmd="$ydb_dist/mupip CREATE -REGION="_body("regionName")
	. . kill shellResult
	. . set ret=$$runShell^%ydbguiUtils(postCmd,.shellResult)
	. . do:ret<0
	. . . set res("result")="WARNING"
	. . . set warningFlag=warningFlag+1
	. . . set res("error",warningFlag,"description")="Couldn't create database file. Error: "_ret
	. . . merge res("error",warningFlag,"dump")=shellResult
	. ;
	. do:body("journalEnabled")="true"
	. . set postCmd="$ydb_dist/mupip SET -JOURNAL=""ENABLE"
	. . set postCmd=postCmd_","_$select(body("postProcessing","switchJournalOn")="true":"ON",1:"OFF")
	. . set postCmd=postCmd_""" -REGION "_body("regionName")
	. . kill shellResult
	. . set ret=$$runShell^%ydbguiUtils(postCmd,.shellResult)
	. . do:ret<0
	. . . set res("result")="WARNING"
	. . . set warningFlag=warningFlag+1
	. . . set res("error",warningFlag,"description")="Couldn't turn journal on. Error: "_ret
	. . . merge res("error",warningFlag,"dump")=shellResult
	. ;
	. ; Retun OK
	. set:warningFlag=0 res("result")="OK"
	. ;
	else  do
	. ; return error !!!
	. set res("result")="ERROR"
	. set res("error","description")="Error creating region"
	. zkill verifyStatus
	. merge res("error","dump")=verifyStatus
	;
createQuit
	quit *res
	;
	;
; **************************
; delete(regionName)
;
; PARAMS:
; regionName	string
; It will delete the region, segment and name having regioName as identifier
; RETURNS:
; 1 if OK
; **************************
delete(regionName,deleteFiles)
	new shellResult,ret,res,namesList
	new deleteCmd,name,command,LF,ix,cnt,verifyStatus
	new regionData,warnings,dbFilename,journalFilename
	;
	; initialize variables
	set regionName=$zconvert(regionName,"u")
	set deleteCmd=""
	set LF=$char(10)
	set command="$ydb_dist/yottadb -r GDE"
	do getRegionStruct(regionName,.regionData,.warnings)
	;
	; get the names list
	set *namesList=$$getNames(regionName)
	;
	; prepare the delete list in the deleteCmd with names
	set name="" for  set name=$order(namesList(name)) quit:name=""  do
	. set deleteCmd=deleteCmd_"DELETE -NAME "_name_LF
	;
	; and segment / region
	set deleteCmd=deleteCmd_"DELETE -SEGMENT "_regionName_LF
	set deleteCmd=deleteCmd_"DELETE -REGION "_regionName_LF
	; and save the changes
	set deleteCmd=deleteCmd_"exit"_LF
	;
	;execute the command
	set ret=$$runIntShell^%ydbguiUtils(command,deleteCmd,.shellResult)
	;
	; and parse the result
	set (verifyStatus,cnt)=0
	set ix="" for  set ix=$order(shellResult(ix)) quit:ix=""!(verifyStatus=1)  do
	. quit:ix<4
	. if shellResult(ix)="%GDE-I-VERIFY, Verification OK" set verifyStatus=1 quit
	. if shellResult(ix)'="",shellResult(ix)'="GDE> " set cnt=cnt+1,verifyStatus(cnt)=shellResult(ix)
	;
	if $data(verifyStatus)>9 do  goto deleteQuit
	. set res("result")="ERROR"
	. set res("error","description")="Error deleting the region: "_regionName
	. zkill verifyStatus
	. merge res("error","dump")=verifyStatus
	;
	; need to delete files ?
	if deleteFiles do  go:$get(res("result"))="ERROR" deleteQuit
	. set dbFilename=$get(regionData("dbFile","flags","file"))
	. set journalFilename=$get(regionData("journal","flags","file"))
	. ;
	. if dbFilename'="" do  if $get(res("result"))="ERROR" quit
	. . kill shellResult
	. . set ret=$$runShell^%ydbguiUtils("rm "_dbFilename,.shellResult)
	. . if ret'=0 do
	. . . set res("result")="ERROR"
	. . . set res("error","description")="Error deleting the file: "_dbFilename
	. ;
	. if journalFilename'="" do
	. . kill shellResult
	. . set ret=$$runShell^%ydbguiUtils("rm "_journalFilename_"*",.shellResult)
	. . if ret'=0 do
	. . . set res("result")="ERROR"
	. . . set res("error","description")="Error deleting the file: "_journalFilename
	;
	set res("result")="OK"
	;
deleteQuit
	quit *res
	;
; ------------------------------------------------------------------------------
; ------------------------------------------------------------------------------
; ------------------------------------------------------------------------------
; LOCAL ROUTINES
; ------------------------------------------------------------------------------
; ------------------------------------------------------------------------------
; ------------------------------------------------------------------------------
;
buildSegmentCommand:(body) ; Builds a command to update the segment
	new ix,field,cmd
	;
	set cmd=""
	;
	; Segment type
	set cmd=cmd_"-ACCESS_METHOD="_$select(body("segmentTypeBg")="true":"BG",1:"MM")
	;
	; Params from array
	set ix="" for  set ix=$order(body("segmentData",ix)) quit:ix=""  do
	. set field=body("segmentData",ix,"id")
	. set:field="initialAllocation" cmd=cmd_" -ALLOCATION="_body("segmentData",ix,"value")
	. set:field="asyncIo" cmd=cmd_" -"_$select(body("segmentData",ix,"value")=0:"NO",1:"")_"ASYNCIO"
	. set:field="blockSize" cmd=cmd_" -BLOCK_SIZE="_body("segmentData",ix,"value")
	. set:field="deferAllocate" cmd=cmd_" -"_$select(body("segmentData",ix,"value")=0:"NO",1:"")_"DEFER_ALLOCATE"
	. set:field="extensionCount" cmd=cmd_" -EXTENSION_COUNT="_body("segmentData",ix,"value")
	. set:field="globalBufferCount" cmd=cmd_" -GLOBAL_BUFFER_COUNT="_body("segmentData",ix,"value")
	. set:field="lockSpace" cmd=cmd_" -LOCK_SPACE="_body("segmentData",ix,"value")
	. set:field="mutexSlots" cmd=cmd_" -MUTEX_SLOTS="_body("segmentData",ix,"value")
	. set:field="reservedBytes" cmd=cmd_" -RESERVED_BYTES="_body("segmentData",ix,"value")
	. set:field="encryptionFlag" cmd=cmd_" -"_$select(body("segmentData",ix,"value")=0:"NO",1:"")_"ENCRYPTION"
	;
	quit cmd
	;
	;
buildRegionCommand:(body,autoDbFlag) ; Builds a command to update the region
	new ix,field,cmd,appendString
		;
	set cmd=""
	;
	do:$data(body("dbAccess","region"))
	. set ix="" for  set ix=$order(body("dbAccess","region",ix)) quit:ix=""  do
	. . set field=body("dbAccess","region",ix,"id")
	. . set:field="autoDb" cmd=cmd_" -"_$select(body("dbAccess","region",ix,"value")=0:"NO",1:"")_"AUTODB",autoDbFlag=body("dbAccess","region",ix,"value")
	. . set:field="recordSize" cmd=cmd_" -RECORD_SIZE="_body("dbAccess","region",ix,"value")
	. . set:field="keySize" cmd=cmd_" -KEY_SIZE="_body("dbAccess","region",ix,"value")
	. . set:field="nullSubscripts" cmd=cmd_" -NULL_SUBSCRIPTS="_$select(body("dbAccess","region",ix,"value")=0:"ALWAYS",body("dbAccess","region",ix,"value")=1:"NEVER",1:"EXISTING")
	. . set:field="collation" cmd=cmd_" -COLLATION_DEFAULT="_body("dbAccess","region",ix,"value")
	. . set:field="lockCriticalSeparate" cmd=cmd_" -"_$select(body("dbAccess","region",ix,"value")=0:"NO",1:"")_"LOCK_CRIT_SEPARATE"
	. . set:field="qbRundown" cmd=cmd_" -"_$select(body("dbAccess","region",ix,"value")=0:"NO",1:"")_"QDBRUNDOWN"
	. . set:field="stats" cmd=cmd_" -"_$select(body("dbAccess","region",ix,"value")=0:"NO",1:"")_"STATS"
	;
	;
	do:$data(body("dbAccess","journal"))&(body("journalEnabled")="true")
	. set cmd=cmd_" -JOURNAL=("
	. set prefixString=""
	. set ix="" for  set ix=$order(body("dbAccess","journal",ix)) quit:ix=""  do
	. . set field=body("dbAccess","journal",ix,"id")
	. . set:field="beforeImage" cmd=cmd_$select(body("dbAccess","journal",ix,"value")=0:"NO",1:"")_"BEFORE_IMAGE,"
	. . set:field="allocation" cmd=cmd_"ALLOCATION="_body("dbAccess","journal",ix,"value")_","
	. . set:field="autoSwitchLimit" cmd=cmd_"AUTOSWITCHLIMIT="_body("dbAccess","journal",ix,"value")_","
	. . set:field="bufferSize" cmd=cmd_"BUFFER_SIZE="_body("dbAccess","journal",ix,"value")_","
	. . ;set:field="epochInterval" cmd=cmd_"EPOCH_INTERVAL="_body("dbAccess","journal",ix,"value")_","
	. . set:field="extension" cmd=cmd_"EXTENSION="_body("dbAccess","journal",ix,"value")_","
	. . ;set:field="syncIo" cmd=cmd_$select(body("dbAccess","journal",ix,"value")=0:"NO",1:"")_"SYNC_IO,"
	. . ;set:field="yieldLimit" cmd=cmd_"YIELD_LIMIT="_body("dbAccess","journal",ix,"value")_","
	. . set:field="epochTaper" prefixString=" -"_$select(body("dbAccess","journal",ix,"value")=0:"NO",1:"")_"EPOCHTAPER "
	. ;
	. if $extract(cmd,$length(cmd))="(" set cmd=""
	. else  set cmd=prefixString_$extract(cmd,1,$length(cmd)-1)_$select($find(cmd,"IMAGE"):")",1:",BEFORE_IMAGE)")
	;
	set:body("journalEnabled")="false" cmd=cmd_" -NOJOURNAL"
	;
	quit cmd
	;
	;
; ****************************************************************
; dbnopen:(dbfile)	; Report number of processes accessing a YottaDB database file
; Return value:
; Return value:
; - >=0: file is a database file, number of processes that have it open
; - <0: errors
; - -999999: file is a database file that is not open by any processes, but has a shared memory segment
; - -130 file does not exist or is not a database file
; - other: other error return codes from processes in PIPE devices
; ****************************************************************
dbnopen:(dbfile)	; Report number of processes accessing a YottaDB database file
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
	kill lockData,lockBuffer
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
	set cnt=cnt+$select($find(lockBuffer(cnt+1),"%YDB-I-NOLOCKMATCH"):2,1:1)
	do parseLockSpaceUse(lockBuffer(cnt))
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
; tryOpenRegion(regionName)
; ;
; PARAMS:
; regionName		string
; RETURNS:
; >0				OK
; 0					Could NOT open the region
; ****************************************************************
tryOpenRegion(regionName)
	new ret
	new $ztrap,$etrap
	;
	set $ztrap="goto tryOpenRegionQuit"
	set ret=0
	;
	set ret=$$^%PEEKBYNAME("sgmnt_data.blk_size",region)
	;
tryOpenRegionQuit
	quit ret
	;
	;
; ****************************************************************
; getNames(regionName)
; ;
; PARAMS:
; regionName		string
; RETURNS:
; array with names as subscripts
; ****************************************************************
getNames:(regionName)
	new cnt,map,name,newNames,regionMap,gdeData
	;
	; get the names
	do getRegion^%ydbguiGde(regionName,.gdeData)
	;quit *gdeData
	;
	set cnt=0
	set map="" for  set map=$order(gdeData("map",map)) quit:map=""  do
	. if $get(gdeData("map",map,"region"))=regionName do
	. . set name="" for  set name=$order(gdeData("names",name)) quit:name=""  do
	. . . if $extract(name,1,$length(name)-1)=$get(gdeData("map",map,"from"))!(name=$get(gdeData("map",map,"from"))) do
	. . . . set cnt=cnt+1
	. . . . set newNames(name,cnt,"from")=$get(gdeData("map",map,"from"))
	. . . . set newNames(name,cnt,"to")=$get(gdeData("map",map,"to"))
	;
	set (cnt,name)=""
	for  set name=$order(newNames(name)) quit:name=""  do
	. set cnt=$increment(cnt)
	. set regionMap(name)=""
	;
	quit *regionMap
