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


//*********************************************
// init()
//*********************************************
app.ui.dashboard.init = () => {
    $('#lblYottadbVersion').text('');

    app.ui.dashboard.resetGlobalStatus();
    app.ui.dashboard.resetRegions();
    app.ui.dashboard.resetMenus();
};

//*********************************************
// refresh()
//*********************************************
app.ui.dashboard.flashList = [];

app.ui.dashboard.refresh = async () => {

    // button status
    const STATUS_HEALTHY = null;
    const STATUS_ISSUES = false;
    const STATUS_CRITICAL = true;
    const STATUS_DISABLED = -1;
    const STATUS_UNKNOWN = -2;
    const STATUS_NO_GLD = -4;
    const STATUS_ENABLED = -5;

    const JOURNAL_STATE_DISABLED = 0;
    const JOURNAL_STATE_ENABLED_OFF = 1;
    const JOURNAL_STATE_ENABLED_ON = 2;

    const REPL_STATUS_DISABLED = 0;
    const REPL_STATUS_ENABLED = 1;
    const REPL_STATUS_WASON = 2;

    app.ui.dashboard.flashList = [];

    const lblDashStatusDatabases = $('#lblDashStatusDatabases');
    const lblDashStatusJournals = $('#lblDashStatusJournals');
    const lblDashStatusReplication = $('#lblDashStatusReplication');

    if (testMode === true) {
        // **********************
        // TEST MODE
        // **********************
        try {
            app.system = await getSystemData();
            if (app.system.result === 'WARNING') {
                let errors = '';
                if (Array.isArray(app.system.data.warnings)) {
                    app.system.data.warnings.forEach(warning => {
                        errors += warning + '<br>'
                    });
                }
                app.ui.msgbox.show('The following warnings occurred while fetching the data:<br>' + errors, 'WARNING')
            }

            app.system = app.system.data

        } catch (err) {
            app.ui.wait.hide();
            console.log(err);
            app.ui.dashboard.init();

            $('#menuSystemInfo').addClass('disabled').addClass('default').removeClass('hand');
            $('#menuSystemAdministration').addClass('disabled').addClass('default').removeClass('hand');
            $('#menuDevelopment').addClass('disabled').addClass('default').removeClass('hand');

            await app.ui.msgbox.show(app.REST.parseError(err), 'ERROR', true);
            return
        }

    } else {
        // **********************
        //execute REST call
        // **********************
        await app.ui.wait.show('Fetching dashboard information...');

        try {
            const response = await app.REST._dashboardGetAll();
            if (app.system.result === 'WARNING') {
                let errors = '';
                if (Array.isArray(app.system.data.warnings)) {
                    app.system.data.warnings.forEach(warning => {
                        errors += warning + '<br>'
                    });
                }
                app.ui.msgbox.show('The following warnings occurred while fetching the data:<br>' + errors, 'WARNING')
            }

            app.system = response.data

        } catch (err) {
            app.ui.wait.hide();
            console.log(err);
            app.ui.dashboard.init();

            $('#menuSystemInfo').addClass('disabled').addClass('default').removeClass('hand');
            $('#menuSystemAdministration').addClass('disabled').addClass('default').removeClass('hand');
            $('#menuDevelopment').addClass('disabled').addClass('default').removeClass('hand');

            await app.ui.msgbox.show(app.REST.parseError(err), 'ERROR', true);
            return
        }
    }

    // Process refresh
    app.ui.menu.processRefresh();

    // **********************
    // YDB version
    // **********************
    $('#lblYottadbVersion').html(app.system.ydb_version + '<span style="font-size: 10px;"> ( YDBGUI v' + app.version + ' )</span>');

    // **********************
    // .gld file missing
    // **********************
    if (app.system.gld.exist === false) {
        // Update screen
        app.ui.dashboard.setGlobalStatus(lblDashStatusDatabases, STATUS_NO_GLD);
        app.ui.dashboard.setGlobalStatus(lblDashStatusJournals, STATUS_UNKNOWN);
        app.ui.dashboard.setGlobalStatus(lblDashStatusReplication, STATUS_UNKNOWN);
        app.ui.dashboard.resetRegions();

        $('#menuSystemAdministration').addClass('disabled').addClass('hand');
        $('#menuDevelopment').addClass('disabled').addClass('hand');

        app.ui.wait.hide();

        await app.ui.msgbox.show('The .gld file doesn\'t exists', 'FATAL', true);

        return
    }

    app.ui.wait.hide();

    // **********************
    // Regions
    // **********************

    // Clear the table
    const tblDashRegionsBody = $('#tblDashRegions> tbody');
    $(tblDashRegionsBody).empty();


    Object.keys(app.system.regions).forEach((region, ix) => {
        const reg = app.system.regions[region];

        // detailed info for subsequent popups
        const result = {
            database: {},
            journaling: {},
            replication: {}
        };

        let filename = app.ui.getKeyValue(reg.dbFile.data, 'FILE_NAME');
        if (filename !== '' && reg.replication !== undefined) filename += reg.replication.flags.status > 0 ? ' *' : '';
        let row = '' +
            '<tr>' +
            '<td style="text-align: center;">' +
            '<button id="btnDashRegionView' + ix + '"" class="btn btn-outline-info btn-sm dash-plus-button" onclick="app.ui.regionView.show(\'' + region + '\')" type="button">' +
            '<i class="bi-zoom-in"></i>' +
            '</button>' +
            '</td>' +
            '<td>' + region + '</td>' +
            '<td id="txtDashboardRegionTableFilename' + ix + '" class="inconsolata">' + filename + '</td>';

        // Database status
        if (reg.dbFile.flags.fileExist) {
            if (reg.dbFile.flags.fileBad === true) {
                // File exists and is BAD
                result.database.caption = 'Critical';
                result.database.class = 'ydb-status-red';
                result.database.popup = {
                    visible: true,
                    title: 'ISSUES',
                    caption: 'The database file is corrupted'
                }

            } else {
                if (reg.dbFile.flags.shmenHealthy === false) {
                    // shmem is BAD
                    result.database.caption = 'Critical';
                    result.database.class = 'ydb-status-red';
                    result.database.popup = {
                        visible: true,
                        title: 'ISSUES',
                        caption: 'The database shared memory is corrupted'
                    }
                } else {
                    // File exist and is GOOD
                    // check extension
                    const dbStatus = app.ui.dashboard.computeRegionSpace(reg);
                    if (dbStatus.class !== 'ydb-status-green') {
                        result.database = dbStatus

                    } else {
                        if (reg.dbFile.flags.freeze > 0) {
                            result.database.caption = 'Issues';
                            result.database.class = 'ydb-status-amber';
                            result.database.popup = {
                                visible: true,
                                title: 'ISSUES',
                                caption: 'The database is frozen by user: ' + reg.dbFile.flags.freeze
                            }
                        } else {

                            result.database.caption = 'Healthy';
                            result.database.class = 'ydb-status-green';
                            result.database.popup = {
                                visible: false
                            }
                        }
                    }
                }
            }
        } else {
            result.database.caption = app.ui.getKeyValue(reg.dbFile.data, 'AUTO_DB') ? 'AutoDB, No File' : 'Critical';
            result.database.class = app.ui.getKeyValue(reg.dbFile.data, 'AUTO_DB') ? 'ydb-status-amber' : 'ydb-status-red';
            result.database.popup = {
                visible: true,
                title: 'ISSUES',
                caption: app.ui.getKeyValue(reg.dbFile.data, 'AUTO_DB') ? 'Database file doesn\'t exist. Please create it' : 'Database file missing'
            }

        }

        row += '<td class="table-row-pill">' +
            (result.database.popup.visible ? '<a tabindex="-1" role="button" data-toggle="popover" data-trigger="hover" title="ISSUES" data-content="' + result.database.popup.caption + '">' : '') +
            '<div id="pillDashboardRegionTableDb' + ix + '" class="table-pill  ' + result.database.class + (result.database.popup.visible ? ' hand ' : '') + '">' +
            result.database.caption +
            '</div>' +
            (result.database.popup.visible ? '</a>' : '') +
            '</td>';

        // Journaling status
        result.journaling.badgeId = 'bdgSplashRegionsJournal' + ix;

        const replStatus = reg.replication !== undefined;

        if (reg.dbFile.flags.fileExist === false) {
            result.journaling.class = 'ydb-status-gray';
            result.journaling.caption = 'Disabled';
            result.journaling.popup = {
                visible: false
            }

        } else {

            if (reg.journal.flags.state === 2 && (reg.journal.flags.fileExist === false || app.ui.getKeyValue(reg.journal.data, 'JFILE_NAME') === '')) {
                result.journaling.class = 'ydb-status-red';
                result.journaling.caption = 'NO FILE';
                result.journaling.popup = {
                    visible: true,
                    title: 'ISSUES',
                    caption: 'The file is missing'
                }

            } else {

                if (replStatus && reg.replication.flags.status === REPL_STATUS_WASON) {
                    result.journaling.class = 'ydb-status-red';
                    result.journaling.caption = 'WAS ON';
                    result.journaling.popup = {
                        visible: true,
                        title: 'ISSUES',
                        caption: 'Replication is in WAS ON status'
                    }
                } else {
                    if (replStatus && reg.replication.flags.status > 0 && reg.dbFile.flags.sessions > 0) {
                        // replicated region and active (sessions > 0)
                        if (reg.journal.flags.state === 1) {
                            result.journaling.class = 'ydb-status-red';
                            result.journaling.caption = 'Critical';
                            result.journaling.popup = {
                                visible: true,
                                title: 'Critical',
                                caption: 'Journaling must be turned on in an active replicated region'
                            }

                        } else if (reg.journal.flags.state === JOURNAL_STATE_DISABLED) {
                            result.journaling.class = 'ydb-status-red';
                            result.journaling.caption = 'Critical';
                            result.journaling.popup = {
                                visible: true,
                                title: 'Critical',
                                caption: 'Journaling must be enabled and turned on in an active replicated region'
                            }
                        } else {
                            result.journaling.caption = app.ui.getKeyValue(reg.journal.data, 'BEFORE') ? 'BeforeImage' : 'Nobefore Image';
                            result.journaling.popup = {
                                visible: false
                            };

                            result.journaling.class = 'ydb-status-green';

                        }
                    } else {
                        // not replicated region

                        if (reg.journal.flags === undefined) reg.journal.flags = {state: 0};

                        if (reg.journal.flags.state === JOURNAL_STATE_DISABLED) {
                            result.journaling.class = 'ydb-status-gray';
                            result.journaling.caption = 'Disabled';
                            result.journaling.popup = {
                                visible: false
                            }

                        } else if (reg.journal.flags.state === JOURNAL_STATE_ENABLED_OFF) {
                            result.journaling.class = 'ydb-status-amber';
                            result.journaling.caption = 'Enabled/Off';
                            result.journaling.popup = {
                                visible: true,
                                title: 'Issues',
                                caption: 'Journaling needs to be turned on'
                            }

                        } else {
                            result.journaling.caption = app.ui.getKeyValue(reg.journal.data, 'BEFORE') ? 'BeforeImage' : 'Nobefore Image';
                            result.journaling.popup = {
                                visible: false
                            };

                            result.journaling.class = 'ydb-status-green';
                        }
                    }
                }
            }
        }

        reg.popup = result;

        row += '<td class="table-row-pill">' +
            (result.journaling.popup.visible ? '<a tabindex="-1" role="button" data-toggle="popover" data-trigger="hover" title="ISSUES" data-content="' + result.journaling.popup.caption + '">' : '') +
            '<div class="table-pill ' + result.journaling.class + (result.database.popup.visible ? ' hand ' : '') + '" id="' + result.journaling.badgeId + '">' + result.journaling.caption +
            '</div>' +
            (result.journaling.popup.visible ? '</a>' : '') +
            '</td>';

        row += '</tr>';
        tblDashRegionsBody.append(row);

        // check flash status and push into list if needed
        if (reg.replication !== undefined && replStatus && reg.replication.flags === 2) app.ui.dashboard.flashList.push($('#' + result.journaling.badgeId));
        if (result.database.flash !== undefined && result.database.flash === true) app.ui.dashboard.flashList.push($('#pillDashboardRegionTableDb' + ix));
    });

    // **********************
    // Global status
    // **********************

    const status = {
        regionCount: 0,
        replication: STATUS_DISABLED,
        database: {
            each: [],
            overall: null
        },
        journaling: {
            each: [],
            overall: null
        },
        popup: {
            database: '',
            journaling: ''
        }
    };

    // Compute replication data
    status.replication = STATUS_DISABLED;

    let replStatus = {
        enabled: false,
        wasOn: false
    };

    Object.keys(app.system.regions).forEach(region => {
        const reg = app.system.regions[region];
        if (reg.replication !== undefined && reg.replication.flags.status > 0) {
            status.replication = reg.replication.flags.status === REPL_STATUS_ENABLED ? replStatus.enabled = true : replStatus.wasOn = true;
        }
    });

    if (replStatus.enabled) status.replication = STATUS_ENABLED;
    if (replStatus.wasOn) status.replication = STATUS_CRITICAL;

    // Compute region data
    Object.keys(app.system.regions).forEach(region => {
        status.regionCount++;

        const reg = app.system.regions[region];

        // Database
        if ((reg.dbFile.flags.fileExist === false) || reg.dbFile.flags.fileBad) {
            status.database.each.push(STATUS_CRITICAL);
            status.popup.database += '<strong>' + region + ':&nbsp;</strong>' + reg.popup.database.popup.caption + '<br>'
        } else {

            if (reg.popup.database.popup.visible) {
                status.database.each.push(reg.popup.database.class === 'ydb-status-red' ? STATUS_CRITICAL : STATUS_ISSUES);
                status.popup.database += '<strong>' + region + ':&nbsp;</strong>' + reg.popup.database.popup.caption + '<br>'
            }

            // Journal
            if (reg.replication !== undefined && reg.replication.flags.status === REPL_STATUS_WASON) {
                status.journaling.each.push(STATUS_CRITICAL);
                status.journaling.overall = STATUS_CRITICAL;

            } else if (reg.journal.flags.state === 1 && status.journaling === null) {
                status.journaling.each.push(STATUS_ISSUES);

            } else if (reg.popup.journaling.popup.visible) {
                status.popup.journaling += '<strong>' + region + ':&nbsp;</strong>' + reg.popup.journaling.popup.caption + '<br>';
                status.journaling.each.push(STATUS_ISSUES);
            }
        }
    });

    if (status.database.each.length === 0) status.database.overall = STATUS_HEALTHY;
    else status.database.overall = (status.database.each.length === status.regionCount);

    if (status.journaling.each.length === 0) status.journaling.overall = STATUS_HEALTHY;
    else status.journaling.overall = status.journaling.overall === STATUS_CRITICAL ? STATUS_CRITICAL : (status.journaling.each.length === status.regionCount ? STATUS_ISSUES : false);

    // Update screen
    app.ui.dashboard.setGlobalStatus(lblDashStatusDatabases, status.database.overall);
    app.ui.dashboard.setGlobalStatus(lblDashStatusJournals, status.journaling.overall);
    app.ui.dashboard.setGlobalStatus(lblDashStatusReplication, status.replication);

    // Popups
    const lblDashStatusDatabasesPopup = $('#lblDashStatusDatabasesPopup');
    const lblDashStatusJournalsPopup = $('#lblDashStatusJournalsPopup');

    if (status.popup.database === '') {
        lblDashStatusDatabasesPopup.attr('role', '');
        lblDashStatusDatabasesPopup.attr('data-content', '');
        lblDashStatusDatabasesPopup.attr('data-toggle', '');

        lblDashStatusDatabases.removeClass('hand');

    } else {
        lblDashStatusDatabasesPopup.attr('role', 'button');
        lblDashStatusDatabasesPopup.attr('data-content', status.popup.database);
        lblDashStatusDatabasesPopup.attr('data-toggle', 'popover');

        lblDashStatusDatabases.addClass('hand');
    }

    if (status.popup.journaling === '') {
        lblDashStatusJournalsPopup.attr('role', '');
        lblDashStatusJournalsPopup.attr('data-content', '');
        lblDashStatusJournalsPopup.attr('data-toggle', 'popover');

        lblDashStatusJournals.removeClass('hand');

    } else {
        lblDashStatusJournalsPopup.attr('role', 'button');
        lblDashStatusJournalsPopup.attr('data-content', status.popup.journaling);
        lblDashStatusJournalsPopup.attr('data-toggle', 'popover');

        lblDashStatusJournals.addClass('hand');
    }

    // **********************
    // Storage
    // **********************

    // Clear all panels
    $('#divDashStorageDevice0').empty();

    // Loop through the devices
    app.system.devices.forEach((device, ix) => {

        let chunk = '<div class="bg-white rounded-lg p-3 shadow ydb-back6">' +
            '<div class="row">' +
            '<div class="col-2 ydb-fore3">' +
            '<b>' + (ix === 0 ? 'Storage Usage:' : '') + '</b>' +
            '</div>' +
            '<div class="col-1">' +
            '<button class="btn btn-outline-info btn-sm dash-plus-button" type="button" id="btnDashStorageView' + ix + '"><i class="bi-zoom-in"></i></button>' +
            '</div>' +
            '<div class="col-4">' +
            '<span id="lblDashStorageList' + ix + '" style="font-size: 12px"></span></div>' +
            '<div class="col-5">' +
            '<a tabindex="-1" role="button" data-toggle="popover" data-trigger="hover" title="Device info" id="hlpDashStorageUsage' + ix + '">' +
            '<div class="progress">' +
            '<div class="progress-bar ydb-status-green hand" role="progressbar" id="pgsDashStorageUsage' + ix + '" style="width: 23%; color: white; font-size: 15px;"></div>' +
            '</div></a></div></div></div>';

        $('#divDashStorageDevice0').append(chunk);

        $('#btnDashStorageView' + ix).on('click', () => app.ui.deviceInfo.show(ix));
        // usedBy list
        let usedByString = '';
        device.usedBy.forEach(usedByElement => {
            usedByString += '<strong>' + usedByElement.region + ':</strong> <span class="inconsolata">' + usedByElement.file + '</span><BR>'
        });
        $('#lblDashStorageList' + ix).html(usedByString);

        // range
        const pgsDashStorageUsage = $('#pgsDashStorageUsage' + ix);
        pgsDashStorageUsage
            .css('width', device.percentUsed + '%')
            .text(device.percentUsed + ' %');

        const rangeStyle = {};
        app.userSettings.dashboard.storageRanges.forEach(el => {
            if (device.percentUsed >= el.min && device.percentUsed <= el.max) {
                rangeStyle.class = el.class;
                rangeStyle.flash = el.flash;
            }
        });

        // range help
        let help = '<strong>Mount point: </strong>' + device.mountPoint + '<br>';
        const divideFactor = device.fsBlockSize / 1024;
        help += '<strong>Total blocks: </strong>' + app.ui.formatThousands(device.totalBlocks / divideFactor) + ' (' + app.ui.formatBytes(device.totalBlocks * 1024) + ')<br>';
        help += '<strong>Used blocks: </strong>' + app.ui.formatThousands(device.usedBlocks / divideFactor) + ' (' + app.ui.formatBytes(device.usedBlocks * 1024) + ')<br>';
        help += '<strong>Free blocks: </strong>' + app.ui.formatThousands(device.freeBlocks / divideFactor) + ' (' + app.ui.formatBytes(device.freeBlocks * 1024) + ')';

        let title = '';
        switch (rangeStyle.class) {
            case 'ydb-status-red': {
                title = 'Critical : Low space condition';
                help = 'You are running out of disk space on this device. Take action immediately !<br>' + help;
                break
            }
            case 'ydb-status-amber': {
                title = 'Warning : Low space condition';
                help = 'This device is running low on disk space. <br>' + help;
                break
            }
            default: {
            }
        }

        $('#hlpDashStorageUsage' + ix)
            .attr('title', title)
            .attr('data-content', help);

        // Perform the refresh
        pgsDashStorageUsage
            .removeClass('ydb-status-red ydb-status-green ydb-status-amber ydb-status-gray')
            .addClass(rangeStyle.class);

        // push element in flash list for flashing effect
        if (rangeStyle.flash) app.ui.dashboard.flashList.push(pgsDashStorageUsage);

        // display the section
        $('#divDashStorageDevice' + ix).css('display', 'block');

    });

    // re-generate the pop ups
    $('[data-toggle="popover"]').popover({
        html: true, container: 'body', template: '' +
            '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header ydb-popover-header"></h3><div class="popover-body"></div></div>'
    });

    // flash if needed
    if (app.ui.dashboard.flashList.length) app.ui.dashboard.flash();
};

app.ui.dashboard.setGlobalStatus = (element, statusValue) => {
    let className;
    let caption;

    const STATUS_HEALTHY = null;
    const STATUS_ISSUES = false;
    const STATUS_CRITICAL = true;
    const STATUS_DISABLED = -1;
    const STATUS_UNKNOWN = -2;
    const STATUS_NO_GLD = -4;
    const STATUS_ENABLED = -5;

    if (statusValue === STATUS_HEALTHY) {
        className = 'ydb-status-green';
        caption = 'Healthy';

    } else if (statusValue === STATUS_ISSUES) {
        className = 'ydb-status-amber';
        caption = 'Issues';

    } else if (statusValue === STATUS_DISABLED) {
        className = 'ydb-status-gray';
        caption = 'Disabled';

    } else if (statusValue === STATUS_UNKNOWN) {
        className = 'ydb-status-gray';
        caption = 'Unknown';

    } else if (statusValue === STATUS_NO_GLD) {
        className = 'ydb-status-amber';
        caption = 'NO .gld ';

    } else if (statusValue === STATUS_ENABLED) {
        className = 'ydb-status-green';
        caption = 'Enabled';

    } else {
        className = 'ydb-status-red';
        caption = 'Critical';
        // push element in flash list for flashing effect
        app.ui.dashboard.flashList.push(element)
    }

    element
        .removeClass('ydb-status-red ydb-status-green ydb-status-amber ydb-status-gray')
        .addClass(className)
        .text(caption);
};

// Reset code
app.ui.dashboard.resetGlobalStatus = () => {
    // Global status
    $('#lblDashStatusDatabases')
        .removeClass('ydb-status-red ydb-status-green ydb-status-amber ydb-status-gray')
        .addClass('ydb-status-gray')
        .text('Unknown');
    $('#lblDashStatusJournals')
        .removeClass('ydb-status-red ydb-status-green ydb-status-amber ydb-status-gray')
        .addClass('ydb-status-gray')
        .text('Unknown');
    $('#lblDashStatusReplication')
        .removeClass('ydb-status-red ydb-status-green ydb-status-amber ydb-status-gray')
        .addClass('ydb-status-gray')
        .text('Unknown');
};

app.ui.dashboard.resetRegions = () => {
    // Regions
    $("#tblDashRegions > tbody").empty();
};

app.ui.dashboard.resetMenus = () => {
    $('#menuSystemInfo').removeClass('disabled').removeClass('default').addClass('hand');
    $('#menuSystemAdministration').removeClass('disabled').removeClass('default').addClass('hand');
    $('#menuSystemDevelopment').removeClass('disabled').removeClass('default').addClass('hand');

};

// Flashing
app.ui.dashboard.flash = () => {
    let toggle = false;

    setInterval(() => {
        if (toggle) {
            toggle = false;
            app.ui.dashboard.flashList.forEach(el => {
                el.removeClass('ydb-status-red').addClass('ydb-status-gray-no-border')
            })
        } else {
            toggle = true;
            app.ui.dashboard.flashList.forEach(el => {
                el.removeClass('ydb-status-gray-no-border').addClass('ydb-status-red')
            })

        }
    }, app.userSettings.dashboard.flashInterval)
};

// compute alerts for db file free space vs device free space
app.ui.dashboard.computeRegionSpace = region => {

    // determine what kind of check has to be done
    const extension = app.ui.getKeyValue(region.dbFile.data, 'EXTENSION_COUNT');
    const freeSpaceBytes = region.dbFile.flags.device.split(' ')[3] * 1024;
    let rangeStyle = {};

    if (extension === 0) {
        const dbSizeBytesPercent = (region.dbFile.usage.totalBlocks * app.ui.getKeyValue(region.dbFile.data, 'BLOCK_SIZE')) / 100;

        app.userSettings.dashboard.manualExtend.forEach(el => {
            if (freeSpaceBytes >= (dbSizeBytesPercent * el.min) && freeSpaceBytes <= (dbSizeBytesPercent * el.max)) {
                if (el.class !== 'ydb-status-green') {
                    rangeStyle = {
                        class: el.class,
                        flash: el.flash,
                        caption: el.class === 'ydb-status-red' ? 'Critical' : 'Issues',
                        popup: {
                            visible: true,
                            title: 'Issues',
                            caption: 'You have a low disk space for extension'
                        }
                    };

                } else {
                    rangeStyle = {
                        class: el.class,
                        flash: el.flash,
                        caption: 'Healthy',
                        popup: {
                            visible: false,
                            title: '',
                            caption: ''
                        }
                    }
                }
            }
        });

    } else {
        const extensionBytes = extension * app.ui.getKeyValue(region.dbFile.data, 'BLOCK_SIZE');
        let numberOfExtensions = Math.round(freeSpaceBytes / extensionBytes);
        if (numberOfExtensions < 0) numberOfExtensions = 0;

        app.userSettings.dashboard.autoExtend.forEach(el => {
            if (numberOfExtensions >= el.min && numberOfExtensions <= el.max) {
                if (el.class !== 'ydb-status-green') {
                    rangeStyle = {
                        class: el.class,
                        flash: el.flash,
                        caption: el.class === 'ydb-status-red' ? 'Critical' : 'Issues',
                        popup: {
                            visible: true,
                            title: 'Issues',
                            caption: 'You have ' + numberOfExtensions + ' extensions left on this device'
                        }
                    };

                } else {
                    rangeStyle = {
                        class: el.class,
                        flash: el.flash,
                        caption: 'Healthy',
                        popup: {
                            visible: false,
                            title: '',
                            caption: ''
                        }
                    }
                }
            }
        });
    }

    return rangeStyle
};
