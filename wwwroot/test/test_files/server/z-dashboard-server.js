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

describe("SERVER: Endpoints verification", async () => {
    it("Test # 1000: dashboard/getAll", async () => {
        // execute the call
        const res = await libs._REST('dashboard/getAll').catch(() => {});

        // Check if it is an object
        const isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // Check the result
        let isNode = res.result !== undefined;
        expect(isNode).to.be.true;

        expect(res.result).to.have.string('OK');

        // Check the data node
        isNode = res.data !== undefined;
        expect(isNode).to.be.true;

        // Check the devices node
        isNode = res.data.devices !== undefined;
        expect(isNode).to.be.true;

        let isArray = Array.isArray(res.data.devices);
        expect(isArray).to.be.true;

        expect(res.data.devices.length > 0).to.be.true;

        isNode = res.data.devices[0].freeBlocks !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.devices[0].mountPoint !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.devices[0].percentUsed !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.devices[0].totalBlocks !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.devices[0].type !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.devices[0].usedBlocks !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.devices[0].usedBy !== undefined;
        expect(isNode).to.be.true;

        isArray = Array.isArray(res.data.devices[0].usedBy);
        expect(isArray).to.be.true;

        expect(res.data.devices[0].usedBy.length > 0).to.be.true;

        isNode = res.data.devices[0].usedBy[0].file !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.devices[0].usedBy[0].region !== undefined;
        expect(isNode).to.be.true;

        // Check the gld node
        isNode = res.data.gld !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.gld.exist !== undefined;
        expect(isNode).to.be.true;

        // Check the ydb version
        isNode = res.data.ydb_version !== undefined;
        expect(isNode).to.be.true;

        // Check the systemInfo
        isNode = res.data.systemInfo !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.systemInfo.chset !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.systemInfo.gld !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.systemInfo.zroutines !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.systemInfo.envVars !== undefined;
        expect(isNode).to.be.true;

        isArray = Array.isArray(res.data.systemInfo.envVars);
        expect(isArray).to.be.true;

        expect(res.data.systemInfo.envVars.length > 0).to.be.true;

        // Regions
        isNode = res.data.regions !== undefined;
        expect(isNode).to.be.true;

        // DEFAULT
        isNode = res.data.regions.DEFAULT !== undefined;
        expect(isNode).to.be.true;

        // DB ACCESS
        isNode = res.data.regions.DEFAULT.dbAccess !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.dbAccess.data !== undefined;
        expect(isNode).to.be.true;

        isArray = Array.isArray(res.data.regions.DEFAULT.dbAccess.data);
        expect(isArray).to.be.true;

        expect(res.data.regions.DEFAULT.dbAccess.data.length > 0).to.be.true;

        // DB FILE
        isNode = res.data.regions.DEFAULT.dbFile !== undefined;
        expect(isNode).to.be.true;

        // DB FILE: data
        isNode = res.data.regions.DEFAULT.dbFile.data !== undefined;
        expect(isNode).to.be.true;

        isArray = Array.isArray(res.data.regions.DEFAULT.dbFile.data);
        expect(isArray).to.be.true;

        expect(res.data.regions.DEFAULT.dbFile.data.length > 0).to.be.true;

        // DB FILE: flags
        isNode = res.data.regions.DEFAULT.dbFile.flags !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.dbFile.flags.device !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.dbFile.flags.file !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.dbFile.flags.fileBad !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.dbFile.flags.fileExist !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.dbFile.flags.mountpoint !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.dbFile.flags.sessions !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.dbFile.flags.shmenHealthy !== undefined;
        expect(isNode).to.be.true;

        // DB FILE: usage
        isNode = res.data.regions.DEFAULT.dbFile.usage !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.dbFile.usage.freeBlocks !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.dbFile.usage.totalBlocks !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.dbFile.usage.usedBlocks !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.dbFile.usage.usedPercent !== undefined;
        expect(isNode).to.be.true;

        // JOURNAL
        isNode = res.data.regions.DEFAULT.journal !== undefined;
        expect(isNode).to.be.true;

        // JOURNAL: data
        isNode = res.data.regions.DEFAULT.journal.data !== undefined;
        expect(isNode).to.be.true;

        isArray = Array.isArray(res.data.regions.DEFAULT.journal.data);
        expect(isArray).to.be.true;

        expect(res.data.regions.DEFAULT.journal.data.length > 0).to.be.true;

        // JOURNAL: flags
        isNode = res.data.regions.DEFAULT.journal.flags !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.journal.flags.device !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.journal.flags.file !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.journal.flags.inode !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.journal.flags.mountpoint !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.journal.flags.state !== undefined;
        expect(isNode).to.be.true;

        // LOCKS
        isNode = res.data.regions.DEFAULT.locks !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.locks.estimatedFreeLockSpace !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.locks.processesOnQueue !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.locks.slotsBytesInUse !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.locks.slotsInUse !== undefined;
        expect(isNode).to.be.true;

        // names
        isNode = res.data.regions.DEFAULT.names[0].name === '*';
        expect(isNode).to.be.true;

        // replication
        isNode = res.data.regions.DEFAULT.replication !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.replication.flags !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.replication.flags.status !== undefined;
        expect(isNode).to.be.true;
    });

    it("Test # 1001: dashboard/regions/DEFAULT", async () => {

        // execute the call
        const res = await libs._REST('regions/DEFAULT').catch(() => {});

        // Check if it is an object
        const isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // Check the result
        let isNode = res.result !== undefined;
        expect(isNode).to.be.true;

        expect(res.result).to.have.string('OK');

        // Check the data node
        isNode = res.data !== undefined;
        expect(isNode).to.be.true;

        // DB FILE
        isNode = res.data.dbFile !== undefined;
        expect(isNode).to.be.true;
    });


    it("Test # 1002: Ensure the extra device information is returned", async () => {
        // execute the call
        const res = await libs._REST('dashboard/getAll').catch(() => {});

        // Check if it is an object
        const isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // Check the result
        let isNode = res.result !== undefined;
        expect(isNode).to.be.true;

        expect(res.result).to.have.string('OK');

        const flags = res.data.regions['DEFAULT'].dbFile.flags;

        const freeze = flags.freeze;
        expect(freeze === 0).to.be.true;

        const fsBlockSize = flags.fsBlockSize;
        expect(fsBlockSize !== 0).to.be.true;

        const iNodesFree = flags.iNodesFree;
        expect(iNodesFree !== 0).to.be.true;

        const iNodesTotal = flags.iNodesTotal;
        expect(iNodesTotal !== 0).to.be.true;

        const deviceId = flags.deviceId;
        expect(deviceId !== '').to.be.true;
    });

    it("Test # 1020: Use a wrong REST path and ensure that a 404 is returned", async () => {
        // execute the call
        const res = await libs._REST('dashboard/notacall').catch(() => {});

        expect(res.error.code === 404).to.be.true;
    });

    it("Test # 1021: Trigger an error in the server on GET and verify that an error is returned", async () => {
        // execute the call
        const res = await libs._REST('test/error').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;
        expect(res.error.errors[0].mcode === ' s a=1/0').to.be.true;
    });

    it("Test # 1022: Trigger an error in the server on POST and verify that an error is returned", async () => {
        // execute the call
        const res = await libs._RESTpost('test/error').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;
        expect(res.error.errors[0].mcode === ' s a=1/0').to.be.true;
    });

    it("Test # 1023: Trigger an error in the server on DELETE and verify that an error is returned", async () => {
        // execute the call
        const res = await libs._RESTdelete('test/error').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;
        expect(res.error.errors[0].mcode === ' s a=1/0').to.be.true;
    });

    it("Test # 1024: Rename a db file and verify that segment fields get populated anyway (with GDE data)", async () => {

        // move the db file
        execSync('mv  /data/r1.35_x86_64/g/yottadb.dat /data/r1.35_x86_64/g/yottadb.old').toString();

        // execute the call
        const res = await libs._REST('regions/DEFAULT').catch(() => {});

        // Check if it is an object
        const isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // Check the result
        let isNode = res.result !== undefined;
        expect(isNode).to.be.true;
        expect(res.result).to.have.string('OK');

        // Check the data node
        isNode = res.data !== undefined;
        expect(isNode).to.be.true;

        // DB FILE: data
        isNode = res.data.dbFile.data !== undefined;
        expect(isNode).to.be.true;

        isArray = Array.isArray(res.data.dbFile.data);
        expect(isArray).to.be.true;

        length = res.data.dbFile.data.length === 13;
        expect(length).to.be.true;

        // restore the db file
        execSync('mv  /data/r1.35_x86_64/g/yottadb.old /data/r1.35_x86_64/g/yottadb.dat').toString();
    });

    it("Test # 1025: Rename a db file and verify that region fields get populated anyway (with GDE data)", async () => {

        // move the db file
        execSync('mv  /data/r1.35_x86_64/g/yottadb.dat /data/r1.35_x86_64/g/yottadb.old').toString();

        // execute the call
        const res = await libs._REST('regions/DEFAULT').catch(() => {});

        // Check if it is an object
        const isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // Check the result
        let isNode = res.result !== undefined;
        expect(isNode).to.be.true;

        expect(res.result).to.have.string('OK');

        // Check the data node
        isNode = res.data !== undefined;
        expect(isNode).to.be.true;

        // DB FILE: data
        isNode = res.data.dbAccess.data !== undefined;
        expect(isNode).to.be.true;

        isArray = Array.isArray(res.data.dbAccess.data);
        expect(isArray).to.be.true;

        length = res.data.dbAccess.data.length === 8;
        expect(length).to.be.true;

        // restore the db file
        execSync('mv  /data/r1.35_x86_64/g/yottadb.old /data/r1.35_x86_64/g/yottadb.dat').toString();
    });

    it("Test # 1026: Rename a db file and verify that journal fields get populated anyway (with GDE data)", async () => {

        // move the db file
        execSync('mv  /data/r1.35_x86_64/g/yottadb.dat /data/r1.35_x86_64/g/yottadb.old').toString();

        // execute the call
        const res = await libs._REST('regions/DEFAULT').catch(() => {});

        // Check if it is an object
        const isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        // Check the result
        let isNode = res.result !== undefined;
        expect(isNode).to.be.true;

        expect(res.result).to.have.string('OK');

        // Check the data node
        isNode = res.data !== undefined;
        expect(isNode).to.be.true;

        // DB FILE: data
        isNode = res.data.journal.data !== undefined;
        expect(isNode).to.be.true;

        isArray = Array.isArray(res.data.journal.data);
        expect(isArray).to.be.true;

        length = res.data.journal.data.length === 11;
        expect(length).to.be.true;

        // restore the db file
        execSync('mv  /data/r1.35_x86_64/g/yottadb.old /data/r1.35_x86_64/g/yottadb.dat').toString();
    });
});

describe("SERVER: GLD ERRORS", async () => {
    it("Test # 1100: Rename the gld to make it appear missing", async () => {

        // rename the file to emulate a missing file
        let shellRes = execSync('. /opt/yottadb/current/ydb_env_set && mv $ydb_gbldir /tmp/oldGld.gld').toString();

        // execute the call
        const res = await libs._REST('dashboard/getAll').catch(() => {});
        const isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        //ROLLBACK: restore the file
        shellRes = execSync('. /opt/yottadb/current/ydb_env_set && mv /tmp/oldGld.gld $ydb_gbldir ').toString();
    });
});

describe("SERVER: REGION", async () => {
    it("Test # 1120: Rename the default.dat file to make it appear missing", async () => {

        // execute the call to get the filename
        let res = await libs._REST('dashboard/getAll').catch(() => {});
        let isObject = typeof res === 'object';
        expect(isObject).to.be.true;
        const filename = res.data.regions.DEFAULT.dbFile.flags.file;


        // rename the file to emulate the missing file
        let shellRes = execSync('. /opt/yottadb/current/ydb_env_set && mv ' + filename + ' /tmp/default.old ').toString();

        // execute the call
        res = await libs._REST('dashboard/getAll').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        //ROLLBACK: restore the file
        shellRes = execSync('. /opt/yottadb/current/ydb_env_set && mv /tmp/default.old ' + filename).toString();
    });

    it("Test # 1121: Check # of sessions by increasing it with a timed session accessing a global", async () => {
        // execute the call to get the filename
        let res = await libs._REST('dashboard/getAll').catch(() => {});
        let isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        const sessions = res.data.regions.DEFAULT.dbFile.flags.sessions;

        // access a global in DEFAULT to have a new user
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'s ^test=0 h .500\'');

        await libs.delay(100);

        // execute the call
        res = await libs._REST('dashboard/getAll').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(sessions !== res.data.regions.DEFAULT.dbFile.flags.sessions).to.be.true;
    });

    it("Test # 1122: | 1122 | Verify that processIds of sessions are returned as array", async () => {
        // access a global in DEFAULT to have a new user
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'s ^test=0 h 2\'');

        await libs.delay(100);

        // execute the call
        res = await libs._REST('regions/DEFAULT').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.data.dbFile.flags.processes.length > 0).to.be.true;
    });
});

describe("SERVER: JOURNAL", async () => {
    it("Test # 1140: Switch journaling off in DEFAULT", async () => {

        await libs.delay(600);

        // switch journaling off
        execSync('. /opt/yottadb/current/ydb_env_set && mupip set -journal=off -region "DEFAULT"', {stdio: 'ignore'});

        // execute the call
        res = await libs._REST('dashboard/getAll').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.data.regions.DEFAULT.journal.flags.state === 1).to.be.true;

        isArray = Array.isArray(res.data.regions.DEFAULT.journal.data);
        expect(isArray).to.be.true;

        expect(res.data.regions.DEFAULT.journal.data.length > 0).to.be.true;

        // switch journaling on again
        execSync('. /opt/yottadb/current/ydb_env_set && mupip set -journal=on -region "DEFAULT"', {stdio: 'ignore'});
    });

    it("Test # 1141: Enable journaling in YDBAIM", async () => {

        // switch journaling on
        execSync('. /opt/yottadb/current/ydb_env_set && mupip set -journal=on,enable -region "YDBAIM"', {stdio: 'ignore'});

        // execute the call
        res = await libs._REST('dashboard/getAll').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.data.regions.YDBAIM.journal.flags.state === 2).to.be.true;

        // switch journaling off again
        execSync('. /opt/yottadb/current/ydb_env_set && mupip set -journal=disable -region "YDBAIM"', {stdio: 'ignore'});
    });

    it("Test # 1142: Disable journaling in YDBAIM", async () => {

        // switch journaling off
        execSync('. /opt/yottadb/current/ydb_env_set && mupip set -journal=disable -region "YDBAIM"');

        // execute the call
        res = await libs._REST('dashboard/getAll').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.data.regions.YDBAIM.journal.flags.state === 0).to.be.true;

        // switch journaling on again
        execSync('. /opt/yottadb/current/ydb_env_set && mupip set -journal=enable,on -region "YDBAIM"', {stdio: 'ignore'});
    });

    it("Test # 1143: Journal file is missing", async () => {

        // get region information
        let res = await libs._REST('regions/YDBAIM').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        const jFilename = res.data.journal.flags.file;

        // delete journal
        execSync('rm ' + jFilename, {stdio: 'ignore'});

        // execute the call
        res = await libs._REST('regions/YDBAIM').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;
        expect(res.data.journal.flags.file === undefined).to.be.true;

    });
});

describe("SERVER: REPLICATION", async () => {
    it("Test # 1160: Turn replication on on YDBAIM as verify the response", async () => {

        // switch replication on
        execSync('. /opt/yottadb/current/ydb_env_set && mupip set -replication=on -region "YDBAIM"', {stdio: 'ignore'});

        // execute the call
        res = await libs._REST('dashboard/getAll').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.data.regions.YDBAIM.replication.flags.status === 1).to.be.true;

        // switch replication off again
        execSync('. /opt/yottadb/current/ydb_env_set && mupip set -replication=off -region "YDBAIM"', {stdio: 'ignore'});
    });
});

describe("SERVER: MAPS", async () => {

    it("Test # 1200: Create a new MAP and see it appearing in the response", async () => {

        // creates a new name called TEST in region YDBOCTO
        execSync('. /opt/yottadb/current/ydb_env_set && yottadb -r GDE  <<< \'add -name TEST -r=YDBAIM\'', {shell: '/bin/bash', stdio: 'ignore'});

        // execute the call
        res = await libs._REST('dashboard/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        const found = res.data.regions.YDBAIM.names.find(el => el.name === 'TEST');
        expect(found !== undefined).to.be.true;

        // delete the name
        execSync('. /opt/yottadb/current/ydb_env_set && yottadb -r GDE <<< \'delete -name TEST \'', {shell: '/bin/bash', stdio: 'ignore'});
    });
});

describe("SERVER: LOCKS", async () => {
    it("Test # 1220: LOCKS: Create a lock and verify", async () => {

        // creates a new lock on ^test and wait 3 seconds
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +^test h 3\'');
        await libs.delay(100);

        // execute the call
        res = await libs._REST('dashboard/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.data.regions.DEFAULT.locks.locks[0].node === '^test').to.be.true;
    });

    it("Test # 1221: LOCKS: Create a lock and a waiter and verify", async () => {

        // try to lock ^test
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +^test h 1\'');
        await libs.delay(100);

        // execute the call
        res = await libs._REST('dashboard/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.data.regions.DEFAULT.locks.locks[0].waiters.length === 1).to.be.true;
    });

    it("Test # 1222: LOCKS: Create a lock and two waiters and verify", async () => {

        // try to lock ^test
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +^test h 1\'');
        await libs.delay(100);

        // execute the call
        res = await libs._REST('dashboard/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.data.regions.DEFAULT.locks.locks[0].waiters.length === 2).to.be.true;
    });
});
