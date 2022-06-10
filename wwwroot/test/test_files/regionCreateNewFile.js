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

describe("CLIENT: Create Database", async () => {
    it("Test # 440: Verify that dialog is displayed", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=440`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnRegionViewRegionCreateDbFile");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure the extend dialog is visible
        isVisible = await libs.getCssDisplay('#modalRegionCreateDbFile') !== 'none';
        expect(isVisible).to.be.true;

    });

    it("Test # 441: Verify that the three labels are populated correctly", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=441`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnRegionViewRegionCreateDbFile");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure the extend dialog is visible
        isVisible = await libs.getCssDisplay('#modalRegionCreateDbFile') !== 'none';
        expect(isVisible).to.be.true;

        // and text is correct
        let modal = await page.$('#lblRegionCreateDbAllocation');
        let text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('2,048 blocks');

        modal = await page.$('#lblRegionCreateDbAvailableSpace');
        text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('blocks');

        modal = await page.$('#lblRegionCreateDbNewAvailableSpace');
        text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('blocks')
    });

    it("Test # 442: Submit the form and expect a dialog", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=442`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnRegionViewRegionCreateDbFile");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(600);

        // make sure the extend dialog is visible
        isVisible = await libs.getCssDisplay('#modalRegionCreateDbFile') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnRegionCreateDbOk");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;
    });

    it("Test # 443: Submit the form and answer NO. Expect the dialog to disappear", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=443`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(650);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnRegionViewRegionCreateDbFile");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure the extend dialog is visible
        isVisible = await libs.getCssDisplay('#modalRegionCreateDbFile') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnRegionCreateDbOk");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnInputboxNo");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure inputbox is invisible
        isVisible = await libs.getCssDisplay('#modalInputbox') === 'none';
        expect(isVisible).to.be.true;
    });

    it("Test # 444: Submit the form and answer YES. Expect the dialog to close and an error dialog open with error: file already exists", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=444`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnRegionViewRegionCreateDbFile");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure the extend dialog is visible
        isVisible = await libs.getCssDisplay('#modalRegionCreateDbFile') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnRegionCreateDbOk");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnInputboxYes");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure inputbox is invisible
        isVisible = await libs.getCssDisplay('#modalInputbox') === 'none';
        expect(isVisible).to.be.true;

        modal = await page.$('#txtMsgboxText');
        text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('The database already exists');
    });
});
