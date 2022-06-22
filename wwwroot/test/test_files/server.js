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

const libs = require('../libs');
const {expect} = require("chai");
const {execSync, exec} = require('child_process');
const http = require('http');
const fetch = require("node-fetch");

describe("SERVER: Endpoints verification", async () => {
    it("Test # 1000: dashboard/getAll", async () => {
        // execute the call
        const res = await _REST('dashboard/getAll').catch(() => {});

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

        // replication
        isNode = res.data.regions.DEFAULT.replication !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.replication.flags !== undefined;
        expect(isNode).to.be.true;

        isNode = res.data.regions.DEFAULT.replication.flags.status !== undefined;
        expect(isNode).to.be.true;
    });

    it("Test # 1001: dashboard/regions/DEFAULT/get", async () => {

        // execute the call
        const res = await _REST('regions/DEFAULT/').catch(() => {});

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
});

describe("SERVER: GLD ERRORS", async () => {
    it("Test # 1100: Rename the gld to make it appear missing", async () => {

        // rename the file to emulate a missing file
        let shellRes = execSync('. /opt/yottadb/current/ydb_env_set && mv $ydb_gbldir /tmp/oldGld.gld').toString();

        // execute the call
        const res = await _REST('dashboard/getAll').catch(() => {});
        const isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        //ROLLBACK: restore the file
        shellRes = execSync('. /opt/yottadb/current/ydb_env_set && mv /tmp/oldGld.gld $ydb_gbldir ').toString();
    });
});

describe("SERVER: REGION", async () => {
    it("Test # 1120: Rename the default.dat file to make it appear missing", async () => {

        // execute the call to get the filename
        let res = await _REST('dashboard/getAll').catch(() => {});
        let isObject = typeof res === 'object';
        expect(isObject).to.be.true;
        const filename = res.data.regions.DEFAULT.dbFile.flags.file;


        // rename the file to emulate the missing file
        let shellRes = execSync('. /opt/yottadb/current/ydb_env_set && mv ' + filename + ' /tmp/default.old ').toString();

        // execute the call
        res = await _REST('dashboard/getAll').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        //ROLLBACK: restore the file
        shellRes = execSync('. /opt/yottadb/current/ydb_env_set && mv /tmp/default.old ' + filename).toString();
    });

    it("Test # 1121: Check # of sessions by increasing it with a timed session accessing a global", async () => {
        // execute the call to get the filename
        let res = await _REST('dashboard/getAll').catch(() => {});
        let isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        const sessions = res.data.regions.DEFAULT.dbFile.flags.sessions;

        // access a global in DEFAULT to have a new user
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'s ^test=0 h .500\'');

        await libs.delay(100);

        // execute the call
        res = await _REST('dashboard/getAll').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(sessions !== res.data.regions.DEFAULT.dbFile.flags.sessions).to.be.true;
    });
});

describe("SERVER: JOURNAL", async () => {
    it("Test # 1140: Switch journaling off in DEFAULT", async () => {

        await libs.delay(600);

        // switch journaling off
        execSync('. /opt/yottadb/current/ydb_env_set && mupip set -journal=off -region "DEFAULT"', {stdio: 'ignore'});

        // execute the call
        res = await _REST('dashboard/getAll').catch(() => {});
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
        res = await _REST('dashboard/getAll').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.data.regions.YDBAIM.journal.flags.state === 2).to.be.true;

        // switch journaling off again
        execSync('. /opt/yottadb/current/ydb_env_set && mupip set -journal=disable -region "YDBAIM"', {stdio: 'ignore'});
    });

    it("Test # 1142: Disable journaling in YDBAIM", async () => {

        // switch journaling off
        execSync('. /opt/yottadb/current/ydb_env_set && mupip set -journal=disable -region "DEFAULT"', {stdio: 'ignore'});

        // execute the call
        res = await _REST('dashboard/getAll').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.data.regions.DEFAULT.journal.flags.state === 0).to.be.true;

        // switch journaling on again
        execSync('. /opt/yottadb/current/ydb_env_set && mupip set -journal=enable,on -region "DEFAULT"', {stdio: 'ignore'});
    });
});

describe("SERVER: REPLICATION", async () => {
    it("Test # 1160: Turn replication on on DEFAULT as verify the response", async () => {

        // switch replication on
        execSync('. /opt/yottadb/current/ydb_env_set && mupip set -replication=on -region "DEFAULT"', {stdio: 'ignore'});

        // execute the call
        res = await _REST('dashboard/getAll').catch(() => {});
        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.data.regions.DEFAULT.replication.flags.status === 1).to.be.true;

        // switch replication off again
        execSync('. /opt/yottadb/current/ydb_env_set && mupip set -replication=off -region "DEFAULT"', {stdio: 'ignore'});
    });
});

describe("SERVER: MAPS", async () => {

    it("Test # 1200: Create a new MAP and see it appearing in the response", async () => {

        // creates a new name called TEST in region YDBOCTO
        execSync('. /opt/yottadb/current/ydb_env_set && yottadb -r GDE  <<< \'add -name TEST -r=YDBAIM\'', {shell: '/bin/bash', stdio: 'ignore'});

        // execute the call
        res = await _REST('dashboard/getAll').catch(() => {});

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
        res = await _REST('dashboard/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.data.regions.DEFAULT.locks.locks[0].node === '^test').to.be.true;
    });

    it("Test # 1221: LOCKS: Create a lock and a waiter and verify", async () => {

        // try to lock ^test
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +^test h 1\'');
        await libs.delay(100);

        // execute the call
        res = await _REST('dashboard/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.data.regions.DEFAULT.locks.locks[0].waiters.length === 1).to.be.true;
    });

    it("Test # 1222: LOCKS: Create a lock and two waiters and verify", async () => {

        // try to lock ^test
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +^test h 1\'');
        await libs.delay(100);

        // execute the call
        res = await _REST('dashboard/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.data.regions.DEFAULT.locks.locks[0].waiters.length === 2).to.be.true;
    });
});

describe("SERVER: GDE functions", async () => {
    it("Test # 1240: Extend db", async () => {

        // execute the call and read the size
        let res = await _REST('dashboard/getAll').catch(() => {});
        const oldValue = res.data.regions.DEFAULT.dbFile.usage.totalBlocks

        // extend the region
        await _RESTpost('regions/DEFAULT/extend?blocks=100').catch((err) => {console.log(err)});

        // execute the call again and read the size again
        res = await _REST('dashboard/getAll').catch(() => {});
        const newValue = res.data.regions.DEFAULT.dbFile.usage.totalBlocks

        // and compare them
        expect(newValue > oldValue).to.be.true;
    });

    it("Test # 1241: Turn journal OFF", async () => {

        // extend the region
        let res = await _RESTpost('regions/DEFAULT/journalSwitch?turn=off').catch(() => {});

        // execute the call again and read the size again
        res = await _REST('dashboard/getAll').catch(() => {});

        // and compare them
        expect(res.data.regions.DEFAULT.journal.flags.state === 1).to.be.true;
    });

    it("Test # 1242: Turn journal ON", async () => {

        // extend the region
        let res = await _RESTpost('regions/DEFAULT/journalSwitch?turn=on').catch(() => {});

        // execute the call again and read the size again
        res = await _REST('dashboard/getAll').catch(() => {});

        // and compare them
        expect(res.data.regions.DEFAULT.journal.flags.state === 2).to.be.true;
    });

    it("Test # 1244: Create DB: existing", async () => {

        // delete the file
        execSync('. /opt/yottadb/current/ydb_env_set && rm $ydb_dir/$ydb_rel/g/yottadb.dat').toString();

        // execute the call
        const res = await _RESTpost('regions/DEFAULT/createDb').catch(() => {});

        // and verify the result
        expect(res.result === 'OK').to.be.true;
    });

    it("Test # 1245: Create DB: freshly created region", async () => {

        // create a new region with the GDE
        execSync('. /opt/yottadb/current/ydb_env_set && yottadb -r GDE  <<< \'add -r TEST5 -dyn=TEST5\nadd -s TEST5 -f=/data/test5.dat\nadd -n test5 -r=TEST5\nexit\n\'', {shell: '/bin/bash', stdio: 'ignore'});

        // execute the call again and read the size again
        let res = await _RESTpost('regions/TEST5/createDb').catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the file really exists
        res = execSync('ls /data/test5.dat').toString().replace('\n', '');
        expect(res === '/data/test5.dat').to.be.true;

    });

});

const _REST = path => {
    return new Promise(async function (resolve, reject) {
        http.get('http://localhost:8089/api/' + path, res => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    resolve(JSON.parse(data))
                } catch (err) {
                    reject(err)
                }
            });

            res.on('error', err => {
                reject(err)
            })
        })
    });
};

const _RESTpost = path => {
    return new Promise(async function (resolve, reject) {
        fetch('http://localhost:8089/api/' + path,
            {
                method: "POST",
                body: {},
            }).then(async response => resolve(JSON.parse(await response.text()))).catch(err => reject(err))
    })
};
