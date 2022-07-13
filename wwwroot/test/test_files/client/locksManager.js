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

const libs = require('../../libs');
const {expect} = require("chai");

describe("LOCK MANAGER: Tree integrity", async () => {
    it("Test # 600: One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By Namespace tree, lock 1", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=600`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // get namespace el
        let elem = await page.$('#ns-TEST1_anchor');

        // check text
        let text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('TEST1');

        // doubclick
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // get region node
        elem = await page.$('#ns-TEST1-region-YDBOCTO_anchor');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('YDBOCTO');

        // expand region
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // Region field 1
        elem = await page.$('#ns-TEST1-region-YDBOCTO--estimatedFreeLockSpace_anchor');
        await libs.dblClickOnElement(elem);

        // Region field 2
        elem = await page.$('#ns-TEST1-region-YDBOCTO--processesOnQueue_anchor');
        await libs.dblClickOnElement(elem);

        // Region field 3
        elem = await page.$('#ns-TEST1-region-YDBOCTO--slotsInUse_anchor');
        await libs.dblClickOnElement(elem);

        // Region field 4
        elem = await page.$('#ns-TEST1-region-YDBOCTO--slotsBytesInUse_anchor');
        await libs.dblClickOnElement(elem);

        // get pid node
        elem = await page.$('#ns-TEST1-pid-1_anchor');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('PID: 1');

        // expand pid
        elem = await page.$('#ns-TEST1-pid-1_anchor');
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // Pid field 1
        elem = await page.$('#ns-TEST1-pid-1--userid_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 2
        elem = await page.$('#ns-TEST1-pid-1--process_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 3
        elem = await page.$('#ns-TEST1-pid-1--PPID_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 4
        elem = await page.$('#ns-TEST1-pid-1--time_anchor');
        await libs.dblClickOnElement(elem);

        // get waiters node
        elem = await page.$('#ns-TEST1-waiters_anchor');

        // expand waiters
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // 3rd waiter
        elem = await page.$('#ns-TEST1-waiter-11_anchor');
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // Pid field 1
        elem = await page.$('#ns-TEST1-waiter-11--userid_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 2
        elem = await page.$('#ns-TEST1-waiter-11--process_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 3
        elem = await page.$('#ns-TEST1-waiter-11--PPID_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 4
        elem = await page.$('#ns-TEST1-waiter-11--time_anchor');
        await libs.dblClickOnElement(elem);

        // close namespace
        elem = await page.$('#ns-TEST1_anchor');

        await libs.dblClickOnElement(elem);
    });

    it("Test # 601: One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By Namespace tree, lock 2", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=601`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // get namespace el
        elem = await page.$('#ns-TEST2_anchor');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('TEST2');

        // doubclick
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // get region node
        elem = await page.$('#ns-TEST2-region-DEFAULT_anchor');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('DEFAULT');

        // expand region
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // Region field 1
        elem = await page.$('#ns-TEST2-region-DEFAULT--estimatedFreeLockSpace_anchor');
        await libs.dblClickOnElement(elem);

        // Region field 2
        elem = await page.$('#ns-TEST2-region-DEFAULT--processesOnQueue_anchor');
        await libs.dblClickOnElement(elem);

        // Region field 3
        elem = await page.$('#ns-TEST2-region-DEFAULT--slotsInUse_anchor');
        await libs.dblClickOnElement(elem);

        // Region field 4
        elem = await page.$('#ns-TEST2-region-DEFAULT--slotsBytesInUse_anchor');
        await libs.dblClickOnElement(elem);

        // get pid node
        elem = await page.$('#ns-TEST2-pid-2_anchor');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('PID: 2');

        // expand pid
        elem = await page.$('#ns-TEST2-pid-2_anchor');
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // Pid field 1
        elem = await page.$('#ns-TEST2-pid-2--userid_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 2
        elem = await page.$('#ns-TEST2-pid-2--process_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 3
        elem = await page.$('#ns-TEST2-pid-2--PPID_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 4
        elem = await page.$('#ns-TEST2-pid-2--time_anchor');
        await libs.dblClickOnElement(elem);

        // collapse pid
        elem = await page.$('#ns-TEST2-pid-2_anchor');
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // get waiters node
        elem = await page.$('#ns-TEST2-waiters_anchor');

        // expand waiters
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // 3rd waiter
        elem = await page.$('#ns-TEST2-waiter-21_anchor');
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // Pid field 1
        elem = await page.$('#ns-TEST2-waiter-21--userid_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 2
        elem = await page.$('#ns-TEST2-waiter-21--process_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 3
        elem = await page.$('#ns-TEST2-waiter-21--PPID_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 4
        elem = await page.$('#ns-TEST2-waiter-21--time_anchor');
        await libs.dblClickOnElement(elem);

        // close namespace
        elem = await page.$('#ns-TEST2_anchor');

        await libs.dblClickOnElement(elem);
    });

    it("Test # 602: One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By Namespace tree, lock 3", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=602`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // get namespace el
        elem = await page.$('#ns-TEST3_anchor');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('TEST3');

        // doubclick
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // get region node
        elem = await page.$('#ns-TEST3-region-YDBAIM_anchor');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('YDBAIM');

        // expand region
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // Region field 1
        elem = await page.$('#ns-TEST3-region-YDBAIM--estimatedFreeLockSpace_anchor');
        await libs.dblClickOnElement(elem);

        // Region field 2
        elem = await page.$('#ns-TEST3-region-YDBAIM--processesOnQueue_anchor');
        await libs.dblClickOnElement(elem);

        // Region field 3
        elem = await page.$('#ns-TEST3-region-YDBAIM--slotsInUse_anchor');
        await libs.dblClickOnElement(elem);

        // Region field 4
        elem = await page.$('#ns-TEST3-region-YDBAIM--slotsBytesInUse_anchor');
        await libs.dblClickOnElement(elem);

        // get pid node
        elem = await page.$('#ns-TEST3-pid-3_anchor');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('PID: 3');

        // expand pid
        elem = await page.$('#ns-TEST3-pid-3_anchor');
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // Pid field 1
        elem = await page.$('#ns-TEST3-pid-3--userid_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 2
        elem = await page.$('#ns-TEST3-pid-3--process_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 3
        elem = await page.$('#ns-TEST3-pid-3--PPID_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 4
        elem = await page.$('#ns-TEST3-pid-3--time_anchor');
        await libs.dblClickOnElement(elem);

        // collapse pid
        elem = await page.$('#ns-TEST3-pid-3_anchor');
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // get waiters node
        elem = await page.$('#ns-TEST3-waiters_anchor');

        // expand waiters
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // 3rd waiter
        elem = await page.$('#ns-TEST3-waiter-31_anchor');
        await libs.dblClickOnElement(elem);
    });

    it("Test # 603: One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By Region tree, lock 1", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=603`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByRegion');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace el
        elem = await page.$('#region-YDBOCTO-ns-TEST1_anchor');

        // check text
        let text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('TEST1');

        // doubclick
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // get pid node
        elem = await page.$('#region-YDBOCTO-ns-TEST1-pid-1_anchor');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('PID: 1');

        // expand pid
        elem = await page.$('#region-YDBOCTO-ns-TEST1-pid-1_anchor');
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // Pid field 1
        elem = await page.$('#region-YDBOCTO-ns-TEST1-pid-1--userid_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 2
        elem = await page.$('#region-YDBOCTO-ns-TEST1-pid-1--process_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 3
        elem = await page.$('#region-YDBOCTO-ns-TEST1-pid-1--PPID_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 4
        elem = await page.$('#region-YDBOCTO-ns-TEST1-pid-1--time_anchor');
        await libs.dblClickOnElement(elem);
        // get waiters node
        elem = await page.$('#region-YDBOCTO-ns-TEST1-waiters_anchor');

        // expand waiters
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);
        // 3rd waiter
        elem = await page.$('#region-YDBOCTO-ns-TEST1-waiter-11_anchor');
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // Pid field 1
        elem = await page.$('#region-YDBOCTO-ns-TEST1-waiter-11--userid_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 2
        elem = await page.$('#region-YDBOCTO-ns-TEST1-waiter-11--process_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 3
        elem = await page.$('#region-YDBOCTO-ns-TEST1-waiter-11--PPID_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 4
        elem = await page.$('#region-YDBOCTO-ns-TEST1-waiter-11--time_anchor');
        await libs.dblClickOnElement(elem);

        // close namespace
        elem = await page.$('#region-YDBOCTO-ns-TEST1_anchor');

        await libs.dblClickOnElement(elem);
    });

    it("Test # 604: One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By Region tree, lock 2", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=604`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByRegion');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace el
        elem = await page.$('#region-DEFAULT-ns-TEST2_anchor');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('TEST2');

        // doubclick
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // get pid node
        elem = await page.$('#region-DEFAULT-ns-TEST2-pid-2_anchor');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('PID: 2');

        // expand pid
        elem = await page.$('#region-DEFAULT-ns-TEST2-pid-2_anchor');
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // Pid field 1
        elem = await page.$('#region-DEFAULT-ns-TEST2-pid-2--userid_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 2
        elem = await page.$('#region-DEFAULT-ns-TEST2-pid-2--process_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 3
        elem = await page.$('#region-DEFAULT-ns-TEST2-pid-2--PPID_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 4
        elem = await page.$('#region-DEFAULT-ns-TEST2-pid-2--time_anchor');
        await libs.dblClickOnElement(elem);

        // get waiters node
        elem = await page.$('#region-DEFAULT-ns-TEST2-waiters_anchor');

        // expand waiters
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // 3rd waiter
        elem = await page.$('#region-DEFAULT-ns-TEST2-waiter-21_anchor');
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // Pid field 1
        elem = await page.$('#region-DEFAULT-ns-TEST2-waiter-21--userid_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 2
        elem = await page.$('#region-DEFAULT-ns-TEST2-waiter-21--process_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 3
        elem = await page.$('#region-DEFAULT-ns-TEST2-waiter-21--PPID_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 4
        elem = await page.$('#region-DEFAULT-ns-TEST2-waiter-21--time_anchor');
        await libs.dblClickOnElement(elem);

        // close namespace
        elem = await page.$('#region-DEFAULT-ns-TEST2_anchor');

        await libs.dblClickOnElement(elem);
    });

    it("Test # 605: One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By Region tree, lock 3", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=602`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByRegion');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace el
        elem = await page.$('#region-YDBAIM-ns-TEST3_anchor');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('TEST3');

        // doubclick
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // get pid node
        elem = await page.$('#region-YDBAIM-ns-TEST3-pid-3_anchor');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('PID: 3');

        // expand pid
        elem = await page.$('#region-YDBAIM-ns-TEST3-pid-3_anchor');
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // Pid field 1
        elem = await page.$('#region-YDBAIM-ns-TEST3-pid-3--userid_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 2
        elem = await page.$('#region-YDBAIM-ns-TEST3-pid-3--process_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 3
        elem = await page.$('#region-YDBAIM-ns-TEST3-pid-3--PPID_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 4
        elem = await page.$('#region-YDBAIM-ns-TEST3-pid-3--time_anchor');
        await libs.dblClickOnElement(elem);

        // get waiters node
        elem = await page.$('#region-YDBAIM-ns-TEST3-waiters_anchor');

        // expand waiters
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // 3rd waiter
        elem = await page.$('#region-YDBAIM-ns-TEST3-waiter-31_anchor');
        await libs.dblClickOnElement(elem);
    });

    it("Test # 606: One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By PIDs tree, lock 1", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=606`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to pid tree
        let elem = await page.$('#navLocksManagerByPid');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace el
        elem = await page.$('#pid-1-ns-TEST1_anchor');

        // check text
        let text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('TEST1');

        // doubclick
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // get region node
        elem = await page.$('#pid-1-ns-TEST1-region-YDBOCTO_anchor');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('YDBOCTO');

        // expand region
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // Region field 1
        elem = await page.$('#pid-1-ns-TEST1-region-YDBOCTO--estimatedFreeLockSpace_anchor');
        await libs.dblClickOnElement(elem);

        // Region field 2
        elem = await page.$('#pid-1-ns-TEST1-region-YDBOCTO--processesOnQueue_anchor');
        await libs.dblClickOnElement(elem);

        // Region field 3
        elem = await page.$('#pid-1-ns-TEST1-region-YDBOCTO--slotsInUse_anchor');
        await libs.dblClickOnElement(elem);

        // Region field 4
        elem = await page.$('#pid-1-ns-TEST1-region-YDBOCTO--slotsBytesInUse_anchor');
        await libs.dblClickOnElement(elem);

        // get waiters node
        elem = await page.$('#pid-1-ns-TEST1-waiters_anchor');

        // expand waiters
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);
        // 3rd waiter
        elem = await page.$('#pid-1-ns-TEST1-waiter-11_anchor');
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // Pid field 1
        elem = await page.$('#pid-1-ns-TEST1-waiter-11--userid_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 2
        elem = await page.$('#pid-1-ns-TEST1-waiter-11--process_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 3
        elem = await page.$('#pid-1-ns-TEST1-waiter-11--PPID_anchor');
        await libs.dblClickOnElement(elem);

        // Pid field 4
        elem = await page.$('#pid-1-ns-TEST1-waiter-11--time_anchor');
        await libs.dblClickOnElement(elem);

        // close namespace
        elem = await page.$('#pid-1-ns-TEST1_anchor');

        await libs.dblClickOnElement(elem);
    });

    it("Test # 607: One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By PIDs tree, lock 2", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=607`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to pid tree
        let elem = await page.$('#navLocksManagerByPid');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace el
        elem = await page.$('#pid-2-ns-TEST2_anchor');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('TEST2');
        // doubclick
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // get region node
        elem = await page.$('#pid-2-ns-TEST2-region-DEFAULT_anchor');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('DEFAULT');

        // expand region
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // Region field 1
        elem = await page.$('#pid-2-ns-TEST2-region-DEFAULT--estimatedFreeLockSpace_anchor');
        await libs.dblClickOnElement(elem);

        // Region field 2
        elem = await page.$('#pid-2-ns-TEST2-region-DEFAULT--processesOnQueue_anchor');
        await libs.dblClickOnElement(elem);

        // Region field 3
        elem = await page.$('#pid-2-ns-TEST2-region-DEFAULT--slotsInUse_anchor');
        await libs.dblClickOnElement(elem);

        // Region field 4
        elem = await page.$('#pid-2-ns-TEST2-region-DEFAULT--slotsBytesInUse_anchor');
        await libs.dblClickOnElement(elem);

        // get waiters node
        elem = await page.$('#pid-2-ns-TEST2-waiters_anchor');

        // expand waiters
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);
    });

    it("Test # 608: One lock per region with different PIDs, 1, 2 and 3 waiters per lock. Test By PIDs tree, lock 3", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=608`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to Pid tree
        let elem = await page.$('#navLocksManagerByPid');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace el
        elem = await page.$('#pid-3-ns-TEST3_anchor');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('TEST3');
        // doubclick
        await libs.dblClickOnElement(elem);
    });

    it("Test # 609: Test sort on namespace", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=609`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        let elem = await page.$('.jstree-container-ul > li > a');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('ATEST1');
    });

    it("Test # 610: Test sort on region", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=610`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByRegion');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        elem = await page.$('#treeLocksManagerByRegion > .jstree-container-ul > li > a');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('AAA');
    });

    it("Test # 611: Test sort on PIDs", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=611`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByPid');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        elem = await page.$('#treeLocksManagerByProcess > .jstree-container-ul > li > a');

        // check text
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('0');
    });


    it("Test # 612: No locks at all. Test By Namespace tree", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=612`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // try to get the first element, it should error
        try {
            let elem = await page.$('#treeLocksManagerByNamespace > .jstree-container-ul > li > a');
            let text = await page.evaluate(el => el.textContent, elem);
            expect(text).to.have.string('0');
            error.throw('Generated error')
        } catch (err) {
            expect(err.message).to.have.string('Cannot read properties of null');
        }
    });

    it("Test # 613: No locks at all. Test By Regions tree", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=613`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByRegion');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // try to get the first element, it should error
        try {
            let elem = await page.$('#treeLocksManagerByRegion > .jstree-container-ul > li > a');
            let text = await page.evaluate(el => el.textContent, elem);
            expect(text).to.have.string('0');
            error.throw('Generated error')
        } catch (err) {
            expect(err.message).to.have.string('Cannot read properties of null');
        }
    });

    it("Test # 614: No locks at all. Test By PIDs tree", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=614`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByPid');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // try to get the first element, it should error
        try {
            let elem = await page.$('#treeLocksManagerByProcess > .jstree-container-ul > li > a');
            let text = await page.evaluate(el => el.textContent, elem);
            error.throw('Generated error')
        } catch (err) {
            expect(err.message).to.have.string('Cannot read properties of null');
        }
    });
});

describe("LOCK MANAGER: Submit messages => Clear lock", async () => {
    it("Test # 615: Test By Namespace tree, select namespace, click on Clear Lock", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=615`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // get namespace el
        let elem = await page.$('#ns-TEST1_anchor');

        // check text
        let text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('TEST1');

        // select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Clear button
        elem = await page.$('#btnLocksManagerClear');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to clear the lock on: TEST1');
    });

    it("Test # 616: Test By Namespace tree, select region, click on Clear Lock", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=616`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // get namespace el
        let elem = await page.$('#ns-TEST1_anchor');

        // doubclick
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // get region node
        elem = await page.$('#ns-TEST1-region-YDBOCTO_anchor');

        // select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Clear button
        elem = await page.$('#btnLocksManagerClear');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to clear the lock on: TEST1');
    });

    it("Test # 617: Test By Namespace tree, select PID, click on Clear Lock", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=617`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // get namespace el
        let elem = await page.$('#ns-TEST1_anchor');

        // doubclick
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // get pid node
        elem = await page.$('#ns-TEST1-pid-1_anchor');

        // select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Clear button
        elem = await page.$('#btnLocksManagerClear');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to clear the lock on: TEST1');
    });

    it("Test # 618: Test By Namespace tree, select first waiter, click on Clear Lock", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=618`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // get namespace el
        let elem = await page.$('#ns-TEST1_anchor');

        // doubclick
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // get waiters node
        elem = await page.$('#ns-TEST1-waiters_anchor');

        // expand waiters
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // 3rd waiter
        elem = await page.$('#ns-TEST1-waiter-11_anchor');
        await libs.clickOnElement(elem);

        await libs.delay(1000);

        // and click the Clear button
        elem = await page.$('#btnLocksManagerClear');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to clear the lock on: TEST1');
    });

    it("Test # 619: Test By Region tree, select region, click on Clear Lock", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=619`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByRegion');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get region node
        elem = await page.$('#region-DEFAULT_anchor');

        // select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Clear button
        elem = await page.$('#btnLocksManagerClear');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is invisible
        isVisible = await libs.getCssDisplay('#modalInputbox') === 'none';
        expect(isVisible).to.be.true;
    });

    it("Test # 620: Test By Region tree, select namespace, click on Clear Lock", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=620`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByRegion');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace node
        elem = await page.$('#region-DEFAULT-ns-TEST2_anchor');

        // select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Clear button
        elem = await page.$('#btnLocksManagerClear');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to clear the lock on: TEST2');
    });

    it("Test # 621: Test By Region tree, select pid, click on Clear Lock", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=621`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByRegion');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace node
        elem = await page.$('#region-DEFAULT-ns-TEST2_anchor');

        // expand it
        await libs.dblClickOnElement(elem);

        await libs.delay(500);

        // get pid node
        elem = await page.$('#region-DEFAULT-ns-TEST2-pid-2_anchor');

        // select it
        await libs.clickOnElement(elem);

        // and click the Clear button
        elem = await page.$('#btnLocksManagerClear');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to clear the lock on: TEST2');
    });

    it("Test # 622: Test By Region tree, select first waiter, click on Clear Lock", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=622`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByRegion');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace node
        elem = await page.$('#region-DEFAULT-ns-TEST2_anchor');

        // expand it
        await libs.dblClickOnElement(elem);

        await libs.delay(500);

        // get waiters node
        elem = await page.$('#region-DEFAULT-ns-TEST2-waiters_anchor');

        // select it
        await libs.dblClickOnElement(elem);

        await libs.delay(500);

        // get waiter node
        elem = await page.$('#region-DEFAULT-ns-TEST2-waiter-21_anchor');

        // select it
        await libs.clickOnElement(elem);

        // and click the Clear button
        elem = await page.$('#btnLocksManagerClear');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to clear the lock on: TEST2');
    });

    it("Test # 623: Test By Pids tree, select pid, click on Clear Lock", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=623`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByPid');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace el
        elem = await page.$('#pid-1_anchor');

        // check text
        let text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('1');

        // select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Clear button
        elem = await page.$('#btnLocksManagerClear');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is invisible
        isVisible = await libs.getCssDisplay('#modalInputbox') === 'none';
        expect(isVisible).to.be.true;

    });

    it("Test # 624: Test By Pids tree, select namespace, click on Clear Lock", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=624`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByPid');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace el
        elem = await page.$('#pid-1-ns-TEST1_anchor');

        // check text
        let text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('TEST1');

        // select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Clear button
        elem = await page.$('#btnLocksManagerClear');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to clear the lock on: TEST1');
    });

    it("Test # 625: Test By Pids tree, select region, click on Clear Lock", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=625`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByPid');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace el
        elem = await page.$('#pid-1-ns-TEST1_anchor');

        // check text
        let text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('TEST1');

        // expand it
        await libs.dblClickOnElement(elem);

        await libs.delay(500);

        // get region el
        elem = await page.$('#pid-1-ns-TEST1-region-YDBOCTO_anchor');

        // and select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Clear button
        elem = await page.$('#btnLocksManagerClear');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to clear the lock on: TEST1');
    });

    it("Test # 626: Test By Pids tree, select first waiter, click on Clear Lock", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=626`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByPid');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace el
        elem = await page.$('#pid-1-ns-TEST1_anchor');

        // check text
        let text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('TEST1');

        // expand it
        await libs.dblClickOnElement(elem);

        await libs.delay(500);

        // get waiter el
        elem = await page.$('#pid-1-ns-TEST1-waiters_anchor');

        // and expand it
        await libs.dblClickOnElement(elem);

        // get first waiter el
        elem = await page.$('#pid-1-ns-TEST1-waiter-11_anchor');

        // and select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Clear button
        elem = await page.$('#btnLocksManagerClear');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to clear the lock on: TEST1');
    });

});

describe("LOCK MANAGER: Submit messages => Terminate process", async () => {
    it("Test # 627: Test By Namespace tree, select namespace, click on Terminate process", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=627`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // get namespace el
        let elem = await page.$('#ns-TEST1_anchor');

        // check text
        let text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('TEST1');

        // select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Terminate Process button
        elem = await page.$('#btnLocksManagerTerminateProcess');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to terminate process: 1 belonging to lock:TEST1');
    });

    it("Test # 628: Test By Namespace tree, select region, click on Terminate process", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=628`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // get namespace el
        let elem = await page.$('#ns-TEST1_anchor');

        // doubclick
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // get region node
        elem = await page.$('#ns-TEST1-region-YDBOCTO_anchor');

        // select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Terminate Process button
        elem = await page.$('#btnLocksManagerTerminateProcess');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to terminate process: 1 belonging to lock:TEST1');
    });

    it("Test # 629: Test By Namespace tree, select PID, click on Terminate process", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=629`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // get namespace el
        let elem = await page.$('#ns-TEST1_anchor');

        // doubclick
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // get pid node
        elem = await page.$('#ns-TEST1-pid-1_anchor');

        // select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Terminate Process button
        elem = await page.$('#btnLocksManagerTerminateProcess');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to terminate process: 1 belonging to lock:TEST1');
    });

    it("Test # 630: Test By Namespace tree, select first waiter, click on Terminate process", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=630`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // get namespace el
        let elem = await page.$('#ns-TEST1_anchor');

        // doubclick
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // get waiters node
        elem = await page.$('#ns-TEST1-waiters_anchor');

        // expand waiters
        await libs.dblClickOnElement(elem);

        await libs.delay(1000);

        // 3rd waiter
        elem = await page.$('#ns-TEST1-waiter-11_anchor');
        await libs.clickOnElement(elem);

        await libs.delay(1000);

        // and click the Terminate Process button
        elem = await page.$('#btnLocksManagerTerminateProcess');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to terminate process: 11 belonging to a waiter for lock:TEST1');
    });

    it("Test # 631: Test By Region tree, select region, click on Terminate process", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=631`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByRegion');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get region node
        elem = await page.$('#region-DEFAULT_anchor');

        // select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Terminate Process button
        elem = await page.$('#btnLocksManagerTerminateProcess');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is invisible
        isVisible = await libs.getCssDisplay('#modalInputbox') === 'none';
        expect(isVisible).to.be.true;
    });

    it("Test # 632: Test By Region tree, select namespace, click on Terminate process", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=632`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByRegion');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace node
        elem = await page.$('#region-DEFAULT-ns-TEST2_anchor');

        // select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Terminate Process button
        elem = await page.$('#btnLocksManagerTerminateProcess');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to terminate process: 2 belonging to lock:TEST2');
    });

    it("Test # 633: Test By Region tree, select pid, click on Terminate process", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=633`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByRegion');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace node
        elem = await page.$('#region-DEFAULT-ns-TEST2_anchor');

        // expand it
        await libs.dblClickOnElement(elem);

        await libs.delay(500);

        // get pid node
        elem = await page.$('#region-DEFAULT-ns-TEST2-pid-2_anchor');

        // select it
        await libs.clickOnElement(elem);

        // and click the Terminate Process button
        elem = await page.$('#btnLocksManagerTerminateProcess');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to terminate process: 2 belonging to lock:TEST2');
    });

    it("Test # 634: Test By Region tree, select first waiter, click on Terminate process", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=634`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByRegion');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace node
        elem = await page.$('#region-DEFAULT-ns-TEST2_anchor');

        // expand it
        await libs.dblClickOnElement(elem);

        await libs.delay(500);

        // get waiters node
        elem = await page.$('#region-DEFAULT-ns-TEST2-waiters_anchor');

        // select it
        await libs.dblClickOnElement(elem);

        await libs.delay(500);

        // get waiter node
        elem = await page.$('#region-DEFAULT-ns-TEST2-waiter-21_anchor');

        // select it
        await libs.clickOnElement(elem);

        // and click the Terminate Process button
        elem = await page.$('#btnLocksManagerTerminateProcess');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('ou are going to terminate process: 21 belonging to a waiter for lock:TEST2');
    });

    it("Test # 635: Test By Pids tree, select pid, click on Terminate process", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=635`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByPid');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace el
        elem = await page.$('#pid-1_anchor');

        // check text
        let text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('1');

        // select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Terminate Process button
        elem = await page.$('#btnLocksManagerTerminateProcess');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to terminate process: 1Do you want to proceed ?');
    });

    it("Test # 636: TestTest By Pids tree, select namespace, click on Terminate process", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=636`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByPid');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace el
        elem = await page.$('#pid-1-ns-TEST1_anchor');

        // check text
        let text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('TEST1');

        // select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Terminate Process button
        elem = await page.$('#btnLocksManagerTerminateProcess');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to terminate process: 1 belonging to lock:TEST1');
    });

    it("Test # 637: Test By Pids tree, select region, click on Terminate process", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=637`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to region tree
        let elem = await page.$('#navLocksManagerByPid');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace el
        elem = await page.$('#pid-1-ns-TEST1_anchor');

        // check text
        let text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('TEST1');

        // expand it
        await libs.dblClickOnElement(elem);

        await libs.delay(500);

        // get region el
        elem = await page.$('#pid-1-ns-TEST1-region-YDBOCTO_anchor');

        // and select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Terminate Process button
        elem = await page.$('#btnLocksManagerTerminateProcess');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to terminate process: 1 belonging to lock:TEST1');
    });

    it("Test # 638: Test By Pids tree, select first waiter, click on Terminate process", async () => {
        await page.goto(`http://localhost:${MDevPort}//index.html?test=638`, {
            waitUntil: "domcontentloaded"
        });

        // wait for dashboard to be set by the async call
        await libs.delay(1000);

        // switch to pid tree
        let elem = await page.$('#navLocksManagerByPid');
        await libs.clickOnElement(elem);

        await libs.delay(300)

        // get namespace el
        elem = await page.$('#pid-1-ns-TEST1_anchor');

        // check text
        let text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('TEST1');

        // expand it
        await libs.dblClickOnElement(elem);

        await libs.delay(500);

        // get waiter el
        elem = await page.$('#pid-1-ns-TEST1-waiters_anchor');

        // and expand it
        await libs.dblClickOnElement(elem);

        await libs.delay(500);

        // get first waiter el
        elem = await page.$('#pid-1-ns-TEST1-waiter-11_anchor');

        // and select it
        await libs.clickOnElement(elem);

        await libs.delay(500);

        // and click the Terminate Process button
        elem = await page.$('#btnLocksManagerTerminateProcess');
        await libs.clickOnElement(elem);

        await libs.delay(650);

        // make sure inputbox is visible
        isVisible = await libs.getCssDisplay('#modalInputbox') !== 'none';
        expect(isVisible).to.be.true;

        // validate the text
        elem = await page.$('#txtInputboxText');
        text = await page.evaluate(el => el.textContent, elem);
        expect(text).to.have.string('You are going to terminate process: 11 belonging to a waiter for lock:TEST1');
    });
});
