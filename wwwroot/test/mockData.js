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

const getSystemData = (state = true) => {
    const testData = testLoadData();
    return new Promise(function (resolve, reject) {
        if (state === false) {
            reject(

            )
        } else {
            // return success data
            resolve(
                testData
            )
        }
    })
};

const testLoadData = () => {
        let mockData = testMock;

        let testNumber = parseInt(window.location.search.split('=')[1]);

        console.log('Test: ' + testNumber);
        switch (testNumber) {

            // gld file
            case 30: {
                mockData.data.gld.exist = false;
                break;
            }
            case 31: {
                mockData.data.gld.exist = true;
                mockData.data.gld.valid = false;
                break;
            }

            // REGION LIST: Db file
            case 40: {
                mockData.data.regions.DEFAULT.replication.flags.status = 1;
                break;
            }
            case 41: {
                mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": "/data/r1.34_x86_64/g/yottadb.dat"};
                break;
            }
            case 42: {
                mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
                mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
                mockData.data.regions.DEFAULT.dbAccess.data[2] = {"AUTO_DB": false};
                break;
            }
            case 43: {
                mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
                mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
                mockData.data.regions.DEFAULT.dbAccess.data[2] = {"AUTO_DB": true};
                break;
            }
            case 44: {
                mockData.data.regions.DEFAULT.dbFile.flags.shmenHealthy = false;
                break;
            }

            // REGION LIST: Journal file
            case 50: {
                mockData.data.regions.DEFAULT.journal.flags.state = 0;
                break;
            }
            case 51: {
                mockData.data.regions.DEFAULT.journal.flags.state = 1;
                break;
            }
            case 52: {
                mockData.data.regions.DEFAULT.journal.flags.state = 2;
                mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: true};
                break;
            }
            case 53: {
                mockData.data.regions.DEFAULT.journal.flags.state = 2;
                mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: false};
                break;
            }
            case 54: {
                mockData.data.regions.DEFAULT.journal.flags.state = 2;
                mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: true};
                mockData.data.regions.DEFAULT.replication.flags.status = 2;
                break;
            }
            case 55: {
                mockData.data.regions.DEFAULT.journal.flags.state = 1;
                mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: true};
                mockData.data.regions.DEFAULT.replication.flags.status = 1;
                break;
            }
            case 56: {
                mockData.data.regions.DEFAULT.journal.flags.state = 2;
                mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: true};
                mockData.data.regions.DEFAULT.replication.flags.status = 1;
                break;
            }
            case 57: {
                mockData.data.regions.DEFAULT.journal.flags.state = 2;
                mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: false};
                mockData.data.regions.DEFAULT.replication.flags.status = 1;
                break;
            }
            case 58: {
                mockData.data.regions.DEFAULT.journal.flags.state = 0;
                mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: false};
                mockData.data.regions.DEFAULT.dbFile.flags.status = 1;
                break;
            }
            case 59: {
                mockData.data.regions.DEFAULT.journal.flags.state = 0;
                mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: false};
                mockData.data.regions.DEFAULT.replication.flags.status = 1;
                mockData.data.regions.DEFAULT.dbFile.flags.sessions = 1;
                break;
            }

            case 60: {
                mockData.data.regions.DEFAULT.journal.flags.state = 1;
                mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: false};
                mockData.data.regions.DEFAULT.replication.flags.status = 1;
                mockData.data.regions.DEFAULT.dbFile.flags.sessions = 1;
                break;
            }
            case 61: {
                mockData.data.regions.DEFAULT.journal.flags.state = 2;
                mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: true};
                mockData.data.regions.DEFAULT.replication.flags.status = 1;
                mockData.data.regions.DEFAULT.dbFile.flags.sessions = 1;
                break;
            }
            case 62: {
                mockData.data.regions.DEFAULT.journal.flags.state = 2;
                mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: false};
                mockData.data.regions.DEFAULT.replication.flags.status = 1;
                mockData.data.regions.DEFAULT.dbFile.flags.sessions = 1;
                break;
            }

            // Devices
            case 70: {
                mockData.data.devices[0].percentUsed = 50;
                break;
            }
            case 71: {
                mockData.data.devices[0].percentUsed = 75;
                break;
            }
            case 72: {
                mockData.data.devices[0].percentUsed = 92;
                break;
            }
            case 73: {
                mockData.data.devices[0].percentUsed = 98;
                break;
            }

            // Global status
            case 100: {
                break;
            }
            case 101: {
                mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
                mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
                mockData.data.regions.DEFAULT.dbAccess.data[2] = {"AUTO_DB": false};
                break;
            }
            case 102: {
                mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
                mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
                mockData.data.regions.DEFAULT.dbAccess.data[2] = {"AUTO_DB": false};

                mockData.data.regions.YDBAIM.dbFile.flags.fileExist = false;
                mockData.data.regions.YDBAIM.dbFile.data[0] = {"FILE_NAME": ""};
                mockData.data.regions.YDBAIM.dbAccess.data[2] = {"AUTO_DB": false};

                mockData.data.regions.YDBOCTO.dbFile.flags.fileExist = false;
                mockData.data.regions.YDBOCTO.dbFile.data[0] = {"FILE_NAME": ""};
                mockData.data.regions.YDBOCTO.dbAccess.data[2] = {"AUTO_DB": false};
                break;
            }
            case 103: {
                break;
            }
            case 104: {
                mockData.data.regions.DEFAULT.journal.flags.state = 1;
                break;
            }
            case 105: {
                mockData.data.regions.DEFAULT.journal.flags.state = 1;
                mockData.data.regions.YDBAIM.journal.flags.state = 1;
                mockData.data.regions.YDBOCTO.journal.flags.state = 1;
                break;
            }
            case 106: {
                mockData.data.regions.DEFAULT.replication.flags.status = 2;
                break;
            }
            case 107: {
                break;
            }
            case 108: {
                mockData.data.regions.DEFAULT.replication.flags.status = 1;
                break;
            }
            case 109: {
                mockData.data.regions.DEFAULT.replication.flags.status = 2;
                break;
            }

            // system info
            case 151: {
                mockData.data.systemInfo.plugins = [];
                mockData.data.systemInfo.plugins.push({name: 'Plugin-name', description: 'Plugin-description', vendor: 'Plugin-vendor', version: 'Plugin-version'});
                break;
            }

            // device info
            case 192: {
                mockData.data.devices[0].percentUsed = 75;
                break
            }
            case 193: {
                mockData.data.devices[0].percentUsed = 92;
                break
            }
            case 194: {
                mockData.data.devices[0].percentUsed = 98;
                break
            }

            // Region view: db
            case 250: {
                mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
                mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
                mockData.data.regions.DEFAULT.dbAccess.data[2] = {"AUTO_DB": true};
                break
            }
            case 251: {
                mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
                mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
                mockData.data.regions.DEFAULT.dbAccess.data[2] = {"AUTO_DB": false};
                break
            }
            case 252: {
                mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
                mockData.data.regions.DEFAULT.dbFile.flags.fileValid = false;
                break
            }
            case 253: {
                mockData.data.regions.DEFAULT.dbFile.flags.shmenHealthy = false;
                break
            }
            case 254: {
                mockData.data.regions.DEFAULT.dbFile.usage.usedPercent = 10;
                break
            }
            case 255: {
                mockData.data.regions.DEFAULT.dbFile.usage.usedPercent = 80;
                break
            }
            case 256: {
                mockData.data.regions.DEFAULT.dbFile.usage.usedPercent = 95;
                break
            }
            case 257: {
                mockData.data.regions.DEFAULT.dbFile.usage.usedPercent = 99;
                break
            }
            case 259: {
                mockData.data.regions.DEFAULT.dbFile.flags.sessions = 27;
                break
            }
            case 260: {
                mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
                mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
                mockData.data.regions.DEFAULT.dbAccess.data[2] = {"AUTO_DB": true};
                break
            }
            case 261: {
                mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
                mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
                mockData.data.regions.DEFAULT.dbAccess.data[2] = {"AUTO_DB": false};
                break
            }
            case 262: {
                mockData.data.regions.DEFAULT.dbFile.flags.fileExist = true;
                mockData.data.regions.DEFAULT.dbFile.flags.fileBad = true;
                break
            }
            case 263: {
                mockData.data.regions.DEFAULT.dbFile.flags.shmenHealthy = false;
                break
            }
            case 280: {
                mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
                mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
                mockData.data.regions.DEFAULT.dbAccess.data[2] = {"AUTO_DB": true};
                break
            }
            case 281: {
                mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
                mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
                mockData.data.regions.DEFAULT.dbAccess.data[2] = {"AUTO_DB": false};
                break
            }
            case 284: {
                mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
                break
            }
            case 285: {
                mockData.data.regions.DEFAULT.dbFile.flags.fileBad = true;
                break
            }

            // Region view: journal
            case 290: {
                mockData.data.regions.DEFAULT.journal.flags.state = 0;
                break
            }
            case 291: {
                mockData.data.regions.DEFAULT.journal.flags.state = 1;
                break
            }
            case 293: {
                mockData.data.regions.DEFAULT.replication.flags.status = 2;
                break
            }
            case 294: {
                mockData.data.regions.DEFAULT.journal.flags.state = 1;
                mockData.data.regions.DEFAULT.replication.flags.status = 1;
                break
            }
            case 295: {
                mockData.data.regions.DEFAULT.replication.flags.status = 1;
                break
            }
            case 296: {
                mockData.data.regions.DEFAULT.replication.flags.status = 1;
                mockData.data.regions.DEFAULT.journal.flags.state = 2;
                mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: false};
                break
            }
            case 297: {
                mockData.data.regions.DEFAULT.replication.flags.status = 1;
                mockData.data.regions.DEFAULT.journal.flags.state = 0;
                mockData.data.regions.DEFAULT.dbFile.flags.sessions = 27;
                break
            }
            case 298: {
                mockData.data.regions.DEFAULT.replication.flags.status = 1;
                mockData.data.regions.DEFAULT.journal.flags.state = 1;
                mockData.data.regions.DEFAULT.dbFile.flags.sessions = 27;
                break
            }
            case 299: {
                mockData.data.regions.DEFAULT.replication.flags.status = 1;
                mockData.data.regions.DEFAULT.journal.flags.state = 2;
                mockData.data.regions.DEFAULT.dbFile.flags.sessions = 27;
                break
            }
            case 310: {
                mockData.data.regions.DEFAULT.journal.flags.state = 1;
                break
            }
            case 311: {
                mockData.data.regions.DEFAULT.journal.flags.state = 0;
                break
            }
            case 314: {
                mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: false};
                break
            }
            case 315: {
                mockData.data.regions.DEFAULT.journal.flags.state = 0;
                break
            }
            case 317: {
                mockData.data.regions.DEFAULT.journal.flags.state = 0;
                break
            }
            case 318: {
                mockData.data.regions.DEFAULT.replication.flags.status = 2;
                break
            }
            case 319: {
                mockData.data.regions.DEFAULT.journal.flags.state = 0;
                mockData.data.regions.DEFAULT.replication.flags.status = 1;
                mockData.data.regions.DEFAULT.dbFile.flags.sessions = 27;
                break
            }
            case 320: {
                mockData.data.regions.DEFAULT.journal.flags.state = 1;
                mockData.data.regions.DEFAULT.replication.flags.status = 1;
                mockData.data.regions.DEFAULT.dbFile.flags.sessions = 27;
                break
            }
            case 321: {
                mockData.data.regions.DEFAULT.journal.flags.state = 1;
                mockData.data.regions.DEFAULT.replication.flags.status = 0;
                mockData.data.regions.DEFAULT.dbFile.flags.sessions = 27;
                break
            }
            case 375: {
                mockData.data.regions.DEFAULT.locks.locks = [
                    {
                        node: '^testGlobal("subscript1")',
                        pid: 1234
                    }
                ];
                break
            }
            case 376: {
                mockData.data.regions.DEFAULT.locks.locks = [
                    {
                        node: '^testGlobal("subscript1")',
                        pid: 1234,
                        waiters: [
                            {pid: 4321}
                        ]
                    }
                ];
                break
            }
            case 377: {
                mockData.data.regions.DEFAULT.locks.locks = [
                    {
                        node: '^testGlobal("subscript1")',
                        pid: 1234,
                        waiters: [
                            {pid: 4321},
                            {pid: 7890}
                        ]
                    }
                ];
                break
            }
            case 378: {
                mockData.data.regions.DEFAULT.locks.locks = [
                    {
                        node: '^testGlobal("subscript1")',
                        pid: 1234
                    },
                    {
                        node: '^testGlobal("subscript2")',
                        pid: 1234321
                    }
                ];
                break
            }
            case 379: {
                mockData.data.regions.DEFAULT.locks.locks = [
                    {
                        node: '^testGlobal("subscript1")',
                        pid: 1234,
                        waiters: [
                            {pid: 4321}
                        ]
                    },
                    {
                        node: '^testGlobal("subscript2")',
                        pid: 1234321
                    }
                ];
                break
            }
            case 380: {
                mockData.data.regions.DEFAULT.locks.locks = [
                    {
                        node: '^testGlobal("subscript1")',
                        pid: 1234,
                        waiters: [
                            {pid: 4321},
                            {pid: 7890}
                        ]
                    },
                    {
                        node: '^testGlobal("subscript2")',
                        pid: 1234321
                    }
                ];
                break


            }
        }

        return mockData
    }
;

let testMock = {
    data: {
        devices: [
            {
                freeBlocks: 234145020,
                mountPoint: "/",
                percentUsed: 7,
                totalBlocks: 263174212,
                type: "overlay",
                usedBlocks: 15591036,
                usedBy: [
                    {
                        "file": "/data/r1.34_x86_64/g/yottadb.dat",
                        "region": "DEFAULT"
                    },
                    {
                        "file": "/data/r1.34_x86_64/g/yottadb.mjl",
                        "region": "DEFAULT"
                    },
                    {
                        "file": "/data/r1.34_x86_64/g/%ydbaim.dat",
                        "region": "YDBAIM"
                    },
                    {
                        "file": "/data/r1.34_x86_64/g/%ydbocto.dat",
                        "region": "YDBOCTO"
                    },
                    {
                        "file": "/data/r1.34_x86_64/g/%ydbocto.mjl",
                        "region": "YDBOCTO"
                    }
                ]
            }
        ],
        "gld":
            {
                "exist":
                    true,
                "valid":
                    true
            }
        ,
        "regions":
            {
                "DEFAULT":
                    {
                        "dbAccess":
                            {
                                "data":
                                    [
                                        {
                                            "RECORD_SIZE": 4080
                                        },
                                        {
                                            "KEY_SIZE": 255
                                        },
                                        {
                                            "AUTO_DB": false
                                        },
                                        {
                                            "NULL_SUBSCRIPTS": false
                                        }
                                    ]
                            }
                        ,
                        "dbFile":
                            {
                                "data":
                                    [
                                        {
                                            "FILE_NAME": "/data/r1.34_x86_64/g/yottadb.dat"
                                        },
                                        {
                                            "currentSize": 20520960
                                        },
                                        {
                                            "extensionLeft": 20471808
                                        },
                                        {
                                            "maximumSize": 40992768
                                        },
                                        {
                                            "ACCESS_METHOD": "BG"
                                        },
                                        {
                                            "GLOBAL_BUFFER_COUNT": 1000
                                        },
                                        {
                                            "LOCK_SPACE": 220
                                        },
                                        {
                                            "ASYNCIO": false
                                        },
                                        {
                                            "DEFER_ALLOCATE": true
                                        },
                                        {
                                            "EXTENSION_COUNT": 10000
                                        },
                                        {
                                            "TRANSACTION_NUMBER": "0x0000000000000001"
                                        },
                                        {
                                            "LAST_BACKUP": "0x0000000000000001"
                                        },
                                        {
                                            "ALLOCATION": 2048
                                        },
                                        {
                                            "BLOCK_SIZE": 4096
                                        }
                                    ],
                                "flags":
                                    {
                                        "device":
                                            "overlay 263174212 15591036 234145020 7% /",
                                        "file":
                                            "/data/r1.34_x86_64/g/yottadb.dat",
                                        "fileBad":
                                            false,
                                        "fileExist":
                                            true,
                                        "mountpoint":
                                            "/",
                                        "sessions":
                                            0,
                                        "shmenHealthy":
                                            true
                                    }
                                ,
                                "usage":
                                    {
                                        "freeBlocks":
                                            4998,
                                        "totalBlocks":
                                            10008,
                                        "usedBlocks":
                                            5010,
                                        "usedPercent":
                                            49.9
                                    }
                            }
                        ,
                        "journal":
                            {
                                "data":
                                    [
                                        {
                                            "JFILE_NAME": "/data/r1.34_x86_64/g/yottadb.mjl"
                                        },
                                        {
                                            "BEFORE": true
                                        },
                                        {
                                            "EPOCH_INTERVAL": 300
                                        },
                                        {
                                            "EPOCH_TAPER": true
                                        },
                                        {
                                            "SYNC_IO": false
                                        },
                                        {
                                            "BUFFER_SIZE": 2312
                                        }
                                    ],
                                "flags":
                                    {
                                        "device":
                                            "overlay 263174212 15591036 234145020 7% /",
                                        "file":
                                            "/data/r1.34_x86_64/g/yottadb.mjl",
                                        "inode":
                                            "",
                                        "mountpoint":
                                            "/",
                                        "state":
                                            2
                                    }
                            }
                        ,
                        "locks":
                            {
                                "estimatedFreeLockSpace":
                                    "100% of 220 pages",
                                "processesOnQueue":
                                    "0/880",
                                "slotsBytesInUse":
                                    "0/28080",
                                "slotsInUse":
                                    "0/597"
                            }
                        ,
                        "replication":
                            {
                                "flags":
                                    {
                                        "status":
                                            0
                                    }
                            }
                        ,
                        "stats":
                            {
                                "csa":
                                    {
                                        "caption":
                                            "Critical Section Acquisition",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_success": 51
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_fail": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_in_epch": 0
                                                }
                                            ]
                                    }
                                ,
                                "journal":
                                    {
                                        "caption":
                                            "Journal information",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jfile_bytes": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jnl_flush": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jnl_fsync": 1
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jrec_epoch_regular": 0
                                                }
                                            ]
                                    }
                                ,
                                "locks":
                                    {
                                        "caption":
                                            "M Lock Operations",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_lock_success": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_lock_fail": 0
                                                }
                                            ]
                                    }
                                ,
                                "logicalOperations":
                                    {
                                        "caption":
                                            "Logical Database operations",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_set": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_kill": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_get": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_data": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_order": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_zprev": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_query": 0
                                                }
                                            ]
                                    }
                                ,
                                "transactions":
                                    {
                                        "caption":
                                            "Transactions",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_0": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_1": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_2": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_3": 0
                                                }
                                            ]
                                    }
                            }
                    }
                ,
                "YDBAIM":
                    {
                        "dbAccess":
                            {
                                "data":
                                    [
                                        {
                                            "RECORD_SIZE": 2048
                                        },
                                        {
                                            "KEY_SIZE": 1019
                                        },
                                        {
                                            "AUTO_DB": false
                                        },
                                        {
                                            "NULL_SUBSCRIPTS": true
                                        }
                                    ]
                            }
                        ,
                        "dbFile":
                            {
                                "data":
                                    [
                                        {
                                            "FILE_NAME": "/data/r1.34_x86_64/g/%ydbaim.dat"
                                        },
                                        {
                                            "currentSize": 20520960
                                        },
                                        {
                                            "extensionLeft": 20475904
                                        },
                                        {
                                            "maximumSize": 40996864
                                        },
                                        {
                                            "ACCESS_METHOD": "MM"
                                        },
                                        {
                                            "LOCK_SPACE": 220
                                        },
                                        {
                                            "DEFER_ALLOCATE": true
                                        },
                                        {
                                            "EXTENSION_COUNT": 20000
                                        },
                                        {
                                            "TRANSACTION_NUMBER": "0x0000000000000001"
                                        },
                                        {
                                            "LAST_BACKUP": "0x0000000000000001"
                                        },
                                        {
                                            "ALLOCATION": 2048
                                        },
                                        {
                                            "BLOCK_SIZE": 2048
                                        }
                                    ],
                                "flags":
                                    {
                                        "device":
                                            "overlay 263174212 15591036 234145020 7% /",
                                        "file":
                                            "/data/r1.34_x86_64/g/%ydbaim.dat",
                                        "fileBad":
                                            false,
                                        "fileExist":
                                            true,
                                        "mountpoint":
                                            "/",
                                        "sessions":
                                            0,
                                        "shmenHealthy":
                                            true
                                    }
                                ,
                                "usage":
                                    {
                                        "freeBlocks":
                                            9998,
                                        "totalBlocks":
                                            20018,
                                        "usedBlocks":
                                            10020,
                                        "usedPercent":
                                            49.9
                                    }
                            }
                        ,
                        "journal":
                            {
                                "data":
                                    [
                                        {
                                            "JFILE_NAME": ""
                                        },
                                        {
                                            "BEFORE": false
                                        },
                                        {
                                            "EPOCH_INTERVAL": 300
                                        },
                                        {
                                            "EPOCH_TAPER": true
                                        },
                                        {
                                            "SYNC_IO": false
                                        },
                                        {
                                            "BUFFER_SIZE": 2312
                                        }
                                    ],
                                "flags":
                                    {
                                        "inode":
                                            "",
                                        "state":
                                            0
                                    }
                            }
                        ,
                        "locks":
                            {
                                "estimatedFreeLockSpace":
                                    "100% of 220 pages",
                                "processesOnQueue":
                                    "0/880",
                                "slotsBytesInUse":
                                    "0/28080",
                                "slotsInUse":
                                    "0/597"
                            }
                        ,
                        "names":
                            [
                                {
                                    "name": "YDBAIM",
                                    "ranges": [
                                        {
                                            "from": "%ydbAIM",
                                            "to": "%ydbAIN"
                                        },
                                        {
                                            "from": "%ydbAIm",
                                            "to": "%ydbAIn"
                                        },
                                        {
                                            "from": "%ydbAiM",
                                            "to": "%ydbAiN"
                                        },
                                        {
                                            "from": "%ydbAim",
                                            "to": "%ydbAin"
                                        },
                                        {
                                            "from": "%ydbaIM",
                                            "to": "%ydbaIN"
                                        },
                                        {
                                            "from": "%ydbaIm",
                                            "to": "%ydbaIn"
                                        },
                                        {
                                            "from": "%ydbaiM",
                                            "to": "%ydbaiN"
                                        },
                                        {
                                            "from": "%ydbaim",
                                            "to": "%ydbain"
                                        }
                                    ],
                                    "type": "%y"
                                }
                            ],
                        "replication":
                            {
                                "flags":
                                    {
                                        "status":
                                            0
                                    }
                            }
                        ,
                        "stats":
                            {
                                "csa":
                                    {
                                        "caption":
                                            "Critical Section Aquisition",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_success": 50
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_fail": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_in_epch": 0
                                                }
                                            ]
                                    }
                                ,
                                "journal":
                                    {
                                        "caption":
                                            "Journal information",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jfile_bytes": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jnl_flush": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jnl_fsync": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jrec_epoch_regular": 0
                                                }
                                            ]
                                    }
                                ,
                                "locks":
                                    {
                                        "caption":
                                            "M Lock Operations",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_lock_success": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_lock_fail": 0
                                                }
                                            ]
                                    }
                                ,
                                "logicalOperations":
                                    {
                                        "caption":
                                            "Logical Database operations",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_set": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_kill": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_get": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_data": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_order": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_zprev": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_query": 0
                                                }
                                            ]
                                    }
                                ,
                                "transactions":
                                    {
                                        "caption":
                                            "Transactions",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_0": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_1": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_2": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_3": 0
                                                }
                                            ]
                                    }
                            }
                    }
                ,
                "YDBOCTO":
                    {
                        "dbAccess":
                            {
                                "data":
                                    [
                                        {
                                            "RECORD_SIZE": 1048576
                                        },
                                        {
                                            "KEY_SIZE": 1019
                                        },
                                        {
                                            "AUTO_DB": false
                                        },
                                        {
                                            "NULL_SUBSCRIPTS": true
                                        }
                                    ]
                            }
                        ,
                        "dbFile":
                            {
                                "data":
                                    [
                                        {
                                            "FILE_NAME": "/data/r1.34_x86_64/g/%ydbocto.dat"
                                        },
                                        {
                                            "currentSize": 20520960
                                        },
                                        {
                                            "extensionLeft": 20475904
                                        },
                                        {
                                            "maximumSize": 40996864
                                        },
                                        {
                                            "ACCESS_METHOD": "BG"
                                        },
                                        {
                                            "GLOBAL_BUFFER_COUNT": 2000
                                        },
                                        {
                                            "LOCK_SPACE": 220
                                        },
                                        {
                                            "ASYNCIO": false
                                        },
                                        {
                                            "DEFER_ALLOCATE": true
                                        },
                                        {
                                            "EXTENSION_COUNT": 20000
                                        },
                                        {
                                            "TRANSACTION_NUMBER": "0x0000000000000001"
                                        },
                                        {
                                            "LAST_BACKUP": "0x0000000000000001"
                                        },
                                        {
                                            "ALLOCATION": 2048
                                        },
                                        {
                                            "BLOCK_SIZE": 2048
                                        }
                                    ],
                                "flags":
                                    {
                                        "device":
                                            "overlay 263174212 15591036 234145020 7% /",
                                        "file":
                                            "/data/r1.34_x86_64/g/%ydbocto.dat",
                                        "fileBad":
                                            false,
                                        "fileExist":
                                            true,
                                        "mountpoint":
                                            "/",
                                        "sessions":
                                            0,
                                        "shmenHealthy":
                                            true
                                    }
                                ,
                                "usage":
                                    {
                                        "freeBlocks":
                                            9998,
                                        "totalBlocks":
                                            20018,
                                        "usedBlocks":
                                            10020,
                                        "usedPercent":
                                            49.9
                                    }
                            }
                        ,
                        "journal":
                            {
                                "data":
                                    [
                                        {
                                            "JFILE_NAME": "/data/r1.34_x86_64/g/%ydbocto.mjl"
                                        },
                                        {
                                            "BEFORE": true
                                        },
                                        {
                                            "EPOCH_INTERVAL": 300
                                        },
                                        {
                                            "EPOCH_TAPER": true
                                        },
                                        {
                                            "SYNC_IO": false
                                        },
                                        {
                                            "BUFFER_SIZE": 2312
                                        }
                                    ],
                                "flags":
                                    {
                                        "device":
                                            "overlay 263174212 15591036 234145020 7% /",
                                        "file":
                                            "/data/r1.34_x86_64/g/%ydbocto.mjl",
                                        "inode":
                                            "",
                                        "mountpoint":
                                            "/",
                                        "state":
                                            2
                                    }
                            }
                        ,
                        "locks":
                            {
                                "estimatedFreeLockSpace":
                                    "100% of 220 pages",
                                "processesOnQueue":
                                    "0/880",
                                "slotsBytesInUse":
                                    "0/28080",
                                "slotsInUse":
                                    "0/597"
                            }
                        ,
                        "names":
                            [
                                {
                                    "name": "YDBOCTO",
                                    "ranges": [
                                        {
                                            "from": "%ydbOCTO",
                                            "to": "%ydbOCTP"
                                        },
                                        {
                                            "from": "%ydbOCTo",
                                            "to": "%ydbOCTp"
                                        },
                                        {
                                            "from": "%ydbOCtO",
                                            "to": "%ydbOCtP"
                                        },
                                        {
                                            "from": "%ydbOCto",
                                            "to": "%ydbOCtp"
                                        },
                                        {
                                            "from": "%ydbOcTO",
                                            "to": "%ydbOcTP"
                                        },
                                        {
                                            "from": "%ydbOcTo",
                                            "to": "%ydbOcTp"
                                        },
                                        {
                                            "from": "%ydbOctO",
                                            "to": "%ydbOctP"
                                        },
                                        {
                                            "from": "%ydbOcto",
                                            "to": "%ydbOctp"
                                        },
                                        {
                                            "from": "%ydboCTO",
                                            "to": "%ydboCTP"
                                        },
                                        {
                                            "from": "%ydboCTo",
                                            "to": "%ydboCTp"
                                        },
                                        {
                                            "from": "%ydboCtO",
                                            "to": "%ydboCtP"
                                        },
                                        {
                                            "from": "%ydboCto",
                                            "to": "%ydboCtp"
                                        },
                                        {
                                            "from": "%ydbocTO",
                                            "to": "%ydbocTP"
                                        },
                                        {
                                            "from": "%ydbocTo",
                                            "to": "%ydbocTp"
                                        },
                                        {
                                            "from": "%ydboctO",
                                            "to": "%ydboctP"
                                        },
                                        {
                                            "from": "%ydbocto",
                                            "to": "%ydboctp"
                                        }
                                    ],
                                    "type": "%y"
                                }
                            ],
                        "replication":
                            {
                                "flags":
                                    {
                                        "status":
                                            0
                                    }
                            }
                        ,
                        "stats":
                            {
                                "csa":
                                    {
                                        "caption":
                                            "Critical Section Aquisition",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_success": 55
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_fail": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_in_epch": 0
                                                }
                                            ]
                                    }
                                ,
                                "journal":
                                    {
                                        "caption":
                                            "Journal information",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jfile_bytes": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jnl_flush": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jnl_fsync": 1
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jrec_epoch_regular": 0
                                                }
                                            ]
                                    }
                                ,
                                "locks":
                                    {
                                        "caption":
                                            "M Lock Operations",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_lock_success": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_lock_fail": 0
                                                }
                                            ]
                                    }
                                ,
                                "logicalOperations":
                                    {
                                        "caption":
                                            "Logical Database operations",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_set": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_kill": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_get": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_data": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_order": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_zprev": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_query": 0
                                                }
                                            ]
                                    }
                                ,
                                "transactions":
                                    {
                                        "caption":
                                            "Transactions",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_0": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_1": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_2": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_3": 0
                                                }
                                            ]
                                    }
                            }
                    }
            }
        ,
        "systemInfo":
            {
                "chset":
                    "UTF-8",
                "envVars":
                    [
                        {
                            "name": "GTM_CALLIN_START",
                            "value": 140516965999840
                        },
                        {
                            "name": "HOME",
                            "value": "/root"
                        },
                        {
                            "name": "HOSTNAME",
                            "value": "94c82c3754f7"
                        },
                        {
                            "name": "LANG",
                            "value": "en_US.UTF-8"
                        },
                        {
                            "name": "LANGUAGE",
                            "value": "en_US:en"
                        },
                        {
                            "name": "LC_ALL",
                            "value": "en_US.UTF-8"
                        },
                        {
                            "name": "LD_LIBRARY_PATH",
                            "value": "/opt/yottadb/current"
                        },
                        {
                            "name": "OLDPWD",
                            "value": "/data"
                        },
                        {
                            "name": "PATH",
                            "value": "/opt/yottadb/current:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
                        },
                        {
                            "name": "PWD",
                            "value": "/YDBGUI/wwwroot"
                        },
                        {
                            "name": "SHLVL",
                            "value": 1
                        },
                        {
                            "name": "_",
                            "value": "/opt/yottadb/current/mumps"
                        },
                        {
                            "name": "gtm_chset",
                            "value": "UTF-8"
                        },
                        {
                            "name": "gtm_dist",
                            "value": "/opt/yottadb/current"
                        },
                        {
                            "name": "gtm_etrap",
                            "value": "Write:(0=$STACK) \"Error occurred: \",$ZStatus,!"
                        },
                        {
                            "name": "gtm_icu_version",
                            "value": 66.1
                        },
                        {
                            "name": "gtm_log",
                            "value": "/tmp/yottadb/r1.34_x86_64"
                        },
                        {
                            "name": "gtm_procstuckexec",
                            "value": "/opt/yottadb/current/yottadb -run %YDBPROCSTUCKEXEC"
                        },
                        {
                            "name": "gtm_repl_instance",
                            "value": "/data/r1.34_x86_64/g/yottadb.repl"
                        },
                        {
                            "name": "gtm_retention",
                            "value": 42
                        },
                        {
                            "name": "gtm_tmp",
                            "value": "/tmp/yottadb/r1.34_x86_64"
                        },
                        {
                            "name": "gtmdir",
                            "value": "/data"
                        },
                        {
                            "name": "gtmgbldir",
                            "value": "/data/r1.34_x86_64/g/yottadb.gld"
                        },
                        {
                            "name": "gtmroutines",
                            "value": "/data/r1.34_x86_64/o/utf8*(/data/r1.34_x86_64/r /data/r) /opt/yottadb/current/utf8/libyottadbutil.so"
                        },
                        {
                            "name": "gtmver",
                            "value": "V6.3-011_x86_64"
                        },
                        {
                            "name": "serverName",
                            "value": "ydbgui"
                        },
                        {
                            "name": "ydb_callin_start",
                            "value": 140516965999840
                        },
                        {
                            "name": "ydb_chset",
                            "value": "UTF-8"
                        },
                        {
                            "name": "ydb_dir",
                            "value": "/data"
                        },
                        {
                            "name": "ydb_dist",
                            "value": "/opt/yottadb/current"
                        },
                        {
                            "name": "ydb_etrap",
                            "value": "Write:(0=$STACK) \"Error occurred: \",$ZStatus,!"
                        },
                        {
                            "name": "ydb_gbldir",
                            "value": "/data/r1.34_x86_64/g/yottadb.gld"
                        },
                        {
                            "name": "ydb_icu_version",
                            "value": 66.1
                        },
                        {
                            "name": "ydb_j0",
                            "value": ""
                        },
                        {
                            "name": "ydb_log",
                            "value": "/tmp/yottadb/r1.34_x86_64"
                        },
                        {
                            "name": "ydb_procstuckexec",
                            "value": "/opt/yottadb/current/yottadb -run %YDBPROCSTUCKEXEC"
                        },
                        {
                            "name": "ydb_rel",
                            "value": "r1.34_x86_64"
                        },
                        {
                            "name": "ydb_repl_instance",
                            "value": "/data/r1.34_x86_64/g/yottadb.repl"
                        },
                        {
                            "name": "ydb_retention",
                            "value": 42
                        },
                        {
                            "name": "ydb_routines",
                            "value": "/data/r1.34_x86_64/o/utf8*(/data/r1.34_x86_64/r /data/r /YDBGUI/routines) /opt/yottadb/current/utf8/libyottadbutil.so"
                        },
                        {
                            "name": "ydb_sav_1_PATH",
                            "value": "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
                        },
                        {
                            "name": "ydb_sav_1_gtmdir",
                            "value": "/data"
                        },
                        {
                            "name": "ydb_statsdir",
                            "value": "/tmp/yottadb/r1.34_x86_64"
                        },
                        {
                            "name": "ydb_tmp",
                            "value": "/tmp/yottadb/r1.34_x86_64"
                        },
                        {
                            "name": "ydb_unset_1",
                            "value": "ydb_dir ydb_sav_1_gtmdir ydb_rel gtmver ydb_chset gtm_chset ydb_icu_version gtm_icu_version ydb_dist gtm_dist ydb_repl_instance gtm_repl_instance ydb_retention gtm_retention ydb_gbldir gtmgbldir ydb_routines gtmroutines ydb_log gtm_log ydb_tmp gtm_tmp ydb_etrap gtm_etrap ydb_procstuckexec gtm_procstuckexec LD_LIBRARY_PATH ydb_sav_1_PATH"
                        },
                        {
                            "name": "ydb_xc_gblstat",
                            "value": "/opt/yottadb/current/gtmgblstat.xc"
                        }
                    ],
                "gld":
                    "/data/r1.34_x86_64/g/yottadb.gld",
                "zroutines":
                    "/data/r1.34_x86_64/o/utf8*(/data/r1.34_x86_64/r /data/r /YDBGUI/routines) /opt/yottadb/current/utf8/libyottadbutil.so"
            }
        ,
        "ydb_version":
            "r1.34"
    }
    ,
    "result":
        "OK"
};

