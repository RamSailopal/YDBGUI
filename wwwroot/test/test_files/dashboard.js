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

describe("CLIENT: Dashboard: gld file", async () => {
    it("Test # 30: When gld file is missing", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=30`, {
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
        console.log(text)
        expect(text).to.have.string('The .gld file doesn\'t exists')
    });
});

describe("CLIENT: Dashboard: Regions list: Database", async () => {
    it("Test # 40: when region[0] file is replicated (asterisk)", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=40`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        // and text is correct
        const cell = await page.$('#txtDashboardRegionTableFilename0');
        const text = await page.evaluate(el => el.textContent, cell);
        const hasAsterisk = text.indexOf('*') > -1;
        expect(hasAsterisk).to.be.true;
    });

    it("Test # 41: when region[0] has a valid file", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=41`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        // check if text is correct
        const cell = await page.$('#txtDashboardRegionTableFilename0');
        const text = await page.evaluate(el => el.textContent, cell);
        const exists = text.length > 0;
        expect(exists).to.be.true;

        // and pill has the GREEN color
        const pillColor = await libs.getCssBackground('#pillDashboardRegionTableDb0');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 42: when region[0] has a file missing + no auto db", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=42`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(350);

        // check if text is correct
        const cell = await page.$('#pillDashboardRegionTableDb0');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Critical');

        // and pill has the RED color
        const pillColor = await libs.getCssBackground('#pillDashboardRegionTableDb0');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 43: when region[0] has a file missing + auto db", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=43`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // check if text is correct
        const cell = await page.$('#pillDashboardRegionTableDb0');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('AutoDB, No File');

        // and pill has the YELLOW color
        const pillColor = await libs.getCssBackground('#pillDashboardRegionTableDb0');
        expect(pillColor).to.have.string('rgb(234, 184, 59)')
    });

    it("Test # 44: when region[0] has a file ok but shmem is bad", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=44`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // check if text is correct
        const cell = await page.$('#pillDashboardRegionTableDb0');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Critical');

        // and pill has the RED color
        const pillColor = await libs.getCssBackground('#pillDashboardRegionTableDb0');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });
});

describe("CLIENT: Dashboard: Regions list: Journal", async () => {
    it("Test # 50: when journal file is disabled AND repl off", async () => {
        await page.goto(`http://localhost:${MDevPort}/index.html?test=50`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        // and text is correct
        const cell = await page.$('#bdgSplashRegionsJournal0');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Disabled');

        // and pill has the GRAY color
        const pillColor = await libs.getCssBackground('#bdgSplashRegionsJournal0');
        expect(pillColor).to.have.string('rgb(243, 243, 243)')
    });

    it("Test # 51: when journal file is enabled but off AND repl off", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=51`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // and text is correct
        const cell = await page.$('#bdgSplashRegionsJournal0');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Enabled/Off');

        // and pill has the YELLOW color
        const pillColor = await libs.getCssBackground('#bdgSplashRegionsJournal0');
        expect(pillColor).to.have.string('rgb(234, 184, 59)')
    });

    it("Test # 52: when journal file is enabled and on (before) AND repl off", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=52`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // and text is correct
        const cell = await page.$('#bdgSplashRegionsJournal0');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Before');

        // and pill has the GREEN color
        const pillColor = await libs.getCssBackground('#bdgSplashRegionsJournal0');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 53: when journal file is enabled and on (nobefore) AND repl off", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=53`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // and text is correct
        const cell = await page.$('#bdgSplashRegionsJournal0');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Nobefore');

        // and pill has the GREEN color
        const pillColor = await libs.getCssBackground('#bdgSplashRegionsJournal0');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 54: when journal file is enabled and in WasOn status", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=54`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // and text is correct
        const cell = await page.$('#bdgSplashRegionsJournal0');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('WAS ON');

        // and pill has the RED color
        const pillColor = await libs.getCssBackground('#bdgSplashRegionsJournal0');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 55: when journal file is enabled but off AND repl on AND 0 users", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=55`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // and text is correct
        const cell = await page.$('#bdgSplashRegionsJournal0');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Enabled/Off');

        // and pill has the YELLOW color
        const pillColor = await libs.getCssBackground('#bdgSplashRegionsJournal0');
        expect(pillColor).to.have.string('rgb(234, 184, 59)')
    });

    it("Test # 56: when journal file is enabled and on (before) AND repl on AND 0 users", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=56`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // and text is correct
        const cell = await page.$('#bdgSplashRegionsJournal0');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Before');

        // and pill has the GREEN color
        const pillColor = await libs.getCssBackground('#bdgSplashRegionsJournal0');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 57: when journal file is enabled and on (nobefore) AND repl on AND 0 users", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=57`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // and text is correct
        const cell = await page.$('#bdgSplashRegionsJournal0');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Nobefore');

        // and pill has the GREEN color
        const pillColor = await libs.getCssBackground('#bdgSplashRegionsJournal0');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 58: when journal file is disabled AND repl on AND 0 users", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=58`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // and text is correct
        const cell = await page.$('#bdgSplashRegionsJournal0');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Disabled');

        // and pill has the GRAY color
        const pillColor = await libs.getCssBackground('#bdgSplashRegionsJournal0');
        expect(pillColor).to.have.string('rgb(243, 243, 243)')
    });

    it("Test # 59: when journal file is disabled AND repl on AND >0 users", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=59`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // and text is correct
        const cell = await page.$('#bdgSplashRegionsJournal0');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Critical');

        // and pill has the RED color
        const pillColor = await libs.getCssBackground('#bdgSplashRegionsJournal0');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 60: when journal file is enabled but off AND repl on AND >0 users", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=60`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // and text is correct
        const cell = await page.$('#bdgSplashRegionsJournal0');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Critical');

        // and pill has the RED color
        const pillColor = await libs.getCssBackground('#bdgSplashRegionsJournal0');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 61: when journal file is enabled and on (before) AND repl on AND >0 users", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=61`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // and text is correct
        const cell = await page.$('#bdgSplashRegionsJournal0');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Before');

        // and pill has the GREEN color
        const pillColor = await libs.getCssBackground('#bdgSplashRegionsJournal0');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 62: when journal file is enabled and on (nobefore) AND repl on AND >0 users", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=62`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // and text is correct
        const cell = await page.$('#bdgSplashRegionsJournal0');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Nobefore');

        // and pill has the GREEN color
        const pillColor = await libs.getCssBackground('#bdgSplashRegionsJournal0');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

});

describe("CLIENT: Dashboard: Regions list: Devices", async () => {
    it("Test # 70: When disk space is <70%", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=70`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // pill has the GREEN color
        const pillColor = await libs.getCssBackground('#pgsDashStorageUsage0');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 71: When disk space is >70% and <90%", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=71`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // pill has the YELLOW color
        const pillColor = await libs.getCssBackground('#pgsDashStorageUsage0');
        expect(pillColor).to.have.string('rgb(234, 184, 59)')
    });

    it("Test # 72: When disk space is >90% and <97%", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=72`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // pill has the RED color
        const pillColor = await libs.getCssBackground('#pgsDashStorageUsage0');
        expect(pillColor).to.have.string('rgb(206, 58, 58)')
    });

    it("Test # 73: When disk space is >97% and <101%", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=73`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(300);

        // pill has the RED color
        let pillColor = await libs.getCssBackground('#pgsDashStorageUsage0');
        expect(pillColor).to.have.string('rgb(206, 58, 58)');

        // and flashing
        await libs.delay(1000);
        pillColor = await libs.getCssBackground('#pgsDashStorageUsage0');
        expect(pillColor).to.have.string('rgb(243, 243, 243)')
    });
});


describe("CLIENT: Dashboard: Global status", async () => {
    it("Test # 100: When all dbs are ok", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=100`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(750);

        // text is correct
        const cell = await page.$('#lblDashStatusDatabases');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Healthy');

        // and pill has the GREEN color
        let pillColor = await libs.getCssBackground('#lblDashStatusDatabases');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 101: When a few db's have issues", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=101`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        // text is correct
        const cell = await page.$('#lblDashStatusDatabases');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Issues');

        // and pill has the YELLOW color
        let pillColor = await libs.getCssBackground('#lblDashStatusDatabases');
        expect(pillColor).to.have.string('rgb(234, 184, 59)')
    });

    it("Test # 102: When ALL dbs have issues", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=102`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(750);

        // text is correct
        const cell = await page.$('#lblDashStatusDatabases');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Critical');

        /*
        // pill has the RED color
        await libs.delay(300);
        let pillColor = await libs.getCssBackground('#lblDashStatusDatabases');
        expect(pillColor).to.have.string('rgb(206, 58, 58)');

        // and flashing
        await libs.delay(500);
        pillColor = await libs.getCssBackground('#lblDashStatusDatabases');
        expect(pillColor).to.have.string('rgb(243, 243, 243)')

         */
    });

    it("Test # 103: When all journals are ok", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=103`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        // text is correct
        const cell = await page.$('#lblDashStatusJournals');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Healthy');

        // and pill has the GREEN color
        let pillColor = await libs.getCssBackground('#lblDashStatusJournals');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 104: When some journals have issues", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=104`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        // text is correct
        const cell = await page.$('#lblDashStatusJournals');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Issues');

        // and pill has the YELLOW color
        let pillColor = await libs.getCssBackground('#lblDashStatusJournals');
        expect(pillColor).to.have.string('rgb(234, 184, 59)')
    });

    it("Test # 105: When all journals have issues", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=105`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        // text is correct
        const cell = await page.$('#lblDashStatusJournals');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Issues');

        // and pill has the YELLOW color
        let pillColor = await libs.getCssBackground('#lblDashStatusJournals');
        expect(pillColor).to.have.string('rgb(234, 184, 59)')
    });

    it("Test # 106: When at least one journal has the wasOn status set", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=106`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(750);

        // text is correct
        const cell = await page.$('#lblDashStatusJournals');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Critical');

        /*
        // pill has the RED color
        await libs.delay(300);
        let pillColor = await libs.getCssBackground('#lblDashStatusJournals');
        expect(pillColor).to.have.string('rgb(206, 58, 58)');

        // and flashing
        await libs.delay(500);
        pillColor = await libs.getCssBackground('#lblDashStatusJournals');
        expect(pillColor).to.have.string('rgb(243, 243, 243)')

         */
    });

    it("Test # 107: When no region has replication turned on", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=107`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        // text is correct
        const cell = await page.$('#lblDashStatusReplication');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Disabled');

        // and pill has the GRAY color
        let pillColor = await libs.getCssBackground('#lblDashStatusReplication');
        expect(pillColor).to.have.string('rgb(243, 243, 243)')
    });

    it("Test # 108: When no region has replication turned on", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=108`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        // text is correct
        const cell = await page.$('#lblDashStatusReplication');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Enabled');

        // and pill has the GREEN color
        let pillColor = await libs.getCssBackground('#lblDashStatusReplication');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 109: When at least one journal has the wasOn status set", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=109`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(750);

        // text is correct
        const cell = await page.$('#lblDashStatusReplication');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Critical');

        /*
        // pill has the RED color
        await libs.delay(300);
        let pillColor = await libs.getCssBackground('#lblDashStatusReplication');
        expect(pillColor).to.have.string('rgb(206, 58, 58)');

        // and flashing
        await libs.delay(500);
        pillColor = await libs.getCssBackground('#lblDashStatusReplication');
        expect(pillColor).to.have.string('rgb(243, 243, 243)')

         */
    });
});

describe("CLIENT: Dashboard: Events", async () => {
    it("Test # 120: Clicking the region list[0] icon", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=120`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashRegionView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalRegionView') !== 'none';
        expect(isVisible).to.be.true;
    });

    it("Test # 121: Refreshing the Dashboard", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=121`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#menuDashboard");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // text is correct
        const cell = await page.$('#lblDashStatusDatabases');
        const text = await page.evaluate(el => el.textContent, cell);
        expect(text).to.have.string('Healthy');

        // and pill has the correct color
        let pillColor = await libs.getCssBackground('#lblDashStatusDatabases');
        expect(pillColor).to.have.string('rgb(100, 165, 85)')
    });

    it("Test # 122: Clicking the System info menu item", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=122`, {
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

    });

    it("Test # 123: Clicking the devices[0] icon", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=123`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        let btnClick = await page.$("#btnDashStorageView0");
        await btnClick.click();

        // wait for dialog to be set by the async call
        await libs.delay(500);

        // make sure dialog is visible
        const isVisible = await libs.getCssDisplay('#modalDeviceInfo') !== 'none';
        expect(isVisible).to.be.true;

    });
});

describe("CLIENT: Dashboard: PULLDOWN MENUS", async () => {
    it("Test # 200: Make at least one region with no file AND autodb = true and verify that create db menu is enabled", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=200`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        // make sure menu entry has orange color
        const menuColor = await libs.getCssColor('#menuSystemAdministrationRegionCreateDatabase');
        expect(menuColor).to.have.string('rgb(255, 127, 39)')
    });

    it("Test # 201: Remove all journals from all regions (state = 0) and verify that journaling on/off is disabled", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=201`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        // make sure menu entry has gray color
        const menuColor = await libs.getCssColor('#menuSystemAdministrationRegionJournaling');
        expect(menuColor).to.have.string('rgb(170, 170, 170)')
    });

    it("Test # 202: If all no regions have a file, extend menu is disabled", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=202`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(500);

        // make sure menu entry has gray color
        const menuColor = await libs.getCssColor('#menuSystemAdministrationRegionExtendDatabaseLi');
        expect(menuColor).to.have.string('rgb(170, 170, 170)')
    });
});
