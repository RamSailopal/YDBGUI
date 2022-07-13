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

describe("CLIENT: Edit Region: Region tab", async () => {
    it("Test # 555: Edit DEFAULT and verify that BG is checked", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=555`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        // and bg table is visible
        isVisible = await libs.getCssDisplay('#divRegionEditBg') !== 'none';
        expect(isVisible).to.be.true;
    });

    it("Test # 556: Edit DEFAULT and switch to MM: Edit button should be enabled", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=556`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        let btnClick = await page.$("#regionEditSegmentNameMm");
        await btnClick.click();

        // and Edit button is enabled
        btnClick = await page.$("#btnRegionEditOk");
        const prop = await btnClick.getProperty('disabled');
        const value = await prop.jsonValue()
        expect(value).to.be.false;
    });

    it("Test # 557: Edit YDBAIM and verify that MM is checked", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=557`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        // and bg table is visible
        isVisible = await libs.getCssDisplay('#divRegionEditMm') !== 'none';
        expect(isVisible).to.be.true;
    });

    it("Test # 558: Edit YDBAIM and switch to BG: Edit button should be enabled", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=558`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        let btnClick = await page.$("#regionEditSegmentNameBg");
        await btnClick.click();

        // and Edit button is enabled
        btnClick = await page.$("#btnRegionEditOk");
        const prop = await btnClick.getProperty('disabled');
        const value = await prop.jsonValue()
        expect(value).to.be.false;
    });

    it("Test # 559: Click Advanced parameters and verify that left table is properly populated", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=559`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        let btnClick = await page.$("#chkRegionEditAdvancedMode");
        await btnClick.click();

        let cell = await page.$('#tblRegionEditBg >tbody >tr:nth-child(5) >td:nth-child(1) ');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Async');
    });

    it("Test # 560: Click Advanced parameters and verify that right table is properly populated", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=560`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        let btnClick = await page.$("#chkRegionEditAdvancedMode");
        await btnClick.click();

        let cell = await page.$('#tblRegionEditAc >tbody >tr:nth-child(3) >td:nth-child(1) ');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Null');
    });

    it("Test # 561: Edit DEFAULT and click on the filename button. Verify that the message box appears", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=561`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        let btnClick = await page.$("#btn-Bg-filename");
        await btnClick.click();

        await libs.delay(400);
        // make sure the dialog Edit Region is visible
        isVisible = await libs.getCssDisplay('#modalMsgbox') !== 'none';
        expect(isVisible).to.be.true;
    });

    it("Test # 562: Edit YDBAIM and click on the filename button. Verify that the message box appears", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=562`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        let btnClick = await page.$("#btn-Mm-filename");
        await btnClick.click();

        await libs.delay(400);
        // make sure the dialog Edit Region is visible
        isVisible = await libs.getCssDisplay('#modalMsgbox') !== 'none';
        expect(isVisible).to.be.true;
    });
});

describe("CLIENT: Edit Region: Journal tab", async () => {
    it("Test # 570: Edit DEFAULT and verify that journal is ON", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=570`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        //switch to Journal
        let btnClick = await page.$("#navRegionEditJournal");
        await btnClick.click();

        await libs.delay(400);

        // and jo table is visible
        isVisible = await libs.getCssDisplay('#tblRegionEditJo') !== 'none';
        expect(isVisible).to.be.true;
    });

    it("Test # 571: Edit DEFAULT and switch the journal off. Verify that the table gets hidden", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=571`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        //switch to Journal
        let btnClick = await page.$("#navRegionEditJournal");
        await btnClick.click();

        await libs.delay(400);

        btnClick = await page.$("#optRegionEditJournalTypeNo");
        await btnClick.click();

        await libs.delay(400);

        // and jo table is
        isVisible = await libs.getCssDisplay('#divRegionEditJournalParams') === 'none';
        expect(isVisible).to.be.true;
    });

    it("Test # 572: Edit DEFAULT and switch the journal off. Verify that the Edit button is enabled", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=572`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        //switch to Journal
        let btnClick = await page.$("#navRegionEditJournal");
        await btnClick.click();

        await libs.delay(400);

        btnClick = await page.$("#optRegionEditJournalTypeNo");
        await btnClick.click();

        await libs.delay(400);

        // and Edit button is enabled
        btnClick = await page.$("#btnRegionEditOk");
        const prop = await btnClick.getProperty('disabled');
        const value = await prop.jsonValue()
        expect(value).to.be.false;
    });

    it("Test # 573: Edit DEFAULT and click on the filename button. Verify that the Filename dialog appears", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=573`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        //switch to Journal
        let btnClick = await page.$("#navRegionEditJournal");
        await btnClick.click();

        await libs.delay(400);

        btnClick = await page.$("#btn-Jo-jfilename");
        await btnClick.click();

        await libs.delay(400);
        // make sure the dialog Edit Region is visible
        isVisible = await libs.getCssDisplay('#modalRegionFilename') !== 'none';
        expect(isVisible).to.be.true;
    });
});

describe("CLIENT: Edit region: Names Tab", async () => {
    it("Test # 585: Edit DEFAULT, add a name TEST and verify that appears in the list as GREEN", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=585`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        //switch to Names
        let btnClick = await page.$("#navRegionEditNames");
        await btnClick.click();

        await libs.delay(500);

        //Add name
        btnClick = await page.$("#btnRegionEditNamesAdd");
        await btnClick.click();

        await libs.delay(800);

        // and jo table is visible
        isVisible = await libs.getCssDisplay('#modalRegionNameAdd') !== 'none';
        expect(isVisible).to.be.true;

        //type a new name
        await page.keyboard.type('testName');

        //and submit
        btnClick = await page.$("#btnNameAddOk");
        await btnClick.click();

        await libs.delay(600);

        // and verify that it has been added
        let cell = await page.$('#tblRegionEditNames >tbody >tr:nth-child(1) >td:nth-child(1)');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('testName');

        // and it is green
        const color = await libs.getCssColor('#tblRegionEditNames >tbody >tr:nth-child(1) >td:nth-child(1)');
        expect(color).to.have.string('rgb(100, 165, 85)');
    });

    it("Test # 586: Edit YDBOCTO, add a name %a and verify that appears in the list as first and in GREEN color", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=586`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        //switch to Names
        let btnClick = await page.$("#navRegionEditNames");
        await btnClick.click();

        await libs.delay(500);

        //Add name
        btnClick = await page.$("#btnRegionEditNamesAdd");
        await btnClick.click();

        await libs.delay(800);

        // and jo table is visible
        isVisible = await libs.getCssDisplay('#modalRegionNameAdd') !== 'none';
        expect(isVisible).to.be.true;

        //type a new name
        await page.keyboard.type('%a');

        //and submit
        btnClick = await page.$("#btnNameAddOk");
        await btnClick.click();

        await libs.delay(600);

        // and verify that it has been added
        let cell = await page.$('#tblRegionEditNames >tbody >tr:nth-child(1) >td:nth-child(1)');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('%a');

        // and it is green
        const color = await libs.getCssColor('#tblRegionEditNames >tbody >tr:nth-child(1) >td:nth-child(1)');
        expect(color).to.have.string('rgb(100, 165, 85)');
    });

    it("Test # 587: Edit YDBOCTO, add a name %b, select it and verify that delete button caption is: Delete...", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=587`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        //switch to Names
        let btnClick = await page.$("#navRegionEditNames");
        await btnClick.click();

        await libs.delay(500);

        //Add name
        btnClick = await page.$("#btnRegionEditNamesAdd");
        await btnClick.click();

        await libs.delay(800);

        // and jo table is visible
        isVisible = await libs.getCssDisplay('#modalRegionNameAdd') !== 'none';
        expect(isVisible).to.be.true;

        //type a new name
        await page.keyboard.type('%b');

        //and submit
        btnClick = await page.$("#btnNameAddOk");
        await btnClick.click();

        await libs.delay(600);

        // select it
        const elem = await page.$("#row2");
        await libs.clickOnElement(elem);
        await libs.delay(1000);


        // and verify that the delete button has the correct text
        let cell = await page.$('#btnRegionEditNamesDelete');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Delete...');
    });

    it("Test # 588: Edit YDBOCTO, select the first entry and delete it. Verify that text has the RED color", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=588`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        //switch to Names
        let btnClick = await page.$("#navRegionEditNames");
        await btnClick.click();

        await libs.delay(500);

        // select the first item
        const elem = await page.$("#row1");
        await libs.clickOnElement(elem);
        await libs.delay(500);

        //delete it
        btnClick = await page.$("#btnRegionEditNamesDelete");
        await btnClick.click();

        await libs.delay(500);

        // and it is red
        const color = await libs.getCssColor('#tblRegionEditNames >tbody >tr:nth-child(1) >td:nth-child(1)');
        expect(color).to.have.string('rgb(206, 58, 58)');
    });

    it("Test # 589: Edit YDBOCTO, select the first entry and delete it. Verify that delete button caption is: Undelete...", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=589`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        //switch to Names
        let btnClick = await page.$("#navRegionEditNames");
        await btnClick.click();

        await libs.delay(500);

        // select the first item
        let elem = await page.$("#row1");
        await libs.clickOnElement(elem);
        await libs.delay(500);

        //delete it
        btnClick = await page.$("#btnRegionEditNamesDelete");
        await btnClick.click();

        await libs.delay(500);

        // re-select the first item
        elem = await page.$("#row1");
        await libs.clickOnElement(elem);
        await libs.delay(500);

        // and verify that the delete button has the correct text
        let cell = await page.$('#btnRegionEditNamesDelete');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Undelete...');
    });

    it("Test # 590: Edit YDBOCTO, select the first entry and delete it. Click the Undelete... button and verify that text is in Purple color", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=590`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);


        // make sure the dialog Edit Region is visible
        let isVisible = await libs.getCssDisplay('#modalRegionEdit') !== 'none';
        expect(isVisible).to.be.true;

        //switch to Names
        let btnClick = await page.$("#navRegionEditNames");
        await btnClick.click();

        await libs.delay(500);

        // select the first item
        let elem = await page.$("#row1");
        await libs.clickOnElement(elem);
        await libs.delay(500);

        //delete it
        btnClick = await page.$("#btnRegionEditNamesDelete");
        await btnClick.click();

        await libs.delay(500);

        // re-select the first item
        elem = await page.$("#row1");
        await libs.clickOnElement(elem);
        await libs.delay(500);

        //undelete it
        btnClick = await page.$("#btnRegionEditNamesDelete");
        await btnClick.click();

        await libs.delay(500);

        // and it is purple
        const color = await libs.getCssColor('#tblRegionEditNames >tbody >tr:nth-child(1) >td:nth-child(1)');
        expect(color).to.have.string('rgb(59, 26, 104)');
    });
});
