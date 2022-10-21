<!--
/****************************************************************
 *                                                              *
 * Copyright (c) 2022 YottaDB LLC and/or its subsidiaries.      *
 * All rights reserved.                                         *
 *                                                              *
 * This source code contains the intellectual property          *
 * of its copyright holder(s), and is made available            *
 * under a license.  If you do not know the terms of            *
 * the license, please stop and do not read further.            *
 *                                                              *
 ****************************************************************/
-->

# YDBGUI

YottaDB GUI

Forked from https://gitlab.com/YottaDB/UI/YDBGUI

This particular fork contains additional code to integrate a bespoke application restart into the GUI

![main_screen](YDBGUI.JPG)

<hr>

# Getting started

To run:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/RamSailopal/YDBGUI)

Locally - 

    git clone https://github.com/RamSailopal/YDBGUI.git
    cd YDBGUI
    docker run -dp 1338:1338 -p 8089:8089 -v $PWD/tools:/home/tools --entrypoint /home/tools/start.sh --name octo-vehu yottadb/octo-vehu:latest-master
    
# Set Up


The bespoke routine/line label is stored in the global/subscript:

    ^GUISYS("restart")
    
Change this to reference the startup iine/routine for your own application

# Example

A dummy routine **^TESTROUT** has been added to the setup in the routines directory as an example startup routine 

**RESTART^TESTROUT** hangs for 2 minutes and then reports a "clean" system start. 

**CRASH^TESTROUT** demonstrates a crashing startup process, reporting the M error associated.
    
    
    
