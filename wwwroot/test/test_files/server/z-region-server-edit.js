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

// generate a random region name
let newRegionName = libs.randomRegionName();

describe("SERVER: Edit Region", async () => {
    it("Test # 1340: Edit YDBOCTO, add one name and delete another, submit and verify", async () => {
        await libs.delay(5000)
    const regionName = 'YDBOCTO';
        const body = {
            changeAccessMethod: false,
            changeJournal: false,
            journalFilename: '', //'/data/r1.35_x86_64/g/' + regionName + '.mjl',
            newJournalEnabled: false,
            newAccessMethod: '',
            regionName: regionName,
            segmentFilename: '', //'/data/r1.35_x86_64/g/' + regionName + '.dat',
            updateGde: false,
            dbAccess: {
                journal: [],
                region: []
            },
            segmentData: [],
            names: [
                {
                    value: 'newName',
                    new: true
                },
                {
                    value: '%ydbOcto*',
                    existing: true,
                    deleted: true
                }
            ],
        };

        // execute the call
        let res = await libs._RESTpost('regions/' + regionName + '/edit', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/YDBOCTO').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // now check the names
        let newFound = false;
        let deletedFound = false;
        res.data.names.forEach(name => {
            if (name.name === 'newName') newFound = true;
            if (name.name === '%ydbOcto*') deletedFound = true
        });

        expect(newFound).to.be.true;
        expect(deletedFound).to.be.false;
    });

    it("Test # 1341: Edit RANDOM, change BG to MM, submit and verify", async () => {

        let body = {
            dbAccess: {
                journal: [],
                region: []
            },
            journalEnabled: false,
            journalFilename: '/data/r1.35_x86_64/g/' + newRegionName + '.mjl',
            names: [
                {value: newRegionName}
            ],
            postProcessing: {
                createDbFile: true,
                switchJournalOn: false
            },
            regionName: newRegionName,
            segmentData: [],
            segmentFilename: '/data/r1.35_x86_64/g/' + newRegionName + '.dat',
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

        body = {
            changeAccessMethod: true,
            changeJournal: true,
            journalFilename: '', //'/data/r1.35_x86_64/g/' + regionName + '.mjl',
            newJournalEnabled: false,
            newAccessMethod: 'MM',
            regionName: newRegionName,
            segmentFilename: '', //'/data/r1.35_x86_64/g/' + regionName + '.dat',
            updateGde: false,
            dbAccess: {
                journal: [
                    {
                        id: 'beforeImage',
                        value: true
                    }
                ],
                region: []
            },
            segmentData: [],
            names: [],
        };

        // execute the call
        res = await libs._RESTpost('regions/' + newRegionName + '/edit', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/' + newRegionName).catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify that is MM and before Image journaling
        const accessType = res.data.dbFile.data[2].ACCESS_METHOD;
        expect(accessType === 'MM').to.be.true;
        const image = res.data.journal.data[1].BEFORE;
        expect(image === false).to.be.true;
    });

    it("Test # 1342: Edit RANDOM, change MM back to BG, submit and verify", async () => {
        const body = {
            changeAccessMethod: true,
            changeJournal: false,
            journalFilename: '', //'/data/r1.35_x86_64/g/' + regionName + '.mjl',
            newJournalEnabled: false,
            newAccessMethod: 'BG',
            regionName: newRegionName,
            segmentFilename: '', //'/data/r1.35_x86_64/g/' + regionName + '.dat',
            updateGde: true,
            dbAccess: {
                journal: [
                    {
                        id: 'beforeImage',
                        value: true
                    }
                ],
                region: []
            },
            segmentData: [],
            names: [],
        };

        // execute the call
        let res = await libs._RESTpost('regions/' + newRegionName + '/edit', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/' + newRegionName).catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify that is BG
        const accessType = res.data.dbFile.data[2].ACCESS_METHOD;
        expect(accessType === 'BG').to.be.true;
    });

    it("Test # 1343: Edit DEFAULT, switch journal OFF, submit and verify", async () => {
        const regionName = 'DEFAULT';
        const body = {
            changeAccessMethod: false,
            changeJournal: true,
            journalFilename: '', //'/data/r1.35_x86_64/g/default.mjl',
            newJournalEnabled: true,
            newAccessMethod: '',
            regionName: regionName,
            segmentFilename: '', //'/data/r1.35_x86_64/g/' + regionName + '.dat',
            updateGde: false,
            dbAccess: {
                journal: [
                    {
                        id: 'journalEnabled',
                        value: 0
                    }
                ],
                region: []
            },
            segmentData: [],
            names: [],
        };

        // execute the call
        let res = await libs._RESTpost('regions/' + regionName + '/edit', body).catch(() => {});
        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/DEFAULT').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify that journal is off
        const journal = res.data.journal.flags.state === 0;
        expect(journal).to.be.true;
    });

    it("Test # 1344: Edit DEFAULT, switch journal back ON, submit and verify", async () => {
        const regionName = 'DEFAULT';
        const body = {
            changeAccessMethod: false,
            changeJournal: true,
            journalFilename: '/data/r1.35_x86_64/g/defaulttest.mjl',
            newJournalEnabled: true,
            newAccessMethod: '',
            regionName: regionName,
            segmentFilename: '', //'/data/r1.35_x86_64/g/' + regionName + '.dat',
            updateGde: false,
            dbAccess: {
                journal: [
                    {
                        id: 'journalEnabled',
                        value: 1
                    }
                ],
                region: []
            },
            segmentData: [],
            names: [],
        };

        // execute the call
        let res = await libs._RESTpost('regions/' + regionName + '/edit', body).catch(() => {});

        libs.delay(200)
        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/DEFAULT').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify that journal is on
        const journal = res.data.journal.flags.state > 0;
        expect(journal).to.be.true;
    });

    it("Test # 1345: Edit DEFAULT, change AutoDB to true and verify", async () => {
        const regionName = 'DEFAULT';
        const body = {
            changeAccessMethod: false,
            changeJournal: false,
            journalFilename: '', //'/data/r1.35_x86_64/g/default.mjl',
            newJournalEnabled: false,
            newAccessMethod: '',
            regionName: regionName,
            segmentFilename: '', //'/data/r1.35_x86_64/g/' + regionName + '.dat',
            updateGde: true,
            dbAccess: {
                journal: [
                ],
                region: [
                    {
                        id: 'autoDb',
                        value: 1
                    }
                ]
            },
            segmentData: [],
            names: [],
        };

        // execute the call
        let res = await libs._RESTpost('regions/' + regionName + '/edit', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/DEFAULT').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify that autodb is false
        const autoDb = res.data.dbFile.data[1].AUTO_DB;
        expect(autoDb).to.be.true;
    });

    it("Test # 1346: Edit YDBAIM, change AutoDB to false and verify", async () => {
        const regionName = 'YDBAIM';
        const body = {
            changeAccessMethod: false,
            changeJournal: false,
            journalFilename: '', //'/data/r1.35_x86_64/g/default.mjl',
            newJournalEnabled: false,
            newAccessMethod: '',
            regionName: regionName,
            segmentFilename: '', //'/data/r1.35_x86_64/g/' + regionName + '.dat',
            updateGde: false,
            dbAccess: {
                journal: [
                ],
                region: [
                    {
                        id: 'autoDb',
                        value: 0
                    }
                ]
            },
            segmentData: [],
            names: [],
        };

        // execute the call
        let res = await libs._RESTpost('regions/' + regionName + '/edit', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/YDBAIM').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify that autodb is false
        const autoDb = res.data.dbFile.data[1].AUTO_DB;
        expect(autoDb).to.be.false;
    });

    it("Test # 1347: Edit YDBAIM, change AutoDB back to true, change filename, submit and verify", async () => {
        const regionName = 'YDBAIM';
        const body = {
            changeAccessMethod: false,
            changeJournal: false,
            journalFilename: '', //'/data/r1.35_x86_64/g/default.mjl',
            newJournalEnabled: false,
            newAccessMethod: '',
            regionName: regionName,
            segmentFilename: '/data/r1.35_x86_64/g/test.dat',
            updateGde: false,
            dbAccess: {
                journal: [],
                region: [
                    {
                        id: 'autoDb',
                        value: 1
                    }
                ]
            },
            segmentData: [],
            names: [],
        };

        // execute the call
        let res = await libs._RESTpost('regions/' + regionName + '/edit', body).catch(() => {});


        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/YDBAIM').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify that autodb is false
        const autoDb = res.data.dbFile.data[1].AUTO_DB;
        expect(autoDb).to.be.true;

        expect(res.data.dbFile.data[0].FILE_NAME).to.have.string('test.dat')
    });

    it("Test # 1347: Edit YDBAIM, change AutoDB back to true, change filename, submit and verify", async () => {
        const regionName = 'YDBAIM';
        const body = {
            changeAccessMethod: false,
            changeJournal: false,
            journalFilename: '', //'/data/r1.35_x86_64/g/default.mjl',
            newJournalEnabled: false,
            newAccessMethod: '',
            regionName: regionName,
            segmentFilename: '/data/r1.35_x86_64/g/test.dat',
            updateGde: false,
            dbAccess: {
                journal: [],
                region: [
                    {
                        id: 'autoDb',
                        value: 1
                    }
                ]
            },
            segmentData: [],
            names: [],
        };

        // execute the call
        let res = await libs._RESTpost('regions/' + regionName + '/edit', body).catch(() => {});


        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/YDBAIM').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify that autodb is false
        const autoDb = res.data.dbFile.data[1].AUTO_DB;
        expect(autoDb).to.be.true;

        expect(res.data.dbFile.data[0].FILE_NAME).to.have.string('test.dat')
    });

    it("Test # 1348: Edit DEFAULT, change all Segment related fields, submit and verify", async () => {
        const regionName = 'DEFAULT';
        const body = {
            changeAccessMethod: false,
            changeJournal: false,
            journalFilename: '', //'/data/r1.35_x86_64/g/default.mjl',
            newJournalEnabled: false,
            newAccessMethod: '',
            regionName: regionName,
            segmentFilename: '', //'/data/r1.35_x86_64/g/test.dat',
            updateGde: false,
            dbAccess: {
                journal: [],
                region: []
            },
            segmentData: [
                {
                    id: 'lockSpace',
                    value: 123
                },
                {
                    id: 'deferAllocate',
                    value: 0
                },
                {
                    id: 'extensionCount',
                    value: 0
                },
                {
                    id: 'initialAllocation',
                    value: 2500
                },
            ],
            names: [],
        };

        // execute the call
        let res = await libs._RESTpost('regions/' + regionName + '/edit', body).catch(() => {});


        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/DEFAULT').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify the new values
        let valCheck = res.data.dbFile.data[4].LOCK_SPACE === 123;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbFile.data[6].DEFER_ALLOCATE === false;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbFile.data[7].EXTENSION_COUNT === 0;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbFile.data[10].ALLOCATION === 2500;
        expect(valCheck).to.be.true;
    });

    it("Test # 1349: Edit DEFAULT, change all Segment and Region related fields, submit and verify", async () => {
        const regionName = 'DEFAULT';
        const body = {
            changeAccessMethod: false,
            changeJournal: false,
            journalFilename: '', //'/data/r1.35_x86_64/g/default.mjl',
            newJournalEnabled: false,
            newAccessMethod: '',
            regionName: regionName,
            segmentFilename: '', //'/data/r1.35_x86_64/g/test.dat',
            updateGde: false,
            dbAccess: {
                journal: [],
                region: [
                    {
                        id: 'recordSize',
                        value: 5000
                    },
                    {
                        id: 'keySize',
                        value: 300
                    },
                    {
                        id: 'lockCriticalSeparate',
                        value: 1
                    },
                    {
                        id: 'qbRundown',
                        value: 1
                    },
                    {
                        id: 'stats',
                        value: 0
                    },
                ]
            },
            segmentData: [
                {
                    id: 'lockSpace',
                    value: 123
                },
                {
                    id: 'deferAllocate',
                    value: 0
                },
                {
                    id: 'extensionCount',
                    value: 0
                },
                {
                    id: 'initialAllocation',
                    value: 2500
                },
            ],
            names: [],
        };

        // execute the call
        let res = await libs._RESTpost('regions/' + regionName + '/edit', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/DEFAULT').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify the new values
        let valCheck = res.data.dbFile.data[4].LOCK_SPACE === 123;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbFile.data[6].DEFER_ALLOCATE === false;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbFile.data[7].EXTENSION_COUNT === 0;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbFile.data[10].ALLOCATION === 2500;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbAccess.data[0].RECORD_SIZE === 5000;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbAccess.data[1].KEY_SIZE === 300;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbAccess.data[4].LOCK_CRIT_SEPARATE === true;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbAccess.data[6].QDBRUNDOWN === true;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbAccess.data[7].STATS === false;
        expect(valCheck).to.be.true;
    });

    it("Test # 1350: Edit DEFAULT, change all Journaling and Region related fields, submit and verify", async () => {
        await libs.delay(2000)
        const regionName = 'DEFAULT';
        const body = {
            changeAccessMethod: false,
            changeJournal: false,
            journalFilename: '', //'/data/r1.35_x86_64/g/default.mjl',
            newJournalEnabled: false,
            newAccessMethod: '',
            regionName: regionName,
            segmentFilename: '', //'/data/r1.35_x86_64/g/test.dat',
            updateGde: false,
            dbAccess: {
                journal: [
                    {
                        id: 'beforeImage',
                        value: 0
                    },
                    {
                        id: 'autoSwitchLimit',
                        value: 100000
                    },
                    {
                        id: 'bufferSize',
                        value: 3500
                    },
                    {
                        id: 'epochTaper',
                        value: 0
                    },
                    {
                        id: 'epochInterval',
                        value: 60
                    },

                ],
                region: [
                    {
                        id: 'recordSize',
                        value: 6000
                    },
                    {
                        id: 'keySize',
                        value: 350
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
                        value: 1
                    },
                ]
            },
            segmentData: [],
            names: [],
        };

        // execute the call
        let res = await libs._RESTpost('regions/' + regionName + '/edit', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK' || res.result === 'WARNING').to.be.true;

        // read the region back
        res = await libs._REST('regions/DEFAULT').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify the new values
        valCheck = res.data.dbAccess.data[0].RECORD_SIZE === 6000;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbAccess.data[1].KEY_SIZE === 350;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbAccess.data[4].LOCK_CRIT_SEPARATE === false;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbAccess.data[6].QDBRUNDOWN === false;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbAccess.data[7].STATS === true;
        expect(valCheck).to.be.true;

        valCheck = res.data.journal.data[1].BEFORE === false;
        expect(valCheck).to.be.true;

        valCheck = res.data.journal.data[5].AUTO_SWITCH_LIMIT === 98304;
        expect(valCheck).to.be.true;

        valCheck = res.data.journal.data[7].BUFFER_SIZE === 3504;
        expect(valCheck).to.be.true;

        valCheck = res.data.journal.data[3].EPOCH_TAPER === false;
        expect(valCheck).to.be.true;

        valCheck = res.data.journal.data[2].EPOCH_INTERVAL === 60;
        expect(valCheck).to.be.true;
    });

    it("Test # 1351: Edit DEFAULT, change all Journaling, Region and Segment related fields, submit and verify", async () => {
        const regionName = 'DEFAULT';
        const body = {
            changeAccessMethod: false,
            changeJournal: false,
            journalFilename: '', //'/data/r1.35_x86_64/g/default.mjl',
            newJournalEnabled: false,
            newAccessMethod: '',
            regionName: regionName,
            segmentFilename: '', //'/data/r1.35_x86_64/g/test.dat',
            updateGde: false,
            dbAccess: {
                journal: [
                    {
                        id: 'beforeImage',
                        value: 1
                    },
                    {
                        id: 'autoSwitchLimit',
                        value: 130000
                    },
                    {
                        id: 'bufferSize',
                        value: 4500
                    },
                    {
                        id: 'epochTaper',
                        value: 1
                    },
                    {
                        id: 'epochInterval',
                        value: 10
                    },

                ],
                region: [
                    {
                        id: 'recordSize',
                        value: 7000
                    },
                    {
                        id: 'keySize',
                        value: 370
                    },
                    {
                        id: 'lockCriticalSeparate',
                        value: 1
                    },
                    {
                        id: 'qbRundown',
                        value: 1
                    },
                    {
                        id: 'stats',
                        value: 0
                    },
                ]
            },
            segmentData: [
                {
                    id: 'lockSpace',
                    value: 321
                },
                {
                    id: 'deferAllocate',
                    value: 1
                },
                {
                    id: 'extensionCount',
                    value: 1000
                },
                {
                    id: 'initialAllocation',
                    value: 4500
                },
            ],
            names: [],
        };

        // execute the call
        let res = await libs._RESTpost('regions/' + regionName + '/edit', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/DEFAULT').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify the new values
        let valCheck = res.data.dbAccess.data[0].RECORD_SIZE === 7000;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbAccess.data[1].KEY_SIZE === 370;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbAccess.data[4].LOCK_CRIT_SEPARATE === true;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbAccess.data[6].QDBRUNDOWN === true;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbAccess.data[7].STATS === false;
        expect(valCheck).to.be.true;

        valCheck = res.data.journal.data[1].BEFORE === true;
        expect(valCheck).to.be.true;

        valCheck = res.data.journal.data[5].AUTO_SWITCH_LIMIT === 129024;
        expect(valCheck).to.be.true;

        valCheck = res.data.journal.data[7].BUFFER_SIZE === 4504;
        expect(valCheck).to.be.true;

        valCheck = res.data.journal.data[3].EPOCH_TAPER === true;
        expect(valCheck).to.be.true;

        valCheck = res.data.journal.data[2].EPOCH_INTERVAL === 10;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbFile.data[4].LOCK_SPACE === 321;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbFile.data[6].DEFER_ALLOCATE === true;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbFile.data[7].EXTENSION_COUNT === 1000;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbFile.data[10].ALLOCATION === 4500;
        expect(valCheck).to.be.true;
    });

    it("Test # 1352: Edit YDBOCTO, add one name and delete another, change region and journaling and verify", async () => {
        const body = {
            changeAccessMethod: false,
            changeJournal: false,
            journalFilename: '', //'/data/r1.35_x86_64/g/' + regionName + '.mjl',
            newJournalEnabled: false,
            newAccessMethod: '',
            regionName: 'YDBOCTO',
            segmentFilename: '', //'/data/r1.35_x86_64/g/' + regionName + '.dat',
            updateGde: false,
            dbAccess: {
                journal: [
                    {
                        id: 'beforeImage',
                        value: 0
                    },
                    {
                        id: 'autoSwitchLimit',
                        value: 130000
                    },
                ],
                region: [
                    {
                        id: 'lockCriticalSeparate',
                        value: 1
                    },
                    {
                        id: 'qbRundown',
                        value: 1
                    },
                ]
            },
            segmentData: [],
            names: [
                {
                    value: 'newName2',
                    new: true
                },
                {
                    value: '%ydbOcTO*',
                    existing: true,
                    deleted: true
                }
            ],
        };

        // execute the call
        let res = await libs._RESTpost('regions/YDBOCTO/edit', body).catch(() => {});
        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/YDBOCTO').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify that is BG
        let valCheck = res.data.dbAccess.data[4].LOCK_CRIT_SEPARATE === true;
        expect(valCheck).to.be.true;

        valCheck = res.data.dbAccess.data[6].QDBRUNDOWN === true;
        expect(valCheck).to.be.true;

        valCheck = res.data.journal.data[1].BEFORE === false;
        expect(valCheck).to.be.true;

        valCheck = res.data.journal.data[5].AUTO_SWITCH_LIMIT === 129024;
        expect(valCheck).to.be.true;

        // now check the names
        let deletedFound = false;
        let newFound = false;
        res.data.names.forEach(name => {
            if (name.name === '%ydbOcTO*') deletedFound = true;
            if (name.name === 'newName2') newFound = true;
        });

        expect(deletedFound).to.be.false;
        expect(newFound).to.be.true;
    });

    it("Test # 1353: Edit YDBAIM, add one name and delete another, switch journaling on and verify", async () => {
        const body = {
            changeAccessMethod: false,
            changeJournal: true,
            journalFilename: '/data/r1.35_x86_64/g/YDBAIM.mjl',
            newJournalEnabled: true,
            newAccessMethod: 'MM',
            regionName: 'YDBAIM',
            segmentFilename: '', //'/data/r1.35_x86_64/g/' + regionName + '.dat',
            updateGde: false,
            dbAccess: {
                journal: [
                    {
                        id: 'journalEnabled',
                        value: 1
                    }
                ],
                region: []
            },
            segmentData: [],
            names: [
                {
                    value: 'newName3',
                    new: true
                },
                {
                    value: '%ydbAim*',
                    existing: true,
                    deleted: true
                }
            ],
        };

        // execute the call
        let res = await libs._RESTpost('regions/YDBAIM/edit', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/YDBAIM').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify that journal is on
        const journal = res.data.journal.flags.state > 0;
        expect(journal).to.be.true;

        // now check the names
        let deletedFound = false;
        let newFound = false;
        res.data.names.forEach(name => {
            if (name.name === '%ydbAim*') deletedFound = true;
            if (name.name === 'newName3') newFound = true;
        });

        expect(deletedFound).to.be.false;
        expect(newFound).to.be.true;
    });

    it("Test # 1354: Edit YDBAIM, add one name and delete another, switch journaling off and verify", async () => {
        const body = {
            changeAccessMethod: false,
            changeJournal: true,
            journalFilename: '', //'/data/r1.35_x86_64/g/default.mjl',
            newJournalEnabled: false,
            newAccessMethod: '',
            regionName: 'YDBAIM',
            segmentFilename: '', //'/data/r1.35_x86_64/g/' + regionName + '.dat',
            updateGde: false,
            dbAccess: {
                journal: [
                    {
                        id: 'journalEnabled',
                        value: 0
                    }
                ],
                region: []
            },
            segmentData: [],
            names: [
                {
                    value: 'newName4',
                    new: true
                },
                {
                    value: '%ydbaiM*',
                    existing: true,
                    deleted: true
                }
            ],
        };

        // execute the call
        let res = await libs._RESTpost('regions/YDBAIM/edit', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/YDBAIM').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify that journal is off
        const journal = res.data.journal.flags.state === 0;
        expect(journal).to.be.true;

        // now check the names
        let deletedFound = false;
        let newFound = false;
        res.data.names.forEach(name => {
            if (name.name === '%ydbaiM*') deletedFound = true;
            if (name.name === 'newName4') newFound = true;
        });

        expect(deletedFound).to.be.false;
        expect(newFound).to.be.true;
    });

    it("Test # 1355: Edit DEFAULT, change the journal filename on MUPIP, update and verify", async () => {
        const body = {
            changeAccessMethod: false,
            changeJournal: false,
            journalFilename: '/tmp/default.mjl',
            newJournalEnabled: true,
            newAccessMethod: '',
            regionName: 'DEFAULT',
            segmentFilename: '', //'/data/r1.35_x86_64/g/' + regionName + '.dat',
            journalUpdateMupip: true,
            journalUpdateGde: false,
            updateGde: false,
            dbAccess: {
                journal: [],
                region: []
            },
            segmentData: [],
            names: [],
        };

        // execute the call
        let res = await libs._RESTpost('regions/DEFAULT/edit', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/DEFAULT').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify that filename has changed
        let journal = res.data.journal.flags.file === '/tmp/default.mjl';
        expect(journal).to.be.true;

        // but not in the GDE
        journal = res.data.journal.flags.gdeFilename !== '/tmp/default.mjl';
        expect(journal).to.be.true;
    });

    it("Test # 1356: Edit DEFAULT, change the journal filename on GDE, update and verify\n", async () => {
        const body = {
            changeAccessMethod: false,
            changeJournal: false,
            journalFilename: '/default.mjl',
            newJournalEnabled: true,
            newAccessMethod: '',
            regionName: 'DEFAULT',
            segmentFilename: '', //'/data/r1.35_x86_64/g/' + regionName + '.dat',
            journalUpdateMupip: false,
            journalUpdateGde: true,
            updateGde: false,
            dbAccess: {
                journal: [],
                region: []
            },
            segmentData: [],
            names: [],
        };

        // execute the call
        let res = await libs._RESTpost('regions/DEFAULT/edit', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/DEFAULT').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify that filename has NOT changed in the MUPIP
        let journal = res.data.journal.flags.file !== '/default.mjl';
        expect(journal).to.be.true;

        // but it has in the GDE
        journal = res.data.journal.flags.gdeFilename === '/default.mjl';
        expect(journal).to.be.true;
    });

    it("Test # 1357: Edit DEFAULT, change the journal filename on GDE, update and verify\n", async () => {
        const body = {
            changeAccessMethod: false,
            changeJournal: false,
            journalFilename: '/tmp/default2.mjl',
            newJournalEnabled: true,
            newAccessMethod: '',
            regionName: 'DEFAULT',
            segmentFilename: '', //'/data/r1.35_x86_64/g/' + regionName + '.dat',
            journalUpdateMupip: true,
            journalUpdateGde: true,
            updateGde: false,
            dbAccess: {
                journal: [],
                region: []
            },
            segmentData: [],
            names: [],
        };

        // execute the call
        let res = await libs._RESTpost('regions/DEFAULT/edit', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // read the region back
        res = await libs._REST('regions/DEFAULT').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // and verify that filename has changed
        let journal = res.data.journal.flags.file === '/tmp/default2.mjl';
        expect(journal).to.be.true;

        // but not in the GDE
        journal = res.data.journal.flags.gdeFilename === '/tmp/default2.mjl';
        expect(journal).to.be.true;
    });
});
