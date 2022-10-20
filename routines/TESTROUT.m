TESTROUT ;Test routine for system startup
JOB ;
    Set ^GUISYS("restart-process")=$J
    do RESTART^TESTROUT
    Quit
RESTART ;
    Q:$G(^GUISYS("restart-status"))="restarting"
    Set ^GUISYS("restart-status")="restarting"
    Hang 120
    Set DateTime=$zdate($h,"MON DD YYYY/12:60:SS")
    Set Date=$Piece(DateTime,"/",1)
	Set Time=$Piece(DateTime,"/",2)
    Set ^GUISYS("restart-date")=Date
	Set ^GUISYS("restart-time")=Time
    Set ^GUISYS("restart-process")="Finished"
	Set ^GUISYS("restart-status")="restarted"
    Quit