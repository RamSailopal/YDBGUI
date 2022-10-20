TESTROUT ;Test routine for system startup
RESTART ;
    Hang 120
    Quit
CRASH ;
    Hang 30
    Set TEST=^SOMEGLOB("somedata")
    Quit