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

describe("CLIENT: Region Select", async () => {
    it("Test # 430: Display dialog, scroll down twice, submit: verify that the correct dialog is open", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=430`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        await libs.delay(1000);
        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewTitle');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('YDBOCTO');


    });

    it("Test # 430: Display dialog, scroll down twice and then up, submit: verify that the correct dialog is open", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=430`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(1000);

        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('Enter');

        await libs.delay(1000);
        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;

        // check if text is correct
        const cell = await page.$('#lblRegionViewTitle');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('YDBAIM');


    });
});

