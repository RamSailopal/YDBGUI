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

The Server testing is not using the interface at all and is fully focused on the response returned by the REST call. By modifying the database structure, using OS or YDB MUPIP calls, we alter the REST response, so that we can analyze it and determine the validity of the test.


# **CLIENT**


## DASHBOARD

#### GLD FILE

#### GLD

| Number | Description |
| :---:| ---      |
| 30 | When gld file is missing|

#### REGION LIST: Db file

| Number | Description |
| :---:| ---      |
| 40 | when region[0] file is replicated (asterisk)
| 41 | when region[0] has a valid file
| 42 | when region[0] has a file missing + no auto db
| 43 | when region[0] has a file missing + auto db
| 44 | when region[0] has a file ok but shmem is bad

#### REGION LIST: Journal file 

| Number | Description |
| :---:| ---      |
| 50 | when journal file is disabled AND repl off
| 51 |  when journal file is enabled but off AND repl off
| 52 |  when journal file is enabled and on (before) AND repl off
| 53 |  when journal file is enabled and on (nobefore) AND repl off
| 55 |  when journal file is enabled and in WasOn status
| 56 |  when journal file is enabled but off AND repl on AND 0 users 
| 57 |  when journal file is enabled and on (before) AND repl on AND 0 users 
| 58 |  when journal file is enabled and on (nobefore) AND repl on AND 0 users 
| 59 |  when journal file is disabled AND repl on AND 0 users 
| 60 |  when journal file is disabled AND repl on AND >0 users 
| 61 |  when journal file is enabled but off AND repl on AND >0 users 
| 62 |  when journal file is enabled and on (before) AND repl on AND >0 users 
| 63 |  when journal file is enabled and on (nobefore) AND repl on AND >0 users 

#### DEVICES

| Number | Description |
| :---:| ---      |
| 70 |  When disk space is <70%
| 71 |  When disk space is >70% and <90%
| 72 |  When disk space is >90% and <97%
| 73 |  When disk space is >97% and <101%

#### GLOBAL STATUS 

| Number | Description |
| :---:| ---      |
| 100 |  When all dbs are ok
| 101 |  When a few db's have issues
| 102 |  When ALL dbs have issues
| 103 |  When all journals are ok
| 104 |  When some journals have issues
| 105 |  When all journals have issues
| 106 |  When at least one journal has the wasOn status set
| 107 | When no region has replication turned on
| 108 | When some regions have the replication turned on
| 109 | When at least one region is in wasOn state

#### EVENTS 

| Number | Description |
| :---:| ---      |
| 120 | Clicking the region list[0] icon
| 121 | Refreshing the Dashboard
| 122 | Clicking the System info menu item
| 123 | Clicking the devices[0] icon

## SYSTEM INFO

| Number | Description |
| :---:| ---      |
| 150 | Confirm that the three labels are populated correctly
| 151 | Verify the existence of one plugin
| 152 | Clicking the Env Var button should open a dialog
| 170 | Confirm that the list is populate with all three categories
| 171 | Confirm that the list is populate with only system info
| 172 | Confirm that the list is populate with only YDB data
| 173 | Confirm that the list is populate with only GTM data

## **DEVICES** 

| Number | Description |
| :---:| ---      |
| 190 | Confirm that the five labels are populated correctly
| 191 | Gauge when disk space is <70%
| 192 | Gauge when disk space is >70% and <90%
| 193 | Gauge when disk space is >90% and <97%
| 194 | Gauge when disk space is >97% and <101%

## **PULLDOWN MENUS** 

| Number | Description |
| :---:| ---      |
| 200 | Make at least one region with no file AND autodb = true and verify that create db menu is enabled
| 201 | Remove all journals from all regions (state = 0) and verify that journaling on/off is disabled
| 202 | If all no regions have a file, extend menu is disabled

## **REGION VIEW**

#### REGION TAB 

| Number | Description |
| :---:| ---      |
| 250 | Db status when db file is missing and autodb is on
| 251 | Db status when db file is missing and autodb is off
| 252 | Db status when db file is bad
| 253 | Db status when shmem is bad
| 254 | blocks gauge when free block space is <70%
| 255 | blocks gauge when free block space is >70% and <90%
| 256 | blocks gauge when free block space is >90% and <97%
| 257 | blocks gauge when free block space is >97% and <101%
| 258 | User sessions when users = 0
| 259 | User sessions when users > 0
| 260 | Alert message when db file is missing and autodb is on
| 261 | Alert message when db file is missing and autodb is off
| 262 | Alert message when db file is bad
| 263 | Alert message when shmem is bad
| 270 | Db file: Verify that the table gets populated
| 271 | Db Access lists: Verify that the table gets populated
| 280 | Button Create db: verify that is disabled when db file is missing and filename is empty
| 281 | Button Create db: verify that is enabled when db file is missing and filename is specified
| 282 | Button Create db: verify that is disabled when db file is good
| 283 | Button Extend db: verify that is enabled at all times when database file exists and it is valid
| 284 | Button Extend db: verify that is disabled  when database file does NOT exists
| 285 | Button Extend db: verify that is disabled  when database file is invalid
| 286 | Select Advanced Params and verify that extra fields are displayed in the db access table

#### JOURNAL TAB 

| Number | Description |
| :---:| ---      |
| 290 | Status when journal file is disabled AND repl off
| 291 | Status when journal file is enabled but off AND repl off
| 292 | Status when journal file is enabled and on AND repl off
| 293 | Status when journal file is enabled and in WasOn status
| 294 | Status when journal file is enabled but off AND repl on AND 0 users 
| 295 | Status when journal file is enabled and on (before) AND repl on AND 0 users 
| 296 | Status when journal file is enabled and on (nobefore) AND repl on AND 0 users 
| 297 | Status when journal file is disabled AND repl on AND >0 users 
| 298 | Status when journal file is enabled but off AND repl on AND >0 users 
| 299 | Status when journal file is enabled and on AND repl on AND >0 users 
| 300 | If no journal, turn on/off button should be invisible
| 313 | Verify that Type pill is properly populated with the type when journaling is enabled and Before
| 314 | Verify that Type pill is properly populated with the type when journaling is enabled and Nobefore
| 315 | Verify that Type pill is properly populated with the type when journaling disabled
| 316 | Verify that the Parameters list gets properly populated
| 317 | Verify that the entire Journal Parameter list is hidden when journal is disabled
| 318 | Alert message when WAS ON is set
| 319 | Alert message when replication is on and journal is disabled
| 320 | Alert message when replication is on and journal is enabled / off
| 321 | Alert message when replication is off and journal is enabled / off

#### NAMES TAB 

| Number | Description |
| :---:| ---      |
| 350 | Verify that the list is empty
| 351 | Verify that the list content changes when clicking the checkbox and display also the %YDBTEST

#### STATS TAB 

| Number | Description |
| :---:| ---      |
| 360 | Verify that the table gets populated with >0 items

#### LOCKS TAB 

| Number | Description |
| :---:| ---      |
| 370 | Verify that the label Processes on queue gets populated
| 371 | Verify that the label Lock slots in use gets populated
| 372 | Verify that the label Slot bytes in use gets populated
| 373 | Verify that the label Free lock space gets populated
| 374 | Lock table: no locks
| 375 | Lock table: 1 lock, no waiter
| 376 | Lock table: 1 lock, 1 waiter
| 377 | Lock table: 1 lock, 2 waiters
| 378 | Lock table: 2 locks, no waiter
| 379 | Lock table: 2 locks, 1 waiter
| 380 | Lock table: 2 locks, 2 waiter

## DELETE REGION dialog

| Number | Description |
| :---:| ---      |
| 400 | Verify that clicking NO it will abort the procedure
| 401 | Verify that clicking YES it will display a second dialog
| 402 | Verify that clicking YES in the second dialog the delete procedure starts
| 403 | Verify that clicking NO in the second dialog it will abort the procedure

## EXTEND REGION dialog

| Number | Description |
| :---:| ---      |
| 410 | Verify that the dialog is displayed
| 411 | Verify that the top three labels are populated correctly
| 412 | Based on entered ext. size, ensure that New size and New avail. space are correct
| 413 | Submit the form and expect a dialog
| 414 | Submit the form and answer NO. Expect the dialog to disappear
| 425 | Submit the form and answer YES. Expect the dialog to disappear 

## CREATE DATABASE dialog

| Number | Description |
| :---:| ---      |
| 440 | Verify that dialog is displayed
| 441 | Verify that the three labels are populated correctly
| 442 | Submit the form and expect a dialog
| 443 | Submit the form and answer NO. Expect the dialog to close
| 444 | Submit the form and answer YES. Expect the dialog to close and an error dialog open with error: file already exists

(todo)
## SWITCH JOURNAL dialog

| Number | Description |
| :---:| ---      |
| 450 | Verify that the dialog is displayed and with the text 'OFF'
| 451 | Submit the form and answer NO. Expect the dialog to close
| 452 | Submit the form and answer YES. Expect the dialog to close and an error dialog open with error: file already exists




# **SERVER**

#### ENDPOINTS VERIFICATION 

| Number | Description |
| :---:| ---      |
| 1000 | dashboard/getAll |
| 1001 | regions/{region}/get |

#### GLD ERRORS 

| Number | Description |
| :---:| ---      |
| 1100 | Rename the gld to make it appear missing |

#### REGION 

| Number | Description |
| :---:| ---      |
| 1120 | Rename the default.dat file to make it appear missing  |
| 1121 | Check # of sessions by increasing it with a timed session accessing a global |

#### JOURNAL 

| Number | Description |
| :---:| ---      |
| 1140 | Switch journaling off in DEFAULT |
| 1141 | Enable journaling in YDBAIM and verify that the state is correct |
| 1142 | Disable journaling in DEFAULT |

#### REPLICATION 

| Number | Description |
| :---:| ---      |
| 1160 | Turn replication on on DEFAULT as verify the response |

#### MAPPING 

| Number | Description |
| :---:| ---      |
| 1200 | Create a new MAP and see it appearing in the response |

#### LOCKS 

| Number | Description |
| :---:| ---      |
| 1220 | LOCKS: Create a lock and verify |
| 1221 | LOCKS: Create a lock and a waiter and verify |
| 1222 | LOCK: Create a lock and two waiters and verify |

#### GDE functions 

| Number | Description |
| :---:| ---      |
| 1240 | Extend db |
| 1241 | Set Journal ON |
| 1242 | Set JOurnal OFF |
| 1243 | Delete region |
| 1244 | Create DB: existing |
| 1245 | Create DB: freshly created region |

