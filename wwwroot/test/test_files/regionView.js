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

describe("CLIENT: Region View: Database tab", async () => {
    it("Test # 250: Db status when db file is missing and autodb is on", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=250`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#pillRegionViewRegionStatus');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('No database file');

        // and pill has the YELLOW color
        const pillColor = await libs.getCssBackground('#pillRegionViewRegionStatus');
        expect(pillColor).to.have.string('rgb(234, 184, 59)')
    });

    it("Test # 251: Db status when db file is missing and autodb is off", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=251`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#pillRegionViewRegionStatus');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Critical');

        // and pill has the RED color
        const pillColor = await libs.getCssBackground('#pillRegionViewRegionStatus');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 252: Db status when db file is bad", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=252`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#pillRegionViewRegionStatus');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Critical');

        // and pill has the RED color
        const pillColor = await libs.getCssBackground('#pillRegionViewRegionStatus');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 253: Db status when shmem  is bad", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=253`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#pillRegionViewRegionStatus');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Critical');

        // and pill has the RED color
        const pillColor = await libs.getCssBackground('#pillRegionViewRegionStatus');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 254: blocks gauge when free block space is <70%", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=254`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#rngRegionViewRegionUsedSpace');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('10 %');

        // and pill has the GREEN color
        const pillColor = await libs.getCssBackground('#rngRegionViewRegionUsedSpace');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 255: blocks gauge when free block space is >70% and <90%", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=255`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#rngRegionViewRegionUsedSpace');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('80 %');

        // and pill has the YELLOW color
        const pillColor = await libs.getCssBackground('#rngRegionViewRegionUsedSpace');
        expect(pillColor).to.have.string('rgb(234, 184, 59)')
    });

    it("Test # 256: blocks gauge when free block space is >90% and <97%", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=256`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#rngRegionViewRegionUsedSpace');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('95 %');

        // and pill has the RED color
        const pillColor = await libs.getCssBackground('#rngRegionViewRegionUsedSpace');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 257: blocks gauge when free block space is >97% and <101%", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=257`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#rngRegionViewRegionUsedSpace');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('99 %');

        // and pill has the RED color
        const pillColor = await libs.getCssBackground('#rngRegionViewRegionUsedSpace');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 258: User sessions when users = 0", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=258`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#pillRegionViewRegionSessions');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('0');
    });

    it("Test # 259: User sessions when users > 0", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=259`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#pillRegionViewRegionSessions');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('27');
    });

    it("Test # 260: Alert message when db file is missing and autodb is on", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=260`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure alert is visible
        isVisible = await libs.getCssDisplay('#divRegionViewRegionAlert') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewRegionAlert');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('The database file is missing.');

        // and alert has the YELLOW color
        const pillColor = await libs.getCssBackground('#lblRegionViewRegionAlert');
        expect(pillColor).to.have.string('rgb(234, 184, 59)')
    });

    it("Test # 261: Alert message when db file is missing and autodb is off", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=261`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure alert is visible
        isVisible = await libs.getCssDisplay('#divRegionViewRegionAlert') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewRegionAlert');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('The database file is missing.');

        // and alert has the RED color
        const pillColor = await libs.getCssBackground('#lblRegionViewRegionAlert');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 262: Alert message when db file is bad", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=262`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure alert is visible
        isVisible = await libs.getCssDisplay('#divRegionViewRegionAlert') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewRegionAlert');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('The database file exists, but it is');

        // and alert has the RED color
        const pillColor = await libs.getCssBackground('#lblRegionViewRegionAlert');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 263: Alert message when shmem is bad", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=263`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure alert is visible
        isVisible = await libs.getCssDisplay('#divRegionViewRegionAlert') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewRegionAlert');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('The database shared memory is corrupt');

        // and alert has the RED color
        const pillColor = await libs.getCssBackground('#lblRegionViewRegionAlert');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 270: Db file: Verify that the table gets populated", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=270`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure table has data
        let cell = await page.$('#tblRegionViewRegionRegion >tbody >tr >td:nth-child(1) ');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('File name:');
    });

    it("Test # 271: Db Access lists: Verify that the table gets populated", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=271`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure table has data
        let cell = await page.$('#tblRegionViewRegionSegment >tbody >tr >td:nth-child(1) ');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Record size:');
    });

    it("Test # 280: Button Create db: verify that is disabled when db file is missing and filename is empty", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=280`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure button is visible as PURPLE
        let btnColor = await libs.getCssColor('#btnRegionViewRegionCreateDbFile');
        expect(btnColor).to.have.string('rgb(35, 31, 32)')
    });

    it("Test # 281: Button Create db: verify that is enabled when db file is missing and filename is specified", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=281`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure button is visible as DARK GRAY
        let btnColor = await libs.getCssColor('#btnRegionViewRegionCreateDbFile');
        expect(btnColor).to.have.string('rgb(59, 26, 104)')
    });

    it("Test # 282: Button Create db: verify that is disabled when db file is good", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=282`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure button is visible as DARK GRAY
        let btnColor = await libs.getCssColor('#btnRegionViewRegionCreateDbFile');
        expect(btnColor).to.have.string('rgb(35, 31, 32)')
    });

    it("Test # 283: Button Extend db: verify that is enabled at all times when database file exists and it is valid", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=283`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure button is visible as PURPLE
        let btnColor = await libs.getCssColor('#btnRegionViewRegionExtendDbFile');
        expect(btnColor).to.have.string('rgb(59, 26, 104)')
    });

    it("Test # 284: Button Extend db: verify that is disabled  when database file does NOT exists", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=284`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure button is visible as DARD GRAY
        let btnColor = await libs.getCssColor('#btnRegionViewRegionExtendDbFile');
        expect(btnColor).to.have.string('rgb(35, 31, 32)')
    });

    it("Test # 285: Button Extend db: verify that is disabled  when database file is invalid", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=285`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure button is visible as DARK GRAY
        let btnColor = await libs.getCssColor('#btnRegionViewRegionExtendDbFile');
        expect(btnColor).to.have.string('rgb(35, 31, 32)')
    });

    it("Test # 286: Select Advanced Params and verify that extra fields are displayed in the db access table", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=286`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // click on extended mode
        btnClick = await page.$("#chkRegionViewAdvancedMode");
        await btnClick.click();

        await libs.delay(500);

        // make sure table has data
        let cell = await page.$('#tblRegionViewRegionSegment >tbody >tr:nth-child(3) >td:nth-child(1) ');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Null subscripts:');
    });
});

describe("CLIENT: Region View: Journal tab", async () => {
    it("Test # 290: Status when journal file is disabled AND repl off", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=290`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewJournalStatus');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Disabled');

        // and pill has the correct color as GRAY
        const pillColor = await libs.getCssBackground('#lblRegionViewJournalStatus');
        expect(pillColor).to.have.string('rgb(243, 243, 243)')
    });

    it("Test # 291: Status when journal file is enabled but off AND repl off", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=291`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewJournalStatus');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Enabled/Off');

        // and pill has the correct color as YELLOW
        const pillColor = await libs.getCssBackground('#lblRegionViewJournalStatus');
        expect(pillColor).to.have.string('rgb(234, 184, 59)')
    });

    it("Test # 292: Status when journal file is enabled and on (before) AND repl off", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=292`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewJournalStatus');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Enabled / On');

        // and pill has the correct color as GREEN
        const pillColor = await libs.getCssBackground('#lblRegionViewJournalStatus');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 293: Status when journal file is enabled and in WasOn status", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=293`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewJournalStatus');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('WAS ON');

        // and pill has the correct color as RED
        const pillColor = await libs.getCssBackground('#lblRegionViewJournalStatus');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 294: Status when journal file is enabled but off AND repl on AND 0 users", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=294`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewJournalStatus');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Enabled/Off');

        // and pill has the correct color as YELLOW
        const pillColor = await libs.getCssBackground('#lblRegionViewJournalStatus');
        expect(pillColor).to.have.string('rgb(234, 184, 59)')
    });

    it("Test # 295: Status when journal file is enabled and on (before) AND repl on AND 0 users", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=295`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewJournalStatus');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Enabled / On');

        // and pill has the correct color as GREEN
        const pillColor = await libs.getCssBackground('#lblRegionViewJournalStatus');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 296: Status when journal file is enabled and on (nobefore) AND repl on AND 0 users", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=296`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewJournalStatus');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Enabled / On');

        // and pill has the correct color as GREEN
        const pillColor = await libs.getCssBackground('#lblRegionViewJournalStatus');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 297: Status when journal file is disabled AND repl on AND >0 users", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=297`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewJournalStatus');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Critical');

        // and pill has the correct color as RED
        const pillColor = await libs.getCssBackground('#lblRegionViewJournalStatus');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 298: Status when journal file is enabled but off AND repl on AND >0 users", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=298`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewJournalStatus');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Critical');

        // and pill has the correct color as RED
        const pillColor = await libs.getCssBackground('#lblRegionViewJournalStatus');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 300: If no journal, turn on/off button should be invisible", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=300`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView1");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure dialog is invisible
        isVisible = await libs.getCssDisplay('#btnRegionViewJournalSwitch') === 'none';
        expect(isVisible).to.be.true;

    });

    it("Test # 313: Verify that Type pill is properly populated with the type when journaling is enabled and Before", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=313`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewJournalType');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Before Image');

        // and pill has the correct color as GREEN
        const pillColor = await libs.getCssBackground('#lblRegionViewJournalType');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 314: Verify that Type pill is properly populated with the type when journaling is enabled and Nobefore", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=314`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewJournalType');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('No before image');

        // and pill has the correct color as GREEN
        const pillColor = await libs.getCssBackground('#lblRegionViewJournalType');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 315: Verify that Type pill is properly populated with the type when journaling disabled", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=315`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewJournalType');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('N/A');

        // and pill has the correct color as GRAY
        const pillColor = await libs.getCssBackground('#lblRegionViewJournalType');
        expect(pillColor).to.have.string('rgb(243, 243, 243)')
    });

    it("Test # 316: Verify that the Parameters list gets properly populated", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=316`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure table has data
        let cell = await page.$('#tblRegionViewJournalParams >tbody >tr >td:nth-child(1) ');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('File name:');
    });

    it("Test # 317: Verify that the entire Journal Parameter list is hidden when journal is disabled", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=317`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure the table is invisible
        isVisible = await libs.getCssDisplay('#divRegionViewJournalTable') !== 'none';
        expect(isVisible).to.be.false;
    });

    it("Test # 318: Alert message when WAS ON is set", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=318`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure alert is visible
        isVisible = await libs.getCssDisplay('#divRegionViewJournalAlert') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewJournalAlert');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Replication is in WAS ON status');

        // and alert has the correct color as RED
        const pillColor = await libs.getCssBackground('#lblRegionViewJournalAlert');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 319: Alert message when replication is on and journal is disabled", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=319`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure alert is visible
        isVisible = await libs.getCssDisplay('#divRegionViewJournalAlert') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewJournalAlert');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Journaling must be enabled and turned');

        // and alert has the correct color as RED
        const pillColor = await libs.getCssBackground('#lblRegionViewJournalAlert');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 320: Alert message when replication is on and journal is enabled / off", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=320`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure alert is visible
        isVisible = await libs.getCssDisplay('#divRegionViewJournalAlert') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewJournalAlert');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Journaling must be turned on in an ');

        // and alert has the correct color as RED
        const pillColor = await libs.getCssBackground('#lblRegionViewJournalAlert');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 321: Alert message when replication is off and journal is enabled / off", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=321`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure alert is visible
        isVisible = await libs.getCssDisplay('#divRegionViewJournalAlert') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewJournalAlert');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Journaling needs to be turned on');

        // and alert has the correct color as YELLOW
        const pillColor = await libs.getCssBackground('#lblRegionViewJournalAlert');
        expect(pillColor).to.have.string('rgb(234, 184, 59)')
    });
});

describe("CLIENT: Region View: Names tab", async () => {
    it("Test # 350: Verify that the list is empty", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=350`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure table has NO data
        let cell = await page.$('#tblRegionViewNames >tbody >tr >td ');
        expect(cell === null).to.be.true;
    });

    it("Test # 351: Verify that the list content changes when clicking the checkbox and display also the %YDBOCTO", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=351`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView2");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;
    });

});

describe("CLIENT: Region View: Stats tab", async () => {
    it("Test # 360: Verify that the table gets populated with >0 items", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=360`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure table has data
        let cell = await page.$('#tblRegionViewStats >tbody >tr >td:nth-child(1)');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Critical Section Acquisition');
    });
});

describe("CLIENT: Region View: Locks tab", async () => {
    it("Test # 370: Verify that the label Processes on queue gets populated", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=370`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure label has data
        let cell = await page.$('#lblRegionViewLocksProcessesOnQueue');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('0/880');
    });

    it("Test # 371: Verify that the label Lock slots in use gets populated", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=371`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure label has data
        let cell = await page.$('#lblRegionViewLocksSlotsInUse');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('0/597');
    });

    it("Test # 372: Verify that the label Slot bytes in use gets populated", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=372`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure label has data
        let cell = await page.$('#lblRegionViewLocksBytesInUse');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('0/28080');
    });

    it("Test # 373: Verify that the label Free lock space gets populated", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=373`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure label has data
        let cell = await page.$('#lblRegionViewLocksFreeLockSpace');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('100%');
    });

    it("Test # 374: Lock table: no locks", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=374`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure table has NO data
        let cell = await page.$('#tblRegionViewLocks >tbody >tr >td ');
        expect(cell === null).to.be.true;
    });

    it("Test # 375: Lock table: 1 lock, no waiter", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=375`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure table has correct data

        // 1 lock
        let cell = await page.$('#tblRegionViewLocks >tbody >tr >td:nth-child(1)');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('^testGlobal("subscript1")');

        cell = await page.$('#tblRegionViewLocks >tbody >tr td:nth-child(2)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('1234');

        // No waiter
        cell = await page.$('#tblRegionViewLocks >tbody >tr td:nth-child(3) ');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('');
    });

    it("Test # 376: Lock table: 1 lock, 1 waiter", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=376`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure table has correct data

        // 1 lock
        let cell = await page.$('#tblRegionViewLocks >tbody >tr >td:nth-child(1)');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('^testGlobal("subscript1")');

        cell = await page.$('#tblRegionViewLocks >tbody >tr >td:nth-child(2)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('1234');

        // 1 waiter
        cell = await page.$('#tblRegionViewLocks >tbody >tr td:nth-child(3)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('4321');
    });

    it("Test # 377: Lock table: 1 lock, 2 waiters", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=377`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure table has correct data

        // 1 lock
        let cell = await page.$('#tblRegionViewLocks >tbody >tr >td:nth-child(1)');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('^testGlobal("subscript1")');

        cell = await page.$('#tblRegionViewLocks >tbody >tr >td:nth-child(2)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('1234');

        // 2 waiters
        cell = await page.$('#tblRegionViewLocks >tbody >tr td:nth-child(3)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('4321');

        cell = await page.$('#tblRegionViewLocks >tbody >tr:nth-child(2) td:nth-child(3)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('7890');
    });

    it("Test # 378: Lock table: 2 lock, no waiter", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=378`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure table has correct data

        // 1st lock
        let cell = await page.$('#tblRegionViewLocks >tbody >tr >td:nth-child(1)');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('^testGlobal("subscript1")');

        cell = await page.$('#tblRegionViewLocks >tbody >tr td:nth-child(2)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('1234');

        // No waiter
        cell = await page.$('#tblRegionViewLocks >tbody >tr td:nth-child(3) ');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('');

        // 2nd lock
        cell = await page.$('#tblRegionViewLocks >tbody >tr:nth-child(2) >td:nth-child(1)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('^testGlobal("subscript2")');

        cell = await page.$('#tblRegionViewLocks >tbody >tr:nth-child(2) td:nth-child(2)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('1234321');

        // No waiter
        cell = await page.$('#tblRegionViewLocks >tbody >tr:nth-child(2) td:nth-child(3) ');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('');
    });

    it("Test # 379: Lock table: 2 locks, 1 waiter", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=379`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure table has correct data

        // 1st lock
        let cell = await page.$('#tblRegionViewLocks >tbody >tr >td:nth-child(1)');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('^testGlobal("subscript1")');

        cell = await page.$('#tblRegionViewLocks >tbody >tr td:nth-child(2)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('1234');

        // No waiter
        cell = await page.$('#tblRegionViewLocks >tbody >tr td:nth-child(3) ');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('4321');

        // 2nd lock
        cell = await page.$('#tblRegionViewLocks >tbody >tr:nth-child(2) >td:nth-child(1)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('^testGlobal("subscript2")');

        cell = await page.$('#tblRegionViewLocks >tbody >tr:nth-child(2) td:nth-child(2)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('1234321');

        // No waiter
        cell = await page.$('#tblRegionViewLocks >tbody >tr:nth-child(2) td:nth-child(3) ');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('');
    });

    it("Test # 380: Lock table: 2 locks, 2 waiters", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=380`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // make sure table has correct data

        // 1 lock
        let cell = await page.$('#tblRegionViewLocks >tbody >tr >td:nth-child(1)');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('^testGlobal("subscript1")');

        cell = await page.$('#tblRegionViewLocks >tbody >tr >td:nth-child(2)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('1234');

        // 2 waiters
        cell = await page.$('#tblRegionViewLocks >tbody >tr td:nth-child(3)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('4321');

        cell = await page.$('#tblRegionViewLocks >tbody >tr:nth-child(2) td:nth-child(3)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('7890');

        // 2nd lock
        cell = await page.$('#tblRegionViewLocks >tbody >tr:nth-child(3) >td:nth-child(1)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('^testGlobal("subscript2")');

        cell = await page.$('#tblRegionViewLocks >tbody >tr:nth-child(3) td:nth-child(2)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('1234321');

        // No waiter
        cell = await page.$('#tblRegionViewLocks >tbody >tr:nth-child(3) td:nth-child(3) ');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('');
    });
});
