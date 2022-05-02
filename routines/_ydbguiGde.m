%ydbguiGde ; YottaDB Gde; 05-07-2021
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
; **************************
; verifyGldFile
;
; RETURNS:
; 1		Verify OK
; 0		Verify BAD
; <0	Shell error occurred
    ;
; **************************
verifyGldFile()
    new gdequit,io,useio
    ;
    set gdequiet=1
    set io=$io
    set useio="io"
    do setup
    quit $$ALL^GDEVERIF
    ;
    ;
; **************************
; enumRegions(regions)
;
; PARAMS:
; regions		array byRef
; **************************
enumRegions(regions)
    new ERR,gdequiet,gdeweberror,gdewebquit
    new useio,io,varsRetLabel,region
    ;
    ; push GDE variables in the stack
    set varsRetLabel="enumRegions2"
    goto pushVars
    ;
enumRegions2
    set gdequiet=1
    set io=$io
    set useio="io"
    do setup
    ;
    set region="" for  set region=$order(regs(region)) quit:region=""  do
    . set regions(region)=""
    zkill regions
    ;
    quit
    ;
; **************************
; getRegion(regionName,buffer)
; **************************
getRegion(regionName,buffer)
    new ERR,gdequiet,gdeweberror,gdewebquit
    new useio,io,varsRetLabel,region
    ;
    ; push GDE variables in the stack
    set varsRetLabel="getRegion2"
    goto pushVars
    ;
getRegion2
    set gdequiet=1
    set io=$io
    set useio="io"
    do setup
    ;
    do NAM2MAP^GDEMAP ; get human readable mapping names
    new mapreg,mapdispmaxlen,index set mapreg="",mapdispmaxlen=0 DO mapdispcalc
    set s1=$order(map("$"))
    if s1'="%" set map("%")=map("$"),s1="%"
    for index=1:1  set s2=s1,s1=$order(map(s2)) quit:'$zlength(s1)  do onemap(s1,s2)
    do onemap("...",s2)
    set index=index+1
    if $data(nams("#")) set s2="LOCAL LOCKS",map(s2)=nams("#") do onemap("",s2) kill map(s2)
    ;
    merge buffer("names")=nams
    zkill buffer("names")
    merge buffer("map")=map2
    merge buffer("globalNames")=gnams
    zkill buffer("globalNames")
    ;
    ;
    merge buffer("region")=regs(regionName)
    zkill buffer("region")
    ;
    merge buffer("segments")=segs(regionName)
    zkill buffer("segments")
    ;
    quit
    ;
    ; =========================================================================
    ; Common functions
    ; =========================================================================
    ;
    ;
    ; Performs all of the required setup to execute global directory editor internal commands. ;
    ; Also sets up various error traps, etc. ;
    ;
    ;
setup
    new debug
    set debug=""
    ; Based off of DBG^GDE
    ; Save parent process context before GDE tampers with it for its own necessities. ;
    ; Most of it is stored in the "gdeEntryState" local variable in subscripted nodes. ;
    ; Exceptions are local collation related act,ncol,nct values which have to be stored in in unsubscripted
    ; variables to prevent COLLDATAEXISTS error as part of the $$set^%LCLCOL below. ;
    new gdeEntryState,gdeEntryStateAct,gdeEntryStateNcol,gdeEntryStateNct
    set gdeEntryStateAct=$$get^%LCLCOL
    set gdeEntryStateNcol=$$getncol^%LCLCOL
    set gdeEntryStateNct=$$getnct^%LCLCOL
    ; Set local collation to what GDE wants to operate. Errors while doing so will have to exit GDE right away. ;
    ; Prepare special $etrap to issue error in case VIEW "YLCT" call to set local collation fails below
    ; Need to use this instead of the gde $etrap (set a few lines later below) as that expects some initialization
    ; to have happened whereas we are not yet there since setting local collation is a prerequisite for that init. ;
    set $etrap="w !,$p($zs,"","",3,999) s $ecode="""" d message^GDE(150503603,""""_$zparse(""$ydb_gbldir"","""",""*.gld"")_"""") quit"
    ; since GDE creates null subscripts, we don't want user level setting of gtm_lvnullsubs to affect us in any way
    set gdeEntryState("nullsubs")=$view("LVNULLSUBS")
    view "LVNULLSUBS"
    set gdeEntryState("zlevel")=$zlengthevel-1
    set gdeEntryState("io")=$io
    set $etrap=$select(debug:"b:$zs'[""%GDE""!allerrs  ",1:"")_"g:(""%GDE%NONAME""[$p($p($zs,"","",3),""-"")) SHOERR^GDE d ABORT^GDE"
    set io=$io,useio="io",comlevel=0,combase=$zlength,resume(comlevel)=$zlength_":INTERACT"
    if $$set^%PATCODE("M")
    set gdequiet=1
    ; GDEINIT sets up required variables
    ; GDEMSGIN sets up gdeerror map between text and zmessage number
    ; GDFIND finds the global directory
    ; CREATE/LOAD creates or reads the global directory
    do GDEINIT^GDEINIT,GDEMSGIN^GDEMSGIN,GDFIND^GDESETGD,CREATE^GDEGET:create,LOAD^GDEGET:'create
    set useio="io"
    set io=$io
    ; Using the GDE Defaults isn't an error. Kill it so the webservices can move on
    if ($get(gdeweberror("count"))=1),gdeweberror(1)["%GDE-I-GDUSEDEFS" kill gdeweberror
    quit
    ;
    ; This converts object properties from boolean true/false to integer 1/0
    ;
    ; @input object - gde object structure
booltoint(object)
    new REGION,SEGMENT,ITEM
    ; There is nothing in names that would need to be converted
    set REGION="" for  set REGION=$order(object("data","regions",REGION)) quit:REGION=""  do
    . set ITEM="" for ITEM="NULL_SUBSCRIPTS","STDNULLCOLL","JOURNAL","INST_FREEZE_ON_ERROR","QDBRUNDOWN","EPOCHTAPER","AUTODB","STATS","LOCK_CRIT_SEPARATE","BEFORE_IMAGE" do
    . . if $get(object("data","regions",REGION,ITEM))="true" set object("data","regions",REGION,ITEM)=1
    . . else  if $get(object("data","regions",REGION,ITEM))="false" set object("data","regions",REGION,ITEM)=0
    set SEGMENT="" for  set SEGMENT=$order(object("data","segments",SEGMENT)) quit:SEGMENT=""  do
    . set ITEM="" for ITEM="ENCRYPTION_FLAG","DEFER_ALLOCATE","ASYNCIO" do
    . . if $get(object("data","segments",SEGMENT,ITEM))="true" set object("data","segments",SEGMENT,ITEM)=1
    . . else  if $get(object("data","segments",SEGMENT,ITEM))="false" set object("data","segments",SEGMENT,ITEM)=0
    quit
    ;
    ; This converts object properties from integer 1/0 to boolean true/false
    ;
    ; @input object - gde object structure
inttobool(object)
    new REGION,SEGMENT,ITEM
    ; There is nothing in names that would need to be converted
    set REGION="" for  set REGION=$order(object("data","regions",REGION)) quit:REGION=""  do
    . set ITEM="" for ITEM="NULL_SUBSCRIPTS","STDNULLCOLL","JOURNAL","INST_FREEZE_ON_ERROR","QDBRUNDOWN","EPOCHTAPER","AUTODB","STATS","LOCK_CRIT_SEPARATE","BEFORE_IMAGE" do
    . . if $get(object("data","regions",REGION,ITEM))=1 set object("data","regions",REGION,ITEM)="true"
    . . else  if $get(object("data","regions",REGION,ITEM))=0 set object("data","regions",REGION,ITEM)="false"
    set SEGMENT="" for  set SEGMENT=$order(object("data","segments",SEGMENT)) quit:SEGMENT=""  do
    . set ITEM="" for ITEM="ENCRYPTION_FLAG","DEFER_ALLOCATE","ASYNCIO" do
    . . if $get(object("data","segments",SEGMENT,ITEM))=1 set object("data","segments",SEGMENT,ITEM)="true"
    . . else  if $get(object("data","segments",SEGMENT,ITEM))=0 set object("data","segments",SEGMENT,ITEM)="false"
    quit
    ;
    ; =========================================================================
    ; Internal line tags below... ;
    ; =========================================================================
    ;
    ; This calculates the display names. It is copied from GDESHOW and modified to move results to map2
    ;
    ; @input map - Global Directory map information
    ;
mapdispcalc:
    new coll,gblname,isplusplus,m,mapdisplen,mlen,mprev,mtmp,name,namedisp,namelen,offset
    set m=""
    for  set mprev=m,m=$order(map(m)) quit:'$zlength(m)  do
    . if $zlength(mapreg),(mapreg'=map(m)),('$zlength(mprev)!(mapreg'=map(mprev))) quit
    . set offset=$zfind(m,ZERO,0)
    . if offset=0  set mapdisp(m)=$translate(m,")","0") quit  ; no subscripts case. finish it off first
    . set gblname=$ze(m,1,offset-2),coll=+$g(gnams(gblname,"COLLATION")),mlen=$zlength(m)
    . set isplusplus=$$isplusplus^GDEMAP(m,mlen)
    . set mtmp=$select(isplusplus:$ze(m,1,mlen-1),1:m)  ; if ++ type map entry, remove last 01 byte before converting it into gvn
    . set name=$zcollate(mtmp_ZERO_ZERO,coll,1)
    . if isplusplus set name=name_"++"
    . set namelen=$zlength(name),name=$ze(name,2,namelen) ; remove '^' at start of name
    . set namedisp=$$namedisp(name,0)
    . set mapdisp(m)=namedisp,mapdisplen=$zwidth(namedisp)
    . if mapdispmaxlen<mapdisplen set mapdispmaxlen=mapdisplen
    quit
    ;
    ; Convert passed name to a name that is displayable (i.e. if it contains control characters, they are replaced by $c() etc.)
    ; (called from mapdispcalc and onemap)
    ;
    ; @param {Array} name - Name from map data to convert to display name
    ; @param {Integer} addquote - 0 = no surrounding double-quotes are added. 1 = when control characters are seen (e.g. $c(...)) return
    ;                                 the name with double-quotes
    ; @returns {String} - Display name of passed name
    ;
namedisp:(name,addquote)
    ; returns a
    new namezwrlen,namezwr,namedisplen,namedisp,ch,quotestate,starti,i,seenquotestate3,doublequote
    set namezwr=$zwrite(name) ; this will convert all control characters to $c()/$zc() notation
    ; But $zwrite will introduce more double-quotes than we want to display; so remove them
    ; e.g. namezwr = "MODELNUM("""_$C(0)_""":"""")"
    set namezwrlen=$zlength(namezwr),namedisp="",doublequote=""""
    set namedisp="",namedisplen=0,quotestate=0
    for i=1:1:namezwrlen  set ch=$ze(namezwr,i) do
    . if (quotestate=0) do  quit
    . . if (ch=doublequote) set quotestate=1,starti=i+1  quit
    . . ; We expect ch to be "$" here
    . . set quotestate=3
    . if (quotestate=1) do  quit
    . . if ch'=doublequote quit
    . . set quotestate=2  set namedisp=namedisp_$ze(namezwr,starti,i-1),namedisplen=namedisplen+(i-starti),starti=i+1 quit
    . if (quotestate=2) do  quit
    . . ; At this point ch can be either doublequote or "_"
    . . set quotestate=$select(ch=doublequote:1,1:0)
    . . if ch="_" do  quit
    . . . if (($ze(namedisp,namedisplen)'=doublequote)!($ze(namedisp,namedisplen-1)=doublequote)) do  quit
    . . . . set starti=(i-1) ; include previous double-quote
    . . . ; remove extraneous ""_ before $c()
    . . . set namedisp=$ze(namedisp,1,namedisplen-1),namedisplen=namedisplen-1,starti=i+1
    . if (quotestate=3) do  quit
    . . set seenquotestate3=1
    . . if (ch=doublequote) set quotestate=1 quit
    . . if ((ch="_")&($ze(namezwr,i+1,i+3)=(doublequote_doublequote_doublequote))&($ze(namezwr,i+4)'=doublequote))  do  quit
    . . . ; remove extraneous _"" after $c()
    . . . set namedisp=namedisp_$ze(namezwr,starti,i-1),namedisplen=namedisplen+(i-starti),starti=i+4,quotestate=1,i=i+3 quit
    if addquote&$data(seenquotestate3) set namedisp=doublequote_namedisp_doublequote
    ; 2 and 3 are the only terminating states; check that. that too 3 only if addquote is 1. ;
    ; ASSERT : i '((quotestate=2)!(addquote&(quotestate=3))) s $etrap="zg 0" zsh "*"  zhalt 1
    quit namedisp
    ;
    ; Convert the map data into displayable format in map2
    ;
    ; @input {Array} map - Global Directory map data
    ; @param {Array} s1 - Start of range
    ; @param {Array/Object} s2 - End of range
    ; @output {Array} map2 - Global Directory map data in displyable format
    ;
onemap:(s1,s2)
    if $zlength(mapreg),mapreg'=map(s2) quit
    set l1=$zlength(s1)
    if $zlength(s2)=l1,$ze(s1,l1)=0,$ze(s2,l1)=")",$ze(s1,1,l1-1)=$ze(s2,1,l1-1) quit
    if '$data(mapdisp(s1)) set mapdisp(s1)=s1 ; e.g. "..." or "LOCAL LOCKS"
    if '$data(mapdisp(s2)) set mapdisp(s2)=s2 ; e.g. "..." or "LOCAL LOCKS"
    set map2(index,"from")=mapdisp(s2)
    set map2(index,"to")=mapdisp(s1)
    set map2(index,"region")=map(s2)
    if '$data(regs(map(s2),"DYNAMIC_SEGMENT")) do  quit
    . set map2(index,"segment")="NONE"
    . set map2(index,"file")="NONE"
    set j=regs(map(s2),"DYNAMIC_SEGMENT") set map2(index,"segment")=j
    if '$data(segs(j,"ACCESS_METHOD")) set map2(index,"file")="NONE"
    else  set s=segs(j,"FILE_NAME") set map2(index,"file")=$$namedisp(s,1)
    quit
    ;
    ; Convert a given name string into a parsed array that contains all of the data needed to work with other GDE APIs
    ; This is copied from tokscan^GDESCAN and modified to be silent and work with passed data
    ;
    ; @param {Array} name - name to convert
    ; @output {Array} NAME - Parsed name in format understandable by other GDE APIs
    ;
createnamearray(name)
    new i,c,NAMEsubs,NAMEtype,cp,ntoken
    set cp=1
    ; About to parse the token following a -name. Take double-quotes into account. ;
    ; Any delimiter that comes inside a double-quote does NOT terminate the scan/parse. ;
    ; Implement the following DFA (Deterministic Finite Automaton)
    ;	  State 0 --> next char is     a double-quote --> State 1
    ;	  State 0 --> next char is NOT a double-quote --> State 0
    ;	  State 1 --> next char is     a double-quote --> State 2
    ;	  State 1 --> next char is NOT a double-quote --> State 1
    ;	  State 2 --> next char is     a double-quote --> State 1
    ;	  State 2 --> next char is NOT a double-quote --> State 0
    ; Also note down (in NAMEsubs) the columns where LPAREN, COMMA and COLON appear. Later used in NAME^GDEPARSE
    new quotestate,parenstate,errstate,quitloop
    set quotestate=0,parenstate=0,errstate=""
    kill NAMEsubs ; this records the column where subscript delimiters COMMA or COLON appear in the name specification
    kill NAMEtype
    set NAMEtype="POINT",NAMEsubs=0,quitloop=0
    for i=0:1 set c=$ze(name,cp+i) quit:(c="")  do  quit:quitloop
    . if c="""" set quotestate=$select(quotestate=1:2,1:1)
    . else        set quotestate=$select(quotestate=2:0,1:quotestate) if 'quotestate do
    . . if $data(delim(c)) set quitloop=1 quit
    . . if (parenstate=2) if '$zlength(errstate) set errstate="NAMRPARENNOTEND"
    . . if (c="(") do
    . . . if parenstate set parenstate=parenstate+2  quit   ; nested parens
    . . . set parenstate=1
    . . . set NAMEsubs($incr(NAMEsubs))=(i+2)
    . . if (c=",") do
    . . . if 'parenstate if '$zlength(errstate) set errstate="NAMLPARENNOTBEG"
    . . . if (1'=parenstate) quit   ; nested parens
    . . . if NAMEtype="RANGE" if '$zlength(errstate) set errstate="NAMRANGELASTSUB"
    . . . set NAMEsubs($incr(NAMEsubs))=(i+2)
    . . if c=":" do
    . . . if 'parenstate if '$zlength(errstate) set errstate="NAMLPARENNOTBEG"
    . . . if NAMEtype="RANGE" if '$zlength(errstate) set errstate="NAMONECOLON"
    . . . set NAMEsubs($incr(NAMEsubs))=(i+2),NAMEtype="RANGE"
    . . if c=")" do
    . . . if 'parenstate if '$zlength(errstate) set errstate="NAMLPARENNOTBEG"
    . . . if (1'=parenstate) set parenstate=parenstate-2 quit   ; nested parens
    . . . set parenstate=2
    . . . set NAMEsubs($incr(NAMEsubs))=(i+2)
    if quotestate if '$zlength(errstate) set errstate="STRMISSQUOTE"
    if (1=parenstate)!(2<parenstate) if '$zlength(errstate) set errstate="NAMRPARENMISSING"
    if $zlength(errstate) do message^GDE(gdeerr(errstate),""""_$ze(name,cp,cp+i-1)_"""")
    if 'NAMEsubs set NAMEsubs($incr(NAMEsubs))=i+2
    if c="" do
    . ; check if tail of last token in line contains $c(13,10) and if so remove it
    . ; this keeps V61 GDE backward compatible with V60 GDE
    . new j
    . for j=1:1 set c=$ze(name,cp+i-j) quit:($char(10)'=c)&($char(13)'=c)
    . set i=i-j+1
    set ntoken=$ze(name,cp,cp+i-1),cp=cp+i
    ; NAME from GDEPARSE
    new c,len,j,k,starti,endi,subcnt,gblname,rangeprefix,nullsub,lsub,sub
    if "%Y"=$ze(name,1,2) do message^GDE(gdeerr("NOPERCENTY"))
    if (MAXGVSUBS<(NAMEsubs-1-$select(NAMEtype="RANGE":1,1:0))) do message^GDE(gdeerr("NAMGVSUBSMAX"),"""name"":"""_MAXGVSUBS_"")
    ; parse subscripted name (potentially with ranges) to ensure individual pieces are well-formatted
    ; One would be tempted to use $NAME to do automatic parsing of subscripts for well-formedness, but there are issues
    ; with it. $NAME does not issue error in various cases (unsubscripted global name longer than 31 characters,
    ; numeric subscript mantissa more than 18 digits etc.). And since we want these cases to error out as well, we parse
    ; the subscript explicitly below. ;
    set len=$zlength(name)
    set j=$get(NAMEsubs(1))
    set gblname=$ze(name,1,j-2)
    set NAME=gblname
    if $zlength(NAME)'=$zlength(NAME) do message^GDE(gdeerr("NONASCII"),"""NAME"":"""_name_"")	; error if the name is non-ascii
    set NAME("SUBS",0)=gblname
    if $ze(gblname,j-2)="*" set NAMEtype="STAR"
    set NAME("TYPE")=NAMEtype
    if ("*"'=gblname)&(gblname'?1(1"%",1A).AN.1"*") do message^GDE(gdeerr("VALUEBAD"),""""_gblname_""":""name""")
    if (j-2)>PARNAMLN do message^GDE(gdeerr("VALTOOLONG"),""""_gblname_""":"""_PARNAMLN_""":""name""")
    if j=(len+2) set NAME("NSUBS")=0 quit  ; no subscripts to process. done. ;
    ; have subscripts to process
    if NAMEtype="STAR" do message^GDE(gdeerr("NAMSTARSUBSMIX"),""""_name_"""")
    if $ze(name,len)'=")" do message^GDE(gdeerr("NAMENDBAD"),""""_name_"""")
    set NAME=NAME_"("
    set nullsub=""""""
    for subcnt=1:1:NAMEsubs-1 do
    . set k=NAMEsubs(subcnt+1)
    . set sub=$ze(name,j,k-2)
    . if (sub="") do
    . . ; allow empty subscripts only on left or right side of range
    . . if (NAMEtype="RANGE") do
    . . . if (subcnt=(NAMEsubs-2)) set sub=nullsub quit  ; if left  side of range is empty, replace with null subscript
    . . . if (subcnt=(NAMEsubs-1)) set sub=nullsub quit  ; if right side of range is empty, replace with null subscript
    . if (sub="") do message^GDE(gdeerr("NAMSUBSEMPTY"),""""_subcnt_"""") ; null subscript
    . set c=$ze(sub,1)
    . if (c="""")!(c="$") set sub=$$STRSUB^GDEPARSE(sub,subcnt)	; string subscript
    . else  set sub=$$numsub^GDEPARSE(sub,subcnt)			; numeric subscript
    . if (NAMEtype="RANGE")&(subcnt=(NAMEsubs-2)) set rangeprefix=NAME,lsub=sub
    . set NAME("SUBS",subcnt)=sub,NAME=NAME_sub,j=k
    . set NAME=NAME_$select(subcnt=(NAMEsubs-1):")",(NAMEtype="RANGE")&(subcnt=(NAMEsubs-2)):":",1:",")
    set NAME("NSUBS")=NAMEsubs-1,NAME("NAME")=NAME
    if NAMEtype="RANGE" do
    . ; check if both subscripts are identical; if so morph the RANGE subscript into a POINT type. ;
    . ; the only exception is if the range is of the form <nullsub>:<nullsub>. In this case, it is actually a range
    . ; meaning every possible value in that subscript. ;
    . if ((NAME("SUBS",NAMEsubs-1)=lsub)&(lsub'=nullsub)) do  quit
    . . set NAME("NAME")=rangeprefix_lsub_")",NAME("NSUBS")=NAMEsubs-2,NAME("TYPE")="POINT",NAME=NAME("NAME")
    . . kill NAME("SUBS",NAMEsubs-1)
    . set NAME("GVNPREFIX")=rangeprefix	; subscripted gvn minus the last subscript
    . ; note the below (which does out-of-order check) also does the max-key-size checks for both sides of the range
    . do namerangeoutofordercheck^GDEPARSE(.NAME,+$get(gnams(gblname,"COLLATION")))
    else  do
    . ; ensure input NAME is within maximum key-size given current gblname value of collation
    . new coll,key
    . set coll=+$get(gblname,"COLLATION")
    . set key=$$gvn2gds^GDEMAP("^"_NAME,coll)
    . do keylencheck^GDEPARSE(NAME,key,coll)
    quit
    ;
pushVars
    new BOL,FALSE,HEX,MAXGVSUBS,MAXGVSUBS,MAXNAMLN,MAXREGLN,MAXSEGLN,MAXSTRLEN
    new ONE,PARNAMLN,PARREGLN,PARSEGLN,SIZEOF,TAB,TRUE,TWO,ZERO,accmeth,am,bs
    new chset,combase,comlevel,comline,create,dbfilpar,defdb,defgld,defgldext
    new defglo,defreg,defseg,dflreg,encsupportedplat,endian,f,file,filesize
    new filexfm,gdeerr,glo,gnams,gtm64,hdrlab,helpfile,i,inst,killed,ks,l,label
    new len,log,logfile,lower,mach,matchLen,maxgnam,maxinst,maxreg,maxseg,mingnam
    new minreg,minseg,nams,nommbi,olabel,quitLoop,rec,reghasv550fields
    new reghasv600fields,regs,renpref,resume,s,seghasencrflag,segs,sep,syntab
    new tfile,tmpacc,tmpreg,tmpseg,tokens,typevalue,update,upper,v30,v44,v532
    new v533,v534,v542,v550,v5ft1,v600,v621,v631,v63a,ver,x,y,map,map2,mapdisp,s1,s2,l1,j
    ;
    goto @varsRetLabel
