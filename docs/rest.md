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

# REST Endpoints 

## Overview

| Method | Endpoint | Params | Description |
| --- | --- | ---  | --- |
| GET | [api/dashbboard/getAll](#get-apidashbboardgetall) | | Retrieves full info on all regions, devices and system|
| GET | [api/regions/{region}/](#get-apiregionsregion) | | Retieves info about a specific region 
| DELETE | [api/regions/{region}/](#get-apiregionsregion)| | Deletes a specific region
| POST | [api/regions/{region}/createDb](#get-apiregionsregioncreatedb) | | Creates a database in the specified region
| POST | [api/regions/{region}/extend](#get-apiregionsregionextend) | blocks=_nnn_ | Extends the specified region for the given amount of blocks 
| POST | [api/regions/{region}/journalSwitch](#get-apiregionsregionjournalswitch) | mode=_on_  _off_ | Switches the journal `on` or `off` in the given region

### GET api/dashbboard/getAll

Retrieves information about:
- all regions
- all used disk devices
- system information

### GET api/regions/{region}/

Retrieves information about a specific region

### DELETE api/regions/{region}/

Deletes the specified region

### POST api/regions/{region}/createDb

Creates the database file specified in the given region

### POST api/regions/{region}/extend

Extends the database file in the specified region by the passed amount of blocks

### POST api/regions/{region}/journalSwitch

Switches the journaling on or off in the specified region
