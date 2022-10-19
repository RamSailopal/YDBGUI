TESTROUT ;Test routine for system startup
RESTART ;
	Hang 120
	Set ^SYS("restart-status")="restarted"
	Quit