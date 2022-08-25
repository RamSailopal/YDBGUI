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
	new gdeData,res,segmentFilename,journalFilename,fhead,cnt,deviceInfo,users
	new fheadOk,dataCnt,map,newNames,name,regionMap,mapCnt,lsof,lockBuffer,record,devInfo
	new gdeSegmentData,gdeRegionData,gdeJournalData
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
	. set segmentFilename=$zsearch(gdeData("segments","FILE_NAME"),-1)
	. if segmentFilename="" do
	. . ; no file found on file system, fill data from GDE for the GUI to create file
	. . set dataCnt=0
	. . set regionData("dbFile","flags","fileExist")="false"
	. . set regionData("dbFile","flags","fileBad")="true"
	. . ; get GDE segment data
	. . set *gdeSegmentData=$$populateGdeSegmentData(.gdeData)
	. . merge regionData("dbFile","data")=gdeSegmentData
	. . ; get GDE region
	. . set *gdeRegionData=$$populateGdeRegionData(.gdeData)
	. . merge regionData("dbAccess","data")=gdeRegionData
	. . ; get GDE journal
	. . set *gdeJournalData=$$populateGdeJournalData(.gdeData)
	. . merge regionData("journal","data")=gdeJournalData
	. ;
	. else  do
	. . set regionData("dbFile","flags","file")=segmentFilename
	. . ; file found on file system
	. . set regionData("dbFile","flags","fileExist")=$select(segmentFilename="":"false",1:"true")
	. . ;
	. . ;execute FHEAD and try to read the header
	. . set ret=$$runShell^%ydbguiUtils("$ydb_dist/mupip dumpfhead -r "_regionName,.fhead)
	. . if ret'=0 do
	. . . ; error while executing dumpfhead
	. . . set warnings($increment(warnings))="Error occurred while fetching the FHEAD for region: "_regionName_" error is: "_ret
	. . . set regionData("dbFile","flags","fileBad")="true"
	. . else  do
	. . . ; dumfhead was ok, parse it
	. . . set fheadOk=1
	. . . set regionData("dbFile","flags","fileBad")="false"
	. . . ; here we populate the array: record using indirection
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
	. . . kill users
	. . . set ret=$$dbnopen(segmentFilename,.users),regionData("dbFile","flags","shmenHealthy")="true"
	. . . if ret>-1 do  quit
	. . . . set regionData("dbFile","flags","sessions")=ret
	. . . . merge regionData("dbFile","flags","processes")=users
	. . . if ret=-999999 do  quit
	. . . . ; shmem error, try to open the region and check if it got fixed
	. . . . set ret=$$tryOpenRegion(regionName)
	. . . . if ret=0 set regionData("dbFile","flags","sessions")="n/a",regionData("dbFile","flags","shmenHealthy")="false"
	. . . . else  kill users set ret=$$dbnopen(segmentFilename,.users) if ret=999999 set regionData("dbFile","flags","shmenHealthy")="false" quit
	. . . ;
	. . . if ret=-130 set regionData("dbFile","flags","fileBad")="true" quit
	. . . ; process extra errors
	. . . set warnings($increment(warnings))="Error occurred while fetching the users for region: "_regionName_" error is: "_ret
	. . . set regionData("dbFile","flags","sessions")="n/a"
	;
	goto:regionData("dbFile","flags","fileExist")="false" getRegionNames
	;
	; Process journal flags
	set journalFilename=$zsearch($extract(record("sgmnt_data.jnl_file_name"),1,record("sgmnt_data.jnl_file_len")),-1)
	set regionData("journal","flags","gdeFilename")=gdeData("region","FILE_NAME")
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
	set regionData("dbAccess","data",$increment(dataCnt),"INST_FREEZE_ON_ERROR")=$select(record("sgmnt_data.freeze_on_fail"):"true",1:"false")
	set regionData("dbAccess","data",$increment(dataCnt),"LOCK_CRIT_SEPARATE")=$select(record("sgmnt_data.lock_crit_with_db"):"true",1:"false")
	set regionData("dbAccess","data",$increment(dataCnt),"NULL_SUBSCRIPTS")=$select(record("sgmnt_data.null_subs")=0:"Never",record("sgmnt_data.null_subs")=1:"Always",1:"Existing")
	set regionData("dbAccess","data",$increment(dataCnt),"QDBRUNDOWN")=$select(record("sgmnt_data.mumps_can_bypass"):"true",1:"false")
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
	set regionData("journal","data",$increment(dataCnt),"JEXTENSION_SIZE")=record("sgmnt_data.jnl_deq")
	set regionData("journal","data",$increment(dataCnt),"JALLOCATION")=record("sgmnt_data.jnl_alq")
	;
	;
	; Statistical data
	set dataCnt=0
	set regionData("stats","1-logicalOperations","caption")="Logical Database operations"
	set regionData("stats","1-logicalOperations","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_set")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_set"))
	set regionData("stats","1-logicalOperations","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_kill")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_kill"))
	set regionData("stats","1-logicalOperations","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_get")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_get"))
	set regionData("stats","1-logicalOperations","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_data")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_data"))
	set regionData("stats","1-logicalOperations","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_order")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_order"))
	set regionData("stats","1-logicalOperations","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_zprev")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_zprev"))
	set regionData("stats","1-logicalOperations","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_query")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_query"))
	;
	set dataCnt=0
	set regionData("stats","2-locks","caption")="M Lock Operations"
	set regionData("stats","2-locks","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_lock_success")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_lock_success"))
	set regionData("stats","2-locks","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_lock_fail")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_lock_fail"))
	;
	set dataCnt=0
	set regionData("stats","3-transactions","caption")="Transactions"
	set regionData("stats","3-transactions","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_nontp_retries_0")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_nontp_retries_0"))
	set regionData("stats","3-transactions","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_nontp_retries_1")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_nontp_retries_1"))
	set regionData("stats","3-transactions","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_nontp_retries_2")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_nontp_retries_2"))
	set regionData("stats","3-transactions","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_nontp_retries_3")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_nontp_retries_3"))
	;
	set dataCnt=0
	set regionData("stats","4-journal","caption")="Journal information"
	set regionData("stats","4-journal","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_jfile_bytes")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_jfile_bytes"))
	set regionData("stats","4-journal","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_jnl_flush")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_jnl_flush"))
	set:+record("sgmnt_data.jnl_sync_io")=0 regionData("stats","4-journal","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_jnl_fsync")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_jnl_fsync"))
	set regionData("stats","4-journal","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_jrec_epoch_regular")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_jrec_epoch_regular"))
	;
	set dataCnt=0
	set regionData("stats","5-csa","caption")="Critical Section Aquisition"
	set regionData("stats","5-csa","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_crit_success")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_crit_success"))
	set regionData("stats","5-csa","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_crit_fail")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_crit_failed"))
	set regionData("stats","5-csa","data",$increment(dataCnt),"sgmnt_data.gvstats_rec.n_crit_in_epch")=$$FUNC^%HD(record("sgmnt_data.gvstats_rec.n_crits_in_epch"))
	;
	; locks
	set *lockBuffer=$$getLocksData^%ydbguiLocks(regionName)
	if $data(lockBuffer) merge regionData("locks")=lockBuffer
	else  do
	. set warnings($increment(warnings))="Error occurred while fetching the locks for region: "_regionName_" error is: "_ret
	. set regionData("locks","processesOnQueue")="N/A"
	. set regionData("locks","slotsInUse")="N/A"
	. set regionData("locks","slotsBytesInUse")="N/A"
	. set regionData("locks","estimatedFreeLockSpace")="N/A"
	;
	; Now process the names
	;
getRegionNames
	; is this a default region ?
	if gdeData("names","*")=regionName do  goto namesFinalize
	. set regionMap(1,"name")="*"
	. set regionMap(1,"ranges",1,"from")=""
	. set regionMap(1,"ranges",1,"to")=""
	. set regionMap(1,"type")="*"
	;
	; Regular region
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
namesFinalize
	merge regionData("names")=regionMap
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
	new gldData,autoDbFlag,shellResult,USEMUPIP,USEGDE
	;
	; init main vars
	set NL=$char(10)
	set (segmentCmd,regionCmd,segmentTcmd,regionTcmd,cmd)=""
	set (autoDbFlag,warningFlag)=0
	set USEMUPIP=1,USEGDE=0
	;
	; create backup of the .gld file
	set *gldData=$$backupGld()
	if gldData=0 do  goto createQuit
	. zkill gldData
	. merge res=gldData
	;
	; create command header and terminators
	set cmdHeader="$ydb_dist/yottadb -r GDE"
	set cmdExit=" exit"_NL
	set cmdQuit=" quit"_NL
	;
	; create templates commands if needed
	if body("templates","updateTemplateDb")="true",$data(body("segmentData")) set segmentTcmd=$$buildSegmentCommand(.body,USEGDE)
	if (body("templates","updateTemplateDb")="true")&($data(body("dbAccess","region")))!(body("templates","updateTemplateJournal")="true"&($data(body("dbAccess","journal")))) set regionTcmd=$$buildRegionCommand(.body,.autoDbFlag)
	;
	; create now the commands for the region
	if (body("templates","updateTemplateDb")="false"&($data(body("segmentData"))))!(body("segmentTypeBg")="false") set segmentCmd=$$buildSegmentCommand(.body,USEGDE)
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
	; create backup of the .gld file
	set *gldData=$$backupGld()
	if gldData=0 do  goto deleteQuit
	. zkill gldData
	. merge res=gldData
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
	if deleteFiles do  goto:$get(res("result"))="ERROR" deleteQuit
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
; ****************************************************************
; edit:(body)
;
; PARAMS:
; body					array byRef
; RETURN
; res					array byRef (response JDOM)
; ****************************************************************
edit(body)
	new res,shellResult,ret,NL,cnt,verifyStatus,ix
	new mupipSegment,mupipRegion,mupipJournal
	new gdeSegment,gdeRegion,gdeNames,gdeJournal,USEGDE,USEMUPIP
	new cmdMupip,cmdGde,cmdGdeJournal,cmdMupipJournal,cmdExit,cmdQuit
	new tempRes
	;
	set (gdeSegment,gdeRegion,gdeNames,cmdMupip,cmdMupipJournal,cmdGde,cmdGdeJournal)=""
	set NL=$char(10)
	set cmdExit=" exit"_NL
	set cmdQuit=" quit"_NL
	set USEMUPIP=1,USEGDE=0
	set body("journalUpdateGde")=$get(body("journalUpdateGde"),"false")
	set body("journalUpdateMupip")=$get(body("journalUpdateMupip"),"false")
	;
	; ---------------------
	; create cmd strings
	; ---------------------
	;
	; Process names
	if $data(body("names"))>9 do
	. set body("updateGde")="true"
	. set ix=0 for  set ix=$order(body("names",ix)) quit:ix=""  do
	. . if $data(body("names",ix,"new")),body("names",ix,"new")="true" do  quit
	. . . set gdeNames=gdeNames_"ADD -name "_body("names",ix,"value")_" -REGION="_body("regionName")_NL
	. . if $data(body("names",ix,"deleted")),body("names",ix,"deleted")="true" do
	. . . set gdeNames=gdeNames_"DELETE -name "_body("names",ix,"value")_NL
	;
	; GDE
	; GDE is used for: initialAllocation, autoDb and journal filename
	set ix="" for  set ix=$order(body("segmentData",ix)) quit:ix=""  do
	. set:body("segmentData",ix,"id")="initialAllocation"!(body("segmentData",ix,"id")="blockSize") body("updateGde")="true"
	set ix="" for  set ix=$order(body("dbAccess","region",ix)) quit:ix=""  do
	. set:body("dbAccess","region",ix,"id")="autoDb" body("updateGde")="true"
	if $get(body("updateGde"))="true"!(body("segmentFilename")'="")!(body("journalUpdateGde")="true") do
	. set gdeSegment=$$buildSegmentCommand(.body,USEGDE)
	. set gdeRegion=$$buildRegionCommandEdit(.body,USEGDE)
	. set gdeJournal=$$buildJournalCommandEdit(.body,USEGDE)
	. if body("segmentFilename")'="" set gdeSegment=gdeSegment_" -FILE_NAME="""_body("segmentFilename")_"""",body("updateGde")="true"
	;
	; Create MUPIP string
	set mupipSegment=$$buildSegmentCommand(.body,USEMUPIP)
	set mupipRegion=$$buildRegionCommandEdit(.body,USEMUPIP)
	set mupipJournal=$$buildJournalCommandEdit(.body,USEMUPIP)
	if mupipSegment'=""!(mupipRegion'="") set cmdMupip="$ydb_dist/mupip SET -region "_body("regionName")_" "_mupipSegment_" "_mupipRegion_NL
	if mupipJournal'="" set cmdMupipJournal="$ydb_dist/mupip SET -region "_body("regionName")_" "_mupipJournal_NL
	;
	; Create GDE string
	if body("updateGde")="true"!(body("journalUpdateGde")="true") do
	. set:gdeRegion'="" cmdGde=cmdGde_"CHANGE  -REGION "_body("regionName")_" "_gdeRegion_NL
	. set:gdeSegment'="" cmdGde=cmdGde_"CHANGE  -SEGMENT "_body("regionName")_" "_gdeSegment_NL
	. set:gdeJournal'="" cmdGdeJournal=cmdGdeJournal_"CHANGE  -REGION "_body("regionName")_" "_gdeJournal_NL
	. set:gdeNames'="" cmdGde=cmdGde_gdeNames_NL
	. ;
	. ;finalize command
	. if $get(body("debugMode")) do
	. . if cmdGde'="" set cmdGde=cmdGde_"VERIFY"_NL_cmdQuit_NL ;this will verify and exit without saving:
	. . if cmdGdeJournal'="" set cmdGdeJournal=cmdGdeJournal_"VERIFY"_NL_cmdQuit_NL ;this will verify and exit without saving:
	. else  do
	. . if cmdGde'="" set cmdGde=cmdGde_NL_cmdExit_NL
	. . if cmdGdeJournal'="" set cmdGdeJournal=cmdGdeJournal_NL_cmdExit_NL
	;
	; Execute MUPIP journal first (if needed)
	if cmdMupipJournal'="" do  goto:$get(res("result"))="ERROR" editQuit
	. set *tempRes=$$executeMupip(cmdMupipJournal)
	. merge res=tempRes
	;
	; then segment / region MUPIP
	if cmdMupip'="" do  goto:$get(res("result"))="ERROR" editQuit
	. set *tempRes=$$executeMupip(cmdMupip)
	. merge res=tempRes
	;
	; Execute GDE if needed
	if body("updateGde")="true"!(body("journalUpdateGde")="true") do
	. if cmdGdeJournal'="" set *tempRres=$$executeGde(cmdGdeJournal)
	. if cmdGde'="" set *tempRes=$$executeGde(cmdGde)
	. merge res=tempRes
	;
editQuit
	quit *res
	;
	;
; ------------------------------------------------------------------------------
; ------------------------------------------------------------------------------
; ------------------------------------------------------------------------------
; LOCAL ROUTINES
; ------------------------------------------------------------------------------
; ------------------------------------------------------------------------------
; ------------------------------------------------------------------------------
;
executeMupip(command)
	new shellResult,verifyStatus,cnt,ret,ix,res,wcnt
	;
	set verifyStatus=1
	set (cnt,wcnt)=0
	set ret=$$runShell^%ydbguiUtils(command,.shellResult)
	; and parse the result
	set ix="" for  set ix=$order(shellResult(ix)) quit:ix=""!(verifyStatus=0)  do
	. if $find(shellResult(ix),"%YDB-W-WCWRNNOTCHG") set verifyStatus=0
	. if $find(shellResult(ix),"UPD") set wcnt=wcnt+1,res("warnings",wcnt)=shellResult(ix)
	. if $find(shellResult(ix),"SZCHG") set wcnt=wcnt+1,res("warnings",wcnt)=shellResult(ix)
	;
	if verifyStatus=0 do
	. ; Couldn't complete the operation
	. set res("result")="ERROR"
	. set res("error","description")="Error: "_ret_" executing MUPIP command: "_cmdMupip
	. merge res("error","dump")=shellResult
	; Ok or warnings
	else  set res("result")=$select($data(res("warnings"))=0:"OK",1:"WARNING")
	;
	quit *res
	;
executeGde(command)
	new shellResult,verifyStatus,cnt,ret,ix,res
	;
	; create backup of the .gld file
	set *gldData=$$backupGld()
	if gldData=0 do  goto executeGdeQuit
	. zkill gldData
	. merge res=gldData
	;
	set (cnt,verifyStatus)=0
	set ret=$$runIntShell^%ydbguiUtils("$ydb_dist/yottadb -r GDE",command,.shellResult)
	; and parse the result
	set ix="" for  set ix=$order(shellResult(ix)) quit:ix=""!(verifyStatus=1)  do
	. quit:ix<4
	. if shellResult(ix)="%GDE-I-VERIFY, Verification OK" set verifyStatus=1 quit
	. if shellResult(ix)'="",shellResult(ix)'="GDE> " set cnt=cnt+1,verifyStatus(cnt)=shellResult(ix)
	;
	if $data(verifyStatus)>9 do
	. set res("result")=$select(verifyStatus=1:"WARNING",1:"ERROR")
	. set res("error","description")="Error executing GDE command: "_cmdGde
	. if verifyStatus=1 merge res("warnings")=verifyStatus zkill res("warnings")
	. if verifyStatus=0 merge res("error","dump")=verifyStatus zkill res("error","dump")
	;
	if $get(res("result"))="" set res("result")="OK"
	;
executeGdeQuit
	quit *res
	;
	;
buildSegmentCommand:(body,mupipFlag) ; Builds a command to update the segment in add and edit mode
	; Only the edit mode uses the mupipFlag set
	new ix,field,cmd
	;
	set cmd=""
	;
	; Segment type
	if $get(body("segmentTypeBg"))'="" do
	. ; Add mode
	. set cmd=cmd_"-ACCESS_METHOD="_$select(body("segmentTypeBg")="true":"BG",1:"MM")
	else  do
	. ; Edit mode
	. if $get(body("changeAccessMethod"))="true" do
	. . set cmd=cmd_"-ACCESS_METHOD="_body("newAccessMethod")
	;
	; Params from array
	set ix="" for  set ix=$order(body("segmentData",ix)) quit:ix=""  do
	. set field=body("segmentData",ix,"id")
	. do:mupipFlag=0
	. . set:field="initialAllocation" cmd=cmd_" -ALLOCATION="_body("segmentData",ix,"value")
	. . set:field="blockSize" cmd=cmd_" -BLOCK_SIZE="_body("segmentData",ix,"value")
	. . set:field="encryptionFlag" cmd=cmd_" -"_$select(body("segmentData",ix,"value")=0:"NO",1:"")_"ENCRYPTION"
	. . set:field="globalBufferCount" cmd=cmd_" -GLOBAL_BUFFER_COUNT="_body("segmentData",ix,"value")
	. set:field="globalBufferCount"&(mupipFlag=1) cmd=cmd_" -GLOBAL_BUFFERS="_body("segmentData",ix,"value")
	. set:field="asyncIo" cmd=cmd_" -"_$select(body("segmentData",ix,"value")=0:"NO",1:"")_"ASYNCIO"
	. set:field="deferAllocate" cmd=cmd_" -"_$select(body("segmentData",ix,"value")=0:"NO",1:"")_"DEFER_ALLOCATE"
	. set:field="extensionCount" cmd=cmd_" -EXTENSION_COUNT="_body("segmentData",ix,"value")
	. set:field="lockSpace" cmd=cmd_" -LOCK_SPACE="_body("segmentData",ix,"value")
	. set:field="mutexSlots" cmd=cmd_" -MUTEX_SLOTS="_body("segmentData",ix,"value")
	;
	quit cmd
	;
	;
buildRegionCommand:(body,autoDbFlag) ; Builds a command to update the region in add mode
	new ix,field,cmd,cmdRegion
		;
	set cmd=""
	;
	do:$data(body("dbAccess","region"))
	. set ix="" for  set ix=$order(body("dbAccess","region",ix)) quit:ix=""  do
	. . set field=body("dbAccess","region",ix,"id")
	. . set:field="autoDb" cmd=cmd_" -"_$select(body("dbAccess","region",ix,"value")=0:"NO",1:"")_"AUTODB",autoDbFlag=body("dbAccess","region",ix,"value")
	. . set:field="recordSize" cmd=cmd_" -RECORD_SIZE="_body("dbAccess","region",ix,"value")
	. . set:field="keySize" cmd=cmd_" -KEY_SIZE="_body("dbAccess","region",ix,"value")
	. . set:field="nullSubscripts" cmd=cmd_" -NULL_SUBSCRIPTS="_$select(body("dbAccess","region",ix,"value")=0:"NEVER",body("dbAccess","region",ix,"value")=1:"ALWAYS",1:"EXISTING")
	. . set:field="collation" cmd=cmd_" -COLLATION_DEFAULT="_body("dbAccess","region",ix,"value")
	. . set:field="lockCriticalSeparate" cmd=cmd_" -"_$select(body("dbAccess","region",ix,"value")=0:"NO",1:"")_"LOCK_CRIT_SEPARATE"
	. . set:field="qbRundown" cmd=cmd_" -"_$select(body("dbAccess","region",ix,"value")=0:"NO",1:"")_"QDBRUNDOWN"
	. . set:field="stats" cmd=cmd_" -"_$select(body("dbAccess","region",ix,"value")=0:"NO",1:"")_"STATS"
	set cmdRegion=cmd,cmd=""
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
	. . set:field="extension" cmd=cmd_"EXTENSION="_body("dbAccess","journal",ix,"value")_","
	. . set:field="epochTaper" prefixString=" -"_$select(body("dbAccess","journal",ix,"value")=0:"NO",1:"")_"EPOCHTAPER "
	. ;
	. if $extract(cmd,$length(cmd))="(" set cmd=""
	. else  set cmd=prefixString_$extract(cmd,1,$length(cmd)-1)_$select($find(cmd,"IMAGE"):")",1:",BEFORE_IMAGE)")
	;
	set:body("journalEnabled")="false" cmd=cmd_" -NOJOURNAL"
	;
	quit cmdRegion_cmd
	;
	;
buildRegionCommandEdit:(body,mupipFlag) ; Builds a command to update the region in edit mode
	new ix,field,cmd
		;
	set cmd=""
	set jFilename=$get(jFilename)
	;
	set ix="" for  set ix=$order(body("dbAccess","region",ix)) quit:ix=""  do
	. set field=body("dbAccess","region",ix,"id")
	. set:field="autoDb"&(mupipFlag=0) cmd=cmd_" -"_$select(body("dbAccess","region",ix,"value")=0:"NO",1:"")_"AUTODB"
	. set:field="collation"&(mupipFlag=0) cmd=cmd_" -COLLATION_DEFAULT="_body("dbAccess","region",ix,"value")
	. set:field="recordSize" cmd=cmd_" -RECORD_SIZE="_body("dbAccess","region",ix,"value")
	. set:field="keySize" cmd=cmd_" -KEY_SIZE="_body("dbAccess","region",ix,"value")
	. set:field="nullSubscripts" cmd=cmd_" -NULL_SUBSCRIPTS="_$select(body("dbAccess","region",ix,"value")=0:"NEVER",body("dbAccess","region",ix,"value")=1:"ALWAYS",1:"EXISTING")
	. set:field="lockCriticalSeparate" cmd=cmd_" -"_$select(body("dbAccess","region",ix,"value")=0:"NO",1:"")_$select(mupipFlag=0:"LOCK_CRIT_SEPARATE",1:"LCK_SHARES_DB_CRIT")
	. set:field="qbRundown" cmd=cmd_" -"_$select(body("dbAccess","region",ix,"value")=0:"NO",1:"")_"QDBRUNDOWN"
	. set:field="stats" cmd=cmd_" -"_$select(body("dbAccess","region",ix,"value")=0:"NO",1:"")_"STATS"
	;
	quit cmd
	;
	;
buildJournalCommandEdit:(body,mupipFlag) ; Builds a command to update the journal in edit mode
	new ix,field,cmd,prefixString
		;
	set (cmd,prefixString)=""
	;
	do:$data(body("dbAccess","journal"))!(body("journalFilename")'="")
	. set cmd=cmd_" -JOURNAL="
	. if body("journalFilename")'="" do
	. . if ((mupipFlag=0&(body("journalUpdateGde")="true"))!(mupipFlag=1&(body("journalUpdateMupip")="true")))!(body("changeJournal")="true") do
	. . . set cmd=cmd_$select(mupipFlag=0:"FILE_NAME",1:"FILENAME")_"="""_body("journalFilename")_""","_$select(mupipFlag=0:"",1:"ENABLE,ON,")
	. set ix="" for  set ix=$order(body("dbAccess","journal",ix)) quit:ix=""  do
	. . set field=body("dbAccess","journal",ix,"id")
	. . set:field="syncIo"&(mupipFlag) cmd=cmd_$select(body("dbAccess","journal",ix,"value")=0:"NO",1:"")_"SYNC_IO,"
	. . set:field="yieldLimit"&(mupipFlag) cmd=cmd_"YIELD_LIMIT="_body("dbAccess","journal",ix,"value")_","
	. . set:field="epochInterval"&(mupipFlag) cmd=cmd_"EPOCH_INTERVAL="_body("dbAccess","journal",ix,"value")_","
	. . set:field="beforeImage" cmd=cmd_$select(body("dbAccess","journal",ix,"value")=0:"NO",1:"")_"BEFORE_IMAGE,"
	. . set:field="allocation" cmd=cmd_"ALLOCATION="_body("dbAccess","journal",ix,"value")_","
	. . set:field="autoSwitchLimit" cmd=cmd_"AUTOSWITCHLIMIT="_body("dbAccess","journal",ix,"value")_","
	. . set:field="bufferSize" cmd=cmd_"BUFFER_SIZE="_body("dbAccess","journal",ix,"value")_","
	. . set:field="extension" cmd=cmd_"EXTENSION="_body("dbAccess","journal",ix,"value")_","
	. . set:field="epochTaper" prefixString=" -"_$select(body("dbAccess","journal",ix,"value")=0:"NO",1:"")_"EPOCHTAPER "
	. ;
	. if $extract(cmd,$length(cmd))="," set cmd=$extract(cmd,1,$length(cmd)-1)
	;
	if prefixString'="" do
	. if $extract(cmd,$l(cmd))="=" set cmd=prefixString
	. else  set:prefixString'="" cmd=prefixString_cmd
	;
	set:body("changeJournal")="true"&(body("journalFilename")="") cmd=" -NOJOURNAL"
	;
	quit cmd
	;
	;
; ****************************************************************
; dbnopen:(dbfile)	; Report number of processes accessing a YottaDB database file
; Return value:
; - >=0: file is a database file, number of processes that have it open
; - <0: errors
; - -999999: file is a database file that is not open by any processes, but has a shared memory segment
; - -130 file does not exist or is not a database file
; - other: other error return codes from processes in PIPE devices
; ****************************************************************
dbnopen(dbfile,users)	; Report number of processes accessing a YottaDB database file
	new i,io,line,nproc,shmid,shellResult,ret
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
	;
	if nproc>0 do
	. set ret=$$runShell^%ydbguiUtils("grep ' "_shmid_"' /proc/*/maps",.shellResult) do:ret=0!(ret=2)
	. . set ret="" for  set ret=$o(shellResult(ret)) quit:ret=""  do
	. . . set users(ret)=$piece(shellResult(ret),"/",3)
	;
	quit $select(nproc:nproc,1:-999999)
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
	;
	;
; ****************************************************************
; backupGld
; creates a backup of the .gld file
;
; PARAMS:
;
; RETURNS:
; array with 1 or error subscripts
; ****************************************************************
backupGld()
	new gldPath,gldFilename,cpCmd,shellResult,res
	;
	set res=0
	;
	set gldPath=$zparse($zgbldir,"DIRECTORY")
	set gldFilename=$zparse($zgbldir,"NAME")_".bak"
	set cpCmd="cp "_$zgbldir_" "_gldPath_"/"_gldFilename
	set ret=$$runShell^%ydbguiUtils(cpCmd,.shellResult)
	if ret<0 do
	. set res("result")="WARNING"
	. set warningFlag=warningFlag+1
	. set res("error",warningFlag,"description")="Couldn't create the backup file. Error: "_ret
	. merge res("error",warningFlag,"dump")=shellResult
	else  set res=1
	;
	quit *res
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
	set ret=$$^%PEEKBYNAME("sgmnt_data.blk_size",regionName)
	;
tryOpenRegionQuit
	quit ret
	;
	;
	;
	;
	;
	;
; ****************************************************************
; populateGdeSegmentData(gdeData)
; ;
; PARAMS:
; gdeData			array
; RETURNS:
; array by ref
; ****************************************************************
populateGdeSegmentData(gdeData)
	new ret,dataCnt
	;
	set dataCnt=0
	set ret($increment(dataCnt),"FILE_NAME")=gdeData("segments","FILE_NAME")
	set ret($increment(dataCnt),"AUTO_DB")=$select(gdeData("region","AUTODB")=0:"false",1:"true")
	set ret($increment(dataCnt),"ACCESS_METHOD")=gdeData("segments","ACCESS_METHOD")
	set:gdeData("segments","ACCESS_METHOD")="BG" ret($increment(dataCnt),"GLOBAL_BUFFER_COUNT")=gdeData("segments","GLOBAL_BUFFER_COUNT")
	set ret($increment(dataCnt),"LOCK_SPACE")=gdeData("segments","LOCK_SPACE")
	set:gdeData("segments","ACCESS_METHOD")="BG" ret($increment(dataCnt),"ASYNCIO")=$select(gdeData("segments","ASYNCIO")=0:"false",1:"true")
	set ret($increment(dataCnt),"DEFER_ALLOCATE")=$select(gdeData("segments","DEFER_ALLOCATE")=0:"false",1:"true")
	set ret($increment(dataCnt),"EXTENSION_COUNT")=gdeData("segments","EXTENSION_COUNT")
	set ret($increment(dataCnt),"ALLOCATION")=gdeData("segments","ALLOCATION")
	set ret($increment(dataCnt),"BLOCK_SIZE")=gdeData("segments","BLOCK_SIZE")
	set ret($increment(dataCnt),"ENCRYPTION_FLAG")=gdeData("segments","ENCRYPTION_FLAG")
	set ret($increment(dataCnt),"FILE_NAME")=gdeData("segments","FILE_NAME")
	set:gdeData("segments","ACCESS_METHOD")="BG" ret($increment(dataCnt),"MUTEX_SLOTS")=gdeData("segments","MUTEX_SLOTS")
	;
	quit *ret
	;
	;
; ****************************************************************
; populateGdeRegionData(gdeData)
; ;
; PARAMS:
; gdeData			array
; RETURNS:
; array by ref
; ****************************************************************
populateGdeRegionData(gdeData)
	new ret,dataCnt
	;
	set dataCnt=0
	set ret($increment(dataCnt),"RECORD_SIZE")=gdeData("region","RECORD_SIZE")
	set ret($increment(dataCnt),"KEY_SIZE")=gdeData("region","KEY_SIZE")
	set ret($increment(dataCnt),"COLLATION_DEFAULT")=gdeData("region","COLLATION_DEFAULT")
	set ret($increment(dataCnt),"INST_FREEZE_ON_ERROR")=$select(gdeData("region","INST_FREEZE_ON_ERROR")=0:"false",1:"true")
	set ret($increment(dataCnt),"LOCK_CRIT_SEPARATE")=$select(gdeData("region","LOCK_CRIT_SEPARATE")=0:"false",1:"true")
	set ret($increment(dataCnt),"NULL_SUBSCRIPTS")=$select(gdeData("region","NULL_SUBSCRIPTS")=0:"Never",gdeData("region","NULL_SUBSCRIPTS")=0=1:"Always",1:"true")
	set ret($increment(dataCnt),"QDBRUNDOWN")=$select(gdeData("region","QDBRUNDOWN")=0:"false",1:"true")
	set ret($increment(dataCnt),"STATS")=$select(gdeData("region","STATS")=0:"false",1:"true")
	;
	quit *ret
	;
	;
; ****************************************************************
; populateGdeJournalData(gdeData)
; ;
; PARAMS:
; gdeData			array
; RETURNS:
; array by ref
; ****************************************************************
populateGdeJournalData(gdeData)
	new ret,dataCnt
	;
	set dataCnt=0
	set ret($increment(dataCnt),"JFILE_NAME")=gdeData("region","FILE_NAME")
	set ret($increment(dataCnt),"BEFORE")=$select(gdeData("region","BEFORE_IMAGE")=0:"false",1:"true")
	set ret($increment(dataCnt),"EPOCH_INTERVAL")=gdeData("region","EPOCH_INTERVAL")
	set ret($increment(dataCnt),"EPOCH_TAPER")=$select(gdeData("region","EPOCHTAPER")=0:"false",1:"true")
	set ret($increment(dataCnt),"SYNC_IO")=$select(gdeData("region","SYNC_IO")=0:"false",1:"true")
	set ret($increment(dataCnt),"AUTO_SWITCH_LIMIT")=gdeData("region","AUTOSWITCHLIMIT")
	set ret($increment(dataCnt),"ALIGNSIZE")=gdeData("region","ALIGNSIZE")
	set ret($increment(dataCnt),"BUFFER_SIZE")=gdeData("region","BUFFER_SIZE")
	set ret($increment(dataCnt),"YIELD_LIMIT")=gdeData("region","YIELD_LIMIT")
	set ret($increment(dataCnt),"JEXTENSION_SIZE")=gdeData("region","EXTENSION")
	set ret($increment(dataCnt),"JALLOCATION")=gdeData("region","ALLOCATION")
	;
	quit *ret
	;
