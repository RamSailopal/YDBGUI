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
; PARAMS:
; resJson			array byRef
; params			array byRef
; ****************************************************************
getDashboard(resJson,params)
	new res,jsonErr,ret,cnt,regionsData,file,files,region,devices
	new lastIndex,mountpoint,ldevices,ldevice,warnings,list,region,regions
	new file,fbuffer,envVars
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
	;
	; get env vars
	set file="/proc/self/environ"
	open file:readonly use file read fbuffer close file
	set *envVars=$$SPLIT^%MPIECE(fbuffer,$char(0))
	;
	set cnt="" for  set cnt=$order(envVars(cnt)) quit:cnt=""  do
	. set res("data","systemInfo","envVars",cnt,"name")=$piece(envVars(cnt),"=")
	. set res("data","systemInfo","envVars",cnt,"value")=$piece(envVars(cnt),"=",2)
	;
	; get plugins information
	set res=$zsearch(-1)
	for  set file=$zsearch("$ydb_dist/plugin/o/*.so") quit:file=""  do
	. set files($increment(files),"name")=$zparse(file,"name")
	. set files($order(files(""),-1),"description")="Library file: "_file
	. set files($order(files(""),-1),"version")="n/a"
	. set files($order(files(""),-1),"vendor")="n/a"
	;
	merge res("data","systemInfo","plugins")=files
	zkill res("data","systemInfo","plugins")
	;
	; check gld file existance
	set res=$zsearch(-1)
	set res("data","gld","exist")=$select($zsearch($zgbldir)="":"false",1:"true")
	if res("data","gld","exist")="false" goto getDashboardQuit
	;
	; enumerate regions
	do enumRegions^%ydbguiGde(.regions)
	; get single region data
	s region="" for  set region=$order(regions(region)) quit:region=""  do
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
	. ;
	. if $get(regionsData(region,"journal","flags","mountpoint"))'="" do
	. . set lastIndex=lastIndex+1
	. . set devices(regionsData(region,"journal","flags","mountpoint"),lastIndex,"region")=region
	. . set devices(regionsData(region,"journal","flags","mountpoint"),lastIndex,"file")=$get(regionsData(region,"journal","flags","file"))
	. . set devices(regionsData(region,"journal","flags","mountpoint"),lastIndex,"device")=$get(regionsData(region,"journal","flags","device"))
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
; PARAMS:
; arguments			array byRef
; resJson			array byRef
; ****************************************************************
deleteRegion(resJson,arguments)
	;
	s resJson="{""result"":""OK""}"
	;
	quit ""
	;
	;
; ****************************************************************
; extendRegion(resJson,arguments)
;
; PARAMS:
; arguments			array byRef
; body				array byRef
; resJson			array byRef
; ****************************************************************
extendRegion(arguments,body,resJson)
	new jsonErr,res,region,blocks,mupipCmd,ret,shellData
	;
	set region=$get(arguments("region"))
	if region="" do  goto extendRegionQuit
	. set res("result")="ERR"
	. set res("error","description")="The parameter ""region"" is missing or empty"
	;
	set blocks=$get(arguments("blocks"))
	if +blocks=0 do  goto extendRegionQuit
	. set res("result")="ERR"
	. set res("error","description")="The parameter ""blocks"" is missing or not valid"
	;
	set mupipCmd="mupip EXTEND "_region_" -BLOCKS="_blocks
	set ret=$$runShell^%ydbguiUtils(mupipCmd,.shellData)
	;
	if ret'=0 do  goto extendRegionQuit
	. set res("result")="ERR"
	. set res("error","description")="The shell returned the following error: "_ret
	;
	if $find($get(shellData(2)),"Extension successful") do
	. set res("result")="OK"
	else  do
	. set res("result")="ERR"
	. set res("error","description")=$select($get(shellData(1))="":"unknown",1:shellData(1))
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
; PARAMS:
; arguments			array byRef
; body				array byRef
; resJson			array byRef
; ****************************************************************
journalSwitch(arguments,body,resJson)
	new jsonErr,res,region,turn,mupipCmd,ret,shellData
	;
	set region=$get(arguments("region"))
	if region="" do  goto journalSwitchQuit
	. set res("result")="ERR"
	. set res("error","description")="The parameter ""region"" is missing or empty"
	;
	set turn=$zconvert($get(arguments("turn")),"u")
	if turn'="ON",turn'="OFF" do  goto journalSwitchQuit
	. set res("result")="ERR"
	. set res("error","description")="The parameter ""turn"" must be either ""on"" or ""off"""
	;
	set mupipCmd="mupip SET -JOURNAL="_turn_" -region "_region
	set ret=$$runShell^%ydbguiUtils(mupipCmd,.shellData)
	;
	if ret'=0 do  goto journalSwitchQuit
	. set res("result")="ERR"
	. set res("error","description")="The shell returned the following error: "_ret
	;
	if $find($get(shellData(1)),"%YDB-I-JNLSTATE")!($find($get(shellData(4)),"%YDB-I-JNLSTATE"))!($find($get(shellData(1)),"%YDB-I-JNLCREATE")) do
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
	set mupipCmd="mupip CREATE -REGION="_region
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
; PARAMS:
; arguments			array byRef
; body				array byRef
; resJson			array byRef
; ****************************************************************
validatePath(arguments,bodyJson,resJson)
	new jsonErr,body,res,dir,ret,shellResult,command
	new dirRights
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
	set ret=$zsearch(body("path"))
	if ret'="" do  goto validatePathQuit
	. ; error
	. set res("result")="ERROR"
	. set res("error","description")="File aready exists..."
	;
	set dir=$zparse(body("path"),"directory")
	; check permissions 
	set ret=$$tryCreateFile(dir)
	if ret=0 do  goto validatePathQuit
	. ; error
	. set res("result")="ERROR"
	. set res("error","description")="Couldn't access the path..."
	;
	set res("data","validation")=$zsearch(dir)
	set res("data","fileExist")=$zsearch(body("path"))
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
; tryCreateFile(filename)
; ;
; PARAMS:
; filename		string
; RETURNS:
; >0				OK
; 0					Could NOT create the file
; ****************************************************************
tryCreateFile:(dir)
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
