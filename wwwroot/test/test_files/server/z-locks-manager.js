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

describe("SERVER: Get All Locks", async () => {
    it("Test # 1420: Set Lock: ^%ydbocto, no waiters, verify", async () => {
        await libs.delay(5000);

        // creates a new lock on ^test and wait 3 seconds
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +^%ydbocto h 2\'');
        await libs.delay(100);

        // execute the call
        res = await libs._REST('regions/locks/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.locks[0].namespace === '^%ydbocto').to.be.true;

        expect(res.pids[0].pid === res.locks[0].pid).to.be.true;
        expect(res.pids[0].processName === 'yottadb').to.be.true;

        expect(res.regions[0].name === res.locks[0].region).to.be.true;

        await libs.delay(2200)
    });

    it("Test # 1421: Set Lock  ^%ydbaim, 1 waiter, verify", async () => {
        // creates a new lock on ^test and wait 3 seconds
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +^%ydbaim h 1  h\'');
        await libs.delay(300);

        // creates a waiter on the same lock
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +^%ydbaim h 1  h\'');

        await libs.delay(300);

        // execute the call
        res = await libs._REST('regions/locks/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.locks[0].namespace === '^%ydbaim').to.be.true;

        expect(res.pids[0].pid === res.locks[0].pid).to.be.true;
        expect(res.pids[0].processName === 'yottadb').to.be.true;

        expect(res.regions[0].name === res.locks[0].region).to.be.true;

        expect(res.locks[0].waiters[0] !== 0).to.be.true;

        await libs.delay(2200)
    });

    it("Test # 1422: Set Lock  ^%ydbaim, 2 waiters, verify", async () => {
        // creates a new lock on ^test and wait 3 seconds
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +^%ydbaim h 1  h\'');
        await libs.delay(300);

        // creates a waiter on the same lock
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +^%ydbaim h 1  h\'');

        // creates another waiter on the same lock
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +^%ydbaim h 1  h\'');

        await libs.delay(300);

        // execute the call
        res = await libs._REST('regions/locks/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.locks[0].namespace === '^%ydbaim').to.be.true;

        expect(res.pids[0].pid === res.locks[0].pid).to.be.true;
        expect(res.pids[0].processName === 'yottadb').to.be.true;

        expect(res.regions[0].name === res.locks[0].region).to.be.true;

        expect(res.locks[0].waiters[1] !== 0).to.be.true;

        await libs.delay(3200)
    });

    it("Test # 1423: Set Lock: test, no waiters, verify", async () => {
        // creates a new lock on ^test and wait 3 seconds
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +test h 2  h\'');
        await libs.delay(100);

        // execute the call
        res = await libs._REST('regions/locks/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.locks[0].namespace === 'test').to.be.true;

        expect(res.pids[0].pid === res.locks[0].pid).to.be.true;
        expect(res.pids[0].processName === 'yottadb').to.be.true;


        await libs.delay(2200)
    });

    it("Test # 1424: Set Lock: test, 1 waiter, verify", async () => {
        // creates a new lock on ^test and wait 3 seconds
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +test h 2  h\'');
        await libs.delay(100);

        // creates a waiter on the same lock
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +test h 1  h\'');

        await libs.delay(100);

        // execute the call
        res = await libs._REST('regions/locks/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.locks[0].namespace === 'test').to.be.true;

        expect(res.pids[0].pid === res.locks[0].pid).to.be.true;
        expect(res.pids[0].processName === 'yottadb').to.be.true;

        expect(res.locks[0].waiters[0] !== 0).to.be.true;

        await libs.delay(2200)
    });

    it("Test # 1425: Set Lock: test, 1 waiter, verify", async () => {
        // creates a new lock on ^test and wait 3 seconds
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +test h 2  h\'');
        await libs.delay(100);

        // creates a waiter on the same lock
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +test h 1  h\'');

        // creates a waiter on the same lock
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +test h 1  h\'');

        await libs.delay(100);

        // execute the call
        res = await libs._REST('regions/locks/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.locks[0].namespace === 'test').to.be.true;

        expect(res.pids[0].pid === res.locks[0].pid).to.be.true;
        expect(res.pids[0].processName === 'yottadb').to.be.true;

        expect(res.locks[0].waiters[1] !== 0).to.be.true;

        await libs.delay(5200)
    });

    it("Test # 1426: Set Lock  test, test2, ^test3, no waiters, verify", async () => {
        // creates a new lock on ^test and wait 3 seconds
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +test  l +test2  l +^test3 h 2  h\'');
        await libs.delay(200);

        // execute the call
        res = await libs._REST('regions/locks/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.locks[0].namespace === '^test3').to.be.true;
        expect(res.locks[1].namespace === 'test').to.be.true;
        expect(res.locks[2].namespace === 'test2').to.be.true;

        expect(res.pids[0].pid === res.locks[0].pid).to.be.true;
        expect(res.pids[0].processName === 'yottadb').to.be.true;

        await libs.delay(4200)
    });

    it("Test # 1427: Set Lock  test, test2, ^test3, 2 waiters, verify", async () => {
        // creates a new lock on test, test2 and ^test3 and wait 3 seconds
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +test  l +test2  l +^test3 h 2  h\'');
        await libs.delay(100);

        // creates a waiter on the same lock
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +test h 1  h\'');

        // creates a waiter on the same lock
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +test2 h 1  h\'');

        await libs.delay(100);

        // execute the call
        res = await libs._REST('regions/locks/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.locks[0].namespace === '^test3').to.be.true;
        expect(res.locks[1].namespace === 'test').to.be.true;
        expect(res.locks[2].namespace === 'test2').to.be.true;

        expect(res.pids[0].pid === res.locks[0].pid).to.be.true;
        expect(res.pids[0].processName === 'yottadb').to.be.true;

        expect(res.locks[1].waiters[0] !== 0).to.be.true;
        expect(res.locks[2].waiters[0] !== 0).to.be.true;

        await libs.delay(4200)
    });

    it("Test # 1428: No locks, verify", async () => {
        // execute the call
        res = await libs._REST('regions/locks/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(Array.isArray(res.locks)).to.be.false;

        await libs.delay(4200)
    });

    it('Test # 1429: Set lock ^test(\"test with spaces\"), verify', async () => {
        // set the lock
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +^test(\"test with spaces\") h 2  h\'');
        await libs.delay(100);

        // execute the call
        res = await libs._REST('regions/locks/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;
        console.dir(res, {depth: 20})

        expect(res.locks[0].namespace === '^test("test with spaces")').to.be.true;

        await libs.delay(4200)
    });
});

describe("SERVER: Clear lock", async () => {
    it("Test # 1430: No namespace, verify correct error", async () => {
        // execute the call
        res = await libs._RESTpost('regions/locks/clear?namespace=').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.error.description).to.have.string('No parameter: namespace was passed')

    });

    it("Test # 1431: Not existing namespace, verify correct error", async () => {
        // execute the call
        res = await libs._RESTpost('regions/locks/clear?namespace=notexisting').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.error.description).to.have.string('Action couldn\'t be completed.')

    });

    it("Test # 1432: Correct namespace, verify correct response and lock gone", async () => {
        // creates a new lock on ^test and wait 3 seconds
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +test h 2  h\'');
        await libs.delay(100);

        // execute the call
        let res = await libs._RESTpost('regions/locks/clear?namespace=test').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.result).to.have.string('OK');

        await libs.delay(200);

        // execute the call
        res = await libs._REST('regions/locks/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;


        expect(Array.isArray(res.locks)).to.be.false;
    });

});

describe("SERVER: Terminate process", async () => {
    it("Test # 1435: Not existing process Id, verify correct error", async () => {
        // execute the call
        let res = await libs._RESTpost('os/processes/999999/terminate').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.error.description).to.have.string('Process 999999 doesn\'t exist')
    });

    it("Test # 1436: process Id 0, verify correct error", async () => {
        // execute the call
        let res = await libs._RESTpost('os/processes/0/terminate').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.error.description).to.have.string('Process: 0 is not a valid process id')
    });

    it("Test # 1437: process Id is not YDB, verify correct error", async () => {

        // creates a new process
        const process = exec('sleep 3');

        await libs.delay(100)
        // execute the call
        let res = await libs._RESTpost('os/processes/' + process.pid + '/terminate').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        expect(res.error.description).to.have.string('The process: ' + process.pid + ' is not a YottaDB process')
    });

    it("Test # 1438: process Id is correct, verify correct response and terminated process", async () => {

        // creates a new lock on ^test and wait 2 seconds
        exec('. /opt/yottadb/current/ydb_env_set && yottadb -run %XCMD \'l +^%ydbocto h 2\'');
        await libs.delay(100);

        // execute the call
        let res = await libs._REST('regions/locks/getAll').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        const pid = res.locks[0].pid;

        // execute the call
        res = await libs._RESTpost('os/processes/' + pid + '/terminate').catch(() => {});

        isObject = typeof res === 'object';
        expect(isObject).to.be.true;

        try {
            const shellRes = execSync('ps -p ' + pid).toString();
            expect(1 === 0).to.be.true;

        } catch (err) {
            expect(err.status === 1).to.be.true;
        }
    });
});
