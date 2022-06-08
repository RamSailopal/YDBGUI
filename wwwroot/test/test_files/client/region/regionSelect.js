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
    /*
    it("Test # 390: Verify that selecting a region it will pop up the correct dialog filled with the correct region", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=390`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure msgbox is visible
        const isVisible = await libs.getCssDisplay('#txtMsgboxText') !== 'none';
        expect(isVisible).to.be.true;

        // and text is correct
        const modal = await page.$('#txtMsgboxText');
        const text = await page.evaluate(el => el.textContent, modal);
        expect(text).to.have.string('The .gld file doesn\'t exists')
    });

     */
});

