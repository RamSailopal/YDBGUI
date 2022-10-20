TESTROUT ;Test routine for system startup
JOB ;
	Job RESTART
RESTART ;
    Q:SYS("restart-status")="restarting"
    Hang 120
	Set ^SYS("restart-status")="restarted"
    Set DateTime=$zdate($h,"MON DD YYYY/12:60:SS")
    Set Date=$Piece(DateTime,"/",1)
	Set Time=$Piece(DateTime,"/",2)
    Set ^GUISYS("restart-date")=Date
	Set ^GUISYS("restart-time")=Time
	Quit