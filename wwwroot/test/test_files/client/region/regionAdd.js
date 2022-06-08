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

const libs = require('../../../libs');
const {expect} = require("chai");
describe("CLIENT: Add Region: Region tab", async () => {
    it("Test # 490: Default display should be BG table", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=490`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionAdd') !== 'none';
        expect(isVisible).to.be.true;

        // and bg table is visible
        isVisible = await libs.getCssDisplay('#divRegionAddBg') !== 'none';
        expect(isVisible).to.be.true;
    });

    it("Test # 491: Clicking MM it should display the MM table", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=491`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionAdd') !== 'none';
        expect(isVisible).to.be.true;

        // display thge MM table
        const mmButton = await page.$('#regionAddSegmentNameMm');
        mmButton.click();

        await libs.delay(500);

        // and bg table is visible
        isVisible = await libs.getCssDisplay('#divRegionAddMm') !== 'none';
        expect(isVisible).to.be.true;

    });

    it("Test # 492: Click on BG filename and verify dialog is displayed", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=492`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionAdd') !== 'none';
        expect(isVisible).to.be.true;

        // and bg table is visible
        isVisible = await libs.getCssDisplay('#divRegionAddBg') !== 'none';
        expect(isVisible).to.be.true;

        const fileButton = await page.$('#btn-Bg-filename');
        fileButton.click();

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        isVisible = await libs.getCssDisplay('#modalRegionFilename') !== 'none';
        expect(isVisible).to.be.true;

    });

    it("Test # 493: Click on MM filename and verify dialog is displayed", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=493`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionAdd') !== 'none';
        expect(isVisible).to.be.true;

        // display thge MM table
        const mmButton = await page.$('#regionAddSegmentNameMm');
        mmButton.click();

        await libs.delay(500);

        const fileButton = await page.$('#btn-Mm-filename');
        fileButton.click();

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        isVisible = await libs.getCssDisplay('#modalRegionFilename') !== 'none';
        expect(isVisible).to.be.true;

    });

    it("Test # 494: Click on advanced mode and verify that BG table has more rows", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=494`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionAdd') !== 'none';
        expect(isVisible).to.be.true;

        // click on advanced mode
        btnClick = await page.$("#chkRegionAddAdvancedMode");
        await btnClick.click();

        // make sure left table has data
        let cell = await page.$('#tblRegionAddBg >tbody >tr:nth-child(6) >td:nth-child(1)');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Async IO');
    });

    it("Test # 495: Click on advanced mode and verify that MM table has more rows", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=494`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionAdd') !== 'none';
        expect(isVisible).to.be.true;

        // click on advanced mode
        btnClick = await page.$("#chkRegionAddAdvancedMode");
        await btnClick.click();

        // make sure left table has data
        let cell = await page.$('#tblRegionAddMm >tbody >tr:nth-child(4) >td:nth-child(1)');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Defer');
    });

    it("Test # 496: Click on advanced mode and verify that right table has more rows", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=494`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionAdd') !== 'none';
        expect(isVisible).to.be.true;

        // click on advanced mode
        btnClick = await page.$("#chkRegionAddAdvancedMode");
        await btnClick.click();

        // make sure right table has data
        cell = await page.$('#tblRegionAddAc >tbody >tr:nth-child(3) >td:nth-child(1)');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Null');
    });
});

describe("CLIENT: Add Region: Journal tab", async () => {
    it("Test # 520: Default display should be no journal", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=520`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionAdd') !== 'none';
        expect(isVisible).to.be.true;

        // and journal table is NOT visible
        isVisible = await libs.getCssDisplay('#divRegionAddJournalParams') === 'none';
        expect(isVisible).to.be.true;
    });

    it("Test # 522: Turn the journal on and verify that table is displayed", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=522`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionAdd') !== 'none';
        expect(isVisible).to.be.true;

        // select the journal tab
        const tabButton = await page.$('#navRegionEditorJournal');
        tabButton.click();

        await libs.delay(500);

        // and journal table is visible
        isVisible = await libs.getCssDisplay('#tblRegionAddJo') !== 'none';
        expect(isVisible).to.be.true;
    });

    it("Test # 523: Click on Journal filename and verify dialog is displayed", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=523`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionAdd') !== 'none';
        expect(isVisible).to.be.true;

        // select the journal tab
        const tabButton = await page.$('#navRegionEditorJournal');
        tabButton.click();

        await libs.delay(500);

        // switch journaling on
        const jButton = await page.$('#optRegionAddJournalTypeYes');
        jButton.click();

        await libs.delay(500);

        const fileButton = await page.$('#btn-Jo-jfilename');
        fileButton.click();

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        isVisible = await libs.getCssDisplay('#modalRegionFilename') !== 'none';
        expect(isVisible).to.be.true;
    });

    it("Test # 524: Default display should be no journal", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=524`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionAdd') !== 'none';
        expect(isVisible).to.be.true;

        // click on advanced mode
        const btnClick = await page.$("#chkRegionAddAdvancedMode");
        await btnClick.click();

        // make sure right table has data
        const cell = await page.$('#tblRegionAddJo >tbody >tr:nth-child(4) >td:nth-child(1)');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Allocation');
    });
});


describe("CLIENT: Add Region: Names tab", async () => {
    it("Test # 540: Click on add name button and verify that dialog is displayed", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=540`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionAdd') !== 'none';
        expect(isVisible).to.be.true;

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Name is visible
        isVisible = await libs.getCssDisplay('#modalRegionNameAdd') !== 'none';
        expect(isVisible).to.be.true;
    });

    it("Test # 541: Click on add name button and verify that dialog is displayed", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=541`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionAdd') !== 'none';
        expect(isVisible).to.be.true;

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Name is visible
        isVisible = await libs.getCssDisplay('#modalRegionNameAdd') !== 'none';
        expect(isVisible).to.be.true;

        // add a valid name
        const input = await page.$("#txtNameAddName");
        await input.focus();
        await input.type('nametest')

        const okButton = await page.$("#btnNameAddOk");
        await okButton.click()

        await libs.delay(200)
        // and verify that the name has been added to the table
        const cell = await page.$('#tblRegionAddNames >tbody >tr:nth-child(1) >td:nth-child(1)');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text !== '').to.be.true;
    });

    it("Test # 542: Add a name, select it, click delete name and verify that it gets deleted", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=542`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionAdd') !== 'none';
        expect(isVisible).to.be.true;

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Name is visible
        isVisible = await libs.getCssDisplay('#modalRegionNameAdd') !== 'none';
        expect(isVisible).to.be.true;

        // add a valid name
        const input = await page.$("#txtNameAddName");
        await input.focus();
        await input.type(libs.randomRegionName())

        const okButton = await page.$("#btnNameAddOk");
        await okButton.click()

        await libs.delay(200)
        // and verify that the name has been added to the table
        const cell = await page.$('#tblRegionAddNames >tbody >tr:nth-child(1) >td:nth-child(1)');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text !== '').to.be.true;

        // select it
        const elem = await page.$("#row1");
        await clickOnElement(elem);
        await libs.delay(1000);

        // click on delete
        const deleteButton = await page.$('#btnRegionAddNamesDelete');
        await deleteButton.click()
    });

    it("Test # 543: Add multiple names and ensure they got sorted", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=543`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionAdd') !== 'none';
        expect(isVisible).to.be.true;

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        // make sure the dialog Add Name is visible
        isVisible = await libs.getCssDisplay('#modalRegionNameAdd') !== 'none';
        expect(isVisible).to.be.true;

        // add a valid name
        const name = 'g' + libs.randomRegionName();
        let input = await page.$("#txtNameAddName");
        await input.focus();
        await input.type(name);

        let okButton = await page.$("#btnNameAddOk");
        await okButton.click();

        await libs.delay(200);
        // and verify that the name 'ggg' has been added in the middle of the table
        let cell = await page.$('#tblRegionAddNames >tbody >tr:nth-child(2) >td:nth-child(1)');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text === name).to.be.true;
    });
});

async function clickOnElement(elem, x = null, y = null) {
    const rect = await page.evaluate(el => {
        const {top, left, width, height} = el.getBoundingClientRect();
        return {top, left, width, height};
    }, elem);
    const _x = x !== null ? x : rect.width / 2;
    const _y = y !== null ? y : rect.height / 2;

    await page.mouse.click(rect.left + _x, rect.top + _y);
}
