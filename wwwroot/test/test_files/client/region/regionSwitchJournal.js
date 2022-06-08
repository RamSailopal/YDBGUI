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

describe("CLIENT: Switch Journal dialog", async () => {
    it("Test # 450: Verify that the dialog is displayed and with the text 'OFF'", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=450`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure the extend dialog is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // and contains the OFF
        modal = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('OFF');
    });

    it("Test # 451: Submit the form and answer NO. Expect the dialog to close", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=451`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure the extend dialog is visible
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

    it("Test # 452: Submit the form and answer YES. Expect the dialog to close", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=452`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure the extend dialog is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        btnClick = await page.$("#btnInputboxYes");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure inputbox is invisible
        isVisible = await libs.getCssDisplay('#modalInputbox') === 'none';
        expect(isVisible).to.be.true;

    });
});
