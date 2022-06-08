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
    it("Test # 400: Verify that clicking NO it will abort the procedure", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=400`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(700);

        // make sure inputbox is visible
        let isVisible = await libs.getCssDisplay('#txtInputboxText') !== 'none';
        expect(isVisible).to.be.true;

        // and text is correct
        const modal = await page.$('#txtInputboxText');
        const text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('WARNING: you are deleting the region')

        let btnClick = await page.$("#btnInputboxNo");
        await btnClick.click();

        await libs.delay(500);

        // make sure inputbox is invisible
        isVisible = await libs.getCssDisplay('#modalInputbox') === 'none';
        expect(isVisible).to.be.true;

    });

    it("Test # 401: Verify that clicking YES it will display a second dialog", async () => {
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
        modal = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('THIS OPERATION CAN NOT BE UNDONE')

    });

    it("Test # 402: Verify that clicking YES in the second dialog the delete procedure starts", async () => {
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
        modal = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('THIS OPERATION CAN NOT BE UNDONE');

        btnClick = await page.$("#btnInputboxYes");
        await btnClick.click();

        await libs.delay(1500);

        // make sure inputbox is invisible
        isVisible = await libs.getCssDisplay('#modalInputbox') === 'none';
        expect(isVisible).to.be.true;

    });

    it("Test # 403: Verify that clicking NO in the second dialog it will abort the procedure", async () => {
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
        modal = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('THIS OPERATION CAN NOT BE UNDONE');

        btnClick = await page.$("#btnInputboxYes");
        await btnClick.click();

        await libs.delay(1500);

        // make sure inputbox is invisible
        isVisible = await libs.getCssDisplay('#modalInputbox') === 'none';
        expect(isVisible).to.be.true;
    });
});

