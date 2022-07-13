/****************************************************************
 *                                                              *
 * Copyright (c) 2022 YottaDB LLC and/or its subsidiaries.      *
 * All rights reserved.                                         *
 *                                                              *
 * This source code contains the intellectual property          *
 * of its copyright holder(s), and is made available            *
 * under a license.  If you do not know the terms of            *
 * the license, please stop and do not read further.            *
 *                                                              *
 ****************************************************************/

const getSystemData = (state = true) => {
    const testData = testLoadData();
    return new Promise(function (resolve, reject) {
        if (state === false) {
            reject(

            )
        } else {
            // return success data
            resolve(
                testData
            )
        }
    })
};

const testLoadData = () => {
    let mockData = testMock;

    let testNumber = parseInt(window.location.search.split('=')[1]);

    console.log('Test: ' + testNumber);
    switch (testNumber) {

        // gld file
        case 30: {
            mockData.data.gld.exist = false;
            break;
        }
        case 31: {
            mockData.data.gld.exist = true;
            mockData.data.gld.valid = false;
            break;
        }

        // REGION LIST: Db file
        case 35: {
            mockData.data.regions.DEFAULT.replication.flags.status = 1;
            break;
        }
        case 36: {
            mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": "/data/r1.34_x86_64/g/yottadb.dat"};
            break;
        }
        case 37: {
            mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
            mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
            mockData.data.regions.DEFAULT.dbFile.data[2] = {"AUTO_DB": false};
            break;
        }
        case 38: {
            mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
            mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
            mockData.data.regions.DEFAULT.dbFile.data[2] = {"AUTO_DB": true};
            break;
        }
        case 39: {
            mockData.data.regions.DEFAULT.dbFile.flags.shmenHealthy = false;
            break;
        }
        case 40: {
            mockData.data.regions.DEFAULT.dbFile.flags.device = 'overlay 263174212 32597508 10000 14% /';
            // 80K 8   45K 5  15K  2
            break;
        }
        case 41: {
            mockData.data.regions.DEFAULT.dbFile.flags.device = 'overlay 263174212 32597508 45000 14% /';
            break;
        }
        case 42: {
            mockData.data.regions.DEFAULT.dbFile.flags.device = 'overlay 263174212 32597508 320000 14% /';
            break;
        }
        case 43: {
            mockData.data.regions.DEFAULT.dbFile.data[7] = {'EXTENSION_COUNT': 0};
            mockData.data.regions.DEFAULT.dbFile.flags.device = 'overlay 263174212 32597508 1000 14% /';
            break;
        }
        case 44: {
            mockData.data.regions.DEFAULT.dbFile.data[7] = {'EXTENSION_COUNT': 0};
            mockData.data.regions.DEFAULT.dbFile.flags.device = 'overlay 263174212 32597508 2000 14% /';
            break;
        }
        case 45: {
            mockData.data.regions.DEFAULT.dbFile.data[7] = {'EXTENSION_COUNT': 0};
            mockData.data.regions.DEFAULT.dbFile.flags.device = 'overlay 263174212 32597508 12000 14% /';
            break;
        }
        case 46: {
            mockData.data.regions.DEFAULT.dbFile.flags.freeze = 1;
            break;
        }

        // REGION LIST: Journal file
        case 50: {
            mockData.data.regions.DEFAULT.journal.flags.state = 0;
            break;
        }
        case 51: {
            mockData.data.regions.DEFAULT.journal.flags.state = 1;
            break;
        }
        case 52: {
            mockData.data.regions.DEFAULT.journal.flags.state = 2;
            mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: true};
            break;
        }
        case 53: {
            mockData.data.regions.DEFAULT.journal.flags.state = 2;
            mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: false};
            break;
        }
        case 54: {
            mockData.data.regions.DEFAULT.journal.flags.state = 2;
            mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: true};
            mockData.data.regions.DEFAULT.replication.flags.status = 2;
            break;
        }
        case 55: {
            mockData.data.regions.DEFAULT.journal.flags.state = 1;
            mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: true};
            mockData.data.regions.DEFAULT.replication.flags.status = 1;
            break;
        }
        case 56: {
            mockData.data.regions.DEFAULT.journal.flags.state = 2;
            mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: true};
            mockData.data.regions.DEFAULT.replication.flags.status = 1;
            break;
        }
        case 57: {
            mockData.data.regions.DEFAULT.journal.flags.state = 2;
            mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: false};
            mockData.data.regions.DEFAULT.replication.flags.status = 1;
            break;
        }
        case 58: {
            mockData.data.regions.DEFAULT.journal.flags.state = 0;
            mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: false};
            mockData.data.regions.DEFAULT.dbFile.flags.status = 1;
            break;
        }
        case 59: {
            mockData.data.regions.DEFAULT.journal.flags.state = 0;
            mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: false};
            mockData.data.regions.DEFAULT.replication.flags.status = 1;
            mockData.data.regions.DEFAULT.dbFile.flags.sessions = 1;
            break;
        }

        case 60: {
            mockData.data.regions.DEFAULT.journal.flags.state = 1;
            mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: false};
            mockData.data.regions.DEFAULT.replication.flags.status = 1;
            mockData.data.regions.DEFAULT.dbFile.flags.sessions = 1;
            break;
        }
        case 61: {
            mockData.data.regions.DEFAULT.journal.flags.state = 2;
            mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: true};
            mockData.data.regions.DEFAULT.replication.flags.status = 1;
            mockData.data.regions.DEFAULT.dbFile.flags.sessions = 1;
            break;
        }
        case 62: {
            mockData.data.regions.DEFAULT.journal.flags.state = 2;
            mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: false};
            mockData.data.regions.DEFAULT.replication.flags.status = 1;
            mockData.data.regions.DEFAULT.dbFile.flags.sessions = 1;
            break;
        }
        case 63: {
            mockData.data.regions.DEFAULT.journal.flags.state = 2;
            mockData.data.regions.DEFAULT.journal.flags.fileExist = false;
            break;
        }

        // Devices
        case 70: {
            mockData.data.devices[0].percentUsed = 50;
            break;
        }
        case 71: {
            mockData.data.devices[0].percentUsed = 75;
            break;
        }
        case 72: {
            mockData.data.devices[0].percentUsed = 92;
            break;
        }
        case 73: {
            mockData.data.devices[0].percentUsed = 98;
            break;
        }

        // Global status
        case 100: {
            break;
        }
        case 101: {
            mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
            mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
            mockData.data.regions.DEFAULT.dbFile.data[2] = {"AUTO_DB": false};
            break;
        }
        case 102: {
            mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
            mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
            mockData.data.regions.DEFAULT.dbFile.data[2] = {"AUTO_DB": false};

            mockData.data.regions.YDBAIM.dbFile.flags.fileExist = false;
            mockData.data.regions.YDBAIM.dbFile.data[0] = {"FILE_NAME": ""};
            mockData.data.regions.YDBAIM.dbFile.data[2] = {"AUTO_DB": false};

            mockData.data.regions.YDBOCTO.dbFile.flags.fileExist = false;
            mockData.data.regions.YDBOCTO.dbFile.data[0] = {"FILE_NAME": ""};
            mockData.data.regions.YDBOCTO.dbFile.data[2] = {"AUTO_DB": false};
            break;
        }
        case 103: {
            break;
        }
        case 104: {
            mockData.data.regions.DEFAULT.journal.flags.state = 1;
            break;
        }
        case 105: {
            mockData.data.regions.DEFAULT.journal.flags.state = 1;
            mockData.data.regions.YDBAIM.journal.flags.state = 1;
            mockData.data.regions.YDBOCTO.journal.flags.state = 1;
            break;
        }
        case 106: {
            mockData.data.regions.DEFAULT.replication.flags.status = 2;
            break;
        }
        case 107: {
            break;
        }
        case 108: {
            mockData.data.regions.DEFAULT.replication.flags.status = 1;
            break;
        }
        case 109: {
            mockData.data.regions.DEFAULT.replication.flags.status = 2;
            break;
        }
        case 110: {
            mockData.data.regions.DEFAULT.dbFile.flags.freeze = 1;
            break;
        }
        case 111: {
            mockData.data.regions.DEFAULT.dbFile.flags.freeze = 1;
            break;
        }

        // system info
        case 151: {
            mockData.data.systemInfo.plugins = [];
            mockData.data.systemInfo.plugins.push({name: 'Plugin-name', description: 'Plugin-description', vendor: 'Plugin-vendor', version: 'Plugin-version'});
            break;
        }

        // device info
        case 192: {
            mockData.data.devices[0].percentUsed = 75;
            break
        }
        case 193: {
            mockData.data.devices[0].percentUsed = 92;
            break
        }
        case 194: {
            mockData.data.devices[0].percentUsed = 98;
            break
        }
        case 200: {
            mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
            mockData.data.regions.DEFAULT.dbAccess.data[2] = {"AUTO_DB": true};
            break
        }
        case 201: {
            mockData.data.regions.DEFAULT.journal.flags.state = 0;
            mockData.data.regions.YDBAIM.journal.flags.state = 0;
            mockData.data.regions.YDBOCTO.journal.flags.state = 0;
            break
        }
        case 202: {
            mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
            mockData.data.regions.YDBAIM.dbFile.flags.fileExist = false;
            mockData.data.regions.YDBOCTO.dbFile.flags.fileExist = false;
            break
        }

        // Region view: db
        case 250: {
            mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
            mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
            mockData.data.regions.DEFAULT.dbFile.data[2] = {"AUTO_DB": true};
            break
        }
        case 251: {
            mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
            mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
            mockData.data.regions.DEFAULT.dbFile.data[2] = {"AUTO_DB": false};
            break
        }
        case 252: {
            mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
            mockData.data.regions.DEFAULT.dbFile.flags.fileValid = false;
            break
        }
        case 253: {
            mockData.data.regions.DEFAULT.dbFile.flags.shmenHealthy = false;
            break
        }
        case 254: {
            mockData.data.regions.DEFAULT.dbFile.usage.usedPercent = 10;
            break
        }
        case 255: {
            mockData.data.regions.DEFAULT.dbFile.usage.usedPercent = 80;
            mockData.data.regions.DEFAULT.dbFile.data[7] = {'EXTENSION_COUNT': 0};
            break
        }
        case 256: {
            mockData.data.regions.DEFAULT.dbFile.usage.usedPercent = 95;
            mockData.data.regions.DEFAULT.dbFile.data[7] = {'EXTENSION_COUNT': 0};
            break
        }
        case 257: {
            mockData.data.regions.DEFAULT.dbFile.usage.usedPercent = 99;
            mockData.data.regions.DEFAULT.dbFile.data[7] = {'EXTENSION_COUNT': 0};
            break
        }
        case 259: {
            mockData.data.regions.DEFAULT.dbFile.flags.sessions = 27;
            break
        }
        case 260: {
            mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
            mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
            mockData.data.regions.DEFAULT.dbFile.data[2] = {"AUTO_DB": true};
            break
        }
        case 261: {
            mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
            mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
            mockData.data.regions.DEFAULT.dbFile.data[2] = {"AUTO_DB": false};
            break
        }
        case 262: {
            mockData.data.regions.DEFAULT.dbFile.flags.fileExist = true;
            mockData.data.regions.DEFAULT.dbFile.flags.fileBad = true;
            break
        }
        case 263: {
            mockData.data.regions.DEFAULT.dbFile.flags.shmenHealthy = false;
            break
        }
        case 280: {
            mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
            mockData.data.regions.DEFAULT.dbFile.data = [];
            mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": ""};
            mockData.data.regions.DEFAULT.dbFile.data[1] = {"ALLOCATION": 5000};
            mockData.data.regions.DEFAULT.dbFile.data[2] = {"BLOCK_SIZE": 4096};
            mockData.data.regions.DEFAULT.dbFile.data[3] = {"AUTO_DB": true};
            delete mockData.data.regions.DEFAULT.dbAccess;
            break
        }
        case 281: {
            mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
            mockData.data.regions.DEFAULT.dbFile.data = [];
            mockData.data.regions.DEFAULT.dbFile.data[0] = {"FILE_NAME": "/data/temp.dat"};
            mockData.data.regions.DEFAULT.dbFile.data[1] = {"ALLOCATION": 5000};
            mockData.data.regions.DEFAULT.dbFile.data[2] = {"BLOCK_SIZE": 4096};
            mockData.data.regions.DEFAULT.dbFile.data[3] = {"AUTO_DB": true};
            delete mockData.data.regions.DEFAULT.dbAccess;
            break
        }
        case 284: {
            mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
            break
        }
        case 285: {
            mockData.data.regions.DEFAULT.dbFile.flags.fileBad = true;
            break
        }
        case 287: {
            mockData.data.regions.DEFAULT.dbFile.usage.usedPercent = 95;
            mockData.data.regions.DEFAULT.dbFile.data[7] = {'EXTENSION_COUNT': 1000};
            break
        }
        case 288: {
            mockData.data.regions.DEFAULT.dbFile.flags.device = 'overlay 263174212 32597508 25000 14% /';
            // 80K 8   45K 5  15K  2
            break;
        }
        case 289: {
            mockData.data.regions.DEFAULT.dbFile.flags.device = 'overlay 263174212 32597508 180000 14% /';
            break;
        }
        case 290: {
            mockData.data.regions.DEFAULT.dbFile.flags.device = 'overlay 263174212 32597508 320000 14% /';
            break;
        }
        case 291: {
            mockData.data.regions.DEFAULT.dbFile.data[7] = {'EXTENSION_COUNT': 0};
            mockData.data.regions.DEFAULT.dbFile.flags.device = 'overlay 263174212 32597508 1000 14% /';
            break;
        }
        case 292: {
            mockData.data.regions.DEFAULT.dbFile.data[7] = {'EXTENSION_COUNT': 0};
            mockData.data.regions.DEFAULT.dbFile.flags.device = 'overlay 263174212 32597508 2000 14% /';
            break;
        }
        case 293: {
            mockData.data.regions.DEFAULT.dbFile.data[7] = {'EXTENSION_COUNT': 0};
            mockData.data.regions.DEFAULT.dbFile.flags.device = 'overlay 263174212 32597508 12000 14% /';
            break;
        }
        case 294: {
            mockData.data.regions.DEFAULT.dbFile.data[7] = {'EXTENSION_COUNT': 10000};
            mockData.data.regions.DEFAULT.dbFile.flags.device = 'overlay 263174212 32597508 1200000 35% /';
            break;
        }

        // Region view: journal
        case 300: {
            mockData.data.regions.DEFAULT.journal.flags.state = 0;
            break
        }
        case 301: {
            mockData.data.regions.DEFAULT.journal.flags.state = 1;
            break
        }
        case 303: {
            mockData.data.regions.DEFAULT.replication.flags.status = 2;
            break
        }
        case 304: {
            mockData.data.regions.DEFAULT.journal.flags.state = 1;
            mockData.data.regions.DEFAULT.replication.flags.status = 1;
            break
        }
        case 305: {
            mockData.data.regions.DEFAULT.replication.flags.status = 1;
            break
        }
        case 306: {
            mockData.data.regions.DEFAULT.replication.flags.status = 1;
            mockData.data.regions.DEFAULT.journal.flags.state = 2;
            mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: false};
            break
        }
        case 307: {
            mockData.data.regions.DEFAULT.replication.flags.status = 1;
            mockData.data.regions.DEFAULT.journal.flags.state = 0;
            mockData.data.regions.DEFAULT.dbFile.flags.sessions = 27;
            break
        }
        case 308: {
            mockData.data.regions.DEFAULT.replication.flags.status = 1;
            mockData.data.regions.DEFAULT.journal.flags.state = 1;
            mockData.data.regions.DEFAULT.dbFile.flags.sessions = 27;
            break
        }
        case 309: {
            mockData.data.regions.DEFAULT.replication.flags.status = 1;
            mockData.data.regions.DEFAULT.journal.flags.state = 2;
            mockData.data.regions.DEFAULT.dbFile.flags.sessions = 27;
            break
        }
        case 310: {
            mockData.data.regions.DEFAULT.journal.flags.state = 1;
            break
        }
        case 311: {
            mockData.data.regions.DEFAULT.journal.flags.state = 0;
            break
        }
        case 314: {
            mockData.data.regions.DEFAULT.journal.data[1] = {BEFORE: false};
            break
        }
        case 315: {
            mockData.data.regions.DEFAULT.journal.flags.state = 0;
            break
        }
        case 317: {
            mockData.data.regions.DEFAULT.journal.flags.state = 0;
            break
        }
        case 318: {
            mockData.data.regions.DEFAULT.replication.flags.status = 2;
            break
        }
        case 319: {
            mockData.data.regions.DEFAULT.journal.flags.state = 0;
            mockData.data.regions.DEFAULT.replication.flags.status = 1;
            mockData.data.regions.DEFAULT.dbFile.flags.sessions = 27;
            break
        }
        case 320: {
            mockData.data.regions.DEFAULT.journal.flags.state = 1;
            mockData.data.regions.DEFAULT.replication.flags.status = 1;
            mockData.data.regions.DEFAULT.dbFile.flags.sessions = 27;
            break
        }
        case 321: {
            mockData.data.regions.DEFAULT.journal.flags.state = 1;
            mockData.data.regions.DEFAULT.replication.flags.status = 0;
            mockData.data.regions.DEFAULT.dbFile.flags.sessions = 27;
            break
        }
        case 322: {
            mockData.data.regions.DEFAULT.journal.flags.state = 2;
            mockData.data.regions.DEFAULT.journal.flags.fileExist = false;
            break
        }
        case 323: {
            mockData.data.regions.DEFAULT.journal.flags.state = 2;
            mockData.data.regions.DEFAULT.journal.flags.fileExist = false;
            break
        }
        case 375: {
            mockData.data.regions.DEFAULT.locks.locks = [
                {
                    node: '^testGlobal("subscript1")',
                    pid: 1234
                }
            ];
            break
        }
        case 376: {
            mockData.data.regions.DEFAULT.locks.locks = [
                {
                    node: '^testGlobal("subscript1")',
                    pid: 1234,
                    waiters: [
                        {pid: 4321}
                    ]
                }
            ];
            break
        }
        case 377: {
            mockData.data.regions.DEFAULT.locks.locks = [
                {
                    node: '^testGlobal("subscript1")',
                    pid: 1234,
                    waiters: [
                        {pid: 4321},
                        {pid: 7890}
                    ]
                }
            ];
            break
        }
        case 378: {
            mockData.data.regions.DEFAULT.locks.locks = [
                {
                    node: '^testGlobal("subscript1")',
                    pid: 1234
                },
                {
                    node: '^testGlobal("subscript2")',
                    pid: 1234321
                }
            ];
            break
        }
        case 379: {
            mockData.data.regions.DEFAULT.locks.locks = [
                {
                    node: '^testGlobal("subscript1")',
                    pid: 1234,
                    waiters: [
                        {pid: 4321}
                    ]
                },
                {
                    node: '^testGlobal("subscript2")',
                    pid: 1234321
                }
            ];
            break
        }
        case 380: {
            mockData.data.regions.DEFAULT.locks.locks = [
                {
                    node: '^testGlobal("subscript1")',
                    pid: 1234,
                    waiters: [
                        {pid: 4321},
                        {pid: 7890}
                    ]
                },
                {
                    node: '^testGlobal("subscript2")',
                    pid: 1234321
                }
            ];
            break
        }
        case 430:
        case 431: {
            setTimeout(() => {
                const dataArray = [
                    'DEFAULT',
                    'YDBAIM',
                    'YDBOCTO'
                ];

                app.ui.regionSelect.show(dataArray, app.ui.regionView.show);
            }, 350);
            break
        }
        case 490:
        case 491:
        case 492:
        case 493:
        case 494:
        case 520:
        case 522:
        case 523:
        case 524: {
            app.ui.regionAdd.name.region = 'test';
            setTimeout(() => app.ui.regionAdd.show(), 150);
            break
        }
        case 540:
        case 541: {
            app.ui.regionAdd.name.region = 'test';
            setTimeout(() => {
                app.ui.regionAdd.show();

                setTimeout(() => {
                    app.ui.regionNames.add.show()

                }, 150)

            }, 150);
            break;
        }
        case 542: {
            app.ui.regionAdd.name.region = 'test';
            setTimeout(() => {
                app.ui.regionAdd.show();

                setTimeout(() => {
                    $('#navRegionEditorNames').tab('show');
                    app.ui.regionNames.add.show()

                }, 150)

            }, 150);
            break;
        }
        case 543: {
            app.ui.regionAdd.name.region = 'test';
            setTimeout(() => {
                app.ui.regionAdd.show();
                setTimeout(() => {
                    app.ui.regionShared.manifest.names.push({value: 'zzz'});
                    app.ui.regionShared.manifest.names.push({value: 'aaa'});
                    $('#navRegionEditorNames').tab('show');
                    app.ui.regionNames.add.show()
                }, 250)

            }, 250);
        }
        case 390: {
            mockData.data.regions.DEFAULT.replication.flags.status = 2;
            break
        }
        case 400:
        case 401:
        case 402:
        case 403: {
            app.ui.regionView.currentRegion = 'DEFAULT';
            setTimeout(() => app.ui.regionDelete.show(), 250);
            break
        }
        case 440:
        case 441:
        case 442:
        case 443:
        case 444: {
            mockData.data.regions.DEFAULT.dbFile.flags.fileExist = false;
            mockData.data.regions.DEFAULT.dbFile.data[2] = {"AUTO_DB": true};
            break
        }
        case 450:
        case 451:
        case 452: {
            app.ui.regionView.currentRegion = 'DEFAULT';
            setTimeout(() => app.ui.regionJournalSwitch.show(), 250);
            break
        }
        case 555:
        case 556:
        case 559:
        case 560:
        case 561:
        case 570:
        case 571:
        case 572:
        case 573:
        case 585: {
            app.ui.regionView.currentRegion = 'DEFAULT';
            setTimeout(() => {
                app.ui.regionEdit.show();
            }, 250);
            break
        }
        case 557:
        case 558:
        case 562: {
            app.ui.regionView.currentRegion = 'YDBAIM';
            setTimeout(() => {
                app.ui.regionEdit.show();
            }, 250);
            break
        }
        case 586:
        case 587:
        case 588:
        case 589:
        case 590: {
            app.ui.regionView.currentRegion = 'YDBOCTO';
            setTimeout(() => {
                app.ui.regionEdit.show();
            }, 250);
            break
        }
        case 600:
        case 601:
        case 602:
        case 603:
        case 604:
        case 605:
        case 606:
        case 607:
        case 608:
        case 615:
        case 616:
        case 617:
        case 618:
        case 619:
        case 620:
        case 621:
        case 622:
        case 623:
        case 624:
        case 625:
        case 626:
        case 627:
        case 628:
        case 629:
        case 630:
        case 631:
        case 632:
        case 633:
        case 634:
        case 635:
        case 636:
        case 637:
        case 638:
        case 640:
        case 641:
        case 642:
        case 643:
        case 644:
        case 645:
        case 646:
        case 647:
        case 648:
        case 649:
        case 650:
        case 651: {
            setTimeout(() => {
                app.ui.locksManager.show();
            }, 250);
            break
        }
        case 609: {
            app.ui.locksManager.locksData.locks.push({
                namespace: 'ATEST1',
                region: 'YDBOCTO',
                pid: 1,
                waiters: [
                    11,
                    12,
                    13,
                ]
            });
            setTimeout(() => {
                app.ui.locksManager.show();
            }, 250);
            break
        }
        case 610: {
            app.ui.locksManager.locksData.locks.push({
                namespace: 'TEST4',
                region: 'AAA',
                pid: 1,
                waiters: [
                    11,
                    12,
                    13,
                ]
            });
            app.ui.locksManager.locksData.regions.push(
                {
                    name: 'AAA',
                    estimatedFreeLockSpace: '100% of 220 pages',
                    processesOnQueue: '0/880',
                    slotsInUse: '0/597',
                    slotsBytesInUse: '0/28080'
                }
            );
            setTimeout(() => {
                app.ui.locksManager.show();
            }, 250);
            break
        }
        case 611: {
            app.ui.locksManager.locksData.locks.push({
                namespace: 'ATEST1',
                region: 'YDBOCTO',
                pid: 0,
                waiters: [
                    11,
                    12,
                    13,
                ]
            });
            app.ui.locksManager.locksData.pids.push(
                {
                    pid: 0,
                    userId: 'pid1',
                    processName: 'yottadb',
                    PPID: 0,
                    time: '00:00:00'
                },
            );
            setTimeout(() => {
                app.ui.locksManager.show();
            }, 250);
            break
        }
        case 612:
        case 613:
        case 614: {
            app.ui.locksManager.locksData.locks = [];
            app.ui.locksManager.locksData.pids = [];
            app.ui.locksManager.locksData.regions = [];
            setTimeout(() => {
                app.ui.locksManager.show();
            }, 250);
            break
        }
    }

    return mockData
};

let testMock = {
    data: {
        devices: [
            {
                freeBlocks: 234145020,
                mountPoint: "/",
                percentUsed: 7,
                totalBlocks: 263174212,
                type: "overlay",
                usedBlocks: 15591036,
                deviceId: 'fedc9aa3bd65bc57',
                fsBlockSize: 4096,
                iNodesFree: 4243423,
                iNodesTotal: 43243243,
                usedBy: [
                    {
                        "file": "/data/r1.34_x86_64/g/yottadb.dat",
                        "region": "DEFAULT"
                    },
                    {
                        "file": "/data/r1.34_x86_64/g/yottadb.mjl",
                        "region": "DEFAULT"
                    },
                    {
                        "file": "/data/r1.34_x86_64/g/%ydbaim.dat",
                        "region": "YDBAIM"
                    },
                    {
                        "file": "/data/r1.34_x86_64/g/%ydbocto.dat",
                        "region": "YDBOCTO"
                    },
                    {
                        "file": "/data/r1.34_x86_64/g/%ydbocto.mjl",
                        "region": "YDBOCTO"
                    }
                ]
            }
        ],
        "gld":
            {
                "exist":
                    true,
                "valid":
                    true
            }
        ,
        "regions":
            {
                "DEFAULT":
                    {
                        "dbAccess":
                            {
                                "data":
                                    [
                                        {
                                            "RECORD_SIZE": 4080
                                        },
                                        {
                                            "KEY_SIZE": 255
                                        },
                                        {
                                            "NULL_SUBSCRIPTS": false
                                        }
                                    ]
                            }
                        ,
                        "dbFile":
                            {
                                "data":
                                    [
                                        {
                                            "FILE_NAME": "/data/r1.34_x86_64/g/yottadb.dat"
                                        },
                                        {
                                            "currentSize": 20520960
                                        },
                                        {
                                            "extensionLeft": 20471808
                                        },
                                        {
                                            "maximumSize": 40992768
                                        },
                                        {
                                            "ACCESS_METHOD": "BG"
                                        },
                                        {
                                            "AUTO_DB": false
                                        },
                                        {
                                            "GLOBAL_BUFFER_COUNT": 1000
                                        },
                                        {
                                            "LOCK_SPACE": 220
                                        },
                                        {
                                            "ASYNCIO": false
                                        },
                                        {
                                            "DEFER_ALLOCATE": true
                                        },
                                        {
                                            "EXTENSION_COUNT": 10000
                                        },
                                        {
                                            "TRANSACTION_NUMBER": "0x0000000000000001"
                                        },
                                        {
                                            "LAST_BACKUP": "0x0000000000000001"
                                        },
                                        {
                                            "ALLOCATION": 2048
                                        },
                                        {
                                            "BLOCK_SIZE": 4096
                                        }
                                    ],
                                "flags":
                                    {
                                        "device":
                                            "overlay 263174212 15591036 234145020 7% /",
                                        "file":
                                            "/data/r1.34_x86_64/g/yottadb.dat",
                                        "fileBad":
                                            false,
                                        "fileExist":
                                            true,
                                        "mountpoint":
                                            "/",
                                        "sessions":
                                            0,
                                        "shmenHealthy":
                                            true,
                                        deviceId: 'fedc9aa3bd65bc57',
                                        fsBlockSize: 4096,
                                        iNodesFree: 4243423,
                                        iNodesTotal: 43243243,

                                    }
                                ,
                                "usage":
                                    {
                                        "freeBlocks":
                                            4998,
                                        "totalBlocks":
                                            10008,
                                        "usedBlocks":
                                            5010,
                                        "usedPercent":
                                            49.9
                                    }
                            }
                        ,
                        "journal":
                            {
                                "data":
                                    [
                                        {
                                            "JFILE_NAME": "/data/r1.34_x86_64/g/yottadb.mjl"
                                        },
                                        {
                                            "BEFORE": true
                                        },
                                        {
                                            "EPOCH_INTERVAL": 300
                                        },
                                        {
                                            "EPOCH_TAPER": true
                                        },
                                        {
                                            "SYNC_IO": false
                                        },
                                        {
                                            "BUFFER_SIZE": 2312
                                        }
                                    ],
                                "flags":
                                    {
                                        "device":
                                            "overlay 263174212 15591036 234145020 7% /",
                                        "file":
                                            "/data/r1.34_x86_64/g/yottadb.mjl",
                                        "inode":
                                            "",
                                        "mountpoint":
                                            "/",
                                        "state":
                                            2,
                                        deviceId: 'fedc9aa3bd65bc57',
                                        fsBlockSize: 4096,
                                        iNodesFree: 4243423,
                                        iNodesTotal: 43243243,

                                    }
                            }
                        ,
                        "locks":
                            {
                                "estimatedFreeLockSpace":
                                    "100% of 220 pages",
                                "processesOnQueue":
                                    "0/880",
                                "slotsBytesInUse":
                                    "0/28080",
                                "slotsInUse":
                                    "0/597"
                            }
                        ,
                        "replication":
                            {
                                "flags":
                                    {
                                        "status":
                                            0
                                    }
                            }
                        ,
                        "stats":
                            {
                                "csa":
                                    {
                                        "caption":
                                            "Critical Section Acquisition",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_success": 51
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_fail": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_in_epch": 0
                                                }
                                            ]
                                    }
                                ,
                                "journal":
                                    {
                                        "caption":
                                            "Journal information",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jfile_bytes": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jnl_flush": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jnl_fsync": 1
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jrec_epoch_regular": 0
                                                }
                                            ]
                                    }
                                ,
                                "locks":
                                    {
                                        "caption":
                                            "M Lock Operations",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_lock_success": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_lock_fail": 0
                                                }
                                            ]
                                    }
                                ,
                                "logicalOperations":
                                    {
                                        "caption":
                                            "Logical Database operations",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_set": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_kill": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_get": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_data": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_order": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_zprev": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_query": 0
                                                }
                                            ]
                                    }
                                ,
                                "transactions":
                                    {
                                        "caption":
                                            "Transactions",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_0": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_1": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_2": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_3": 0
                                                }
                                            ]
                                    }
                            }
                    }
                ,
                "YDBAIM":
                    {
                        "dbAccess":
                            {
                                "data":
                                    [
                                        {
                                            "RECORD_SIZE": 2048
                                        },
                                        {
                                            "KEY_SIZE": 1019
                                        },
                                        {
                                            "AUTO_DB": false
                                        },
                                        {
                                            "NULL_SUBSCRIPTS": true
                                        }
                                    ]
                            }
                        ,
                        "dbFile":
                            {
                                "data":
                                    [
                                        {
                                            "FILE_NAME": "/data/r1.34_x86_64/g/%ydbaim.dat"
                                        },
                                        {
                                            "currentSize": 20520960
                                        },
                                        {
                                            "extensionLeft": 20475904
                                        },
                                        {
                                            "maximumSize": 40996864
                                        },
                                        {
                                            "ACCESS_METHOD": "MM"
                                        },
                                        {
                                            "LOCK_SPACE": 220
                                        },
                                        {
                                            "DEFER_ALLOCATE": true
                                        },
                                        {
                                            "EXTENSION_COUNT": 20000
                                        },
                                        {
                                            "TRANSACTION_NUMBER": "0x0000000000000001"
                                        },
                                        {
                                            "LAST_BACKUP": "0x0000000000000001"
                                        },
                                        {
                                            "ALLOCATION": 2048
                                        },
                                        {
                                            "BLOCK_SIZE": 2048
                                        }
                                    ],
                                "flags":
                                    {
                                        "device":
                                            "overlay 263174212 15591036 234145020 7% /",
                                        "file":
                                            "/data/r1.34_x86_64/g/%ydbaim.dat",
                                        "fileBad":
                                            false,
                                        "fileExist":
                                            true,
                                        "mountpoint":
                                            "/",
                                        "sessions":
                                            0,
                                        "shmenHealthy":
                                            true,
                                        deviceId: 'fedc9aa3bd65bc57',
                                        fsBlockSize: 4096,
                                        iNodesFree: 4243423,
                                        iNodesTotal: 43243243,
                                    }
                                ,
                                "usage":
                                    {
                                        "freeBlocks":
                                            9998,
                                        "totalBlocks":
                                            20018,
                                        "usedBlocks":
                                            10020,
                                        "usedPercent":
                                            49.9
                                    }
                            }
                        ,
                        "journal":
                            {
                                "data":
                                    [
                                        {
                                            "JFILE_NAME": ""
                                        },
                                        {
                                            "BEFORE": false
                                        },
                                        {
                                            "EPOCH_INTERVAL": 300
                                        },
                                        {
                                            "EPOCH_TAPER": true
                                        },
                                        {
                                            "SYNC_IO": false
                                        },
                                        {
                                            "BUFFER_SIZE": 2312
                                        }
                                    ],
                                "flags":
                                    {
                                        "inode":
                                            "",
                                        "state":
                                            0
                                    }
                            }
                        ,
                        "locks":
                            {
                                "estimatedFreeLockSpace":
                                    "100% of 220 pages",
                                "processesOnQueue":
                                    "0/880",
                                "slotsBytesInUse":
                                    "0/28080",
                                "slotsInUse":
                                    "0/597"
                            }
                        ,
                        "names":
                            [
                                {
                                    "name": "YDBAIM",
                                    "ranges": [
                                        {
                                            "from": "%ydbAIM",
                                            "to": "%ydbAIN"
                                        },
                                        {
                                            "from": "%ydbAIm",
                                            "to": "%ydbAIn"
                                        },
                                        {
                                            "from": "%ydbAiM",
                                            "to": "%ydbAiN"
                                        },
                                        {
                                            "from": "%ydbAim",
                                            "to": "%ydbAin"
                                        },
                                        {
                                            "from": "%ydbaIM",
                                            "to": "%ydbaIN"
                                        },
                                        {
                                            "from": "%ydbaIm",
                                            "to": "%ydbaIn"
                                        },
                                        {
                                            "from": "%ydbaiM",
                                            "to": "%ydbaiN"
                                        },
                                        {
                                            "from": "%ydbaim",
                                            "to": "%ydbain"
                                        }
                                    ],
                                    "type": "%y"
                                }
                            ],
                        "replication":
                            {
                                "flags":
                                    {
                                        "status":
                                            0
                                    }
                            }
                        ,
                        "stats":
                            {
                                "csa":
                                    {
                                        "caption":
                                            "Critical Section Aquisition",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_success": 50
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_fail": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_in_epch": 0
                                                }
                                            ]
                                    }
                                ,
                                "journal":
                                    {
                                        "caption":
                                            "Journal information",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jfile_bytes": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jnl_flush": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jnl_fsync": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jrec_epoch_regular": 0
                                                }
                                            ]
                                    }
                                ,
                                "locks":
                                    {
                                        "caption":
                                            "M Lock Operations",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_lock_success": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_lock_fail": 0
                                                }
                                            ]
                                    }
                                ,
                                "logicalOperations":
                                    {
                                        "caption":
                                            "Logical Database operations",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_set": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_kill": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_get": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_data": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_order": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_zprev": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_query": 0
                                                }
                                            ]
                                    }
                                ,
                                "transactions":
                                    {
                                        "caption":
                                            "Transactions",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_0": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_1": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_2": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_3": 0
                                                }
                                            ]
                                    }
                            }
                    }
                ,
                "YDBOCTO":
                    {
                        "dbAccess":
                            {
                                "data":
                                    [
                                        {
                                            "RECORD_SIZE": 1048576
                                        },
                                        {
                                            "KEY_SIZE": 1019
                                        },
                                        {
                                            "AUTO_DB": false
                                        },
                                        {
                                            "NULL_SUBSCRIPTS": true
                                        }
                                    ]
                            }
                        ,
                        "dbFile":
                            {
                                "data":
                                    [
                                        {
                                            "FILE_NAME": "/data/r1.34_x86_64/g/%ydbocto.dat"
                                        },
                                        {
                                            "currentSize": 20520960
                                        },
                                        {
                                            "extensionLeft": 20475904
                                        },
                                        {
                                            "maximumSize": 40996864
                                        },
                                        {
                                            "ACCESS_METHOD": "BG"
                                        },
                                        {
                                            "GLOBAL_BUFFER_COUNT": 2000
                                        },
                                        {
                                            "LOCK_SPACE": 220
                                        },
                                        {
                                            "ASYNCIO": false
                                        },
                                        {
                                            "DEFER_ALLOCATE": true
                                        },
                                        {
                                            "EXTENSION_COUNT": 20000
                                        },
                                        {
                                            "TRANSACTION_NUMBER": "0x0000000000000001"
                                        },
                                        {
                                            "LAST_BACKUP": "0x0000000000000001"
                                        },
                                        {
                                            "ALLOCATION": 2048
                                        },
                                        {
                                            "BLOCK_SIZE": 2048
                                        }
                                    ],
                                "flags":
                                    {
                                        "device":
                                            "overlay 263174212 15591036 234145020 7% /",
                                        "file":
                                            "/data/r1.34_x86_64/g/%ydbocto.dat",
                                        "fileBad":
                                            false,
                                        "fileExist":
                                            true,
                                        "mountpoint":
                                            "/",
                                        "sessions":
                                            0,
                                        "shmenHealthy":
                                            true,
                                        deviceId: 'fedc9aa3bd65bc57',
                                        fsBlockSize: 4096,
                                        iNodesFree: 4243423,
                                        iNodesTotal: 43243243,
                                    }
                                ,
                                "usage":
                                    {
                                        "freeBlocks":
                                            9998,
                                        "totalBlocks":
                                            20018,
                                        "usedBlocks":
                                            10020,
                                        "usedPercent":
                                            49.9
                                    }
                            }
                        ,
                        "journal":
                            {
                                "data":
                                    [
                                        {
                                            "JFILE_NAME": "/data/r1.34_x86_64/g/%ydbocto.mjl"
                                        },
                                        {
                                            "BEFORE": true
                                        },
                                        {
                                            "EPOCH_INTERVAL": 300
                                        },
                                        {
                                            "EPOCH_TAPER": true
                                        },
                                        {
                                            "SYNC_IO": false
                                        },
                                        {
                                            "BUFFER_SIZE": 2312
                                        }
                                    ],
                                "flags":
                                    {
                                        "device":
                                            "overlay 263174212 15591036 234145020 7% /",
                                        "file":
                                            "/data/r1.34_x86_64/g/%ydbocto.mjl",
                                        "inode":
                                            "",
                                        "mountpoint":
                                            "/",
                                        "state":
                                            2,
                                        deviceId: 'fedc9aa3bd65bc57',
                                        fsBlockSize: 4096,
                                        iNodesFree: 4243423,
                                        iNodesTotal: 43243243,
                                    }
                            }
                        ,
                        "locks":
                            {
                                "estimatedFreeLockSpace":
                                    "100% of 220 pages",
                                "processesOnQueue":
                                    "0/880",
                                "slotsBytesInUse":
                                    "0/28080",
                                "slotsInUse":
                                    "0/597"
                            }
                        ,
                        "names":
                            [
                                {
                                    "name": "YDBOCTO",
                                    "ranges": [
                                        {
                                            "from": "%ydbOCTO",
                                            "to": "%ydbOCTP"
                                        },
                                        {
                                            "from": "%ydbOCTo",
                                            "to": "%ydbOCTp"
                                        },
                                        {
                                            "from": "%ydbOCtO",
                                            "to": "%ydbOCtP"
                                        },
                                        {
                                            "from": "%ydbOCto",
                                            "to": "%ydbOCtp"
                                        },
                                        {
                                            "from": "%ydbOcTO",
                                            "to": "%ydbOcTP"
                                        },
                                        {
                                            "from": "%ydbOcTo",
                                            "to": "%ydbOcTp"
                                        },
                                        {
                                            "from": "%ydbOctO",
                                            "to": "%ydbOctP"
                                        },
                                        {
                                            "from": "%ydbOcto",
                                            "to": "%ydbOctp"
                                        },
                                        {
                                            "from": "%ydboCTO",
                                            "to": "%ydboCTP"
                                        },
                                        {
                                            "from": "%ydboCTo",
                                            "to": "%ydboCTp"
                                        },
                                        {
                                            "from": "%ydboCtO",
                                            "to": "%ydboCtP"
                                        },
                                        {
                                            "from": "%ydboCto",
                                            "to": "%ydboCtp"
                                        },
                                        {
                                            "from": "%ydbocTO",
                                            "to": "%ydbocTP"
                                        },
                                        {
                                            "from": "%ydbocTo",
                                            "to": "%ydbocTp"
                                        },
                                        {
                                            "from": "%ydboctO",
                                            "to": "%ydboctP"
                                        },
                                        {
                                            "from": "%ydbocto",
                                            "to": "%ydboctp"
                                        }
                                    ],
                                    "type": "%y"
                                }
                            ],
                        "replication":
                            {
                                "flags":
                                    {
                                        "status":
                                            0
                                    }
                            }
                        ,
                        "stats":
                            {
                                "csa":
                                    {
                                        "caption":
                                            "Critical Section Aquisition",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_success": 55
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_fail": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_crit_in_epch": 0
                                                }
                                            ]
                                    }
                                ,
                                "journal":
                                    {
                                        "caption":
                                            "Journal information",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jfile_bytes": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jnl_flush": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jnl_fsync": 1
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_jrec_epoch_regular": 0
                                                }
                                            ]
                                    }
                                ,
                                "locks":
                                    {
                                        "caption":
                                            "M Lock Operations",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_lock_success": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_lock_fail": 0
                                                }
                                            ]
                                    }
                                ,
                                "logicalOperations":
                                    {
                                        "caption":
                                            "Logical Database operations",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_set": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_kill": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_get": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_data": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_order": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_zprev": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_query": 0
                                                }
                                            ]
                                    }
                                ,
                                "transactions":
                                    {
                                        "caption":
                                            "Transactions",
                                        "data":
                                            [
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_0": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_1": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_2": 0
                                                },
                                                {
                                                    "sgmnt_data.gvstats_rec.n_nontp_retries_3": 0
                                                }
                                            ]
                                    }
                            }
                    }
            }
        ,
        "systemInfo":
            {
                "chset":
                    "UTF-8",
                "envVars":
                    [
                        {
                            "name": "GTM_CALLIN_START",
                            "value": 140516965999840
                        },
                        {
                            "name": "HOME",
                            "value": "/root"
                        },
                        {
                            "name": "HOSTNAME",
                            "value": "94c82c3754f7"
                        },
                        {
                            "name": "LANG",
                            "value": "en_US.UTF-8"
                        },
                        {
                            "name": "LANGUAGE",
                            "value": "en_US:en"
                        },
                        {
                            "name": "LC_ALL",
                            "value": "en_US.UTF-8"
                        },
                        {
                            "name": "LD_LIBRARY_PATH",
                            "value": "/opt/yottadb/current"
                        },
                        {
                            "name": "OLDPWD",
                            "value": "/data"
                        },
                        {
                            "name": "PATH",
                            "value": "/opt/yottadb/current:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
                        },
                        {
                            "name": "PWD",
                            "value": "/YDBGUI/wwwroot"
                        },
                        {
                            "name": "SHLVL",
                            "value": 1
                        },
                        {
                            "name": "_",
                            "value": "/opt/yottadb/current/mumps"
                        },
                        {
                            "name": "gtm_chset",
                            "value": "UTF-8"
                        },
                        {
                            "name": "gtm_dist",
                            "value": "/opt/yottadb/current"
                        },
                        {
                            "name": "gtm_etrap",
                            "value": "Write:(0=$STACK) \"Error occurred: \",$ZStatus,!"
                        },
                        {
                            "name": "gtm_icu_version",
                            "value": 66.1
                        },
                        {
                            "name": "gtm_log",
                            "value": "/tmp/yottadb/r1.34_x86_64"
                        },
                        {
                            "name": "gtm_procstuckexec",
                            "value": "/opt/yottadb/current/yottadb -run %YDBPROCSTUCKEXEC"
                        },
                        {
                            "name": "gtm_repl_instance",
                            "value": "/data/r1.34_x86_64/g/yottadb.repl"
                        },
                        {
                            "name": "gtm_retention",
                            "value": 42
                        },
                        {
                            "name": "gtm_tmp",
                            "value": "/tmp/yottadb/r1.34_x86_64"
                        },
                        {
                            "name": "gtmdir",
                            "value": "/data"
                        },
                        {
                            "name": "gtmgbldir",
                            "value": "/data/r1.34_x86_64/g/yottadb.gld"
                        },
                        {
                            "name": "gtmroutines",
                            "value": "/data/r1.34_x86_64/o/utf8*(/data/r1.34_x86_64/r /data/r) /opt/yottadb/current/utf8/libyottadbutil.so"
                        },
                        {
                            "name": "gtmver",
                            "value": "V6.3-011_x86_64"
                        },
                        {
                            "name": "serverName",
                            "value": "ydbgui"
                        },
                        {
                            "name": "ydb_callin_start",
                            "value": 140516965999840
                        },
                        {
                            "name": "ydb_chset",
                            "value": "UTF-8"
                        },
                        {
                            "name": "ydb_dir",
                            "value": "/data"
                        },
                        {
                            "name": "ydb_dist",
                            "value": "/opt/yottadb/current"
                        },
                        {
                            "name": "ydb_etrap",
                            "value": "Write:(0=$STACK) \"Error occurred: \",$ZStatus,!"
                        },
                        {
                            "name": "ydb_gbldir",
                            "value": "/data/r1.34_x86_64/g/yottadb.gld"
                        },
                        {
                            "name": "ydb_icu_version",
                            "value": 66.1
                        },
                        {
                            "name": "ydb_j0",
                            "value": ""
                        },
                        {
                            "name": "ydb_log",
                            "value": "/tmp/yottadb/r1.34_x86_64"
                        },
                        {
                            "name": "ydb_procstuckexec",
                            "value": "/opt/yottadb/current/yottadb -run %YDBPROCSTUCKEXEC"
                        },
                        {
                            "name": "ydb_rel",
                            "value": "r1.34_x86_64"
                        },
                        {
                            "name": "ydb_repl_instance",
                            "value": "/data/r1.34_x86_64/g/yottadb.repl"
                        },
                        {
                            "name": "ydb_retention",
                            "value": 42
                        },
                        {
                            "name": "ydb_routines",
                            "value": "/data/r1.34_x86_64/o/utf8*(/data/r1.34_x86_64/r /data/r /YDBGUI/routines) /opt/yottadb/current/utf8/libyottadbutil.so"
                        },
                        {
                            "name": "ydb_sav_1_PATH",
                            "value": "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
                        },
                        {
                            "name": "ydb_sav_1_gtmdir",
                            "value": "/data"
                        },
                        {
                            "name": "ydb_statsdir",
                            "value": "/tmp/yottadb/r1.34_x86_64"
                        },
                        {
                            "name": "ydb_tmp",
                            "value": "/tmp/yottadb/r1.34_x86_64"
                        },
                        {
                            "name": "ydb_unset_1",
                            "value": "ydb_dir ydb_sav_1_gtmdir ydb_rel gtmver ydb_chset gtm_chset ydb_icu_version gtm_icu_version ydb_dist gtm_dist ydb_repl_instance gtm_repl_instance ydb_retention gtm_retention ydb_gbldir gtmgbldir ydb_routines gtmroutines ydb_log gtm_log ydb_tmp gtm_tmp ydb_etrap gtm_etrap ydb_procstuckexec gtm_procstuckexec LD_LIBRARY_PATH ydb_sav_1_PATH"
                        },
                        {
                            "name": "ydb_xc_gblstat",
                            "value": "/opt/yottadb/current/gtmgblstat.xc"
                        }
                    ],
                "gld":
                    "/data/r1.34_x86_64/g/yottadb.gld",
                "zroutines":
                    "/data/r1.34_x86_64/o/utf8*(/data/r1.34_x86_64/r /data/r /YDBGUI/routines) /opt/yottadb/current/utf8/libyottadbutil.so"
            }
        ,
        "ydb_version":
            "r1.34"
    }
    ,
    "result":
        "OK"
};

app.ui.locksManager.mockData = () => {
    return app.ui.locksManager.locksData;
};

app.ui.locksManager.locksData = {
    locks: [
        {
            namespace: 'TEST1',
            region: 'YDBOCTO',
            pid: 1,
            waiters: [
                11,
                12,
                13,
            ]
        },
        {
            namespace: 'TEST2',
            region: 'DEFAULT',
            pid: 2,
            waiters: [
                21,
                22
            ]
        },
        {
            namespace: 'TEST3',
            region: 'YDBAIM',
            pid: 3,
            waiters: [
                31,
                32,
                33
            ]
        },
    ],
    pids: [
        {
            pid: 1,
            userId: 'pid1',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 2,
            userId: 'pid2',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 3,
            userId: 'pid3',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 11,
            userId: 'pid11',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 12,
            userId: 'pid12',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 13,
            userId: 'pid13',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 21,
            userId: 'pid21',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 22,
            userId: 'pid22',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 23,
            userId: 'pid23',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 31,
            userId: 'pid31',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 32,
            userId: 'pid32',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
        {
            pid: 33,
            userId: 'pid33',
            processName: 'yottadb',
            PPID: 0,
            time: '00:00:00'
        },
    ],
    regions: [
        {
            name: 'DEFAULT',
            estimatedFreeLockSpace: '100% of 220 pages',
            processesOnQueue: '0/880',
            slotsInUse: '0/597',
            slotsBytesInUse: '0/28080'
        },
        {
            name: 'YDBOCTO',
            estimatedFreeLockSpace: '100% of 220 pages',
            processesOnQueue: '0/880',
            slotsInUse: '0/597',
            slotsBytesInUse: '0/28080'
        },
        {
            name: 'YDBAIM',
            estimatedFreeLockSpace: '100% of 220 pages',
            processesOnQueue: '0/880',
            slotsInUse: '0/597',
            slotsBytesInUse: '0/28080'
        }
    ]
};

