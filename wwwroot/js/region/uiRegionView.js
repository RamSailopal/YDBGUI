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

app.ui.regionView.init = () => {
    $('#btnRegionViewRefresh').on('click', () => app.ui.regionView.refreshBtn());
    $('#chkRegionViewAdvancedMode').on('click', () => app.ui.regionView.refresh());

    $('#modalRegionView').on('hide.bs.modal', () => {
        if (app.ui.regionView.isFresh) {
            app.ui.dashboard.refresh()
        }
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (event) {
        const divRegionViewAdvancedParameters = $('#divRegionViewAdvancedParameters');
        const target = event.target.toString();

        if (target.indexOf('Names') > -1 || target.indexOf('Stats') > -1 || target.indexOf('Locks') > -1) {
            divRegionViewAdvancedParameters.css('display', 'none');

        } else {
            divRegionViewAdvancedParameters.css('display', 'inline');
        }
    });
};

app.ui.regionView.isFresh = false;

app.ui.regionView.currentRegion = '';

app.ui.regionView.show = regionName => {
    $('#btnRegionViewRegionExtendDbFile').on('click', () => app.ui.regionExtend.show(regionName));
    $('#btnRegionViewRegionCreateDbFile').on('click', () => app.ui.regionCreateDbFile.show(regionName));

    //clear the checkbox
    $('#chkRegionViewAdvancedMode').prop('checked', false);
    // and ensure it is visible
    $('#divRegionViewAdvancedParameters').css('display', 'inline');

    // ************************************
    // DISPLAY DIALOG
    // ************************************
    $('#navRegionViewRegion').tab('show');

    app.ui.regionView.currentRegion = regionName;

    app.ui.regionView.refresh();
    app.ui.regionView.isFresh = false;

    $('#modalRegionView').modal({show: true, backdrop: 'static', keyboard: true});
};

app.ui.regionView.refresh = () => {
    const region = app.system.regions[app.ui.regionView.currentRegion];
    const regionName = app.ui.regionView.currentRegion;

    // TITLE
    $('#lblRegionViewTitle').text(regionName);

    const JOURNAL_STATE_DISABLED = 0;
    const JOURNAL_STATE_ENABLED_OFF = 1;
    const JOURNAL_STATE_ENABLED_ON = 2;

    const REPL_STATUS_DISABLED = 0;
    const REPL_STATUS_ENABLED = 1;
    const REPL_STATUS_WASON = 2;

    // ************************************
    // REGION
    // ************************************

    // Database status
    const result = {
        database: {},
        journaling: {}
    };

    if (region.dbFile.flags.fileExist) {
        if (region.dbFile.flags.fileBad === true) {
            // File exists and is BAD
            result.database.caption = 'Critical';
            result.database.class = 'ydb-status-red';
            result.database.alert = 'The database file exists, but it is corrupted.';

        } else {
            if (region.dbFile.flags.shmenHealthy === false) {
                // shmem is BAD
                result.database.caption = 'Critical';
                result.database.class = 'ydb-status-red';
                result.database.alert = 'The database shared memory is corrupted'
            } else {
                // File exist and is GOOD

                // check extension
                const dbStatus = app.ui.dashboard.computeRegionSpace(region);
                if (dbStatus.class !== 'ydb-status-green') {
                    // Extension is fine, no issues found
                    result.database.caption = dbStatus.caption;
                    result.database.class = dbStatus.class;
                    result.database.alert = dbStatus.popup.caption

                } // check freeze status
                else if (region.dbFile.flags.freeze > 0) {
                    result.database.caption = 'Issue';
                    result.database.class = 'ydb-status-amber';
                    result.database.alert = 'The database is frozen by user: ' + region.dbFile.flags.freeze

                } else {
                    result.database.caption = 'Healthy';
                    result.database.class = 'ydb-status-green';
                    result.database.alert = ''
                }
            }
        }

    } else {
        result.database.caption = app.ui.getKeyValue(region.dbFile.data, 'AUTO_DB') ? 'No database file' : 'Critical';
        result.database.class = app.ui.getKeyValue(region.dbFile.data, 'AUTO_DB') ? 'ydb-status-amber' : 'ydb-status-red';
        result.database.alert = 'The database file is missing.';
    }

    $('#pillRegionViewRegionStatus')
        .text(result.database.caption)
        .removeClass('ydb-status-red ydb-status-green ydb-status-amber ydb-status-gray')
        .addClass(result.database.class);

    const divRegionViewRegionAlert = $('#divRegionViewRegionAlert');
    const tblRegionViewRegionRegion = $('#tblRegionViewRegionRegion');

    if (result.database.alert === '') {
        divRegionViewRegionAlert.css('display', 'none');
        tblRegionViewRegionRegion.css('height', '260px')

    } else {
        $('#lblRegionViewRegionAlert')
            .html(result.database.alert)
            .removeClass('ydb-status-red ydb-status-green ydb-status-amber ydb-status-gray')
            .addClass(result.database.class);
        divRegionViewRegionAlert
            .css('display', 'block')
            .css('height', '56px')
    }

    // Used space
    const blockSize = app.ui.getKeyValue(region.dbFile.data, 'BLOCK_SIZE');
    const rngRegionViewRegionUsedSpace = $('#rngRegionViewRegionUsedSpace');
    if (region.dbFile.flags.fileExist && region.dbFile.flags.fileBad === false) {
        rngRegionViewRegionUsedSpace
            .css('width', region.dbFile.usage.usedPercent + '%')
            .text(region.dbFile.usage.usedPercent + ' %');

        const extension = app.ui.getKeyValue(region.dbFile.data, 'EXTENSION_COUNT');
        const rangeStyle = {};

        // Use ranges only if extension is 0
        if (extension > 0) {
            rangeStyle.class = 'ydb-status-green';
            rangeStyle.flash = false
        } else {
            app.userSettings.dashboard.regionRanges.forEach(el => {
                if (region.dbFile.usage.usedPercent >= el.min && region.dbFile.usage.usedPercent <= el.max) {
                    rangeStyle.class = el.class;
                    rangeStyle.flash = el.flash;
                }
            });
        }
        rngRegionViewRegionUsedSpace
            .removeClass('ydb-status-red ydb-status-green ydb-status-amber ydb-status-gray')
            .addClass(rangeStyle.class);

        // and related popup
        const devicePopup = '<strong>Total blocks:</strong> ' + app.ui.formatThousands(region.dbFile.usage.totalBlocks) + ' ( ' + app.ui.formatBytes(region.dbFile.usage.totalBlocks * blockSize) + ' )<br>' +
            '<strong>Free blocks: </strong>' + app.ui.formatThousands(region.dbFile.usage.freeBlocks) + ' ( ' + app.ui.formatBytes(region.dbFile.usage.freeBlocks * blockSize) + ' )<br>' +
            '<strong>Used blocks: </strong>' + app.ui.formatThousands(region.dbFile.usage.usedBlocks) + ' ( ' + app.ui.formatBytes(region.dbFile.usage.usedBlocks * blockSize) + ' )';

        $('#puRegionViewDbUsage')
            .attr('data-content', devicePopup)
        //.attr('title','Device usage');
    } else {
        rngRegionViewRegionUsedSpace
            .css('width', '100%')
            .css('border-color', 'white!important')
            .text(0 + ' %')
            .removeClass('ydb-status-red ydb-status-green ydb-status-amber ydb-status-gray')
            .addClass('ydb-status-gray');

    }


    // User Sessions
    const pillRegionViewRegionSessions = $('#pillRegionViewRegionSessions');
    if (region.dbFile.flags.fileExist && region.dbFile.flags.fileBad === false) {
        pillRegionViewRegionSessions.text(region.dbFile.flags.sessions);

    } else {
        pillRegionViewRegionSessions.text('n/a');
    }

    // Database file table
    const divRegionViewRegionTables = $('#divRegionViewRegionTables');
    if ((region.dbFile.flags.fileExist === false && app.ui.getKeyValue(region.dbFile.data, 'FILE_NAME') === '') || (region.dbFile.flags.fileExist === true && region.dbFile.flags.fileBad === true)) {
        divRegionViewRegionTables.css('display', 'none');

    } else {
        divRegionViewRegionTables.css('display', 'block');

        const tblRegionViewRegionRegion = $('#tblRegionViewRegionRegion > tbody');
        const divRegionViewTableLeftContainer = $('#divRegionViewTableLeftContainer');

        if (divRegionViewRegionAlert.css('display') === 'block') {
            divRegionViewTableLeftContainer.css('height', 206)

        } else {
            divRegionViewTableLeftContainer.css('height', 260)
        }

        tblRegionViewRegionRegion.empty();

        region.dbFile.data.forEach(el => {
            let rowData = '';
            for (const key in el) {
                rowData += app.ui.regionView.renderRow(key, el[key])
            }
            tblRegionViewRegionRegion.append(rowData)
        });

        const tblRegionViewRegionSegment = $('#tblRegionViewRegionSegment > tbody');
        $(tblRegionViewRegionSegment).empty();

        if (region.dbAccess !== undefined && region.dbAccess.data !== undefined && Array.isArray(region.dbAccess.data)) {
            region.dbAccess.data.forEach(el => {
                let rowData = '';
                for (const key in el) {
                    rowData += app.ui.regionView.renderRow(key, el[key])
                }
                tblRegionViewRegionSegment.append(rowData)
            });
        }
    }

    // button create db
    const btnRegionViewRegionCreateDbFile = $('#btnRegionViewRegionCreateDbFile');

    if (region.dbFile.flags.fileExist === false) {
        if (app.ui.getKeyValue(region.dbFile.data, 'FILE_NAME') === '') {
            btnRegionViewRegionCreateDbFile
                .attr('disabled', true)
                .addClass('disabled')

        } else {
            btnRegionViewRegionCreateDbFile
                .attr('disabled', false)
                .removeClass('disabled')
        }
    } else {
        btnRegionViewRegionCreateDbFile
            .attr('disabled', true)
            .addClass('disabled')
    }

    // button extend db
    const btnRegionViewRegionExtendDbFile = $('#btnRegionViewRegionExtendDbFile');

    if (region.dbFile.flags.fileExist === true) {
        if (region.dbFile.flags.fileBad === true) {
            btnRegionViewRegionExtendDbFile
                .attr('disabled', true)
                .addClass('disabled')

        } else {
            btnRegionViewRegionExtendDbFile
                .attr('disabled', false)
                .removeClass('disabled')
        }

    } else {
        btnRegionViewRegionExtendDbFile
            .attr('disabled', true)
            .addClass('disabled')
    }

    // ************************************
    // JOURNAL
    // ************************************
    const navRegionViewJournal = $('#navRegionViewJournal');
    const btnRegionViewJournalSwitch = $('#btnRegionViewJournalSwitch');
    let journalFileMissing = false;

    btnRegionViewJournalSwitch.on('click', () => app.ui.regionJournalSwitch.show(regionName));

    navRegionViewJournal.removeClass('disabled');
    if (region.dbFile.flags.fileExist === false || (region.dbFile.flags.fileExist && region.dbFile.flags.fileBad)) {
        navRegionViewJournal.addClass('disabled');
        btnRegionViewJournalSwitch.css('display', 'none');

    } else {
        // Journal status pill
        const replStatus = region.replication !== undefined;

        if (region.journal.flags.state === JOURNAL_STATE_ENABLED_ON && (region.journal.flags.fileExist === false || app.ui.getKeyValue(region.journal.data, 'JFILE_NAME') === '')) {
            result.journaling.class = 'ydb-status-red';
            result.journaling.caption = 'NO FILE';
            result.journaling.alert = 'The journal file is missing';
            $('#btnRegionViewJournalSwitch').text('Recreate...');
            journalFileMissing = true;


        } else {
            if (replStatus && region.replication.flags.status === REPL_STATUS_WASON) {
                result.journaling.class = 'ydb-status-red';
                result.journaling.caption = 'WAS ON';
                result.journaling.alert = 'Replication is in WAS ON status'

            } else {
                if (replStatus && region.replication.flags.status > 0 && region.dbFile.flags.sessions > 0) {
                    // replicated region and active (sessions > 0)
                    if (region.journal.flags.state === JOURNAL_STATE_ENABLED_OFF) {
                        result.journaling.class = 'ydb-status-red';
                        result.journaling.caption = 'Critical';
                        result.journaling.alert = 'Journaling must be turned on in an active replicated region'

                    } else if (region.journal.flags.state === JOURNAL_STATE_DISABLED) {
                        result.journaling.class = 'ydb-status-red';
                        result.journaling.caption = 'Critical';
                        result.journaling.alert = 'Journaling must be enabled and turned on in an active replicated region'
                    } else {
                        result.journaling.caption = 'Enabled / On';
                        result.journaling.alert = '';
                        result.journaling.class = 'ydb-status-green';
                    }

                } else {
                    // not replicated region

                    if (region.journal.flags === undefined) region.journal.flags = {state: JOURNAL_STATE_DISABLED};

                    if (region.journal.flags.state === JOURNAL_STATE_DISABLED) {
                        result.journaling.class = 'ydb-status-gray';
                        result.journaling.caption = 'Disabled';
                        result.journaling.alert = ''

                    } else if (region.journal.flags.state === JOURNAL_STATE_ENABLED_OFF) {
                        result.journaling.class = 'ydb-status-amber';
                        result.journaling.caption = 'Enabled/Off';
                        result.journaling.alert = 'Journaling needs to be turned on'

                    } else {
                        result.journaling.caption = 'Enabled / On';
                        result.journaling.alert = '';
                        result.journaling.class = 'ydb-status-green';

                    }
                }
            }
        }

        $('#lblRegionViewJournalStatus')
            .html(result.journaling.caption)
            .removeClass('ydb-status-red ydb-status-green ydb-status-amber ydb-status-gray')
            .addClass(result.journaling.class);

        if (journalFileMissing === false) {
            btnRegionViewJournalSwitch.text((region.journal.flags.state === 1 ? 'Turn ON...' : 'Turn OFF...'));
        }
        btnRegionViewJournalSwitch.css('display', region.journal.flags.state === 0 ? 'none' : 'inline');

        const divRegionViewJournalAlert = $('#divRegionViewJournalAlert');
        if (result.journaling.alert === '') {
            divRegionViewJournalAlert.css('display', 'none');

        } else {
            $('#lblRegionViewJournalAlert')
                .html(result.journaling.alert)
                .removeClass('ydb-status-red ydb-status-green ydb-status-amber ydb-status-gray')
                .addClass(result.journaling.class);
            divRegionViewJournalAlert.css('display', 'block');
        }

        // Journal type pill
        const lblRegionViewJournalType = $('#lblRegionViewJournalType');
        lblRegionViewJournalType.removeClass('ydb-status-red ydb-status-green ydb-status-amber ydb-status-gray');
        if (region.journal.flags.state !== JOURNAL_STATE_DISABLED) {
            lblRegionViewJournalType.text(app.ui.getKeyValue(region.journal.data, 'BEFORE') === true ? 'Before Image' : 'No before image')
                .addClass(region.journal.flags.state === 1 ? 'ydb-status-gray' : 'ydb-status-green');

        } else {
            lblRegionViewJournalType.text('N/A')
                .addClass('ydb-status-gray');
        }

        // table
        const divRegionViewJournalTable = $('#divRegionViewJournalTable');

        if (region.journal.flags.state !== JOURNAL_STATE_DISABLED) {
            divRegionViewJournalTable.css('display', 'block');

            const tblRegionViewJournalParams = $('#tblRegionViewJournalParams > tbody');
            tblRegionViewJournalParams.empty();

            region.journal.data.forEach(el => {
                let rowData = '';
                for (const key in el) {
                    rowData += app.ui.regionView.renderRow(key, el[key])
                }
                tblRegionViewJournalParams.append(rowData)
            });

        } else {
            divRegionViewJournalTable.css('display', 'none');

        }
    }

    // ************************************
    // NAMES
    // ************************************
    const navRegionViewNames = $('#navRegionViewNames');
    navRegionViewNames.removeClass('disabled');
    if (region.dbFile.flags.fileExist === false || (region.dbFile.flags.fileExist && region.dbFile.flags.fileBad)) {
        navRegionViewNames.addClass('disabled');

    } else {
        //clear the checkbox
        $('#chkRegionViewNamesSystemNames').prop('checked', false);

        app.ui.regionView.populateNamesTable();
    }
    // ************************************
    // STATS
    // ************************************
    const navRegionViewStats = $('#navRegionViewStats');
    navRegionViewStats.removeClass('disabled');
    if (region.dbFile.flags.fileExist === false || (region.dbFile.flags.fileExist && region.dbFile.flags.fileBad)) {
        navRegionViewStats.addClass('disabled');

    } else {
        const tblRegionViewStats = $('#tblRegionViewStats > tbody');

        tblRegionViewStats.empty();

        for (const stat in region.stats) {

            tblRegionViewStats.append('<tr><td colspan="2" class="region-view-stats-sub-header">' + region.stats[stat].caption + ' </td></tr>');

            region.stats[stat].data.forEach(el => {
                let rowData = '';
                for (const key in el) {
                    rowData += app.ui.regionView.renderRow(key, el[key])
                }
                tblRegionViewStats.append(rowData)
            });
        }
    }

    // ************************************
    // LOCKS
    // ************************************
    const navRegionViewLocks = $('#navRegionViewLocks');
    navRegionViewLocks.removeClass('disabled');
    if (region.dbFile.flags.fileExist === false || (region.dbFile.flags.fileExist && region.dbFile.flags.fileBad)) {
        navRegionViewLocks.addClass('disabled');

    } else {
        $('#lblRegionViewLocksProcessesOnQueue').text(region.locks.processesOnQueue);
        $('#lblRegionViewLocksSlotsInUse').text(region.locks.slotsInUse);
        $('#lblRegionViewLocksBytesInUse').text(region.locks.slotsBytesInUse);
        $('#lblRegionViewLocksFreeLockSpace').text(region.locks.estimatedFreeLockSpace);

        const tblRegionViewLocks = $('#tblRegionViewLocks > tbody');

        tblRegionViewLocks.empty();

        if (Array.isArray(region.locks.locks)) {
            region.locks.locks.forEach(lock => {
                let rowData = '<tr>';

                rowData += '<td>' + lock.node + '</td><td>' + lock.pid + '</td>';
                let firstFlag = false;
                if (Array.isArray(lock.waiters)) {
                    lock.waiters.forEach(waiter => {
                        if (firstFlag === false) {
                            firstFlag = true;
                            rowData += '<td>' + waiter.pid + '</td></tr>';

                        } else {
                            rowData += '<tr><td></td><td></td><td>' + waiter.pid + '</td></tr>'

                        }
                    })

                } else {
                    rowData += '<td></td></tr>'
                }

                tblRegionViewLocks.append(rowData);
            });
        }
    }
};

app.ui.regionView.refreshBtn = async () => {

    // **********************
    //execute REST call
    // **********************
    await app.ui.wait.show('Fetching region information...');

    try {
        const regionData = await app.REST._regionGet(app.ui.regionView.currentRegion);
        app.ui.wait.hide();

        if (regionData.result === 'WARNING') {
            let errors = '';
            if (Array.isArray(regionData.data.warnings)) {
                regionData.data.warnings.forEach(warning => {
                    errors += warning + '<br>'
                });
            }
            app.ui.msgbox.show('The following warnings occurred while fetching the data:<br>' + errors, 'WARNING')
        }

        app.system.regions[app.ui.regionView.currentRegion] = regionData.data;

        app.ui.regionView.isFresh = true;

        app.ui.regionView.refresh()

    } catch (err) {
        app.ui.wait.hide();

        app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');
    }
};

// ************************************
// ************************************
// UTILS
// ************************************
// ************************************

app.ui.regionView.populateNamesTable = () => {
    const region = app.system.regions[app.ui.regionView.currentRegion];

    const tblRegionViewNames = $('#tblRegionViewNames > tbody');

    tblRegionViewNames.empty();

    let names = region.names;
    if (Array.isArray(names) === false) return;

    if ($('#chkRegionViewNamesSystemNames').is(':checked') === false) {
        names = names.filter(el => el.type !== '%')
    }

    names.forEach(name => {
        name.ranges.forEach(range => {
            let row = '<tr>';

            row += '<td>' + name.name + '</td>';
            row += '<td>' + range.from + '</td>';
            row += '<td>' + range.to + '</td>';

            row += '</tr>';

            tblRegionViewNames.append(row)
        })
    })
};

app.ui.regionView.renderRow = (key, value) => {
    let newName = app.ui.help.getRegionByKey(key);
    let leftClass = '';
    let valueCell = '<td>';
    let helpLink = {
        start: '',
        end: '',
        startUnderlineLink: ''
    };
    let rowDef = '<tr class="region-view-detail-table-row">';

    const advancedMode = $('#chkRegionViewAdvancedMode').is(':checked');

    // use old name if doesn't exists
    if (newName === undefined) newName = {caption: key};

    // hide it if not in advanced mode
    if (advancedMode === false && typeof newName.advancedMode !== 'undefined') {
        return '';

    }

    // or it is found and gets translated
    else {
        // if advanced mode gray off also the left cell if required
        if (newName.class !== undefined && typeof newName.advancedMode !== 'undefined') {
            leftClass = 'class="' + newName.class + '"';
        }

        // format
        if (newName.format !== undefined) {
            if (newName.format === 'thousands') {
                value = app.ui.formatThousands(value)
            }
            if (newName.format === 'bytes') {
                value = app.ui.formatBytes(value)
            }
        }

        // unit
        if (newName.unit !== undefined && newName.unit !== '') {
            value += ' ' + newName.unit
        }

        // booleans
        if (typeof value === 'boolean') {
            if (newName.booleanOnOff !== undefined) {
                value = value ? 'On' : 'Off'
            }

            if (newName.booleanYesNo !== undefined) {
                value = value ? 'Yes' : 'No'
            }
        }

        // helpLink
        if (newName.helpLink !== undefined && newName.helpLink !== '') {
            helpLink.start = '<a href="' + newName.helpLink + ' " target="_blank" class="region-view-detail-table-row">';
            helpLink.startUnderlineLink = '<a href="' + newName.helpLink + ' " target="_blank" class="region-view-detail-table-row link-underline">';
            helpLink.end = '</a>';
        }

        //class
        if (newName.class !== undefined && newName.class !== '') {
            valueCell = '<td class="' + newName.class + '">'
        }

        //isPositiveClass
        if (newName.isPositiveClass !== undefined && newName.isPositiveClass !== '' && value > 0) {
            rowDef = rowDef.slice(0, -2) + ' ' + newName.isPositiveClass + '">'
        }
    }

    return rowDef +
        '<td style="text-align: left!important;"' + leftClass + '>' +
        helpLink.startUnderlineLink +
        newName.caption + ':' +
        helpLink.end +
        '</td>' +
        valueCell +
        helpLink.start +
        value +
        helpLink.end +
        '</td>' +
        '</tr>'
};
