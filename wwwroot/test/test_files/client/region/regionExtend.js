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

describe("CLIENT: Region Extend", async () => {
    it("Test # 410: Verify that the dialog is displayed", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=410`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(350);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(350);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

    });

    it("Test # 411: Verify that the top three labels are populated correctly", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=411`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(350);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnRegionViewRegionExtendDbFile");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(400);

        // make sure the extend dialog is visible
        isVisible = await libs.getCssDisplay('#modalExtend') !== 'none';
        expect(isVisible).to.be.true;

        // and text is correct
        let modal = await page.$('#lblRegionExtendCurrentSize');
        let text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('blocks')

        modal = await page.$('#lblRegionExtendAvailableSpace');
        text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('blocks')

        modal = await page.$('#lblRegionExtendBlockSize');
        text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('KiB')
    });

    it("Test # 412: Based on entered ext. size, ensure that New size and New avail. space are correct", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=412`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(350);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnRegionViewRegionExtendDbFile");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(400);

        // make sure the extend dialog is visible
        isVisible = await libs.getCssDisplay('#modalExtend') !== 'none';
        expect(isVisible).to.be.true;

        // and text is correct
        let modal = await page.$('#lblRegionExtendGrandSize');
        let text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('blocks')

        modal = await page.$('#lblRegionExtendGrandAvailableSize');
        text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('blocks')
    });

    it("Test # 413: Submit the form and expect a dialog", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=413`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(350);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnRegionViewRegionExtendDbFile");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure the extend dialog is visible
        isVisible = await libs.getCssDisplay('#modalExtend') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnRegionExtendOk");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(350);

        // make sure inputbox is invisible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;
    });

    it("Test # 414: Submit the form and answer NO. Expect the dialog to disappear", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=414`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(350);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnRegionViewRegionExtendDbFile");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(400);

        // make sure the extend dialog is visible
        isVisible = await libs.getCssDisplay('#modalExtend') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnRegionExtendOk");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(650);

        // make sure inputbox is invisible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnInputboxNo");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(650);

        // make sure inputbox is invisible
        isVisible = await libs.getCssDisplay('#modalInputbox') === 'none';
        expect(isVisible).to.be.true;

    });

    it("Test # 415: Submit the form and answer YES. Expect the dialog to disappear", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=414`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(350);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnRegionViewRegionExtendDbFile");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(400);

        // make sure the extend dialog is visible
        isVisible = await libs.getCssDisplay('#modalExtend') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnRegionExtendOk");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(650);

        // make sure inputbox is invisible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnInputboxYes");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(650);

        // make sure inputbox is invisible
        isVisible = await libs.getCssDisplay('#modalInputbox') === 'none';
        expect(isVisible).to.be.true;
    });
});


