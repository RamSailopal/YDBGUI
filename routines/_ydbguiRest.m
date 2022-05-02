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
	set res("data","systemInfo","gld")=$zgld
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
	set res("data","gld","exist")=$select($zsearch($zgld)="":"false",1:"true")
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
