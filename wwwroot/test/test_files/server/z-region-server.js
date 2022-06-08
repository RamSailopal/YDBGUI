/*
#################################################################
#                                                               #
# Copyright (c) 2022 YottaDB LLC and/or its subsidiaries.       #
# All rights reserved.                                          #
#                                                               #
#   This source code contains the intellectual property         #
#   of its copyright holder(s), and is made available           #
#   under a license.  If you do not know the terms of           #
#   the license, please stop and do not read further.           #
#                                                               #
#################################################################
*/

const libs = require('../../libs');
const {expect} = require("chai");
const {execSync, exec} = require('child_process');

describe("SERVER: Create Region", async () => {
    it("Test # 1310: Create random region with default params and verify creation + file existence", async () => {
        // generate a random region name
        const regionName = libs.randomRegionName();

        const body = {
            dbAccess: {
                journal: [],
                region: []
            },
            journalEnabled: false,
            journalFilename: '/data/r1.35_x86_64/g/' + regionName + '.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: false
            },
            regionName: regionName,
            segmentData: [],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + '.dat',
            segmentTypeBg: true,
            templates: {
                updateTemplateDb: false,
                updateTemplateJournal: false
            }
        };

        // execute the call
        let res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the region exists
        res = await libs._REST('regions/' + regionName + '/');

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and have the correct properties
        let val = res.data.dbAccess.data[0].RECORD_SIZE;
        expect(val === 4080).to.be.true;

        // filename is correct
        val = res.data.dbFile.data[0].FILE_NAME;
        expect(val).to.have.string('/data/r1.35_x86_64/g/' + regionName + '.dat')

        // db file exists
        val = res.data.dbFile.flags.fileExist;
        expect(val).to.be.true;

        // journal state
        val = res.data.journal.flags.state;
        expect(val === 0).to.be.true;

        // names
        val = res.data.names[0].name;
        expect(val).to.have.string(regionName)
    });

    it("Test # 1311: Create random region with different filename and verify creation + file existence", async () => {
        // generate a random region name
        const regionName = libs.randomRegionName();

        const body = {
            dbAccess: {
                journal: [],
                region: []
            },
            journalEnabled: false,
            journalFilename: '/data/r1.35_x86_64/g/' + regionName + 'T.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: false
            },
            regionName: regionName,
            segmentData: [],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + 'T.dat',
            segmentTypeBg: true,
            templates: {
                updateTemplateDb: false,
                updateTemplateJournal: false
            }
        };

        // execute the call
        let res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the region exists
        res = await libs._REST('regions/' + regionName + '/');

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and have the correct properties
        let val = res.data.dbAccess.data[0].RECORD_SIZE;
        expect(val === 4080).to.be.true;

        // filename is correct
        val = res.data.dbFile.data[0].FILE_NAME;
        expect(val).to.have.string('/data/r1.35_x86_64/g/' + regionName + 'T.dat')

        // db file exists
        val = res.data.dbFile.flags.fileExist;
        expect(val).to.be.true;

        // journal state
        val = res.data.journal.flags.state;
        expect(val === 0).to.be.true;

        // names
        val = res.data.names[0].name;
        expect(val).to.have.string(regionName)
    });

    it("Test # 1312: Create random region with default params, but no db file creation and verify + no file", async () => {
        // generate a random region name
        const regionName = libs.randomRegionName();

        const body = {
            dbAccess: {
                journal: [],
                region: []
            },
            journalEnabled: false,
            journalFilename: '/data/r1.35_x86_64/g/' + regionName + '.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: false,
                switchJournalOn: false
            },
            regionName: regionName,
            segmentData: [],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + '.dat',
            segmentTypeBg: true,
            templates: {
                updateTemplateDb: false,
                updateTemplateJournal: false
            }
        };

        // execute the call
        let res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the region exists
        res = await libs._REST('regions/' + regionName + '/');

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // filename is correct
        val = res.data.dbFile.data[0].FILE_NAME;
        expect(val).to.have.string('/data/r1.35_x86_64/g/' + regionName + '.dat');

        // db file does NOT exists
        val = res.data.dbFile.flags.fileExist;
        expect(val).to.be.false;
    });

    it("Test # 1313: Create random region with default params and journal, turned on", async () => {
        // generate a random region name
        const regionName = libs.randomRegionName();

        const body = {
            dbAccess: {
                journal: [
                    {
                        id: 'journalEnabled',
                        value: 1
                    }
                ],
                region: []
            },
            journalEnabled: true,
            journalFilename: '/data/r1.35_x86_64/g/' + regionName + '.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: true
            },
            regionName: regionName,
            segmentData: [],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + '.dat',
            segmentTypeBg: true,
            templates: {
                updateTemplateDb: false,
                updateTemplateJournal: false
            }
        };

        // execute the call
        let res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the region exists
        res = await libs._REST('regions/' + regionName + '/');

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // db file exists
        val = res.data.dbFile.flags.fileExist;
        expect(val).to.be.true;

        // journal state
        val = res.data.journal.flags.state;
        expect(val === 2).to.be.true;
    });

    it("Test # 1314: Create random region with default params and journal, turned off", async () => {
        // generate a random region name
        const regionName = libs.randomRegionName();

        const body = {
            dbAccess: {
                journal: [
                    {
                        id: 'journalEnabled',
                        value: 1
                    }
                ],
                region: []
            },
            journalEnabled: true,
            journalFilename: '/data/r1.35_x86_64/g/' + regionName + '.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: false
            },
            regionName: regionName,
            segmentData: [],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + '.dat',
            segmentTypeBg: true,
            templates: {
                updateTemplateDb: false,
                updateTemplateJournal: false
            }
        };

        // execute the call
        let res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the region exists
        res = await libs._REST('regions/' + regionName + '/');

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // db file exists
        val = res.data.dbFile.flags.fileExist;
        expect(val).to.be.true;

        // journal state
        val = res.data.journal.flags.state;
        expect(val === 1).to.be.true;
    });

    it("Test # 1315: Create random region with default params and journal, turned off, with different journal path", async () => {
        // generate a random region name
        const regionName = libs.randomRegionName();

        const body = {
            dbAccess: {
                journal: [
                    {
                        id: 'journalEnabled',
                        value: 1
                    }
                ],
                region: []
            },
            journalEnabled: true,
            journalFilename: '/data/' + regionName + '.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: false
            },
            regionName: regionName,
            segmentData: [],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + '.dat',
            segmentTypeBg: true,
            templates: {
                updateTemplateDb: false,
                updateTemplateJournal: false
            }
        };

        // execute the call
        let res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the region exists
        res = await libs._REST('regions/' + regionName + '/');

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // db file exists
        val = res.data.dbFile.flags.fileExist;
        expect(val).to.be.true;

        // journal state
        val = res.data.journal.flags.state;
        expect(val === 1).to.be.true;
    });

    it("Test # 1316: Create random region with Auto Db = on", async () => {
        // generate a random region name
        const regionName = libs.randomRegionName();

        const body = {
            dbAccess: {
                journal: [],
                region: [
                    {
                        id: 'autoDb',
                        value: 1
                    }
                ]
            },
            journalEnabled: false,
            journalFilename: '/data/r1.35_x86_64/g/' + regionName + '.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: false
            },
            regionName: regionName,
            segmentData: [],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + '.dat',
            segmentTypeBg: true,
            templates: {
                updateTemplateDb: false,
                updateTemplateJournal: false
            }
        };

        // execute the call
        let res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the region exists
        res = await libs._REST('regions/' + regionName + '/');

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and have the correct properties
        let val = res.data.dbFile.data[3].AUTO_DB;
        expect(val).to.be.true;
    });


    it("Test # 1317: Create random region with Access Method = MM", async () => {
        // generate a random region name
        const regionName = libs.randomRegionName();

        const body = {
            dbAccess: {
                journal: [],
                region: [
                ]
            },
            journalEnabled: false,
            journalFilename: '/data/r1.35_x86_64/g/' + regionName + '.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: false
            },
            regionName: regionName,
            segmentData: [],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + '.dat',
            segmentTypeBg: false,
            templates: {
                updateTemplateDb: false,
                updateTemplateJournal: false
            }
        };

        // execute the call
        let res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the region exists
        res = await libs._REST('regions/' + regionName + '/');

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and have the correct properties
        let val = res.data.dbFile.data[2].ACCESS_METHOD === 'MM';
        expect(val).to.be.true;
    });

    it("Test # 1318: Create random region with all dbAccess fields different and verify them all", async () => {
        // generate a random region name
        const regionName = libs.randomRegionName();

        const body = {
            dbAccess: {
                journal: [],
                region: [
                    {
                        id: 'recordSize',
                        value: 4082
                    },
                    {
                        id: 'keySize',
                        value: 567
                    },
                    {
                        id: 'lockCriticalSeparate',
                        value: 0
                    },
                    {
                        id: 'qbRundown',
                        value: 0
                    },
                    {
                        id: 'stats',
                        value: 0
                    },
                ]
            },
            journalEnabled: false,
            journalFilename: '/data/r1.35_x86_64/g/' + regionName + '.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: false
            },
            regionName: regionName,
            segmentData: [],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + '.dat',
            segmentTypeBg: false,
            templates: {
                updateTemplateDb: false,
                updateTemplateJournal: false
            }
        };

        // execute the call
        let res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the region exists
        res = await libs._REST('regions/' + regionName + '/');

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and have the correct properties
        let val = res.data.dbAccess.data[0].RECORD_SIZE === 4082;
        expect(val).to.be.true;

        val = res.data.dbAccess.data[1].KEY_SIZE === 567;
        expect(val).to.be.true;

        val = res.data.dbAccess.data[3].LOCK_CRIT_SEPARATE === false;
        expect(val).to.be.true;
    });

    it("Test # 1319: Create random region with all fields different and verify them all", async () => {
        // generate a random region name
        const regionName = libs.randomRegionName();

        const body = {
            dbAccess: {
                journal: [],
                region: []
            },
            journalEnabled: false,
            journalFilename: '/data/r1.35_x86_64/g/' + regionName + '.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: false
            },
            regionName: regionName,
            segmentData: [
                {
                    id: 'globalBufferCount',
                    value: 1001
                },
                {
                    id: 'lockSpace',
                    value: 113152
                },
                {
                    id: 'deferAllocate',
                    value: 0
                },
                {
                    id: 'extensionCount',
                    value: 100001
                },
                {
                    id: 'initialAllocation',
                    value: 4999
                },
                {
                    id: 'blockSize',
                    value: 4608
                },
                {
                    id: 'mutexSlots',
                    value: 1025
                },
                {
                    id: 'reservedBytes',
                    value: 1
                },

            ],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + '.dat',
            segmentTypeBg: true,
            templates: {
                updateTemplateDb: false,
                updateTemplateJournal: false
            }
        };

        // execute the call
        let res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the region exists
        res = await libs._REST('regions/' + regionName + '/');

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and have the correct properties
        let val = res.data.dbFile.data[3].GLOBAL_BUFFER_COUNT === 1001;
        expect(val).to.be.true;

        val = res.data.dbFile.data[4].LOCK_SPACE === 113152;
        expect(val).to.be.true;

        val = res.data.dbFile.data[6].DEFER_ALLOCATE === false;
        expect(val).to.be.true;

        val = res.data.dbFile.data[7].EXTENSION_COUNT === 100001;
        expect(val).to.be.true;

        val = res.data.dbFile.data[10].ALLOCATION === 4999;
        expect(val).to.be.true;

        val = res.data.dbFile.data[11].BLOCK_SIZE === 4608;
        expect(val).to.be.true;

        val = res.data.dbFile.data[13].MUTEX_SLOTS === 1025;
        expect(val).to.be.true;
    });

    it("Test # 1320: Create random region with asyncio =true and blocksize= 8192 and verify them all", async () => {
        // generate a random region name
        const regionName = libs.randomRegionName();

        const body = {
            dbAccess: {
                journal: [],
                region: [
                ]
            },
            journalEnabled: false,
            journalFilename: '/data/r1.35_x86_64/g/' + regionName + '.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: false
            },
            regionName: regionName,
            segmentData: [
                {
                    id: 'asyncIo',
                    value: 1
                },
                {
                    id: 'blockSize',
                    value: 8192
                },

            ],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + '.dat',
            segmentTypeBg: true,
            templates: {
                updateTemplateDb: false,
                updateTemplateJournal: false
            }
        };

        // execute the call
        let res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the region exists
        res = await libs._REST('regions/' + regionName + '/');

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and have the correct properties
        let val = res.data.dbFile.flags.fileExist;
        expect(val).to.be.true;
    });

    it("Test # 1321: Create random region with journal/ON and default fields", async () => {
        // generate a random region name
        const regionName = libs.randomRegionName();

        const body = {
            dbAccess: {
                journal: [
                    {
                        id: 'journalEnabled',
                        value: 1
                    },
                ],
                region: []
            },
            journalEnabled: true,
            journalFilename: '/data/r1.35_x86_64/g/' + regionName + '.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: true
            },
            regionName: regionName,
            segmentData: [],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + '.dat',
            segmentTypeBg: true,
            templates: {
                updateTemplateDb: false,
                updateTemplateJournal: false
            }
        };

        // execute the call
        let res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the region exists
        res = await libs._REST('regions/' + regionName + '/');

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and have the correct properties
        let val = res.data.journal.flags.state === 2;
        expect(val).to.be.true;
    });

    it("Test # 1322: Create random region with journal/OFF and default fields", async () => {
        // generate a random region name
        const regionName = libs.randomRegionName();

        const body = {
            dbAccess: {
                journal: [
                    {
                        id: 'journalEnabled',
                        value: 1
                    },
                ],
                region: []
            },
            journalEnabled: true,
            journalFilename: '/data/r1.35_x86_64/g/' + regionName + '.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: false
            },
            regionName: regionName,
            segmentData: [],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + '.dat',
            segmentTypeBg: true,
            templates: {
                updateTemplateDb: false,
                updateTemplateJournal: false
            }
        };

        // execute the call
        let res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the region exists
        res = await libs._REST('regions/' + regionName + '/');

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and have the correct properties
        let val = res.data.journal.flags.state === 1;
        expect(val).to.be.true;
    });

    it("Test # 1323: Create random region with all journal fields different and verify them all", async () => {
        // generate a random region name
        const regionName = libs.randomRegionName();

        const body = {
            dbAccess: {
                journal: [
                    {
                        id: 'journalEnabled',
                        value: 1
                    },
                    {
                        id: 'beforeImage',
                        value: 0
                    },
                    {
                        id: 'allocation',
                        value: 2049
                    },
                    {
                        id: 'autoSwitchLimit',
                        value: 8386561
                    },
                    {
                        id: 'bufferSize',
                        value: 2313
                    },
                    {
                        id: 'extension',
                        value: 2049
                    },
                    {
                        id: 'epochTaper',
                        value: 0
                    },
                ],
                region: []
            },
            journalEnabled: true,
            journalFilename: '/data/r1.35_x86_64/g/' + regionName + '.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: false
            },
            regionName: regionName,
            segmentData: [],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + '.dat',
            segmentTypeBg: true,
            templates: {
                updateTemplateDb: false,
                updateTemplateJournal: false
            }
        };

        // execute the call
        let res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the region exists
        res = await libs._REST('regions/' + regionName + '/');

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and have the correct properties
        let val = res.data.journal.flags.state === 1;
        expect(val).to.be.true;

        val = res.data.journal.data[1].BEFORE === false;
        expect(val).to.be.true;

        val = res.data.journal.data[3].EPOCH_TAPER === false;
        expect(val).to.be.true;

        val = res.data.journal.data[5].AUTO_SWITCH_LIMIT === 8386557;
        expect(val).to.be.true;

        val = res.data.journal.data[7].BUFFER_SIZE === 2320;
        expect(val).to.be.true;
    });

    it("Test # 1324: Create random region with all segment field different, store them on template, create a new region and verify", async () => {
        // generate a random region name
        let regionName = libs.randomRegionName();

        let body = {
            dbAccess: {
                journal: [],
                region: [
                    {
                        id: 'recordSize',
                        value: 4082
                    },
                    {
                        id: 'keySize',
                        value: 567
                    },
                    {
                        id: 'lockCriticalSeparate',
                        value: 0
                    },
                    {
                        id: 'qbRundown',
                        value: 0
                    },
                    {
                        id: 'stats',
                        value: 0
                    },
                ]
            },
            journalEnabled: false,
            journalFilename: '/data/r1.35_x86_64/g/' + regionName + '.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: false
            },
            regionName: regionName,
            segmentData: [
                {
                    id: 'globalBufferCount',
                    value: 1001
                },
                {
                    id: 'lockSpace',
                    value: 113152
                },
                {
                    id: 'deferAllocate',
                    value: 0
                },
                {
                    id: 'extensionCount',
                    value: 100001
                },
                {
                    id: 'initialAllocation',
                    value: 4999
                },
                {
                    id: 'blockSize',
                    value: 4608
                },
                {
                    id: 'mutexSlots',
                    value: 1025
                },
                {
                    id: 'reservedBytes',
                    value: 1
                },

            ],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + '.dat',
            segmentTypeBg: true,
            templates: {
                updateTemplateDb: true,
                updateTemplateJournal: false
            }
        };

        // execute the call
        let res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // recreate the region with no new params
        regionName = libs.randomRegionName();

        body = {
            dbAccess: {
                journal: [],
                region: []
            },
            journalEnabled: true,
            journalFilename: '/data/r1.35_x86_64/g/' + regionName + '.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: false
            },
            regionName: regionName,
            segmentData: [],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + '.dat',
            segmentTypeBg: true,
            templates: {
                updateTemplateDb: false,
                updateTemplateJournal: false
            }
        };

        // execute the call
        res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the region exists
        res = await libs._REST('regions/' + regionName + '/');

        // and have the correct properties
        val = res.data.journal.flags.state === 1;


        // and verify that the region exists
        res = await libs._REST('regions/' + regionName + '/');

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and have the correct properties
        val = res.data.dbFile.data[3].GLOBAL_BUFFER_COUNT === 1001;
        expect(val).to.be.true;

        val = res.data.dbFile.data[4].LOCK_SPACE === 113152;
        expect(val).to.be.true;

        val = res.data.dbFile.data[6].DEFER_ALLOCATE === false;
        expect(val).to.be.true;

        val = res.data.dbFile.data[7].EXTENSION_COUNT === 100001;
        expect(val).to.be.true;

        val = res.data.dbFile.data[10].ALLOCATION === 4999;
        expect(val).to.be.true;

        val = res.data.dbFile.data[11].BLOCK_SIZE === 4608;
        expect(val).to.be.true;

        val = res.data.dbFile.data[13].MUTEX_SLOTS === 1025;
        expect(val).to.be.true;
    });

    it("Test # 1325: Create random region with all journal field different, store them on template, create a new region and verify\n", async () => {
        // generate a random region name
        let regionName = libs.randomRegionName();

        let body = {
            dbAccess: {
                journal: [
                    {
                        id: 'journalEnabled',
                        value: 1
                    },
                    {
                        id: 'beforeImage',
                        value: 0
                    },
                    {
                        id: 'allocation',
                        value: 2049
                    },
                    {
                        id: 'autoSwitchLimit',
                        value: 8386561
                    },
                    {
                        id: 'bufferSize',
                        value: 2313
                    },
                    {
                        id: 'extension',
                        value: 2049
                    },
                    {
                        id: 'epochTaper',
                        value: 0
                    },
                ],
                region: []
            },
            journalEnabled: true,
            journalFilename: '/data/r1.35_x86_64/g/' + regionName + '.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: false
            },
            regionName: regionName,
            segmentData: [],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + '.dat',
            segmentTypeBg: true,
            templates: {
                updateTemplateDb: false,
                updateTemplateJournal: true
            }
        };

        // execute the call
        let res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // recreate the region with no new params
        regionName = libs.randomRegionName();

        body = {
            dbAccess: {
                journal: [
                    {
                        id: 'journalEnabled',
                        value: 1
                    },
                ],
                region: []
            },
            journalEnabled: true,
            journalFilename: '/data/r1.35_x86_64/g/' + regionName + '.mjl',
            names: [
                {value: regionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: false
            },
            regionName: regionName,
            segmentData: [],
            segmentFilename: '/data/r1.35_x86_64/g/' + regionName + '.dat',
            segmentTypeBg: true,
            templates: {
                updateTemplateDb: false,
                updateTemplateJournal: true
            }
        };

        // execute the call
        res = await libs._RESTpost('regions/add', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the region exists
        res = await libs._REST('regions/' + regionName + '/');

        // and have the correct properties
        let val = res.data.journal.flags.state === 1;
        expect(val).to.be.true;

        val = res.data.journal.data[1].BEFORE === false;
        expect(val).to.be.true;

        val = res.data.journal.data[3].EPOCH_TAPER === false;
        expect(val).to.be.true;

        val = res.data.journal.data[5].AUTO_SWITCH_LIMIT === 8386557;
        expect(val).to.be.true;

        val = res.data.journal.data[7].BUFFER_SIZE === 2313;
        expect(val).to.be.true;
    });
});
