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

describe("CLIENT: Devices", async () => {
    it("Test # 190: Confirm that the four labels are populated correctly", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=190`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(250);

        let btnClick = await page.$("#btnDashStorageView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(150);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalDeviceInfo') !== 'none';
        expect(isVisible).to.be.true;

        // lblDeviceInfoMountpoint text is populated
        let cell = await page.$('#lblDeviceInfoMountpoint');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('/');

        // lblDeviceInfoFileSystem text is populated
        cell = await page.$('#lblDeviceInfoFileSystem');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('overlay');

        // lblDeviceInfoTotalBlocks text is populated
        cell = await page.$('#lblDeviceInfoTotalBlocks');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('263,174,212');

        // lblDeviceInfoBlocksUsed text is populated
        cell = await page.$('#lblDeviceInfoBlocksUsed');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('15,591,036');

        // lblDeviceInfoBlockAvailable text is populated
        cell = await page.$('#lblDeviceInfoBlockAvailable');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('234,145,020');
    });

    it("Test # 191: Gauge when disk space is <70%", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=191`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(450);

        let btnClick = await page.$("#btnDashStorageView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(350);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalDeviceInfo') !== 'none';
        expect(isVisible).to.be.true;

        // and has the GREEN color
        const pillColor = await libs.getCssBackground('#rngDeviceInfoPercentUsed');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 192: Gauge when disk space is >70% and <90%", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=192`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(450);

        let btnClick = await page.$("#btnDashStorageView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(350);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalDeviceInfo') !== 'none';
        expect(isVisible).to.be.true;

        // and has the YELLOW color
        const pillColor = await libs.getCssBackground('#rngDeviceInfoPercentUsed');
        expect(pillColor).to.have.string('rgb(234, 184, 59)')
    });

    it("Test # 193: Gauge when disk space is >90% and <97%", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=193`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(450);

        let btnClick = await page.$("#btnDashStorageView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(350);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalDeviceInfo') !== 'none';
        expect(isVisible).to.be.true;

        // and has the RED color
        const pillColor = await libs.getCssBackground('#rngDeviceInfoPercentUsed');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 194: Gauge when disk space is >97% and <101%", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=194`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(450);

        let btnClick = await page.$("#btnDashStorageView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(350);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalDeviceInfo') !== 'none';
        expect(isVisible).to.be.true;

        // and has the RED color
        let  pillColor = await libs.getCssBackground('#rngDeviceInfoPercentUsed');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });
});
