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

describe("CLIENT: System Info", async () => {
    it("Test # 150: Confirm that the three labels are populated correctly", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=150`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#menuSystemInfo");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalSystemInfo') !== 'none';
        expect(isVisible).to.be.true;

        // lblSystemInfoRoutines text is correct
        let cell = await page.$('#lblSystemInfoRoutines');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text.length > 0).to.be.true;

        // lblSystemInfoRoutines text is correct
        cell = await page.$('#lblSystemInfoGlobalDirectory');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text.length > 0).to.be.true;

        // lblSystemInfoRoutines text is correct
        cell = await page.$('#lblSystemInfoMode');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text.length > 0).to.be.true;
    });

    it("Test # 151: Verify the existence of one plugin", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=151`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#menuSystemInfo");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalSystemInfo') !== 'none';
        expect(isVisible).to.be.true;

        let cell = await page.$('#tblSystemInfoPlugins >tbody >tr >td:nth-child(1) ');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Plugin-name');

        cell = await page.$('#tblSystemInfoPlugins >tbody >tr >td:nth-child(2) ');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Plugin-description');

        cell = await page.$('#tblSystemInfoPlugins >tbody >tr >td:nth-child(3) ');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Plugin-version');

        cell = await page.$('#tblSystemInfoPlugins >tbody >tr >td:nth-child(4) ');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Plugin-vendor')
    });

    it("Test # 152: Clicking the Env Var button should open a dialog", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=152`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#menuSystemInfo");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalSystemInfo') !== 'none';
        expect(isVisible).to.be.true;

        // Click on EnvVar button
        btnClick = await page.$("#btnSystemInfoEnvironmentVariables");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        isVisible = await libs.getCssDisplay('#modalEnvVars') !== 'none';
        expect(isVisible).to.be.true;
    });

    it("Test # 170: Env Vars: confirm that the list is populate with all three categories", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=170`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#menuSystemInfo");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalSystemInfo') !== 'none';
        expect(isVisible).to.be.true;

        // Click on EnvVar button
        btnClick = await page.$("#btnSystemInfoEnvironmentVariables");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        isVisible = await libs.getCssDisplay('#modalEnvVars') !== 'none';
        expect(isVisible).to.be.true;

        // Analyze the table and ensure all is set, as default is all check boxes are SET
        let cell = await page.$('#tblEnvVars >tbody >tr:nth-child(1) >td:nth-child(1) ');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('GTM_CALLIN_START');

        cell = await page.$('#tblEnvVars >tbody >tr:nth-child(2) >td:nth-child(1) ');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('HOME');

        cell = await page.$('#tblEnvVars >tbody >tr:nth-child(27) >td:nth-child(1) ');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('ydb_callin_start');
    });

    it("Test # 171: Env Vars: Confirm that the list is populate with only system info", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=171`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#menuSystemInfo");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalSystemInfo') !== 'none';
        expect(isVisible).to.be.true;

        // Click on EnvVar button
        btnClick = await page.$("#btnSystemInfoEnvironmentVariables");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        isVisible = await libs.getCssDisplay('#modalEnvVars') !== 'none';
        expect(isVisible).to.be.true;

        // Click on the GTM and YDB check boxes to CLEAR THEM
        btnClick = await page.$("#chkEnvVarsGtm");
        await btnClick.click();
        btnClick = await page.$("#chkEnvVarsYdb");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // Analyze the table
        let cell = await page.$('#tblEnvVars >tbody >tr:nth-child(1) >td:nth-child(1) ');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('HOME');

        cell = await page.$('#tblEnvVars >tbody >tr:nth-child(2) >td:nth-child(1) ');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('HOSTNAME');

        cell = await page.$('#tblEnvVars >tbody >tr:nth-child(3) >td:nth-child(1) ');
        text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('LANG');
    });

    it("Test # 172: Env Vars: Confirm that the list is populate with only YDB data", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=172`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#menuSystemInfo");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalSystemInfo') !== 'none';
        expect(isVisible).to.be.true;

        // Click on EnvVar button
        btnClick = await page.$("#btnSystemInfoEnvironmentVariables");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        isVisible = await libs.getCssDisplay('#modalEnvVars') !== 'none';
        expect(isVisible).to.be.true;

        // Click on the GTM and YDB check boxes to CLEAR THEM
        btnClick = await page.$("#chkEnvVarsGtm");
        await btnClick.click();
        btnClick = await page.$("#chkEnvVarsSystem");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // Analyze the table
        let cell = await page.$('#tblEnvVars >tbody >tr:nth-child(1) >td:nth-child(1) ');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('ydb_callin_start');
    });

    it("Test # 173: Env Vars: Confirm that the list is populate with only GTM data", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=173`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#menuSystemInfo");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        let isVisible = await libs.getCssDisplay('#modalSystemInfo') !== 'none';
        expect(isVisible).to.be.true;

        // Click on EnvVar button
        btnClick = await page.$("#btnSystemInfoEnvironmentVariables");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        isVisible = await libs.getCssDisplay('#modalEnvVars') !== 'none';
        expect(isVisible).to.be.true;

        // Click on the System and YDB check boxes to CLEAR THEM
        btnClick = await page.$("#chkEnvVarsYdb");
        await btnClick.click();
        btnClick = await page.$("#chkEnvVarsSystem");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // Analyze the table
        let cell = await page.$('#tblEnvVars >tbody >tr:nth-child(1) >td:nth-child(1) ');
        let text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('GTM_CALLIN_START');
    });
});
