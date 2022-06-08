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

    if ( testMode === true )  {
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

            await app.ui.msgbox.show('An error occurred while fetching the data', 'ERROR', true);
            return
        }

    } else {
        // **********************
        //execute REST call
        // **********************
        await app.ui.wait.show('Fetching database information...');

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

            await app.ui.msgbox.show('An error occurred while fetching the data', 'ERROR', true);
            return
        }
    }

    //debug info
    console.log(app.system);

    // **********************
    // YDB version
    // **********************
    $('#lblYottadbVersion').html(app.system.ydb_version || '');

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
        if ( filename !== '' && reg.replication !== undefined ) filename += reg.replication.flags.status > 0 ? ' *' : '';
        let row = '' +
            '<tr>' +
            '<td style="text-align: center;">' +
            '<button id="btnDashRegionView' + ix + '"" class="btn btn-outline-info btn-sm dash-plus-button" onclick="app.ui.regionView.show(\'' + region + '\')" type="button">' +
            '<i class="bi-zoom-in" ></i>' +
            '</button>' +
            '</td>' +
            '<td>' + region + '</td>' +
            '<td id="txtDashboardRegionTableFilename' + ix + '">' + filename + '</td>';

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
                    result.database.caption = 'Healthy';
                    result.database.class = 'ydb-status-green';
                    result.database.popup = {
                        visible: false
                    }
                }
            }
        } else {
            result.database.caption = app.ui.getKeyValue(reg.dbAccess.data, 'AUTO_DB') ? 'AutoDB, No File' : 'Critical';
            result.database.class = app.ui.getKeyValue(reg.dbAccess.data, 'AUTO_DB') ? 'ydb-status-amber' : 'ydb-status-red';
            result.database.popup = {
                visible: true,
                title: 'ISSUES',
                caption: app.ui.getKeyValue(reg.dbAccess.data, 'AUTO_DB') ? 'Database file doesn\'t exist. Please create it' : 'Database file missing'
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

        reg.popup = result;

        row += '<td class="table-row-pill">' +
            (result.journaling.popup.visible ? '<a tabindex="-1" role="button" data-toggle="popover" data-trigger="hover" title="ISSUES" data-content="' + result.journaling.popup.caption + '">' : '') +
            '<div class="table-pill ' + result.journaling.class + (result.database.popup.visible ? ' hand ' : '') + '" id="' + result.journaling.badgeId + '">' + result.journaling.caption +
            '</div>' +
            (result.journaling.popup.visible ? '</a>' : '') +
            '</td>';

        row += '</tr>';
        tblDashRegionsBody.append(row);
        if (reg.replication !== undefined && replStatus && reg.replication.flags === 2) app.ui.dashboard.flashList.push($('#' + result.journaling.badgeId))
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
        journaling: null,
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
        if ( reg.replication !== undefined && reg.replication.flags.status > 0 ) {
            status.replication = reg.replication.flags.status === REPL_STATUS_ENABLED ? replStatus.enabled = true : replStatus.wasOn = true;
        }
    });

    if ( replStatus.enabled ) status.replication = STATUS_ENABLED;
    if ( replStatus.wasOn ) status.replication = STATUS_CRITICAL;

    // Compute region data
    Object.keys(app.system.regions).forEach(region => {
        status.regionCount++;

        const reg = app.system.regions[region];

            // Database
            if ((reg.dbFile.flags.fileExist === false) || reg.dbFile.flags.fileBad) {
                status.database.each.push(STATUS_CRITICAL)
            }

            // Journal
            if (reg.replication !== undefined && reg.replication.flags.status === REPL_STATUS_WASON) {
                status.journaling = STATUS_CRITICAL;
            }
            if (reg.journal.flags.state === 1 && status.journaling === null) {
                status.journaling = STATUS_ISSUES
            }

            if (reg.popup.database.popup.visible) {
                status.popup.database += '<strong>' + region + ':&nbsp;</strong>' + reg.popup.database.popup.caption + '<br>'
            }

            if (reg.popup.journaling.popup.visible) {
                status.popup.journaling += '<strong>' + region + ':&nbsp;</strong>' + reg.popup.journaling.popup.caption + '<br>'
            }
    });

    if ( status.database.each.length === 0 ) status.database.overall = STATUS_HEALTHY;
    else status.database.overall = (status.database.each.length === status.regionCount);

    // Update screen
    app.ui.dashboard.setGlobalStatus(lblDashStatusDatabases, status.database.overall);
    app.ui.dashboard.setGlobalStatus(lblDashStatusJournals, status.journaling);
    app.ui.dashboard.setGlobalStatus(lblDashStatusReplication, status.replication);

    // Popups
    const lblDashStatusDatabasesPopup = $('#lblDashStatusDatabasesPopup');
    const lblDashStatusJournalsPopup = $('#lblDashStatusJournalsPopup');

    if ( status.popup.database === '' ) {
        lblDashStatusDatabasesPopup.attr('role', '');
        lblDashStatusDatabasesPopup.attr('data-toggle', '');

    } else {
        lblDashStatusDatabasesPopup.attr('role', 'button');
        lblDashStatusDatabasesPopup.attr('data-content', status.popup.database);
        lblDashStatusDatabasesPopup.attr('data-toggle', 'popover');
    }

    if ( status.popup.journaling === '' ) {
        lblDashStatusJournalsPopup.attr('role', '');
        lblDashStatusJournalsPopup.attr('data-toggle', 'popover');

    } else {
        lblDashStatusJournalsPopup.attr('role', 'button');
        lblDashStatusJournalsPopup.attr('data-content', status.popup.journaling);
        lblDashStatusJournalsPopup.attr('data-toggle', 'popover');
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
            '<div class="col-3">' +
            '<span id="lblDashStorageList' + ix + '" style="font-size: 12px"></span></div>' +
        '<div class="col-6">' +
            '<a tabindex="-1" role="button" data-toggle="popover" data-trigger="hover" title="Device info" id="hlpDashStorageUsage' + ix + '">' +
            '<div class="progress">' +
            '<div class="progress-bar ydb-status-green" role="progressbar" id="pgsDashStorageUsage' + ix + '" style="width: 23%; color: white; font-size: 15px;"></div>' +
            '</div></a></div></div></div>';

        $('#divDashStorageDevice0').append(chunk);

        $('#btnDashStorageView' + ix).on('click', () => app.ui.deviceInfo.show(ix));
        // usedBy list
        let usedByString = '';
        device.usedBy.forEach(usedByElement => {
            usedByString += '<strong>' + usedByElement.region + ':</strong> ' + usedByElement.file + '<BR>'
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
        help += '<strong>Total blocks: </strong>' + app.ui.formatThousands(device.totalBlocks) + '<br>';
        help += '<strong>Used blocks: </strong>' + app.ui.formatThousands(device.usedBlocks) + '<br>';
        help += '<strong>Free blocks: </strong>' + app.ui.formatThousands(device.freeBlocks);

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
            default: {}
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

    if ( statusValue === STATUS_HEALTHY ) {
        className = 'ydb-status-green';
        caption = 'Healthy';

    } else if ( statusValue === STATUS_ISSUES ) {
        className = 'ydb-status-amber';
        caption = 'Issues';

    } else if ( statusValue === STATUS_DISABLED ) {
        className = 'ydb-status-gray';
        caption = 'Disabled';

    } else if ( statusValue === STATUS_UNKNOWN ) {
        className = 'ydb-status-gray';
        caption = 'Unknown';

    } else if ( statusValue === STATUS_NO_GLD ) {
        className = 'ydb-status-amber';
        caption = 'NO .gld ';

    } else if ( statusValue === STATUS_ENABLED ) {
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
        if ( toggle ) {
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

