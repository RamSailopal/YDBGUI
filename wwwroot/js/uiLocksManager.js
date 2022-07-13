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


app.ui.locksManager.init = () => {
    $('#btnLocksManagerRefresh').on('click', () => { app.ui.locksManager.refreshPressed()});

    $('#btnLocksManagerClear').on('click', () => { app.ui.locksManager.clearPressed() });
    $('#btnLocksManagerTerminateProcess').on('click', () => { app.ui.locksManager.terminateProcessClicked() });
};

app.ui.locksManager.locksData = {};
app.ui.locksManager.currentMask = {};

app.ui.locksManager.show = () => {
    app.ui.locksManager.refresh();

    $('#modalLocksManager').modal({show: true, backdrop: 'static'});
};

app.ui.locksManager.refresh = async () => {
    let locksData;

    if (testMode === true) {
        locksData = app.ui.locksManager.mockData();
        app.ui.locksManager.locksData = locksData;

    } else {
        try {
            locksData = await app.REST._getAllLocks();
            app.ui.locksManager.locksData = locksData;

            if (locksData.result !== 'OK') {
                app.ui.msgbox.show('The following error occurred while fetching locks information:' + locksData.error.description, 'ERROR');

                return

            }
        } catch (err) {
            app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');

            return
        }
    }

    // create namespace tree
    app.ui.locksManager.populateNamespaceTree(locksData);

    // create region tree
    app.ui.locksManager.populateRegionTree(locksData);

    // create process tree
    app.ui.locksManager.populateProcessTree(locksData);

    // clears the button status
    $('#btnLocksManagerClear')
        .addClass('disabled')
        .attr('disabled', true);

    $('#btnLocksManagerTerminateProcess')
        .addClass('disabled')
        .attr('disabled', true);

    // reset status
    app.ui.locksManager.currentMask = {
        clear: '',
        terminateProcess: 0
    };
};

app.ui.locksManager.populateNamespaceTree = locksData => {

    let locks = locksData.locks;
    const treeData = [];

    if (Array.isArray(locks)) {
        locks = locks.sort((a, b) => {
            if (a.namespace < b.namespace) return -1;
            if (a.namespace > b.namespace) return 1;

            return 0
        });


        locks.forEach(lock => {
            const waiters = [];

            // create waiters
            if (Array.isArray(lock.waiters)) {
                lock.waiters.forEach(waiter => {
                    waiters.push({
                        id: 'ns-' + lock.namespace + '-waiter-' + waiter,
                        text: waiter,
                        icon: 'bi-disc',
                        children: app.ui.locksManager.populatePid(locksData.pids, waiter, 'ns-' + lock.namespace + '-waiter-' + waiter)
                    })
                });
            }

            // populate tree
            treeData.push({
                id: 'ns-' + lock.namespace,
                text: '<strong class="locks-manager-font-inconsolata">' + lock.namespace + '</strong>',
                icon: 'bi-lock-fill',
                children: [
                    {
                        id: 'ns-' + lock.namespace + '-region-' + lock.region,
                        text: 'Region: ' + lock.region,
                        icon: 'bi-tags-fill',
                        children: app.ui.locksManager.populateRegion(locksData.regions, lock.region, 'ns-' + lock.namespace + '-region-' + lock.region)
                    },
                    {
                        id: 'ns-' + lock.namespace + '-pid-' + lock.pid,
                        text: 'PID: ' + lock.pid,
                        icon: 'bi-disc',
                        children: app.ui.locksManager.populatePid(locksData.pids, lock.pid, 'ns-' + lock.namespace + '-pid-' + lock.pid)
                    },
                    {
                        id: 'ns-' + lock.namespace + '-waiters',
                        text: 'Waiters',
                        icon: 'bi-disc-fill',
                        children: waiters
                    },
                ]
            })
        });
    }

    app.ui.locksManager.initTree($("#treeLocksManagerByNamespace"), treeData);
};

app.ui.locksManager.populateRegionTree = locksData => {
    let locks = locksData.locks;
    const treeData = [];

    if (Array.isArray(locks)) {

        locks = locks.sort((a, b) => {
            if (a.region < b.region) return -1;
            if (a.region > b.region) return 1;

            return 0

        });

        let region = '';
        let regionEntries = [];

        locks.forEach(lock => {
            const waiters = [];

            if (lock.region !== region) {
                if (region !== '') {
                    // push old region if needed
                    treeData.push({
                        id: 'region-' + region,
                        text: '<strong>' + region + '</strong>',
                        icon: 'bi-tags-fill',
                        children: regionEntries,
                        state: {opened: true},
                    })
                }

                // create new region array
                region = lock.region;
                regionEntries = [];
            }

            // create waiters
            if (Array.isArray(lock.waiters)) {
                lock.waiters.forEach(waiter => {
                    waiters.push({
                        id: 'region-' + region + '-ns-' + lock.namespace + '-waiter-' + waiter,
                        text: waiter,
                        icon: 'bi-disc',
                        children: app.ui.locksManager.populatePid(locksData.pids, waiter, 'region-' + region + '-ns-' + lock.namespace + '-waiter-' + waiter)
                    })
                });
            }

            // populate tree
            regionEntries.push({
                id: 'region-' + region + '-ns-' + lock.namespace,
                text: '<strong class="locks-manager-font-inconsolata">' + lock.namespace + '</strong>',
                icon: 'bi-lock-fill',
                children: [
                    {
                        id: 'region-' + region + '-ns-' + lock.namespace + '-pid-' + lock.pid,
                        text: 'PID: ' + lock.pid,
                        icon: 'bi-disc',
                        children: app.ui.locksManager.populatePid(locksData.pids, lock.pid, 'region-' + region + '-ns-' + lock.namespace + '-pid-' + lock.pid)
                    },
                    {
                        id: 'region-' + region + '-ns-' + lock.namespace + '-waiters',
                        text: 'Waiters',
                        icon: 'bi-disc-fill',
                        children: waiters
                    },
                ]
            })
        });

        // append the last region, if needed
        if (region !== '') {
            treeData.push({
                id: 'region-' + region,
                text: '<strong>' + region + '</strong>',
                icon: 'bi-tags-fill',
                children: regionEntries,
                state: {opened: true},
            });
        }
    }

    app.ui.locksManager.initTree($("#treeLocksManagerByRegion"), treeData);
};

app.ui.locksManager.populateProcessTree = locksData => {
    let locks = locksData.locks;
    const treeData = [];

    if (Array.isArray(locks)) {
        locks = locks.sort((a, b) => {
            if (a.pid < b.pid) return -1;
            if (a.pid > b.pid) return 1;

            return 0
        });

        let pid = '';
        let pidEntries = [];

        locks.forEach(lock => {
            if (lock.pid !== pid) {
                if (pid === '') {
                    //return;
                } else {
                    // push old pid if needed
                    treeData.push({
                        id: 'pid-' + pid,
                        text: '<strong>' + pid + '</strong>',
                        icon: 'bi-disc',
                        children: pidEntries,
                        state: {opened: true},
                    })
                }

                // create new region array
                pid = lock.pid;
                pidEntries = [];
                // populate tree
                app.ui.locksManager.populatePid(locksData.pids, pid, 'pid-' + pid + '-').forEach(pid => {
                    pidEntries.push(pid);
                });

            }

            const waiters = [];

            // create waiters
            if (Array.isArray(lock.waiters)) {
                lock.waiters.forEach(waiter => {
                    waiters.push({
                        id: 'pid-' + pid + '-ns-' + lock.namespace + '-waiter-' + waiter,
                        text: waiter,
                        icon: 'bi-disc',
                        children: app.ui.locksManager.populatePid(locksData.pids, waiter, 'pid-' + pid + '-ns-' + lock.namespace + '-waiter-' + waiter)
                    })
                });
            }

            pidEntries.push({
                id: 'pid-' + pid + '-ns-' + lock.namespace,
                text: '<strong class="locks-manager-font-inconsolata">' + lock.namespace + '</strong>',
                icon: 'bi-lock-fill',
                children: [
                    {
                        id: 'pid-' + pid + '-ns-' + lock.namespace + '-region-' + lock.region,
                        text: 'Region: ' + lock.region,
                        icon: 'bi-tags-fill',
                        children: app.ui.locksManager.populateRegion(locksData.regions, lock.region, 'pid-' + pid + '-ns-' + lock.namespace + '-region-' + lock.region)
                    },
                    {
                        id: 'pid-' + pid + '-ns-' + lock.namespace + '-waiters',
                        text: 'Waiters',
                        icon: 'bi-disc-fill',
                        children: waiters
                    },
                ]
            })
        });

        // append the last pid, if needed
        if (pid !== '') {
            treeData.push({
                id: 'pid-' + pid,
                text: '<strong>' + pid + '</strong>',
                icon: 'bi-disc',
                children: pidEntries,
                state: {opened: true},
            });
        }
    }

    app.ui.locksManager.initTree($("#treeLocksManagerByProcess"), treeData);
};

app.ui.locksManager.populatePid = (pids, pid, key) => {
    const process = pids.find(process => {
        return process.pid === pid
    });

    if (key === undefined || key === '') key = process.pid;

    return [
        {
            id: key + '-' + '-userid',
            text: 'User Id: ' + process.userId,
            icon: 'bi-tags',
        },
        {
            id: key + '-' + '-process',
            text: 'Process name: ' + process.processName,
            icon: 'bi-tags',
        },
        {
            id: key + '-' + '-PPID',
            text: 'PPID: ' + process.PPID,
            icon: 'bi-tags',
        },
        {
            id: key + '-' + '-time',
            text: 'Time: ' + process.time,
            icon: 'bi-tags',
        },
    ]
};

app.ui.locksManager.populateRegion = (regions, regionName, key) => {
    const region = regions.find(region => {
        return region.name === regionName
    });

    if (key === undefined || key === '') key = region.name;

    return [
        {
            id: key + '-' + '-estimatedFreeLockSpace',
            text: 'Free lock space: ' + region.estimatedFreeLockSpace,
            icon: 'bi-tags',
        },
        {
            id: key + '-' + '-processesOnQueue',
            text: 'Processes on queue: ' + region.processesOnQueue,
            icon: 'bi-tags',
        },
        {
            id: key + '-' + '-slotsInUse',
            text: 'Lock slots in use: ' + region.slotsInUse,
            icon: 'bi-tags',
        },
        {
            id: key + '-' + '-slotsBytesInUse',
            text: 'Lock slots in use: ' + region.slotsBytesInUse,
            icon: 'bi-tags',
        },
    ]
};

app.ui.locksManager.initTree = ($tree, treeData) => {
    $tree
        .jstree("destroy")
        .jstree({
            'core': {
                'check_callback': true,
                //'dblclick_toggle': false,
                'multiple': false,
                'data': treeData,
                'themes': {
                    'name': 'proton',
                }
            },
        })
        .on("select_node.jstree", function (node, selected) {
            app.ui.locksManager.processClick(selected.selected[0])
        });
};

app.ui.locksManager.processClick = id => {
    // Enable / Disable matrix
    //
    // clear:               NS: ns/*
    //                      REGION: region/ns/*
    //                      PROCESS: pid/ns/*
    //
    // terminate process    NS: ns ns/region ns/pid ns/waiters/pid/*
    //                      REGION: region/ns region/ns/pid region/ns/waiters/pid/*
    //                      PROCESS: pid/ns /pid/ns/waiters/pid*

    const idArray = id.split('-');
    const buttonEnabled = {
        clear: '',
        terminateProcess: 0
    };

    // set the buttons enabled / disabled status and value depending on tree selection
    switch (idArray[0]) {
        case 'ns': {
            if (id.indexOf('waiter-') > -1) {
                buttonEnabled.terminateProcess = idArray[3] + '-W';
                buttonEnabled.clear = idArray[1];

            } else {
                buttonEnabled.terminateProcess = app.ui.locksManager.findPidByNs(idArray[1]) + '-L';
                buttonEnabled.clear = idArray[1];
            }

            break
        }
        case 'region': {
            if (id.indexOf('waiter-') > -1) {
                buttonEnabled.clear = idArray[3];
                buttonEnabled.terminateProcess = idArray[5] + '-W';

            } else if (idArray.length > 2) {
                buttonEnabled.clear = idArray[3];
                buttonEnabled.terminateProcess = app.ui.locksManager.findPidByNs(idArray[3]) + '-L';
            }

            break
        }
        case 'pid': {
            if (id.indexOf('waiter-') > -1) {
                buttonEnabled.clear = idArray[3];
                buttonEnabled.terminateProcess = idArray[5] + '-W';

            } else if (idArray.length > 2) {
                buttonEnabled.clear = idArray[3];
                buttonEnabled.terminateProcess = idArray[1] + '-L';
            } else {
                buttonEnabled.terminateProcess = idArray[1] + '-L';

            }
        }
    }

    const btnLocksManagerClear = $('#btnLocksManagerClear');
    const btnLocksManagerTerminateProcess = $('#btnLocksManagerTerminateProcess');

    // Clear button
    if (buttonEnabled.clear === '') {
        btnLocksManagerClear
            .addClass('disabled')
            .attr('disabled', true)

    } else {
        btnLocksManagerClear
            .removeClass('disabled')
            .attr('disabled', false)
    }

    // terminate button
    if (buttonEnabled.terminateProcess === 0) {
        btnLocksManagerTerminateProcess
            .addClass('disabled')
            .attr('disabled', true)

    } else {
        btnLocksManagerTerminateProcess
            .removeClass('disabled')
            .attr('disabled', false)
    }

    app.ui.locksManager.currentMask = buttonEnabled;
};

app.ui.locksManager.findPidByNs = namespace => {
    let pid = 0;

    app.ui.locksManager.locksData.locks.forEach(lock => {
        if (lock.namespace === namespace) pid = lock.pid
    });

    return pid
};

app.ui.locksManager.refreshPressed = () => {
    app.ui.locksManager.refresh()
};

app.ui.locksManager.clearPressed = () => {
    app.ui.inputbox.show('You are going to clear the lock on: ' + app.ui.locksManager.currentMask.clear + '<br><br>' +
        'Do you want to proceed ?', 'WARNING', async ret => {
        if (ret === 'YES') {
            try {
                const res = await app.REST._clearLock(app.ui.locksManager.currentMask.clear);

                if (res.result === "OK") {
                    app.ui.locksManager.refresh();

                } else {
                    let msg = res.error.description;

                    if (Array.isArray(res.error.dump)) {
                        msg += '<br><br>';

                        res.error.dump.forEach(line => {
                            msg += line + '<br>'
                        });
                    }

                    app.ui.msgbox.show(msg, 'WARNING')
                }
            } catch (err) {
                app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');
            }
        }
    });
};

app.ui.locksManager.terminateProcessClicked = () => {
    const process = app.ui.locksManager.currentMask.terminateProcess.split('-');

    app.ui.inputbox.show('You are going to terminate process: ' + process[0] + (process[1] === 'W' ? ' belonging to a waiter for lock:<br><br>' + app.ui.locksManager.currentMask.clear : (app.ui.locksManager.currentMask.clear !== '' ? ' belonging to lock:<br><br>' + app.ui.locksManager.currentMask.clear : '')) + '<br><br>' +
        'Do you want to proceed ?', 'WARNING', async ret => {
        if (ret === 'YES') {
            try {
                const res = await app.REST._terminateProcess(process[0]);

                if (res.result === "OK") {
                    app.ui.locksManager.refresh();

                } else {
                    let msg = res.error.description;

                    if (Array.isArray(res.error.dump)) {
                        msg += '<br><br>';

                        res.error.dump.forEach(line => {
                            msg += line + '<br>'
                        });
                    }

                    app.ui.msgbox.show(msg, 'WARNING')
                }
            } catch (err) {
                app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');
            }
        }
    });
};

