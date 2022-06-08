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
| POST | [api/regions/{region}/createDb](#post-apiregionsregioncreatedb) | | Creates a database in the specified region
| POST | [api/regions/{region}/extend](#post-apiregionsregionextend) | blocks=_nnn_ | Extends the specified region for the given amount of blocks 
| POST | [api/regions/{region}/journalSwitch](#post-apiregionsregionjournalswitch) | mode=_on_  _off_ | Switches the journal `on` or `off` in the given region
| GET | [api/dashboard/getTemplates](#get-apidashbboardgettemplates) |  | Returns the GDE templates and their numeric limits
| POST | [api/regions/parseNamespace/](#post-apiregionsparsenamespace) |  | Verify a namespace
| POST | [api/regions/validatePath/](#post-apiregionsvalidatepath) |  | Validate a filepath
| POST | [api/regions/add/](#post-apiregionsadd) |  | Creates a region

### `GET` api/dashboard/getAll

Retrieves information about all regions, all used disk devices, system information and soft3are version

Parameters: 
`none`

Body: 
`none`

Returns:

SUCCESS
````js
res = {
    result: 'OK',
    data: {         // The dashboard data 
        devices: [],
        gld: {},
        regions: {
            regionName: {
                dbAccess: {
                    data: []
                },
                dbFile: {
                    data: [],
                    flags: {
                        
                    },
                    usage: {}
                },
                journal: {
                    data:[],
                    flags: {}
                },
                locks: {},
                replication: {},
                stats: {
                    csa: {},
                    journal: {},
                    locks: {},
                    logicalOperations: {},
                    transactions: {}
                }
            }
        },
        systemInfo: {},
        ydb_version: ''
    } 
}
````

ERROR

````js
res = {
    result: 'ERROR',
    error : {description: ''} // The error description
}
````

WITH WARNINGS

````js
res = {
    result: 'WARNING',
    data : {
        warnings: [
            // The warning(s) description(s)
        ],
        // ... same as SUCCESS
    } 
}
````

---


### `GET` api/regions/{region}/

Retrieves information about a specific region

Parameters: 

`none`

Body: 

`none`

Returns:

SUCCESS
````js
res = {
    result: 'OK',
    data: {          
        dbAccess: {
            data: []
        },
        dbFile: {
            data: [],
            flags: {
                
            },
            usage: {}
        },
        journal: {
            data:[],
            flags: {}
        },
        locks: {},
        replication: {},
        stats: {
            csa: {},
            journal: {},
            locks: {},
            logicalOperations: {},
            transactions: {}
        }
    }
}
````

ERROR

````js
res = {
    result: 'ERR',
    error : {description: ''} // The error description
}
````

WITH WARNINGS

````js
res = {
    result: 'WARNING',
    data : {
        warnings: [
            // The warning(s) description(s)
        ],
        // ... same as SUCCESS
    } 
}
````
---

### `DELETE` api/regions/{region}/

Deletes the specified region

Parameters: 

`none`

Body: 

`none`

---

### `POST` api/regions/{region}/createDb

Creates the database file specified in the given region

Parameters: 

`none`

Body: 

`none`

Returns:

SUCCESS

````js
res = {
    result: 'OK'
}
````

ERROR

````js
res = {
    result: 'ERR',
    error : {description: ''} // The error description
}
````

---

### `POST` api/regions/{region}/extend

Extends the database file in the specified region by the passed amount of blocks

Parameters: 

`number` blocks=_nnn_

Body: 

`none`

Returns:

SUCCESS

````js
res = {
    result: 'OK'
}
````

ERROR

````js
res = {
    result: 'ERR',
    error : {description: ''} // The error description
}
````

---

### `POST` api/regions/{region}/journalSwitch

Switches the journaling on or off in the specified region


Parameters: 

`string` turn=on|off

Body: 

`none`

Returns:

SUCCESS

````js
res = {
    result: 'OK'
}
````

ERROR

````js
res = {
    result: 'ERR',
    error : {description: ''} // The error description
}
````

---

### `GET` api/dashbboard/getTemplates

Retrieves all the GDE templates and their associated min/max values (when applicable)

Parameters: 

`none`

Body: 

`none`

Returns:

SUCCESS

````js
res = {
    result: 'OK',
    data: {
        region: {           // each entry is an object:
                            // { min: 0, max: 0, value: 0} 
        },
        segment: {
            BG: {
                
            },
            MM: {
                
            }
        }
    }
}
````

ERROR

````js
res = {
    result: 'ERR',
    error : {description: ''} // The error description
}
````

---

### `POST` api/regions/parseNamespace

Validates a namespace in the GDE.

Parameters: 

`none`

Body: 
````js
res = {
    namespace: ''
}
````

Returns:

SUCCESS

````js
res = {
    result: 'OK',
    data: {
        parseResult: ''             // literal 'OK' or the error string returned by the GDE
    }
}
````

ERROR

````js
res = {
    result: 'ERR',
    error : {description: ''} // The error description
}
````


---

### `POST` api/regions/validatePath

Validates a path and optionally expand the directories if Env Vars are used.
It will additionally check for filename existence.

Parameters: 

`none`

Body: 
````js
res = {
    path: ''
}
````
Returns:

SUCCESS

````js
res = {
    result: 'OK',
    data: {
        validation: '',             // an (optionally expanded) path if path is valid, 
                                    // empty string if invalid
        fileExist: ''               // the full (optionally expanded) path if the file already exists
                                    // empty string if file does NOT exists
    }
}
````

ERROR

````js
res = {
    result: 'ERR',
    error : {description: ''} // The error description
}
````


---

### `POST` api/regions/add

Adds a new region to the system. 

Parameters: 

`none`

Body: 
````js
res = {
    regionName: '',
    segmentTypeBg: true,
    journalEnabled: true,
    segmentData: [],
    dbAccess: {
        region: [],
        journal: []
    },
    templates: {
        updateTemplateDb: true,
        updateTemplateJournal: false
    },
    names: [],
    segmentFilename: '',
    journalFilename: '',
    postProcessing: {
        createDbFile: true,
        switchJournalOn: true
    }
}
````
Returns:

SUCCESS

````js
res = {
    result: 'OK'
    }
}
````

ERROR

````js
res = {
    result: 'ERR',
    error : {description: ''} // The error description
}
````

WITH WARNINGS

````js
res = {
    result: 'WARNING',
    data : {
        warnings: [
            {
                description: '',        // The warning(s) description(s)
                dump: []                // array with shell responses for debugging
            }
            
        ]
    } 
}
````

---
