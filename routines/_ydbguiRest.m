%ydbguiRest ; REST handlers; 05-07-2021
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
; getAll(resJson,params)
;
; Related URL: GET api/dashboard/getAll
;
; PARAMS:
; resJson			array byRef
; params			array byRef
; ****************************************************************
getDashboard(resJson,params)
	new res,jsonErr,ret,cnt,regionsData,file,files,region,devices
	new lastIndex,mountpoint,ldevices,ldevice,warnings,list,region,regions
	new file,fbuffer,envVars,mountpoint
	;
	set warnings=0
	;
	; get ydb release
	set res("data","ydb_version")=$piece($zyrelease," ",2)
	;
	; get system info
	set res("data","systemInfo","zroutines")=$zroutines
	set res("data","systemInfo","gld")=$zgbldir
	set res("data","systemInfo","chset")=$zchset
	; Encryption library
	set res("data","systemInfo","encryptionLibrary")=$select($zsearch("$ydb_dist/plugin/libgtmcrypt.so",-1)="":"false",1:"true")
	;
	; get env vars
	set file="/proc/self/environ"
	open file:readonly use file read fbuffer close file
	set *envVars=$$SPLIT^%MPIECE(fbuffer,$char(0))
	;
	set cnt="" for  set cnt=$order(envVars(cnt)) quit:cnt=""  do
	. set res("data","systemInfo","envVars",cnt,"name")=$piece(envVars(cnt),"=")
	. set res("data","systemInfo","envVars",cnt,"value")=$piece(envVars(cnt),"=",2,99)
	;
	; get plugins information
	set res=$zsearch("",-1)
	for  set file=$zsearch("$ydb_dist/plugin/o/*.so") quit:file=""  do
	. set files($increment(files),"name")=$zparse(file,"name")
	. set files($order(files(""),-1),"description")="Library file: <br>"_file
	. set files($order(files(""),-1),"version")="n/a"
	. set files($order(files(""),-1),"vendor")="n/a"
	;
	merge res("data","systemInfo","plugins")=files
	zkill res("data","systemInfo","plugins")
	;
	; check gld file existance
	set res("data","gld","exist")=$select($zsearch($zgbldir,-1)="":"false",1:"true")
	if res("data","gld","exist")="false" goto getDashboardQuit
	;
	; enumerate regions
	do enumRegions^%ydbguiGde(.regions)
	;
	; reorganize the array so that numbering is correct
	set region="" for  set region=$order(regions(region)) quit:region=""  do
	. kill regionData
	. do getRegionStruct^%ydbguiRegions(region,.regionData,.warnings)
	. merge regionsData(region)=regionData
	;
	merge res("data","regions")=regionsData
	;
	; compute devices
	set (region,lastIndex)=0
	for  set region=$order(regionsData(region)) quit:region=""  do
	. if $get(regionsData(region,"dbFile","flags","mountpoint"))'="" do
	. . set lastIndex=lastIndex+1
	. . set devices(regionsData(region,"dbFile","flags","mountpoint"),lastIndex,"region")=region
	. . set devices(regionsData(region,"dbFile","flags","mountpoint"),lastIndex,"file")=$get(regionsData(region,"dbFile","flags","file"))
	. . set devices(regionsData(region,"dbFile","flags","mountpoint"),lastIndex,"device")=$get(regionsData(region,"dbFile","flags","device"))
	. . set devices(regionsData(region,"dbFile","flags","mountpoint"),lastIndex,"fsBlockSize")=$get(regionsData(region,"dbFile","flags","fsBlockSize"))
	. . set devices(regionsData(region,"dbFile","flags","mountpoint"),lastIndex,"deviceId")=$get(regionsData(region,"dbFile","flags","deviceId"))
	. . set devices(regionsData(region,"dbFile","flags","mountpoint"),lastIndex,"iNodesTotal")=$get(regionsData(region,"dbFile","flags","iNodesTotal"))
	. . set devices(regionsData(region,"dbFile","flags","mountpoint"),lastIndex,"iNodesFree")=$get(regionsData(region,"dbFile","flags","iNodesFree"))
	. . ;
	. if $get(regionsData(region,"journal","flags","mountpoint"))'="" do
	. . set lastIndex=lastIndex+1
	. . set devices(regionsData(region,"journal","flags","mountpoint"),lastIndex,"region")=region
	. . set devices(regionsData(region,"journal","flags","mountpoint"),lastIndex,"file")=$get(regionsData(region,"journal","flags","file"))
	. . set devices(regionsData(region,"journal","flags","mountpoint"),lastIndex,"device")=$get(regionsData(region,"journal","flags","device"))
	. . set devices(regionsData(region,"journal","flags","mountpoint"),lastIndex,"fsBlockSize")=$get(regionsData(region,"journal","flags","fsBlockSize"))
	. . set devices(regionsData(region,"journal","flags","mountpoint"),lastIndex,"deviceId")=$get(regionsData(region,"journal","flags","deviceId"))
	. . set devices(regionsData(region,"journal","flags","mountpoint"),lastIndex,"iNodesTotal")=$get(regionsData(region,"journal","flags","iNodesTotal"))
	. . set devices(regionsData(region,"journal","flags","mountpoint"),lastIndex,"iNodesFree")=$get(regionsData(region,"journal","flags","iNodesFree"))
	;
	; reset the first leg
	set mountpoint=0
	for  set mountpoint=$order(devices(mountpoint)) quit:mountpoint=""  do
	. set cnt=$order(devices(mountpoint,"")) if cnt>1 do
	. . merge devices(mountpoint,1)=devices(mountpoint,cnt)
	. . kill devices(mountpoint,cnt)
	;
	set (lastIndex,cnt)=0
	for  set cnt=$order(devices(cnt)) quit:cnt=""  do
	. set lastIndex=lastIndex+1
	. merge ldevices(lastIndex,"usedBy")=devices(cnt)
	. set ldevice=$get(devices(cnt,1,"device"))
	. ; piecing out the device information returned by the shell
	. ; "type totalBlocks usedBlocks freeBlocks percentUsed mountPoint"
	. set ldevices(lastIndex,"type")=$piece(ldevice," ",1)
	. set ldevices(lastIndex,"totalBlocks")=$piece(ldevice," ",2)
	. set ldevices(lastIndex,"usedBlocks")=$piece(ldevice," ",3)
	. set ldevices(lastIndex,"freeBlocks")=$piece(ldevice," ",4)
	. set ldevices(lastIndex,"percentUsed")=$extract($p(ldevice," ",5),1,$length($piece(ldevice," ",5))-1)
	. set ldevices(lastIndex,"mountPoint")=$piece(ldevice," ",6)
	. set ldevices(lastIndex,"fsBlockSize")=devices(cnt,1,"fsBlockSize")
	. set ldevices(lastIndex,"deviceId")=devices(cnt,1,"deviceId")
	. set ldevices(lastIndex,"iNodesTotal")=devices(cnt,1,"iNodesTotal")
	. set ldevices(lastIndex,"iNodesFree")=devices(cnt,1,"iNodesFree")
	;
	; remove unused data by the client
	set cnt=0 for  set cnt=$order(ldevices(cnt)) quit:cnt=""  do
	. set lastIndex="" for  set lastIndex=$order(ldevices(cnt,"usedBy",lastIndex)) quit:lastIndex=""  do
	. . kill ldevices(cnt,"usedBy",lastIndex,"device")
	;
	merge res("data","devices")=ldevices
	;
getDashboardQuit
	; all ok, set status
	set res("result")=$select($data(warnings)>1:"WARNING",1:"OK")
	if $data(warnings)>1 merge res("data","warnings")=warnings zkill res("data","warnings")
	;
	do encode^%webjson($name(res),$name(resJson),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the data to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	;
	quit
	;
	;
; ****************************************************************
; getRegion(resJson,arguments)
;
; Related URL: GET api/regions/{region}
;
; PARAMS:
; resJson			array byRef
; arguments			array byRef
; ****************************************************************
getRegion(resJson,arguments)
	new res,jsonErr,ret,cnt,regionName,regionData,warnings
	;
	set warnings=0
	;
	set regionName=$zconvert($get(arguments("region")),"u")
	;
	do getRegionStruct^%ydbguiRegions(regionName,.regionData,.warnings)
	merge res("data")=regionData
	;
	; all ok, set status
	set res("result")=$select($data(warnings)>1:"WARNING",1:"OK")
	if $data(warnings)>1 merge res("data","warnings")=warnings zkill res("data","warnings")
	;
	do encode^%webjson($name(res),$name(resJson),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the data to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	quit
	;
	;
; ****************************************************************
; deleteRegion(resJson,arguments)
;
; Related URL: DELETE api/regions/{region}
;
; PARAMS:
; resJson			array byRef
; arguments			array byRef
; ****************************************************************
deleteRegion(resJson,arguments)
	new jsonErr,res,regionName,regions,deleteFiles
	;
	; check if param exists
	set regionName=$get(arguments("region"))
	if regionName="" do  goto deleteRegionQuit
	. set res("result")="ERR"
	. set res("error","description")="The parameter ""region"" is missing or empty"
	;
	set deleteFiles=$data(arguments("deletefiles"))
	;
	set regionName=$zconvert(regionName,"u")
	;
	; check if region exists
	do enumRegions^%ydbguiGde(.regions)
	if $data(regions(regionName))=0 do  goto deleteRegionQuit
	. set res("result")="ERR"
	. set res("error","description")="The region "_regionName_" doesn't exist"
	;
	; perform the delete
	set *res=$$delete^%ydbguiRegions(regionName,deleteFiles)
	;
deleteRegionQuit
	do encode^%webjson($name(res),$name(resJson),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the data to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	quit
	;
	;
; ****************************************************************
; extendRegion(arguments,body,resJson)
;
; Related URL: POST api/regions/{region}/extend
;
; PARAMS:
; arguments			array byRef
; body				array byRef
; resJson			array byRef
; ****************************************************************
extendRegion(arguments,body,resJson)
	new jsonErr,res,region,blocks,mupipCmd,ret,shellData,regions
	;
	; check if param region exist
	set region=$get(arguments("region"))
	if region="" do  goto extendRegionQuit
	. set res("result")="ERR"
	. set res("error","description")="The parameter ""region"" is missing or empty"
	;
	set region=$zconvert(region,"u")
	;
	; check if region exists
	do enumRegions^%ydbguiGde(.regions)
	if $data(regions(region))=0 do  goto extendRegionQuit
	. set res("result")="ERR"
	. set res("error","description")="The region "_region_" doesn't exist"
	;
	; check the blocks parameter
	set blocks=$get(arguments("blocks"))
	if +blocks=0 do  goto extendRegionQuit
	. set res("result")="ERR"
	. set res("error","description")="The parameter ""blocks"" is missing or not valid"
	;
	set mupipCmd="$ydb_dist/mupip EXTEND "_region_" -BLOCKS="_blocks
	set ret=$$runShell^%ydbguiUtils(mupipCmd,.shellData)
	;
	if ret'=0 do  goto extendRegionQuit
	. set res("result")="ERR"
	. set res("error","description")="The shell returned the following error: "_ret
	;
	set res("result")="OK"
	;
extendRegionQuit
	do encode^%webjson($name(res),$name(resJson),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the data to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	quit ""
	;
	;
; ****************************************************************
; journalSwitch(resJson,arguments)
;
; Related URL: POST api/regions/{region}/journalSwitch
;
; PARAMS:
; arguments			array byRef
; body				array byRef
; resJson			array byRef
; ****************************************************************
journalSwitch(arguments,body,resJson)
	new jsonErr,res,region,turn,mupipCmd,ret,shellData
	;
	; check if param region exist
	set region=$get(arguments("region"))
	if region="" do  goto journalSwitchQuit
	. set res("result")="ERR"
	. set res("error","description")="The parameter ""region"" is missing or empty"
	;
	set region=$zconvert(region,"u")
	;
	; check if region exists
	do enumRegions^%ydbguiGde(.regions)
	if $data(regions(region))=0 do  goto journalSwitchQuit
	. set res("result")="ERR"
	. set res("error","description")="The region "_region_" doesn't exist"
	;
	; check the turn parameter
	set turn=$zconvert($get(arguments("turn")),"u")
	if turn'="ON",turn'="OFF" do  goto journalSwitchQuit
	. set res("result")="ERR"
	. set res("error","description")="The parameter ""turn"" must be either ""on"" or ""off"""
	;
	set mupipCmd="$ydb_dist/mupip SET -JOURNAL="_turn_" -region "_region
	set ret=$$runShell^%ydbguiUtils(mupipCmd,.shellData)
	;
	if ret'=0 do  goto journalSwitchQuit
	. set res("result")="ERR"
	. set res("error","description")=$select(ret=10:"The journal file couldn't be found",1:"The shell returned the following error: "_ret)
	;
	if $find($get(shellData(1)),"%YDB-I-JNLSTATE")!($find($get(shellData(4)),"%YDB-I-JNLSTATE"))!($find($get(shellData(1)),"%YDB-I-JNLCREATE"))!($find($get(shellData(1)),"%YDB-I-FILERENAME"))!($find($get(shellData(1)),"%YDB-I-JNLFNF")) do
	. set res("result")="OK"
	else  do
	. set res("result")="ERR"
	. set res("error","description")=$select($get(shellData(1))="":"unknown",1:shellData(1))
	;
journalSwitchQuit
	do encode^%webjson($name(res),$name(resJson),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the data to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	quit ""
	;
	;
; ****************************************************************
; createDb(resJson,arguments)
;
; Related URL: POST api/regions/{region}/createDb
;
; PARAMS:
; arguments			array byRef
; body				array byRef
; resJson			array byRef
; ****************************************************************
createDb(arguments,body,resJson)
	new jsonErr,res,region,mupipCmd,ret,shellData
	;
	set region=$get(arguments("region"))
	if region="" do  goto createDbQuit
	. set res("result")="ERR"
	. set res("error","description")="The parameter ""region"" is missing or empty"
	;
	set mupipCmd="$ydb_dist/mupip CREATE -REGION="_region
	set ret=$$runShell^%ydbguiUtils(mupipCmd,.shellData)
	;
	if ret=84 do  goto createDbQuit
	. set res("result")="ERR"
	. set res("error","description")="The database already exists"
	;
	if ret'=0,ret'=84 do  goto createDbQuit
	. set res("result")="ERR"
	. set res("error","description")="The shell returned the following error: "_ret
	;
	if $find($get(shellData(1)),"%YDB-I-DBFILECREATED") do
	. set res("result")="OK"
	else  do
	. set res("result")="ERR"
	. set res("error","description")=$select($get(shellData(1))="":"unknown",1:shellData(1))
	;
createDbQuit
	do encode^%webjson($name(res),$name(resJson),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the data to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	quit ""
	;
	;
; ****************************************************************
; getTemplates(resJson,arguments)
;
; Related URL: GET api/dashboard/getTemplates
;
; PARAMS:
; resJson			array byRef
; arguments			array byRef
; ****************************************************************
getTemplates(resJson,arguments)
	new res,jsonErr,templates,key,value,type
	;
	; get templates
	set *templates=$$getTemplates^%ydbguiGde()
	;
	; get limits
	do ^GDEINIT
	;
	; map everything
	set key="" for  set key=$order(templates("region",key)) quit:key=""  do
	. quit:key="FILE_NAME"
	. set value=templates("region",key)
	. kill templates("region",key)
	. set templates("region",key,"value")=value
	. set templates("region",key,"min")=minreg(key)
	. set templates("region",key,"max")=maxreg(key)
	;
	for type="BG","MM" do
	. set key="" for  set key=$order(templates("segment",type,key)) quit:key=""  do
	. . set value=templates("segment",type,key)
	. . kill templates("segment",type,key)
	. . set templates("segment",type,key,"value")=value
	. . set templates("segment",type,key,"min")=$g(minseg(type,key))
	. . set templates("segment",type,key,"max")=$g(maxseg(type,key))
	;
	merge res("data")=templates
	set res("result")="OK"
	;
	do encode^%webjson($name(res),$name(resJson),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the data to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	quit
	;
	;
; ****************************************************************
; parseNamespace(arguments,body,resJson)
;
; Related URL: POST api/regions/parseNamespace
;
; PARAMS:
; arguments			array byRef
; body				array byRef
; resJson			array byRef
; ****************************************************************
parseNamespace(arguments,bodyJson,resJson)
	new jsonErr,body,gdeCommand,shellResult,map,regions,region,res,cnt
	;
	; get region list to ensure we have a valid name
	do enumRegions^%ydbguiGde(.regions)
	;
	; and extract the first name
	set region=$order(regions(""))
	;
	; get the namespace
	do decode^%webjson($name(bodyJson),$name(body),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the body to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	; check params
	if $get(body("namespace"))="" do  goto parseNamespaceQuit
	. set res("result")="ERROR"
	. set result("error","description")="The body parameter: 'namespace' is missing or empty"
	;
	; escape the quotes for the shell
	set map("""")="\"""
	set body("namespace")=$$^%MPIECE(body("namespace"),"""","\""")
	; and execute the GDE
	set gdeCommand="$ydb_dist/yottadb -r GDE  <<< "
	set gdeCommand=gdeCommand_"""add -name "_body("namespace")_" -r="_region_$char(10)_"quit"_$char(10)_""""
	set ret=$$runShell^%ydbguiUtils(gdeCommand,.shellResult,"/bin/bash")
	if ret<0 do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Error: "_ret_" while parsing the namespace."_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	set res("result")="OK"
	set res("data","parseResult")=$get(shellResult(7))
	set:res("data","parseResult")="GDE> " res("data","parseResult")="OK"
	;
parseNamespaceQuit
	do encode^%webjson($name(res),$name(resJson),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the data to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	quit ""
	;
; ****************************************************************
; validatePath(arguments,body,resJson)
;
; Related URL: POST api/regions/validatePath
;
; PARAMS:
; arguments			array byRef
; body				array byRef
; resJson			array byRef
; ****************************************************************
validatePath(arguments,bodyJson,resJson)
	new jsonErr,body,res,dir,ret,shellResult,command
	new deviceInfo
	;
	; get the full path
	do decode^%webjson($name(bodyJson),$name(body),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the body to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	; check params
	if $get(body("path"))="" do  goto validatePathQuit
	. set res("result")="ERROR"
	. set result("error","description")="The body parameter: 'path' is missing or empty"
	;
	; check if file exists first
	set ret=$zsearch(body("path"),-1)
	if ret'="" do  goto validatePathQuit
	. ; error
	. set res("result")="ERROR"
	. set res("error","description")="File aready exists..."
	;
	set dir=$zparse(body("path"),"directory")
	; check permissions
	set ret=$$tryCreateFile^%ydbguiUtils(dir)
	if ret=0 do  goto validatePathQuit
	. ; error
	. set res("result")="ERROR"
	. set res("error","description")="Couldn't access the path..."
	;
	set res("data","validation")=$zsearch(dir,-1)
	set res("data","fileExist")=$zsearch(body("path"))
	;
	; get the device info to extract the block size of the device needed for ASYNCIO validation
	if res("data","validation")'="" do
	. set ret=$$runShell^%ydbguiUtils("stat -fc %s "_dir,.deviceInfo)
	. set res("data","deviceBlockSize")=$get(deviceInfo(1),0)
	else  set res("data","deviceBlockSize")=0
	;
	set res("result")="OK"
	;
validatePathQuit
	do encode^%webjson($name(res),$name(resJson),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the data to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	quit ""
	;
	;
; ****************************************************************
; addRegion(arguments,body,resJson)
;
; Related URL: POST api/regions/add
;
; PARAMS:
; arguments			array byRef
; body				array byRef
; resJson			array byRef
; ****************************************************************
addRegion(arguments,bodyJson,resJson)
	new res,body,jsonErr
	; decode the body
	do decode^%webjson($name(bodyJson),$name(body),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the body to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	; Perform the creation
	set *res=$$create^%ydbguiRegions(.body)
	;
	do encode^%webjson($name(res),$name(resJson),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the data to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	quit ""
	;
	;
; ****************************************************************
; editRegion(arguments,body,resJson)
;
; PARAMS:
; arguments			array byRef
; body				array byRef
; resJson			array byRef
; ****************************************************************
editRegion(arguments,bodyJson,resJson)
	new res,body,jsonErr
	; decode the body
	do decode^%webjson($name(bodyJson),$name(body),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the body to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	; Perform the edit
	set *res=$$edit^%ydbguiRegions(.body)
	;
	do encode^%webjson($name(res),$name(resJson),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the data to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	quit ""
	;
	;
; ****************************************************************
; error(resJson,arguments)
;
; Related URL: 	GET api/test/error/
;				DELETE api/test/error
;
; PARAMS:
; resJson			array byRef
; arguments			array byRef
; ****************************************************************
error(resJson,arguments)
	s a=1/0
	;
	quit
	;
	;
; ****************************************************************
; errorPost(arguments,bodyJson,resJson)
;
; Related URL: POST api/test/error
;
; PARAMS:
; resJson			array byRef
; arguments			array byRef
; ****************************************************************
errorPost(arguments,bodyJson,resJson)
	s a=1/0
	;
	quit
	;
	;
; ****************************************************************
; getAllLocks(resJson,arguments)
;
; Related URL: 	GET api/regions/locks/getAll
;
; PARAMS:
; resJson			array byRef
; arguments			array byRef
; ****************************************************************
getAllLocks(resJson,arguments)
	new res,jsonErr
	;
	set *res=$$getAll^%ydbguiLocks()
	;
	do encode^%webjson($name(res),$name(resJson),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the data to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	quit
	;
	;
; ****************************************************************
; clearLock(arguments,bodyJson,resJson)
;
; Related URL: POST api/regions/locks/clear
;
; PARAMS:
; resJson			array byRef
; arguments			array byRef
; ****************************************************************
clearLock(arguments,bodyJson,resJson)
	new res,jsonErr,namespace
	;
	if $get(arguments("namespace"))="" do  goto clearLockQuit
	. set res("result")="ERROR"
	. set res("error","description")="No parameter: namespace was passed"
	;
	set *res=$$clear^%ydbguiLocks(arguments("namespace"))
	;
clearLockQuit
	do encode^%webjson($name(res),$name(resJson),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the data to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	quit ""
	;
	;
; ****************************************************************
; terminateProcess(arguments,bodyJson,resJson)
;
; Related URL: POST api/os/processes/{pid}/terminate
;
; PARAMS:
; resJson			array byRef
; arguments			array byRef
; ****************************************************************
restart(resJson,arguments)
	;
	Set action=$G(^GUISYS("restart"))
	If $G(^GUISYS("restart-status"))="restarting" D
	. set res("status")="Already started" 
	. set res("date")=^GUISYS("restart-date")
    . set res("time")=^GUISYS("restart-time")
	. set res("process")=^GUISYS("restart-process")
    . set res("errCode")=$G(^GUISYS("error"))
	E  D
	. If action'="" Kill ^GUISYS("restart-status") D
	. Set DateTime=$zdate($h,"MON DD YYYY/12:60:SS")
    . Set Date=$Piece(DateTime,"/",1)
	. Set Time=$Piece(DateTime,"/",2)
    . Set ^GUISYS("restart-date")=Date
	. Set ^GUISYS("restart-time")=Time
	. Set ^GUISYS("restart-process")=$J
	. Set ^GUISYS("error")=""
	. Quit:$G(^GUISYS("restart-status"))="restarting"
    . Set ^GUISYS("restart-status")="restarting"
	. Set $ZTRAP="G restartErrorHandle^%ydbguiRest"
	. Set DateTime=$zdate($h,"MON DD YYYY/12:60:SS")
    . Set Date=$Piece(DateTime,"/",1)
	. Set Time=$Piece(DateTime,"/",2)
    . Set ^GUISYS("restart-date")=Date
	. Set ^GUISYS("restart-time")=Time
	. do @action
    . Set ^GUISYS("restart-process")="Finished"
	. Set ^GUISYS("restart-status")="restarted"
	. set res("status")=$G(^GUISYS("restart-status"),"No Action")
	. set res("date")=$G(^GUISYS("restart-date"),"No date")
    . set res("time")=$G(^GUISYS("restart-time"),"No time")
	. set res("process")=$G(^GUISYS("restart-process"),"No process")
	. set res("errCode")=$G(^GUISYS("error"),"")
	set res("routine")=$G(^GUISYS("restart"),"No routine set")
	set res("result")="OK"
	;
restartQuit
	do encode^%webjson($name(res),$name(resJson),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the data to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	quit ""
restartStatus(resJson,arguments)
	;
	If $G(^GUISYS("restart-status"))'="" D
	. Set cmd="ps -ef | awk -v pid='"_^GUISYS("restart-process")_"' '$2==pid { found=1 } END { if (found==1)  { print 1 } else { print 0 } }'"
    . open "Files":(command=cmd:readonly:stderr="Errors")::"PIPE"
    . use "Files" read RESP
	. close "Files"
    . I (RESP'="1")&(^GUISYS("restart-status")="restarting") D
	.. set res("restart-status")="crashed"
	.. set ^GUISYS("restart-process")=""
	.. set ^GUISYS("restart-status")="crashed"
	.. set res("errCode")=^GUISYS("error")
	set res("status")=$G(^GUISYS("restart-status"),"No Action")
	set res("date")=$G(^GUISYS("restart-date"),"No date")
    set res("time")=$G(^GUISYS("restart-time"),"No time")
	set res("routine")=$G(^GUISYS("restart"),"No routine set")
	set res("process")=$G(^GUISYS("restart-process"),"No process")
	set res("errCode")=$G(^GUISYS("error"),"")
	I res("process")="Finished" D
	. S res("status")="restarted"
	. S ^GUISYS("restart-status")="restarted"
	. S ^GUISYS("errCode")=""
	set res("result")="OK"
	;
restartStatusQuit
	do encode^%webjson($name(res),$name(resJson),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the data to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	quit ""
restartErrorHandle
    S ^GUISYS("error")=$ZSTATUS
    Set ^GUISYS("restart-process")=""
	Set ^GUISYS("restart-status")="crashed"
	set res("status")=$G(^GUISYS("restart-status"),"No Action")
	set res("date")=$G(^GUISYS("restart-date"),"No date")
    set res("time")=$G(^GUISYS("restart-time"),"No time")
	set res("process")=$G(^GUISYS("restart-process"),"No process")
	set res("errCode")=$G(^GUISYS("error"),"")
	set res("routine")=$G(^GUISYS("restart"),"No routine set")
	set res("result")="OK"
	;
restartErrorQuit
	do encode^%webjson($name(res),$name(resJson),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the data to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	quit ""
terminateProcess(arguments,bodyJson,resJson)
	new res,jsonErr,pid,ret,shellResult
	;
	; Validate pid at first
	set pid=+$get(arguments("pid"),0)
	if pid=0 do  goto terminateProcessQuit
	. set res("reuslt")="ERROR"
	. set res("error","description")="Process: 0 is not a valid process id."
	;
	; Check if process exists
	if $zgetjpi(pid,"ISPROCALIVE")=0 do  goto terminateProcessQuit
	. set res("result")="ERROR"
	. set res("error","description")="Process "_pid_" doesn't exist"
	;
	set ret=$$terminateProcess^%ydbguiUtils(pid)
	if ret'=0 do  goto terminateProcessQuit
	. set res("result")="ERROR"
	. if ret=99997 set res("error","description")="The process: "_pid_" could not be terminated" quit
	. if ret=99998 set res("error","description")="The process: "_pid_" is not a YottaDB process" quit
	. if ret=99999 set res("error","description")="The process: "_pid_" is not running anymore"
	. else  set res("error","description")="Error: "_ret
	;
	set res("result")="OK"
	;
terminateProcessQuit
	do encode^%webjson($name(res),$name(resJson),$name(jsonErr))
	if $data(jsonErr) do  quit
	. ; FATAL, can not convert json
	. do setError^%webutils("500","Can not convert the data to JSON"_$c(13,10)_"Contact YottaDB to report the error") quit:$quit "" quit
	;
	quit ""
	;
	;
	;
