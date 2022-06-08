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

describe("SERVER: Get Templates", async () => {
    it("Test # 1260: Verify that BG segment data is complete, including limits", async () => {
        // execute the call
        let res = await libs._REST('dashboard/getTemplates').catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the fields are there
        let val = res.data.segment.BG.ALLOCATION.value;
        expect(val === 5000).to.be.true;

        // and verify that the fields are there
        val = res.data.segment.BG.BLOCK_SIZE.min;
        expect(val === 512).to.be.true;
    });

    it("Test # 1261: Verify that MM segment data is complete, including limits", async () => {
        // execute the call
        let res = await libs._REST('dashboard/getTemplates').catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the fields are there
        let val = res.data.segment.MM.ALLOCATION.value;
        expect(val === 5000).to.be.true;

        // and verify that the fields are there
        val = res.data.segment.MM.BLOCK_SIZE.min;
        expect(val === 512).to.be.true;
    });

    it("Test # 1262: Verify that region data is complete, including limits", async () => {
        // execute the call
        let res = await libs._REST('dashboard/getTemplates').catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the fields are there
        let val = res.data.region.JOURNAL.value;
        expect(val === 0).to.be.true;

        // and verify that the fields are there
        val = res.data.region.JOURNAL.max;
        expect(val === 1).to.be.true;
    });
});

describe("SERVER: Verify Namespace", async () => {
    it("Test # 1270: Submit just name", async () => {
        // execute the call
        const body = {namespace: 'test'};
        let res = await libs._RESTpost('regions/parseNamespace', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the parsing is ok
        expect(res.data.parseResult === 'OK').to.be.true;
    });

    it("Test # 1271: Submit just name with asterisk", async () => {
        // execute the call
        const body = {namespace: 'test*'};
        let res = await libs._RESTpost('regions/parseNamespace', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the parsing is ok
        expect(res.data.parseResult === 'OK').to.be.true;
    });

    it("Test # 1272: Submit name and subscript", async () => {
        // execute the call
        const body = {namespace: 'test("node")'};
        let res = await libs._RESTpost('regions/parseNamespace', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the parsing is ok
        expect(res.data.parseResult === 'OK').to.be.true;
    });

    it("Test # 1273: Submit name and multiple subscripts", async () => {
        // execute the call
        const body = {namespace: 'test("node",12,"aaa")'};
        let res = await libs._RESTpost('regions/parseNamespace', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the parsing is ok
        expect(res.data.parseResult === 'OK').to.be.true;
    });

    it("Test # 1274: Submit name and multiple subscripts with ranges", async () => {
        // execute the call
        const body = {namespace: 'test("node",12,"aaa":"bbb")'};
        let res = await libs._RESTpost('regions/parseNamespace', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the parsing is ok
        expect(res.data.parseResult === 'OK').to.be.true;
    });

    it("Test # 1275: Submit bad name", async () => {
        // execute the call
        const body = {namespace: 'test%@!'};
        let res = await libs._RESTpost('regions/parseNamespace', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the parsing is ok
        expect(res.data.parseResult).to.have.string('%GDE-E-VALUEBAD');
    });

    it("Test # 1276: Submit name and only open paren", async () => {
        // execute the call
        const body = {namespace: 'test(12'};
        let res = await libs._RESTpost('regions/parseNamespace', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the parsing is ok
        expect(res.data.parseResult).to.have.string('%GDE-E-NAMRPARENMISSING');
    });

    it("Test # 1277: Submit name and only close paren", async () => {
        // execute the call
        const body = {namespace: 'test 12)'};
        let res = await libs._RESTpost('regions/parseNamespace', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the parsing is ok
        expect(res.data.parseResult).to.have.string('%GDE-E-MISSINGDELIM');
    });

    it("Test # 1278: Submit name and bad subscript (alphanumeric, no quotes)", async () => {
        // execute the call
        const body = {namespace: 'test(2aa)'};
        let res = await libs._RESTpost('regions/parseNamespace', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the parsing is ok
        expect(res.data.parseResult).to.have.string('%GDE-E-NAMSUBSBAD');
    });

    it("Test # 1279: Submit name and bad subscript (string, only left quote)", async () => {
        // execute the call
        const body = {namespace: 'test("aa)'};
        let res = await libs._RESTpost('regions/parseNamespace', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the parsing is ok
        expect(res.data.parseResult).to.have.string('%GDE-E-STRMISSQUOTE');
    });

    it("Test # 1280: Submit name and bad subscript (string, only right quote)", async () => {
        // execute the call
        const body = {namespace: 'test(aa")'};
        let res = await libs._RESTpost('regions/parseNamespace', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the parsing is ok
        expect(res.data.parseResult).to.have.string('%GDE-E-STRMISSQUOTE');
    });

    it("Test # 1281: Submit name and left range missing", async () => {
        // execute the call
        const body = {namespace: 'test(:33)'};
        let res = await libs._RESTpost('regions/parseNamespace', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the parsing is ok
        expect(res.data.parseResult).to.have.string('OK');
        1
    });

    it("Test # 1282: Submit name and right range missing", async () => {
        // execute the call
        const body = {namespace: 'test(33:)'};
        let res = await libs._RESTpost('regions/parseNamespace', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the parsing is ok
        expect(res.data.parseResult).to.have.string('OK');
    });

    it("Test # 1283: Submit existing name", async () => {
        // execute the call
        const body = {namespace: '%ydbOCTO*'};
        let res = await libs._RESTpost('regions/parseNamespace', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify that the parsing is ok
        expect(res.data.parseResult).to.have.string('%GDE-E-OBJDUP, Name %ydbOCTO* already');
    });
});

describe("SERVER: Verify Filename", async () => {
    it("Test # 1290: Submit name with double /", async () => {
        // execute the call
        const body = {path: '//opt/test.dat'};
        let res = await libs._RESTpost('regions/validatePath', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify the response
        expect(res.data.validation).to.have.string('/opt');
        expect(res.data.fileExist).to.have.string('');
    });

    it("Test # 1291: Submit name with bad env var", async () => {
        // execute the call
        const body = {path: '$dummy/test.dat'};
        let res = await libs._RESTpost('regions/validatePath', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify the response
        expect(res.data.validation).to.have.string('');
        expect(res.data.fileExist).to.have.string('');
    });

    it("Test # 1292: Submit valid name with existing file", async () => {
        // execute the call
        const body = {path: '/data/r1.35_x86_64/g/yottadb.dat'};
        let res = await libs._RESTpost('regions/validatePath', body).catch(() => {});

        // and check the result to be ERROR
        expect(res.result === 'ERROR').to.be.true;
    });

    it("Test # 1293: Submit valid name with absolute path", async () => {
        // execute the call
        const body = {path: '/opt/yottadb/current/test.dat'};
        let res = await libs._RESTpost('regions/validatePath', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify the response
        expect(res.data.validation).to.have.string('/opt/yottadb/current');
        expect(res.data.fileExist).to.have.string('');
    });

    it("Test # 1294: Submit valid name with relative path", async () => {
        // execute the call
        const body = {path: 'html/test.dat'};
        let res = await libs._RESTpost('regions/validatePath', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify the response
        expect(res.data.validation).to.have.string('/YDBGUI/wwwroot/html');
        expect(res.data.fileExist).to.have.string('');
    });

    it("Test # 1295: Submit valid name with env vars and check for proper extension", async () => {
        // execute the call
        const body = {path: '$ydb_dist/test.dat'};
        let res = await libs._RESTpost('regions/validatePath', body).catch(() => {});

        // and check the result to be OK
        expect(res.result === 'OK').to.be.true;

        // and verify the response
        expect(res.data.validation).to.have.string('/opt/yottadb/current');
        expect(res.data.fileExist).to.have.string('');
    });
});
