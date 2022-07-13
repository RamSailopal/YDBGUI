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

describe("CLIENT: Region Delete", async () => {
    it("Test # 400: Verify that clicking YES it will display a second dialog", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=401`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure inputbox is visible
        let isVisible = await libs.getCssDisplay('#txtInputboxText') !== 'none';
        expect(isVisible).to.be.true;

        // and text is correct
        let modal = await page.$('#txtInputboxText');
        let text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('WARNING: you are deleting the region')

        let btnClick = await page.$("#btnInputboxYes");
        await btnClick.click();

        await libs.delay(1500);

        // and text is correct
        modal = await page.$('#spanRegionDeleteConfirmHeader');
        text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('DEFAULT')

    });

    it("Test # 401: Delete a region, type in the wrong region name and verify that you can NOT submit", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=402`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure inputbox is visible
        let isVisible = await libs.getCssDisplay('#txtInputboxText') !== 'none';
        expect(isVisible).to.be.true;

        // and text is correct
        let modal = await page.$('#txtInputboxText');
        let text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('WARNING: you are deleting the region');

        let btnClick = await page.$("#btnInputboxYes");
        await btnClick.click();

        await libs.delay(1500);

        // and text is correct
        modal = await page.$('#spanRegionDeleteConfirmHeader');
        text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('DEFAULT');

        //type a new name
        await page.keyboard.type('testName');

        await libs.delay(500);

        // make sure submit button is disabled
        const el = await page.$('#btnRegionConfirmDeleteOk');
        const prop = await el.getProperty('disabled');
        const value = await prop.jsonValue();
        expect(value).to.be.true;

    });

    it("Test # 402: Delete a region, type in the correct region and verify that you can submit", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=403`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure inputbox is visible
        let isVisible = await libs.getCssDisplay('#txtInputboxText') !== 'none';
        expect(isVisible).to.be.true;

        // and text is correct
        let modal = await page.$('#txtInputboxText');
        let text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('WARNING: you are deleting the region');

        let btnClick = await page.$("#btnInputboxYes");
        await btnClick.click();

        await libs.delay(1500);

        // and text is correct
        modal = await page.$('#spanRegionDeleteConfirmHeader');
        text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('DEFAULT');

        //type a new name
        await page.keyboard.type('DEFAULT');

        await libs.delay(500);

        // make sure submit button is disabled
        const el = await page.$('#btnRegionConfirmDeleteOk');
        const prop = await el.getProperty('disabled');
        const value = await prop.jsonValue();
        expect(value).to.be.false;

    });
});

