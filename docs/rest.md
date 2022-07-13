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
|--- |--- | ---  | --- |
| GET | [api/dashbboard/getAll](#get-apidashbboardgetall) | | Retrieves full info on all regions, devices and system|
| GET | [api/regions/{region}](#get-apiregionsregion) | | Retieves info about a specific region 
| DELETE | [api/regions/{region}](#get-apiregionsregion)| deleteFiles=true | Deletes a specific region
| POST | [api/regions/{region}/createDb](#post-apiregionsregioncreatedb) | | Creates a database in the specified region
| POST | [api/regions/{region}/extend](#post-apiregionsregionextend) | blocks=_nnn_ | Extends the specified region for the given amount of blocks 
| POST | [api/regions/{region}/journalSwitch](#post-apiregionsregionjournalswitch) | mode=_on_  _off_ | Switches the journal `on` or `off` in the given region
| GET | [api/dashboard/getTemplates](#get-apidashbboardgettemplates) |  | Returns the GDE templates and their numeric limits
| POST | [api/regions/parseNamespace](#post-apiregionsparsenamespace) |  | Verify a namespace
| POST | [api/regions/validatePath](#post-apiregionsvalidatepath) |  | Validate a filepath
| POST | [api/regions/add](#post-apiregionsadd) |  | Creates a region
| POST | [api/regions/{region}/edit](#post-apiregionsregionedit) |  | Edits a region
| GET | [api/test/error](#get-apitesterror) |  | Triggers an M error and returns the error description in the status 500 response
| POST | [api/test/error](#post-apitesterror) |  | Triggers an M error and returns the error description in the status 500 response
| DELETE | [api/test/error](#delete-apitesterror) |  | Triggers an M error and returns the error description in the status 500 response
| GET | [api/regions/locks/getAll](#get-apiregionslocksgetall) |  | Returns all the locks and waiters across the all regions
| POST | [api/regions/locks/clear](#post-apiregionslocksclear) | namespace= | Clear the lock specified in the "namespace" parameter
| POST | [api/os/processes/{pid}/terminate](#post-apiosprocessespidterminate) | {pid} | Terminate the process specified in the "pid" parameter using the SIGINT signal

### `GET` api/dashboard/getAll

Retrieves information about all regions, all used disk devices, system information and soft3are version

Parameters: 
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


### `GET` api/regions/{region}

Retrieves information about a specific region

Parameters: 

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

### `DELETE` api/regions/{region}

Deletes the specified region

Parameters: 

`deleteFiles=true`

If deleteFiles=true also journal and database files are deleted.

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
    error : {
        description: '',    // The error description
        dump : []           // Optional response from the shell
     }
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

### `POST` api/regions/{region}/edit

Edits a region to the system. 

Parameters: 

`none`

Body: 
````js
res = {
    changeAccessMethod: false,              
    changeJournal: true,                     
    journalFilename: '',
    journalUpdateGde: true,
    journalUpdateMupip: false,
    dbAccess: {
        region: [],
        journal: []
    },
    newAccessMethod: '',
    names: [],
    newJournalEnabled: true,
    regionName: '',
    segmentData: [],
    segmentFilename: '',
    updateGde: false
}
````
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
    error : {
        description: '',    // The error description
        dump: []            // Array of string with the dump of the shell response
    } 
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
                dump: []                // Array of string with the dump of the shell response
            }
            
        ]
    } 
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

### `GET` api/test/error

Triggers an M error and returns the error description in the status 500 response

Parameters: 

`none`

Returns:

ERROR

````js
res = {
    apiVersion: "1.0",
    error: {
        code: 500,
        errors: [
            {
                logID: 99999,
                mcode: " s a=1/0",
                message: "150373210,error+1^%ydbguiRest,%YDB-E-DIVZERO, Attempt to divide by zero",
                place: "error+1^%ydbguiRest",
                reason: ",M9,Z150373210,"
            }
        ],
        message: "Internal Server Error",
        request: "DELETE /api/test/error/ "
    }
}
````

---

### `POST` api/test/error

Triggers an M error and returns the error description in the status 500 response

Parameters: 

`none`

Body: 

`none`

Returns:

ERROR

````js
res = {
    apiVersion: "1.0",
    error: {
        code: 500,
        errors: [
            {
                logID: 99999,
                mcode: " s a=1/0",
                message: "150373210,error+1^%ydbguiRest,%YDB-E-DIVZERO, Attempt to divide by zero",
                place: "error+1^%ydbguiRest",
                reason: ",M9,Z150373210,"
            }
        ],
        message: "Internal Server Error",
        request: "DELETE /api/test/error/ "
    }
}
````

---

### `DELETE` api/test/error

Triggers an M error and returns the error description in the status 500 response

Parameters: 

`none`

Body: 

`none`

Returns:

ERROR

````js
res = {
    apiVersion: "1.0",
    error: {
        code: 500,
        errors: [
            {
                logID: 99999,
                mcode: " s a=1/0",
                message: "150373210,error+1^%ydbguiRest,%YDB-E-DIVZERO, Attempt to divide by zero",
                place: "error+1^%ydbguiRest",
                reason: ",M9,Z150373210,"
            }
        ],
        message: "Internal Server Error",
        request: "DELETE /api/test/error/ "
    }
}
````

---

### `GET` api/regions/locks/getAll

Returns all the locks, waiters and related processes information

Parameters: 

`none`

Returns:

SUCCESS

````js
res = {
    result: 'OK',
    locks: [
        {
            namespace: 'TEST1',
            region: 'YDBOCTO',
            pid: 1,
            waiters: [
                11,
                12,
                13,
            ]
        },
        {
            namespace: 'TEST2',
            region: 'DEFAULT',
            pid: 2,
            waiters: [
                21,
                22
            ]
        },
        {
            namespace: 'TEST3',
            region: 'YDBAIM',
            pid: 3,
            waiters: [
                31,
                32,
                33
            ]
        },
    ],
    pids: [
        {
            pid: 1,
            userId: 'pid1',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 2,
            userId: 'pid2',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 3,
            userId: 'pid3',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 11,
            userId: 'pid11',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 12,
            userId: 'pid12',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 13,
            userId: 'pid13',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 21,
            userId: 'pid21',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 22,
            userId: 'pid22',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 23,
            userId: 'pid23',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 31,
            userId: 'pid31',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 32,
            userId: 'pid32',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 33,
            userId: 'pid33',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
    ],
    regions: [
        {
            name: 'DEFAULT',
            estimatedFreeLockSpace: '100% of 220 pages',
            processesOnQueue: '0/880',
            slotsInUse: '0/597',
            slotsBytesInUse: '0/28080'
        },
        {
            name: 'YDBOCTO',
            estimatedFreeLockSpace: '100% of 220 pages',
            processesOnQueue: '0/880',
            slotsInUse: '0/597',
            slotsBytesInUse: '0/28080'
        },
        {
            name: 'YDBAIM',
            estimatedFreeLockSpace: '100% of 220 pages',
            processesOnQueue: '0/880',
            slotsInUse: '0/597',
            slotsBytesInUse: '0/28080'
        }
    ]
}
````

ERROR

````js
res = {
    result: 'ERR',
    error : {description: '',   // The error description
    dump: []                    // Eventual dump of shell response
} 
}
````

---

### `POST` api/regions/locks/clear

Clears the lock identified in the namepsace parameter.

Parameters: 

`namespace=`

Specify the namespace to clear.

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
    result: 'ERROR',
    error : {description: ''} // The error description
}
````


---

### `POST` api/os/processes/{pid}/terminate

Terminates the process identified by the `pid` parameter. 

Note: the process must be a yottadb process or it won't be terminated and an error will be returned.

Parameters: 

`none`

Body: 

`none`

Returns:

SUCCESS

````js
res = {
    result: 'OK',
}
````


ERROR

````js
res = {
    result: 'ERROR',
    error : {description: ''} // The error description
}
````

