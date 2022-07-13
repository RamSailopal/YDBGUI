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

## TESTING

The testing is performed by the means of standard Java Script testing tools: chai and puppeteer.
While chai manages the tests, puppeteer provides a headless Chrome browser with DOM access, to inspect graphic elements.

We test Client and Server independently, in the following way:

### Client

The Client testing is performed by generating different mock data in the `app.system` object, thus emulating multiple server responses scenario's. Each test number generates a different response, stimulating the interface to react according, so that we can inspect the graphic elements and determine the validity of the test.

### Server

The Server testing is not using the interface at all and is fully focused on the response returned by the REST call. By modifying the database structure, using OS or YDB MUPIP calls, we alter the REST response, so that we can analyze it and determine the validity of the test.];


# **CLIENT**


#### Dashboard: gld file

| Number | Description |
| :---:| ---      |
| 30 | When gld file is missing|

#### Dashboard: Regions list: Database

| Number | Description |
| :---:| ---      |
| 35 | when region[0] file is replicated (asterisk)|
| 36 | when region[0] has a valid file|
| 37 | when region[0] has a file missing + no auto db|
| 38 | when region[0] has a file missing + auto db|
| 39 | when region[0] has a file ok but shmem is bad|
| 40 | Extension count > 0: 1 extensions left|
| 41 | Extension count > 0: 4 extensions left|
| 42 | Extension count > 0: 9 extensions left|
| 43 | Extension count = 0: 10% of db size left|
| 44 | Extension count = 0: 15% of db size left|
| 45 | Extension count = 0: 25% of db size left|
| 45 | Extension count = 0: 25% of db size left|
| 46 | Freeze mode is on|

#### Dashboard: Regions list: Journal

| Number | Description |
| :---:| ---      |
| 50 | when journal file is disabled AND repl off|
| 51 | when journal file is enabled but off AND repl off|
| 52 | when journal file is enabled and on (before) AND repl off|
| 53 | when journal file is enabled and on (nobefore) AND repl off|
| 54 | when journal file is enabled and in WasOn status|
| 55 | when journal file is enabled but off AND repl on AND 0 users|
| 56 | when journal file is enabled and on (before) AND repl on AND 0 users|
| 57 | when journal file is enabled and on (nobefore) AND repl on AND 0 users|
| 58 | when journal file is disabled AND repl on AND 0 users|
| 59 | when journal file is disabled AND repl on AND >0 users|
| 60 | when journal file is enabled but off AND repl on AND >0 users|
| 61 | when journal file is enabled and on (before) AND repl on AND >0 users|
| 62 | when journal file is enabled and on (nobefore) AND repl on AND >0 users|
| 63 | Journal file is missing and state = enabled/on|

#### Dashboard: Regions list: Devices

| Number | Description |
| :---:| ---      |
| 70 | When disk space is <70%|
| 71 | When disk space is >70% and <90%|
| 72 | When disk space is >90% and <97%|
| 73 | When disk space is >97% and <101%|

#### Dashboard: Global status

| Number | Description |
| :---:| ---      |
| 100 | When all dbs are ok|
| 101 | When a few db's have issues|
| 102 | When ALL dbs have issues|
| 103 | When all journals are ok|
| 104 | When some journals have issues|
| 105 | When all journals have issues|
| 106 | When at least one journal has the wasOn status set|
| 107 | When no region has replication turned on|
| 108 | When no region has replication turned on|
| 109 | When at least one journal has the wasOn status set|
| 110 | When freeze mode is on|
| 111 | Journal file is missing and state = enabled/on|

#### Dashboard: Events

| Number | Description |
| :---:| ---      |
| 120 | Clicking the region list[0] icon|
| 122 | Clicking the System info menu item|
| 123 | Clicking the devices[0] icon|

#### Dashboard: PULLDOWN MENUS

| Number | Description |
| :---:| ---      |
| 200 | Make at least one region with no file AND autodb = true and verify that create db menu is enabled|
| 201 | Remove all journals from all regions (state = 0) and verify that journaling on/off is disabled|
| 202 | If all no regions have a file, extend menu is disabled|
 

#### System Info

| Number | Description |
| :---:| ---      |
| 150 | Confirm that the three labels are populated correctly|
| 151 | Verify the existence of one plugin|
| 152 | Clicking the Env Var button should open a dialog|
| 170 | Env Vars: confirm that the list is populate with all three categories|
| 171 | Env Vars: Confirm that the list is populate with only system info|
| 172 | Env Vars: Confirm that the list is populate with only YDB data|
| 173 | Env Vars: Confirm that the list is populate with only GTM data|
| 174 | Confirm that the encryption flag is populated correctly|
 

#### Devices

| Number | Description |
| :---:| ---      |
| 190 | Confirm that the four labels are populated correctly|
| 191 | Gauge when disk space is <70%|
| 192 | Gauge when disk space is >70% and <90%|
| 193 | Gauge when disk space is >90% and <97%|
| 194 | Gauge when disk space is >97% and <101%|
| 195 | Ensure that the extra device information is properly displayed|
 

#### Region View: Database tab

| Number | Description |
| :---:| ---      |
| 250 | Db status when db file is missing and autodb is on|
| 251 | Db status when db file is missing and autodb is off|
| 252 | Db status when db file is bad|
| 253 | Db status when shmem  is bad|
| 254 | blocks gauge when free block space is <70%|
| 255 | blocks gauge when free block space is >70% and <90%|
| 256 | blocks gauge when free block space is >90% and <97%|
| 257 | blocks gauge when free block space is >97% and <101%|
| 258 | User sessions when users = 0|
| 259 | User sessions when users > 0|
| 260 | Alert message when db file is missing and autodb is on|
| 261 | Alert message when db file is missing and autodb is off|
| 262 | Alert message when db file is bad|
| 263 | Alert message when shmem is bad|
| 270 | Db file: Verify that the table gets populated|
| 271 | Db Access lists: Verify that the table gets populated|
| 280 | Button Create db: verify that is disabled when db file is missing and filename is empty|
| 281 | Button Create db: verify that is enabled when db file is missing and filename is specified|
| 282 | Button Create db: verify that is disabled when db file is good|
| 283 | Button Extend db: verify that is enabled at all times when database file exists and it is valid|
| 284 | Button Extend db: verify that is disabled  when database file does NOT exists|
| 285 | Button Extend db: verify that is disabled  when database file is invalid|
| 286 | Select Advanced Params and verify that extra fields are displayed in the db access table|
| 287 | when db file >90 % and extension > 0 should be green|
| 288 | Extension count > 0: 1 extensions left|
| 289 | Extension count > 0: 5 extensions left|
| 290 | Extension count > 0: 8 extensions left|
| 291 | Extension count = 0: 10% of db size left\n|
| 292 | Extension count = 0: 15% of db size left|
| 293 | Extension count = 0: 25% of db size left|
| 294 | With extension > 0, verify that Db Usage background is always green, but fore changes at 35%|

#### Region View: Journal tab

| Number | Description |
| :---:| ---      |
| 300 | Status when journal file is disabled AND repl off|
| 301 | Status when journal file is enabled but off AND repl off|
| 302 | Status when journal file is enabled and on (before) AND repl off|
| 303 | Status when journal file is enabled and in WasOn status|
| 304 | Status when journal file is enabled but off AND repl on AND 0 users|
| 305 | Status when journal file is enabled and on (before) AND repl on AND 0 users|
| 306 | Status when journal file is enabled and on (nobefore) AND repl on AND 0 users|
| 307 | Status when journal file is disabled AND repl on AND >0 users|
| 308 | Status when journal file is enabled but off AND repl on AND >0 users|
| 310 | If no journal, turn on/off button should be invisible|
| 313 | Verify that Type pill is properly populated with the type when journaling is enabled and Before|
| 314 | Verify that Type pill is properly populated with the type when journaling is enabled and Nobefore|
| 315 | Verify that Type pill is properly populated with the type when journaling disabled|
| 316 | Verify that the Parameters list gets properly populated|
| 317 | Verify that the entire Journal Parameter list is hidden when journal is disabled|
| 318 | Alert message when WAS ON is set|
| 319 | Alert message when replication is on and journal is disabled|
| 320 | Alert message when replication is on and journal is enabled / off|
| 321 | Alert message when replication is off and journal is enabled / off|
| 322 | Journal file is missing and state = 2: verify alert|
| 323 | Journal file is missing and state = 2: verify button text|

#### Region View: Names tab

| Number | Description |
| :---:| ---      |
| 350 | Verify that the list is empty|
| 351 | Verify that the list content changes when clicking the checkbox and display also the %YDBOCTO|
| 352 | Ensure, when choosing a tab different than Region or Journal, that checkbox \"Advanced\" is hidden|

#### Region View: Stats tab

| Number | Description |
| :---:| ---      |
| 360 | Verify that the table gets populated with >0 items|

#### Region View: Locks tab

| Number | Description |
| :---:| ---      |
| 370 | Verify that the label Processes on queue gets populated|
| 371 | Verify that the label Lock slots in use gets populated|
| 372 | Verify that the label Slot bytes in use gets populated|
| 373 | Verify that the label Free lock space gets populated|
| 374 | Lock table: no locks|
| 375 | Lock table: 1 lock, no waiter|
| 376 | Lock table: 1 lock, 1 waiter|
| 377 | Lock table: 1 lock, 2 waiters|
| 378 | Lock table: 2 lock, no waiter|
| 379 | Lock table: 2 locks, 1 waiter|
| 380 | Lock table: 2 locks, 2 waiters|
 

#### Region Delete

| Number | Description |
| :---:| ---      |
| 400 | Verify that clicking YES it will display a second dialog|
| 401 | Delete a region, type in the wrong region name and verify that you can NOT submit|
| 402 | Delete a region, type in the correct region and verify that you can submit|
 

#### Region Extend

| Number | Description |
| :---:| ---      |
| 410 | Verify that the dialog is displayed|
| 411 | Verify that the top three labels are populated correctly|
| 412 | Based on entered ext. size, ensure that New size and New avail. space are correct|
| 413 | Submit the form and expect a dialog|
| 414 | Submit the form and answer NO. Expect the dialog to disappear|
| 415 | Submit the form and answer YES. Expect the dialog to disappear|
 

#### Region Select

| Number | Description |
| :---:| ---      |
| 430 | Display dialog, scroll down twice, submit: verify that the correct dialog is open|
| 430 | Display dialog, scroll down twice and then up, submit: verify that the correct dialog is open|
 

#### Create Database

| Number | Description |
| :---:| ---      |
| 440 | Verify that dialog is displayed|
| 441 | Verify that the three labels are populated correctly|
| 442 | Submit the form and expect a dialog|
| 443 | Submit the form and answer NO. Expect the dialog to disappear|
| 444 | Submit the form and answer YES. Expect the dialog to close and an error dialog open with error: file already exists|
 

#### Switch Journal dialog

| Number | Description |
| :---:| ---      |
| 450 | Verify that the dialog is displayed and with the text 'OFF'|
| 451 | Submit the form and answer NO. Expect the dialog to close|
| 452 | Submit the form and answer YES. Expect the dialog to close|
 

#### Add Region: Region tab

| Number | Description |
| :---:| ---      |
| 490 | Default display should be BG table|
| 491 | Clicking MM it should display the MM table|
| 492 | Click on BG filename and verify dialog is displayed|
| 493 | Click on MM filename and verify dialog is displayed|
| 494 | Click on advanced mode and verify that BG table has more rows|
| 495 | Click on advanced mode and verify that MM table has more rows|
| 496 | Click on advanced mode and verify that right table has more rows|

#### Add Region: Journal tab

| Number | Description |
| :---:| ---      |
| 520 | Default display should be no journal|
| 522 | Turn the journal on and verify that table is displayed|
| 523 | Click on Journal filename and verify dialog is displayed|
| 524 | Default display should be no journal|

#### Add Region: Names tab

| Number | Description |
| :---:| ---      |
| 540 | Click on add name button and verify that dialog is displayed|
| 541 | Click on add name button and verify that dialog is displayed|
| 542 | Add a name, select it, click delete name and verify that it gets deleted|
| 543 | Add multiple names and ensure they got sorted|
 

#### Edit Region: Region tab

| Number | Description |
| :---:| ---      |
| 555 | Edit DEFAULT and verify that BG is checked|
| 556 | Edit DEFAULT and switch to MM: Edit button should be enabled|
| 557 | Edit YDBAIM and verify that MM is checked|
| 558 | Edit YDBAIM and switch to BG: Edit button should be enabled|
| 559 | Click Advanced parameters and verify that left table is properly populated|
| 560 | Click Advanced parameters and verify that right table is properly populated|
| 561 | Edit DEFAULT and click on the filename button. Verify that the message box appears|
| 562 | Edit YDBAIM and click on the filename button. Verify that the message box appears|

#### Edit Region: Journal tab

| Number | Description |
| :---:| ---      |
| 570 | Edit DEFAULT and verify that journal is ON|
| 571 | Edit DEFAULT and switch the journal off. Verify that the table gets hidden|
| 572 | Edit DEFAULT and switch the journal off. Verify that the Edit button is enabled|
| 573 | Edit DEFAULT and click on the filename button. Verify that the Filename dialog appears|

#### Edit region: Names Tab

| Number | Description |
| :---:| ---      |
| 585 | Edit DEFAULT, add a name TEST and verify that appears in the list as GREEN|
| 586 | Edit YDBOCTO, add a name %a and verify that appears in the list as first and in GREEN color|
| 587 | Edit YDBOCTO, add a name %b, select it and verify that delete button caption is: Delete...|
| 588 | Edit YDBOCTO, select the first entry and delete it. Verify that text has the RED color|
| 589 | Edit YDBOCTO, select the first entry and delete it. Verify that delete button caption is: Undelete...|
| 590 | Edit YDBOCTO, select the first entry and delete it. Click the Undelete... button and verify that text is in Purple color|
 

#### Tree integrity

| Number | Description |
| :---:| ---      |
| 600 | One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By Namespace tree, lock 1|
| 601 | One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By Namespace tree, lock 2|
| 602 | One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By Namespace tree, lock 3|
| 603 | One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By Region tree, lock 1|
| 604 | One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By Region tree, lock 2|
| 605 | One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By Region tree, lock 3|
| 606 | One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By PIDs tree, lock 1|
| 607 | One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By PIDs tree, lock 2|
| 608 | One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By PIDs tree, lock 3|
| 609 | Test sort on namespace|
| 610 | Test sort on region|
| 611 | Test sort on PIDs|
| 612 | No locks at all. Test By Namespace tree|
| 613 | No locks at all. Test By Regions tree|
| 614 | No locks at all. Test By PIDs tree|

#### Submit messages => Clear lock

| Number | Description |
| :---:| ---      |
| 615 | Test By Namespace tree, select namespace, click on Clear Lock|
| 616 | Test By Namespace tree, select region, click on Clear Lock|
| 617 | Test By Namespace tree, select PID, click on Clear Lock|
| 618 | Test By Namespace tree, select first waiter, click on Clear Lock|
| 619 | Test By Region tree, select region, click on Clear Lock|
| 620 | Test By Region tree, select namespace, click on Clear Lock|
| 621 | Test By Region tree, select pid, click on Clear Lock|
| 622 | Test By Region tree, select first waiter, click on Clear Lock|
| 623 | Test By Pids tree, select pid, click on Clear Lock|
| 624 | Test By Pids tree, select namespace, click on Clear Lock|
| 625 | Test By Pids tree, select region, click on Clear Lock|
| 626 | Test By Pids tree, select first waiter, click on Clear Lock|

#### Submit messages => Terminate process

| Number | Description |
| :---:| ---      |
| 627 | Test By Namespace tree, select namespace, click on Terminate process|
| 628 | Test By Namespace tree, select region, click on Terminate process|
| 629 | Test By Namespace tree, select PID, click on Terminate process|
| 630 | Test By Namespace tree, select first waiter, click on Terminate process|
| 631 | Test By Region tree, select region, click on Terminate process|
| 632 | Test By Region tree, select namespace, click on Terminate process|
| 633 | Test By Region tree, select pid, click on Terminate process|
| 634 | Test By Region tree, select first waiter, click on Terminate process|
| 635 | Test By Pids tree, select pid, click on Terminate process|
| 636 | TestTest By Pids tree, select namespace, click on Terminate process|
| 637 | Test By Pids tree, select region, click on Terminate process|
| 638 | Test By Pids tree, select first waiter, click on Terminate process|
 
# **SERVER**


#### Endpoints verification

| Number | Description |
| :---:| ---      |
| 1000 | dashboard/getAll|
| 1001 | dashboard/regions/DEFAULT|
| 1002 | Ensure the extra device information is returned|
| 1020 | Use a wrong REST path and ensure that a 404 is returned|
| 1021 | Trigger an error in the server on GET and verify that an error is returned|
| 1022 | Trigger an error in the server on POST and verify that an error is returned|
| 1023 | Trigger an error in the server on DELETE and verify that an error is returned|
| 1024 | Rename a db file and verify that segment fields get populated anyway (with GDE data)|
| 1025 | Rename a db file and verify that region fields get populated anyway (with GDE data)|
| 1026 | Rename a db file and verify that journal fields get populated anyway (with GDE data)|

#### GLD ERRORS

| Number | Description |
| :---:| ---      |
| 1100 | Rename the gld to make it appear missing|

#### REGION

| Number | Description |
| :---:| ---      |
| 1120 | Rename the default.dat file to make it appear missing|
| 1121 | Check # of sessions by increasing it with a timed session accessing a global|
| 1122 | | 1122 | Verify that processIds of sessions are returned as array|

#### JOURNAL

| Number | Description |
| :---:| ---      |
| 1140 | Switch journaling off in DEFAULT|
| 1141 | Enable journaling in YDBAIM|
| 1142 | Disable journaling in YDBAIM|
| 1143 | Journal file is missing|

#### REPLICATION

| Number | Description |
| :---:| ---      |
| 1160 | Turn replication on on YDBAIM as verify the response|

#### MAPS

| Number | Description |
| :---:| ---      |
| 1200 | Create a new MAP and see it appearing in the response|

#### LOCKS

| Number | Description |
| :---:| ---      |
| 1220 | LOCKS: Create a lock and verify|
| 1221 | LOCKS: Create a lock and a waiter and verify|
| 1222 | LOCKS: Create a lock and two waiters and verify|
 

#### Get Templates

| Number | Description |
| :---:| ---      |
| 1260 | Verify that BG segment data is complete, including limits|
| 1261 | Verify that MM segment data is complete, including limits|
| 1262 | Verify that region data is complete, including limits|

#### Verify Namespace

| Number | Description |
| :---:| ---      |
| 1270 | Submit just name|
| 1271 | Submit just name with asterisk|
| 1272 | Submit name and subscript|
| 1273 | Submit name and multiple subscripts|
| 1274 | Submit name and multiple subscripts with ranges|
| 1275 | Submit bad name|
| 1276 | Submit name and only open paren|
| 1277 | Submit name and only close paren|
| 1278 | Submit name and bad subscript (alphanumeric, no quotes)|
| 1279 | Submit name and bad subscript (string, only left quote)|
| 1280 | Submit name and bad subscript (string, only right quote)|
| 1281 | Submit name and left range missing|
| 1282 | Submit name and right range missing|
| 1283 | Submit existing name|

#### Verify Filename

| Number | Description |
| :---:| ---      |
| 1290 | Submit name with double /|
| 1291 | Submit name with bad env var|
| 1292 | Submit valid name with existing file|
| 1293 | Submit valid name with absolute path|
| 1294 | Submit valid name with relative path|
| 1295 | Submit valid name with env vars and check for proper extension|
 

#### Edit Region

| Number | Description |
| :---:| ---      |
| 1340 | Edit YDBOCTO, add one name and delete another, submit and verify|
| 1341 | Edit RANDOM, change BG to MM, submit and verify|
| 1342 | Edit RANDOM, change MM back to BG, submit and verify|
| 1343 | Edit DEFAULT, switch journal OFF, submit and verify|
| 1344 | Edit DEFAULT, switch journal back ON, submit and verify|
| 1345 | Edit DEFAULT, change AutoDB to true and verify|
| 1346 | Edit YDBAIM, change AutoDB to false and verify|
| 1347 | Edit YDBAIM, change AutoDB back to true, change filename, submit and verify|
| 1347 | Edit YDBAIM, change AutoDB back to true, change filename, submit and verify|
| 1348 | Edit DEFAULT, change all Segment related fields, submit and verify|
| 1349 | Edit DEFAULT, change all Segment and Region related fields, submit and verify|
| 1350 | Edit DEFAULT, change all Journaling and Region related fields, submit and verify|
| 1351 | Edit DEFAULT, change all Journaling, Region and Segment related fields, submit and verify|
| 1352 | Edit YDBOCTO, add one name and delete another, change region and journaling and verify|
| 1353 | Edit YDBAIM, add one name and delete another, switch journaling on and verify|
| 1354 | Edit YDBAIM, add one name and delete another, switch journaling off and verify|
| 1355 | Edit DEFAULT, change the journal filename on MUPIP, update and verify|
| 1356 | Edit DEFAULT, change the journal filename on GDE, update and verify\n|
| 1357 | Edit DEFAULT, change the journal filename on GDE, update and verify\n|
 

#### Create Region

| Number | Description |
| :---:| ---      |
| 1310 | Create random region with default params and verify creation + file existence|
| 1311 | Create random region with different filename and verify creation + file existence|
| 1312 | Create random region with default params, but no db file creation and verify + no file|
| 1313 | Create random region with default params and journal, turned on|
| 1314 | Create random region with default params and journal, turned off|
| 1315 | Create random region with default params and journal, turned off, with different journal path|
| 1316 | Create random region with Auto Db = on|
| 1317 | Create random region with Access Method = MM|
| 1318 | Create random region with all dbAccess fields different and verify them all|
| 1319 | Create random region with all fields different and verify them all|
| 1320 | Create random region with asyncio =true and blocksize= 8192 and verify them all|
| 1321 | Create random region with journal/ON and default fields|
| 1322 | Create random region with journal/OFF and default fields|
| 1323 | Create random region with all journal fields different and verify them all|
| 1324 | Create random region with all segment field different, store them on template, create a new region and verify|
| 1325 | Create random region with all journal field different, store them on template, create a new region and verify|
| 1326 | Add region with fields from Region and Journal changed|

#### Delete Region

| Number | Description |
| :---:| ---      |
| 1400 | Delete using a bad region name|
| 1401 | Delete using a null region name|
| 1402 | Delete an existing region|
| 1403 | Delete an existing region and delete the files|
 

#### Get All Locks

| Number | Description |
| :---:| ---      |
| 1420 | Set Lock: ^%ydbocto, no waiters, verify|
| 1421 | Set Lock  ^%ydbaim, 1 waiter, verify|
| 1422 | Set Lock  ^%ydbaim, 2 waiters, verify|
| 1423 | Set Lock: test, no waiters, verify|
| 1424 | Set Lock: test, 1 waiter, verify|
| 1425 | Set Lock: test, 1 waiter, verify|
| 1426 | Set Lock  test, test2, ^test3, no waiters, verify|
| 1427 | Set Lock  test, test2, ^test3, 2 waiters, verify|
| 1428 | No locks, verify|
| 1429 | Set lock ^test(\"test with spaces\|

#### Clear lock

| Number | Description |
| :---:| ---      |
| 1430 | No namespace, verify correct error|
| 1431 | Not existing namespace, verify correct error|
| 1432 | Correct namespace, verify correct response and lock gone|

#### Terminate process

| Number | Description |
| :---:| ---      |
| 1435 | Not existing process Id, verify correct error|
| 1436 | process Id 0, verify correct error|
| 1437 | process Id is not YDB, verify correct error|
| 1438 | process Id is correct, verify correct response and terminated process|
 
