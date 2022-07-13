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

app.ui.regionEdit.init = () => {
    $('#regionEditSegmentNameBg').on('click', () => app.ui.regionEdit.SwitchSegmentType('bg'));
    $('#regionEditSegmentNameMm').on('click', () => app.ui.regionEdit.SwitchSegmentType('mm'));

    $('#chkRegionEditAdvancedMode').on('click', () => app.ui.regionEdit.SwitchAdvancedMode());

    $('#optRegionEditJournalTypeNo').on('click', () => app.ui.regionEdit.SwitchJournal('off'));
    $('#optRegionEditJournalTypeYes').on('click', () => app.ui.regionEdit.SwitchJournal('on'));

    $('#btnRegionEditNamesAdd').on('click', () => app.ui.regionEdit.nameAdd());
    $('#btnRegionEditNamesDelete').on('click', () => app.ui.regionEdit.nameDelete());

    $('#btnRegionEditOk').on('click', () => app.ui.regionEdit.okPressed());

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (event) {
        $('#divRegionEditAdvancedParameters').css('display', event.target.toString().indexOf('Names') > -1 ? 'none' : 'block');
    })

    $('#modalRegionEdit').on('hide.bs.modal', () => {
        // Clear status
        app.ui.regionEdit.inProgress = null;

        // Clear all tables
        $('#tblRegionEditBg > tbody').empty();
        $('#tblRegionEditMm > tbody').empty();
        $('#tblRegionEditAc > tbody').empty();
        $('#tblRegionEditJo > tbody').empty();
    });
};

app.ui.regionEdit.inProgress = null;
app.ui.regionEdit.journalOriginalStatus = null;

app.ui.regionEdit.show = async () => {
    const region = app.system.regions[app.ui.regionView.currentRegion];
    region['name'] = app.ui.regionView.currentRegion;
    regionName = app.ui.regionView.currentRegion;

    if (region.dbFile.flags.fileExist === false) {
        app.ui.msgbox.show('The database file doesn\'t exists.<br><br>In the current release we do not support the ability to alter the GDE.<br>This feature will be available in the near future.', "INFO")

        return
    }

    let templates;

    try {
        templates = await app.REST._getTemplates()

    } catch (err) {
        await app.ui.msgbox.show('An error occurred while fetching the templates', 'ERROR', true);

        return
    }

    // Header title
    $('#lblRegionEditTitle').text(regionName);

    // Clear manifest
    app.ui.regionShared.clearManifest();

    // Populate the manifest with templates
    app.ui.regionEdit.populateManifest(region, templates);

    // set journal status by checking a field that can never be 0
    if (app.ui.getKeyValue(region.journal.data, 'AUTO_SWITCH_LIMIT') === 0) {
        $('#optRegionEditJournalTypeNo').prop('checked', true);
        app.ui.regionEdit.SwitchJournal('off', true);
        app.ui.regionEdit.journalOriginalStatus = false;

    } else {
        $('#optRegionEditJournalTypeYes').prop('checked', true);
        app.ui.regionEdit.SwitchJournal('on', true);
        app.ui.regionEdit.journalOriginalStatus = true;
    }

    $('#puRegionEditJournal').attr('data-content', MSG_EXCL_ACCESS.message);
    $('#iRegionEditJournal')
        .addClass(MSG_EXCL_ACCESS.icon)
        .css('color', MSG_EXCL_ACCESS.color);

    $('#dirtyRegionEditNoJournal').css('background', '');
    $('#dirtyRegionEditJournal').css('background', '');

    // reset advanced mode
    $('#chkRegionEditAdvancedMode').prop('checked', false);

    // reset BG/ MM switches
    const accessMethod = app.ui.getKeyValue(region.dbFile.data, 'ACCESS_METHOD').toLowerCase();

    $('#dirtyRegionEditSegmentNameMm').css('background', '');
    $('#dirtyRegionEditSegmentNameBg').css('background', '');

    if (accessMethod === 'bg') {
        $('#regionEditSegmentNameBg').prop('checked', true);
    } else {
        $('#regionEditSegmentNameMm').prop('checked', true);
    }

    app.ui.regionEdit.SwitchSegmentType(accessMethod, true);

    $('#puRegionEditSegmentType').attr('data-content', MSG_EXCL_ACCESS.message);
    $('#iRegionEditSegmentType')
        .addClass(MSG_EXCL_ACCESS.icon)
        .css('color', MSG_EXCL_ACCESS.color);

    $('#chkRegionEditNamesSystemNames').prop('checked', true);

    // Populate all tables
    app.ui.regionShared.renderTable($('#tblRegionEditBg > tbody'), true);
    app.ui.regionShared.renderTable($('#tblRegionEditMm > tbody'), true);
    app.ui.regionShared.renderTable($('#tblRegionEditAc > tbody'), true);
    app.ui.regionShared.renderTable($('#tblRegionEditJo > tbody'), true);

    app.ui.regionShared.redrawNames($('#tblRegionEditNames > tbody'))
    // reset the tabs
    $('#navRegionEditRegion').tab('show');

    $('#btnRegionEditOk')
        .attr('disabled', true)
        .addClass('disabled');

    app.ui.regionEdit.inProgress = region;

    // Display form
    $('#modalRegionEdit').modal({show: true, backdrop: 'static', keyboard: false});
};

app.ui.regionEdit.SwitchSegmentType = (type, noCheck = false) => {
    // noCheck: when true skips the button validation
    $('#' + (type === 'bg' ? 'divRegionEditBg' : 'divRegionEditMm')).css('display', 'block');
    $('#' + (type === 'bg' ? 'divRegionEditMm' : 'divRegionEditBg')).css('display', 'none');

    const el = app.ui.regionShared.manifest.dbFile.accessType;

    el.value = type;
    if (el.oldValue !== '') {
        el.dirty = el.value !== el.oldValue;

        // draw or hide the dirty status
        if (el.dirty) $('#' + (type === 'bg' ? 'dirtyRegionEditSegmentNameBg' : 'dirtyRegionEditSegmentNameMm')).css('background', 'var(--ydb-status-amber)');
        $('#' + (type === 'bg' ? 'dirtyRegionEditSegmentNameMm' : 'dirtyRegionEditSegmentNameBg')).css('background', '');
    }

    if (noCheck === true) {
        // init the value at show()
        el.oldValue = type;
    } else {
        app.ui.regionEdit.validateOk()
    }

    app.ui.regionShared.manifest.dbFile.accessType = el;
};

app.ui.regionEdit.SwitchAdvancedMode = () => {
    // R=populate all tables
    app.ui.regionShared.renderTable($('#tblRegionEditBg > tbody'), true);
    app.ui.regionShared.renderTable($('#tblRegionEditMm > tbody'), true);
    app.ui.regionShared.renderTable($('#tblRegionEditAc > tbody'), true);
    app.ui.regionShared.renderTable($('#tblRegionEditJo > tbody'), true);
};

app.ui.regionEdit.SwitchJournal = (val, silentMode = false) => {
    // silentMode: when set, skips validating the button and setting the default journal state
    $('#divRegionEditJournalParams').css('display', val === 'on' ? 'block' : 'none');
    $('#divRegionEditJournalSpacer').css('display', val === 'on' ? 'none' : 'block');

    if (silentMode === true) return;

    const el = getEl(app.ui.regionShared.manifest.journal, 'journalEnabled');
    el.value = val === 'on' ? 1 : 0;
    el.dirty = el.value !== el.oldValue;

    // draw or hide the dirty status
    $('#dirtyRegionEditNoJournal').css('background', '');
    $('#dirtyRegionEditJournal').css('background', '');
    if (el.dirty) $('#' + (el.value === 1 ? 'dirtyRegionEditJournal' : 'dirtyRegionEditNoJournal')).css('background', 'var(--ydb-status-amber)');

    app.ui.regionEdit.validateOk()
};

app.ui.regionEdit.nameAdd = () => {
    // Display form
    app.ui.regionNames.add.show(true);
};

app.ui.regionEdit.nameDelete = () => {
    app.ui.regionNames.delete.show('tblRegionEditNames');
};

app.ui.regionEdit.validateOk = () => {
    if ($('#modalRegionEdit').css('display') === 'none') return;

    const regionEditSegmentNameBg = $('#regionEditSegmentNameBg');
    // validate shared data
    let dirty = false;

    const newAccessMethod = regionEditSegmentNameBg.is(':checked') === true ? 'BG' : 'MM';
    const segmentFilename = newAccessMethod === 'BG' ? getEl(app.ui.regionShared.manifest.dbFile.mm, 'filename') : getEl(app.ui.regionShared.manifest.dbFile.mm, 'filename');
    const journalFilename = getEl(app.ui.regionShared.manifest.journal, 'jfilename');
    if (segmentFilename.value !== segmentFilename.oldValue) {
        dirty = true
    }
    if (journalFilename.value !== journalFilename.oldValue) {
        dirty = true
    }

    const accessMethod = app.ui.getKeyValue(app.ui.regionEdit.inProgress.dbFile.data, 'ACCESS_METHOD');

    if (dirty === false) {
        dirty = (regionEditSegmentNameBg.is(':checked') === true && accessMethod !== 'BG' ||
            $('#regionEditSegmentNameMm').is(':checked') === true && accessMethod !== 'MM');
    }

    if (dirty === false) {
        // BG
        app.ui.regionShared.manifest.dbFile.bg.forEach(el => {
            if (el.dirty === true) {
                dirty = true;
            }
        });
    }

    // MM
    if (dirty === false) {
        app.ui.regionShared.manifest.dbFile.mm.forEach(el => {
            if (el.dirty === true) dirty = true
        });
    }

    // dbAccess
    if (dirty === false) {
        app.ui.regionShared.manifest.dbAccess.forEach(el => {
            if (el.dirty === true) dirty = true
        });
    }

    // Journal
    if (dirty === false) {
        app.ui.regionShared.manifest.journal.forEach(el => {
            if (el.dirty === true) dirty = true;
        });
    }

    // Names
    let namesCounters = {
        deleted: 0,
        new: 0,
    };
    app.ui.regionShared.manifest.names.forEach(name => {
        if (name.deleted === true) namesCounters.deleted++;
        if (name.new === true) namesCounters.new++;
    });
    if (namesCounters.deleted > 0 || namesCounters.new > 0) dirty = true;

    const btnRegionEditOk = $('#btnRegionEditOk');
    if (dirty === true) {
        btnRegionEditOk
            .attr('disabled', false)
            .removeClass('disabled')
    } else {
        btnRegionEditOk
            .attr('disabled', true)
            .addClass('disabled')

    }
};

app.ui.regionEdit.okPressed = async () => {
    const region = app.ui.regionEdit.inProgress;
    const accessMethod = app.ui.getKeyValue(region.dbFile.data, 'ACCESS_METHOD');
    const newAccessMethod = $('#regionEditSegmentNameBg').is(':checked') === true ? 'BG' : 'MM';
    const journalEnabled = app.ui.getKeyValue(region.journal.data, 'AUTO_SWITCH_LIMIT') !== 0;
    const newJournalEnabled = $('#optRegionEditJournalTypeYes').is(':checked');

    const segmentArray = newAccessMethod === 'BG' ? app.ui.regionShared.manifest.dbFile.bg : app.ui.regionShared.manifest.dbFile.mm;
    const dbAccessArray = app.ui.regionShared.manifest.dbAccess;
    const journalArray = app.ui.regionShared.manifest.journal;

    const payload = {};

    // filenames
    const segmentFilename = newAccessMethod === 'BG' ? getEl(app.ui.regionShared.manifest.dbFile.mm, 'filename') : getEl(app.ui.regionShared.manifest.dbFile.mm, 'filename');
    const journalFilename = getEl(app.ui.regionShared.manifest.journal, 'jfilename');

    // general flags
    payload.regionName = region.name;
    payload.newAccessMethod = newAccessMethod;
    payload.changeAccessMethod = accessMethod !== newAccessMethod;
    payload.newJournalEnabled = getEl(app.ui.regionShared.manifest.journal, 'journalEnabled').dirty;
    payload.changeJournal = journalEnabled !== newJournalEnabled;

    payload.segmentFilename = '';
    payload.journalFilename = '';

    if (segmentFilename.value !== segmentFilename.oldValue) {
        payload.segmentFilename = segmentFilename.value
    }

    if ((journalFilename.value !== journalFilename.oldValue) || (payload.changeJournal === true && newJournalEnabled === true)) {
        payload.journalFilename = journalFilename.value
    }

    payload.updateGde = false;

    // -------------------------------
    // validation
    // -------------------------------

    // Exclusive access
    if (payload.changeJournal === true
        || newAccessMethod === true
        || getEl(journalArray, 'bufferSize').dirty === true
        || getEl(segmentArray, 'lockSpace').dirty === true
        || getEl(dbAccessArray, 'lockCriticalSeparate').dirty === true
        || (newAccessMethod === 'BG' && (
            getEl(segmentArray, 'asyncIo').dirty === true
            || getEl(segmentArray, 'globalBufferCount').dirty === true
            || getEl(segmentArray, 'mutexSlots').dirty === true))
        || getEl(dbAccessArray, 'recordSize').dirty === true
        || getEl(dbAccessArray, 'keySize').dirty === true
        || getEl(dbAccessArray, 'nullSubscripts').dirty === true
        || getEl(dbAccessArray, 'qbRundown').dirty === true
        || getEl(dbAccessArray, 'stats').dirty === true
    ) {
        // get the latest # of users
        let sessions = 0;

        try {
            const regionData = await app.REST._regionGet(region.name);

            if (regionData.result === 'WARNING') {
                let errors = '';
                if (Array.isArray(regionData.data.warnings)) {
                    regionData.data.warnings.forEach(warning => {
                        errors += warning + '<br>'
                    });
                }
                app.ui.msgbox.show('The following warnings occurred while fetching the data:<br>' + errors, 'WARNING')
            }

            sessions = regionData.data.dbFile.flags.sessions;


        } catch (err) {
            app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');
        }

        if (sessions > 0) {
            app.ui.msgbox.show('This operation requires stand alone access.<br>' +
                'At the moment there ' + (sessions === 1 ? 'is ' : 'are ') + sessions + ' user' + (sessions === 1 ? '' : 's') + ' accessing the database file.<br><br>' +
                'Terminate the sessions and try again...', 'WARNING');
            return
        }
    }

    // BG and journal type
    if (newAccessMethod === 'MM' && newJournalEnabled === true && getEl(journalArray, 'beforeImage').value === 1) {
        app.ui.msgbox.show('A region with MM segment can not have a "beforeImage" journaling', 'WARNING');
        return
    }

    // check asyncIO sector size
    if (newAccessMethod === 'BG' && getEl(segmentArray, 'asyncIo').value === 1) {
        // fetch the file system sector size
        let res;
        try {
            res = await app.REST._validatePath(segmentFilename.oldValue.substring(segmentFilename.oldValue.lastIndexOf('/') + 1));

            if (res.result !== 'OK') {
                app.ui.msgbox.show('An error occurred while trying to validate the database path and get the file system sector size needed for the ASYNC IO', 'ERROR');

                return
            }

            if (res.data.validation === '') {
                app.ui.msgbox.show('The path could not be validated.', 'WARNING');

                return
            }

        } catch (err) {
            app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');

            return
        }

        // get the remainder
        if (res.data.deviceBlockSize % getEl(segmentArray, 'blockSize').value !== 0) {
            app.ui.msgbox.show('The region block size must be equal or a multiple of the device block size, which is: ' + res.data.deviceBlockSize, 'WARNING');

            return
        }
    }

    // record size < current
    const recordSize = getEl(dbAccessArray, 'recordSize');
    if (recordSize.value < recordSize.oldValue) {
        app.ui.msgbox.show('The Record Size can not be lower than the current value', 'WARNING');

        return
    }

    // key size < current
    const keySize = getEl(dbAccessArray, 'keySize');
    if (keySize.value < keySize.oldValue) {
        app.ui.msgbox.show('The Key Size can not be lower than the current value', 'WARNING');

        return
    }

    if (getEl(journalArray, 'allocation').value > getEl(journalArray, 'autoSwitchLimit').value) {
        app.ui.msgbox.show('The Journal Allocation size can not be bigger than the Journal AutoSwitchLimit', 'WARNING');

        return
    }


    payload.segmentData = [];
    payload.dbAccess = {
        region: [],
        journal: []
    };
    payload.names = [];


    // segment
    segmentArray.forEach(el => {
        if (el.dirty === true) {
            if (el.id === 'autoDb') {
                payload.dbAccess.region.push({
                    id: el.id,
                    value: el.value,
                })

            } else {
                payload.segmentData.push({
                    id: el.id,
                    value: el.value,
                })
            }
        }
    });

    // region
    dbAccessArray.forEach(el => {
        if (el.dirty === true) {
            payload.dbAccess.region.push({
                id: el.id,
                value: el.value,
            })
        }
    });

    // journal
    journalArray.forEach(el => {
        if (el.id === 'epochTaper' && el.dirty === true) {
            payload.dbAccess.region.push({
                id: el.id,
                value: el.value,
            });
        }
        if (el.dirty === true) {
            payload.dbAccess.journal.push({
                id: el.id,
                value: el.value,
            })
        }
    });

    // names
    payload.names = [];
    app.ui.regionShared.manifest.names.forEach(name => {
        if ((name.existing !== undefined && name.existing === true && name.deleted === true) || (name.new !== undefined && name.new === true)) {
            payload.names.push(name)
        }
    });

    app.ui.regionEdit.Overview.show(payload);

};

app.ui.regionEdit.confirmCheckBoxesValidate = () => {
    const chkRegionEditUpdateMupip = $('#chkRegionEditUpdateMupip');

    if (chkRegionEditUpdateMupip.is(':checked') === false && $('#chkRegionEditUpdateGde').is(':checked') === false) {
        app.ui.msgbox.show('At least one check box must be checked', 'WARNING')
        chkRegionEditUpdateMupip.prop('checked', true)
    }
};

app.ui.regionEdit.populateManifest = (region, templates) => {
    getEl = (array, id) => {
        return array.find(el => el.id === id);
    };

    let el;

    const bg = app.ui.regionShared.manifest.dbFile.bg;
    const mm = app.ui.regionShared.manifest.dbFile.mm;
    const dbAccess = app.ui.regionShared.manifest.dbAccess;
    const journal = app.ui.regionShared.manifest.journal;
    const names = app.ui.regionShared.manifest.names;

    const segmentFilename = app.ui.getKeyValue(region.dbFile.data, 'FILE_NAME');
    const journalFilename = app.ui.getKeyValue(region.journal.data, 'JFILE_NAME');

    const segmentIsBg = app.ui.getKeyValue(region.dbFile.data, 'ACCESS_METHOD') === 'BG';
    const JournalEnabled = app.ui.getKeyValue(region.journal.data, 'AUTO_SWITCH_LIMIT') !== 0;

    // Journal path
    const journalBasePath = app.ui.regionShared.computeJournalBasePath();

    // ************************
    // BG
    // ************************
    el = getEl(bg, 'filename');
    el.oldValue = segmentFilename;
    el.value = segmentFilename;
    el.min = 0;
    el.max = 0;

    el = getEl(bg, 'globalBufferCount');
    el.oldValue = segmentIsBg === true ? app.ui.getKeyValue(region.dbFile.data, 'GLOBAL_BUFFER_COUNT') : templates.data.segment.BG.GLOBAL_BUFFER_COUNT.value;
    el.value = el.oldValue;
    el.min = templates.data.segment.BG.GLOBAL_BUFFER_COUNT.min;
    el.max = templates.data.segment.BG.GLOBAL_BUFFER_COUNT.max;

    el = getEl(bg, 'initialAllocation');
    el.oldValue = app.ui.getKeyValue(region.dbFile.data, 'ALLOCATION');
    el.value = el.oldValue;
    el.min = templates.data.segment.BG.ALLOCATION.min;
    el.max = templates.data.segment.BG.ALLOCATION.max;

    el = getEl(bg, 'asyncIo');
    el.oldValue = segmentIsBg === true ? app.ui.getKeyValue(region.dbFile.data, 'ASYNCIO') === true ? 1 : 0 : templates.data.segment.BG.ASYNCIO.value;
    el.value = el.oldValue;
    el.min = templates.data.segment.BG.ASYNCIO.min;
    el.max = templates.data.segment.BG.ASYNCIO.max;

    el = getEl(bg, 'blockSize');
    el.oldValue = app.ui.getKeyValue(region.dbFile.data, 'BLOCK_SIZE');
    el.value = el.oldValue;
    el.min = templates.data.segment.BG.BLOCK_SIZE.min;
    el.max = templates.data.segment.BG.BLOCK_SIZE.max;

    el = getEl(bg, 'deferAllocate');
    el.oldValue = app.ui.getKeyValue(region.dbFile.data, 'DEFER_ALLOCATE') === true ? 1 : 0;
    el.value = el.oldValue;
    el.min = templates.data.segment.BG.DEFER_ALLOCATE.min;
    el.max = templates.data.segment.BG.DEFER_ALLOCATE.max;

    el = getEl(bg, 'extensionCount');
    el.oldValue = app.ui.getKeyValue(region.dbFile.data, 'EXTENSION_COUNT');
    el.value = el.oldValue;
    el.min = templates.data.segment.BG.EXTENSION_COUNT.min;
    el.max = templates.data.segment.BG.EXTENSION_COUNT.max;

    el = getEl(bg, 'lockSpace');
    el.oldValue = app.ui.getKeyValue(region.dbFile.data, 'LOCK_SPACE');
    el.value = el.oldValue;
    el.min = templates.data.segment.BG.LOCK_SPACE.min;
    el.max = templates.data.segment.BG.LOCK_SPACE.max;

    el = getEl(bg, 'mutexSlots');
    el.oldValue = segmentIsBg === true ? app.ui.getKeyValue(region.dbFile.data, 'MUTEX_SLOTS') : templates.data.segment.BG.MUTEX_SLOTS.value;
    el.value = el.oldValue;
    el.min = templates.data.segment.BG.MUTEX_SLOTS.min;
    el.max = templates.data.segment.BG.MUTEX_SLOTS.max;

    el = getEl(bg, 'autoDb');
    el.oldValue = app.ui.getKeyValue(region.dbFile.data, 'AUTO_DB') === true ? 1 : 0;
    el.value = el.oldValue;
    el.min = templates.data.region.AUTODB.min;
    el.max = templates.data.region.AUTODB.max;

    // ************************
    // MM
    // ************************
    el = getEl(mm, 'filename');
    el.oldValue = segmentFilename;
    el.value = segmentFilename;
    el.min = 0;
    el.max = 0;

    el = getEl(mm, 'initialAllocation');
    el.oldValue = app.ui.getKeyValue(region.dbFile.data, 'ALLOCATION');
    el.value = el.oldValue;
    el.min = templates.data.segment.MM.ALLOCATION.min;
    el.max = templates.data.segment.MM.ALLOCATION.max;

    el = getEl(mm, 'blockSize');
    el.oldValue = app.ui.getKeyValue(region.dbFile.data, 'BLOCK_SIZE');
    el.value = el.oldValue;
    el.min = templates.data.segment.MM.BLOCK_SIZE.min;
    el.max = templates.data.segment.MM.BLOCK_SIZE.max;

    el = getEl(mm, 'deferAllocate');
    el.oldValue = app.ui.getKeyValue(region.dbFile.data, 'DEFER_ALLOCATE') === true ? 1 : 0;
    el.value = el.oldValue;
    el.min = templates.data.segment.MM.DEFER_ALLOCATE.min;
    el.max = templates.data.segment.MM.DEFER_ALLOCATE.max;

    el = getEl(mm, 'extensionCount');
    el.oldValue = app.ui.getKeyValue(region.dbFile.data, 'EXTENSION_COUNT');
    el.value = el.oldValue;
    el.min = templates.data.segment.MM.EXTENSION_COUNT.min;
    el.max = templates.data.segment.MM.EXTENSION_COUNT.max;

    el = getEl(mm, 'lockSpace');
    el.oldValue = app.ui.getKeyValue(region.dbFile.data, 'LOCK_SPACE');
    el.value = el.oldValue;
    el.min = templates.data.segment.MM.LOCK_SPACE.min;
    el.max = templates.data.segment.MM.LOCK_SPACE.max;

    el = getEl(mm, 'autoDb');
    el.oldValue = app.ui.getKeyValue(region.dbFile.data, 'AUTO_DB') === true ? 1 : 0;
    el.value = el.oldValue;
    el.min = templates.data.region.AUTODB.min;
    el.max = templates.data.region.AUTODB.max;

    // ************************
    // dbAccess
    // ************************
    el = getEl(dbAccess, 'recordSize');
    el.oldValue = app.ui.getKeyValue(region.dbAccess.data, 'RECORD_SIZE');
    el.value = el.oldValue;
    el.min = templates.data.region.RECORD_SIZE.min;
    el.max = templates.data.region.RECORD_SIZE.max;

    el = getEl(dbAccess, 'keySize');
    el.oldValue = app.ui.getKeyValue(region.dbAccess.data, 'KEY_SIZE');
    el.value = el.oldValue;
    el.min = templates.data.region.KEY_SIZE.min;
    el.max = templates.data.region.KEY_SIZE.max;

    el = getEl(dbAccess, 'nullSubscripts');
    el.oldValue = app.ui.getKeyValue(region.dbAccess.data, 'NULL_SUBSCRIPTS') === true ? 1 : 0;
    el.value = el.oldValue;
    el.min = templates.data.region.NULL_SUBSCRIPTS.min;
    el.max = templates.data.region.NULL_SUBSCRIPTS.max;

    el = getEl(dbAccess, 'lockCriticalSeparate');
    el.oldValue = app.ui.getKeyValue(region.dbAccess.data, 'LOCK_CRIT_SEPARATE') === true ? 1 : 0;
    el.value = el.oldValue;
    el.min = templates.data.region.LOCK_CRIT_SEPARATE.min;
    el.max = templates.data.region.LOCK_CRIT_SEPARATE.max;

    el = getEl(dbAccess, 'qbRundown');
    el.oldValue = app.ui.getKeyValue(region.dbAccess.data, 'QDBRUNDOWN') === true ? 1 : 0;
    el.value = el.oldValue;
    el.min = templates.data.region.QDBRUNDOWN.min;
    el.max = templates.data.region.QDBRUNDOWN.max;

    el = getEl(dbAccess, 'stats');
    el.oldValue = app.ui.getKeyValue(region.dbAccess.data, 'STATS') === true ? 1 : 0;
    el.value = el.oldValue;
    el.min = templates.data.region.STATS.min;
    el.max = templates.data.region.STATS.max;
    ;

// ************************
// journal
// ************************
    el = getEl(journal, 'journalEnabled');
    el.oldValue = journalFilename !== '' ? 1 : 0;
    el.value = el.oldValue;

    el = getEl(journal, 'jfilename');
    el.oldValue = journalFilename !== '' ? journalFilename : journalBasePath + region.name.toLowerCase() + '.mjl';
    el.value = el.oldValue;
    el.min = 0;
    el.max = 0;

    el = getEl(journal, 'beforeImage');
    el.oldValue = JournalEnabled === true ? app.ui.getKeyValue(region.journal.data, 'BEFORE') === true ? 1 : 0 : templates.data.region.BEFORE_IMAGE.value;
    el.value = el.oldValue;
    el.min = templates.data.region.BEFORE_IMAGE.min;
    el.max = templates.data.region.BEFORE_IMAGE.max;

    el = getEl(journal, 'autoSwitchLimit');
    el.oldValue = JournalEnabled === true ? app.ui.getKeyValue(region.journal.data, 'AUTO_SWITCH_LIMIT') : templates.data.region.AUTOSWITCHLIMIT.value;
    el.value = el.oldValue;
    el.min = templates.data.region.AUTOSWITCHLIMIT.min;
    el.max = templates.data.region.AUTOSWITCHLIMIT.max;

    el = getEl(journal, 'bufferSize');
    el.oldValue = JournalEnabled === true ? app.ui.getKeyValue(region.journal.data, 'BUFFER_SIZE') : templates.data.region.BUFFER_SIZE.value;
    el.value = el.oldValue;
    el.min = templates.data.region.BUFFER_SIZE.min;
    el.max = templates.data.region.BUFFER_SIZE.max;

    el = getEl(journal, 'extension');
    el.oldValue = JournalEnabled === true ? app.ui.getKeyValue(region.journal.data, 'JEXTENSION_SIZE') : templates.data.region.EXTENSION.value;
    el.value = el.oldValue;
    el.min = templates.data.region.EXTENSION.min;
    el.max = templates.data.region.EXTENSION.max;

    el = getEl(journal, 'allocation');
    el.oldValue = JournalEnabled === true ? app.ui.getKeyValue(region.journal.data, 'JALLOCATION') : templates.data.region.ALLOCATION.value;
    el.value = el.oldValue;
    el.min = templates.data.region.ALLOCATION.min;
    el.max = templates.data.region.ALLOCATION.max;

    el = getEl(journal, 'epochTaper');
    el.oldValue = JournalEnabled === true ? app.ui.getKeyValue(region.journal.data, 'EPOCH_TAPER') === true ? 1 : 0 : templates.data.region.EPOCHTAPER.value;
    el.value = el.oldValue;
    el.min = templates.data.region.EPOCHTAPER.min;
    el.max = templates.data.region.EPOCHTAPER.max;

    el = getEl(journal, 'epochInterval');
    el.oldValue = JournalEnabled === true ? app.ui.getKeyValue(region.journal.data, 'EPOCH_INTERVAL') : templates.data.region.EPOCH_INTERVAL.value;
    el.value = el.oldValue;
    el.min = templates.data.region.EPOCH_INTERVAL.min;
    el.max = templates.data.region.EPOCH_INTERVAL.max;

    el = getEl(journal, 'syncIo');
    el.oldValue = JournalEnabled === true ? app.ui.getKeyValue(region.journal.data, 'SYNC_IO') === true ? 1 : 0 : templates.data.region.SYNC_IO.value;
    el.value = el.oldValue;
    el.min = templates.data.region.SYNC_IO.min;
    el.max = templates.data.region.SYNC_IO.max;

    el = getEl(journal, 'yieldLimit');
    el.oldValue = app.ui.getKeyValue(region.journal.data, 'YIELD_LIMIT');
    el.oldValue = JournalEnabled === true ? app.ui.getKeyValue(region.journal.data, 'YIELD_LIMIT') : templates.data.region.YIELD_LIMIT.value;
    el.value = el.oldValue;
    el.min = templates.data.region.YIELD_LIMIT.min;
    el.max = templates.data.region.YIELD_LIMIT.max;

    if (Array.isArray(region.names)) {
        region.names.forEach(name => {
            names.push({value: name.name, existing: true, deleted: false});
        })
    }
};

// *******************************************************
// Region Edit Overview
// *******************************************************
app.ui.regionEdit.Overview = {};

app.ui.regionEdit.Overview.init = () => {
    $('#btnRegionEditOverviewOk').on('click', () => { app.ui.regionEdit.Overview.okPressed()});
    $('#modalRegionEditOverview').on('hide.bs.modal', () => {
        $('.modal-backdrop').css('z-index', 1040)
    });
};

app.ui.regionEdit.Overview.show = (payload) => {
    app.ui.regionEdit.Overview.payload = payload;
    const $table = $('#tblRegionEditOverview > tbody');

    // clear table
    $table.empty();

    // adjust the autoDb field
    let autoDbFound = false;
    payload.dbAccess.region.forEach(el => {
        if (el.id === 'autoDb') autoDbFound = true;
    });

    // adjust the autoDb field
    let epochTaperFound = false;
    payload.dbAccess.region.forEach(el => {
        if (el.id === 'epochTaper') epochTaperFound = true;
    });


    // populate table
    if (app.ui.regionShared.manifest.dbFile.accessType.dirty === true || payload.segmentData.length > 0 || autoDbFound === true) {
        $table.append('<tr class="edit-overview-header"><td colspan="5">Database file</td></tr>');

        if (app.ui.regionShared.manifest.dbFile.accessType.dirty === true) {
            const el = app.ui.regionShared.manifest.dbFile.accessType;

            $table.append(app.ui.regionEdit.Overview.itemRow(el));
        }

        if (payload.segmentData.length > 0 || autoDbFound === true) {
            const manifestArray = app.ui.regionShared.manifest.dbFile.accessType.value === 'bg' ? app.ui.regionShared.manifest.dbFile.bg : app.ui.regionShared.manifest.dbFile.mm;

            manifestArray.forEach(el => {
                if (el.dirty === true) $table.append(app.ui.regionEdit.Overview.itemRow(el));
            })
        }
    }

    if (payload.dbAccess.region.length > 0) {
        if (((autoDbFound === true || epochTaperFound === true) && payload.dbAccess.region.length === 1) === false) {
            $table.append('<tr class="edit-overview-header"><td colspan="5">Database access</td></tr>');

            app.ui.regionShared.manifest.dbAccess.forEach(el => {
                if (el.dirty === true) $table.append(app.ui.regionEdit.Overview.itemRow(el));
            })
        }
    }

    if (payload.dbAccess.journal.length > 0) {
        $table.append('<tr class="edit-overview-header"><td colspan="5">Journal</td></tr>');

        app.ui.regionShared.manifest.journal.forEach(el => {
            if (el.dirty === true) $table.append(app.ui.regionEdit.Overview.itemRow(el));
        })
    }

    if (payload.names.length > 0) {
        $table.append('<tr class="edit-overview-header"><td colspan="5">Names</td></tr>');

        payload.names.forEach(name => {

            let style = 'style="color:' + (name.new !== undefined && name.new === true ? 'var(--ydb-status-green)' : 'var(--ydb-status-red)') + ';';
            style += (name.deleted !== undefined && name.deleted === true ? ' text-decoration: line-through' : '') + '"';

            let row = '<tr><td colspan="3" ' + style + '>' + name.value + '</td>';
            row += '<td style="text-align: center; font-size: 15px; color: var(--ydb-status-green);"><i class="bi-check-lg"></i></td>';
            row += '<td style="text-align: center; font-size: 15px; color: var(--ydb-status-green);"><i class="bi-check-lg"></i></td>';
            row += '</tr>';

            $table.append(row)
        })
    }

    // Display form
    $('#modalRegionEditOverview').modal({show: true, backdrop: 'static', keyboard: false});

    // used to ensure that the dialog stands out
    $('.modal-backdrop').css('z-index', 1060);

};

app.ui.regionEdit.Overview.itemRow = field => {
    let row = '<tr class="edit-overview-cell">';

    // Caption
    row += '<td style="text-align: left;">' + field.caption + '</td>';

    // Was
    row += app.ui.regionEdit.Overview.drawCell(field, field.oldValue);

    // Will be
    row += app.ui.regionEdit.Overview.drawCell(field, field.value);

    // MUPIP
    if (field.id === 'jfilename') {
        row += '<td style="text-align: center; "><input type="checkbox" id="chkRegionEditUpdateMupip" checked onchange="app.ui.regionEdit.confirmCheckBoxesValidate()"></td>'
    } else {
        row += '<td style="text-align: center; font-size: 15px; color: ' + ((field.canUpdateGde !== undefined && field.canUpdateGde === true) ? 'var(--ydb-status-red)' : 'var(--ydb-status-green)') + ';"><i class="bi-' + ((field.canUpdateGde !== undefined && field.canUpdateGde === true) ? 'x-lg' : 'check-lg') + '"></i></td>';
    }

    // GDE
    if (field.id === 'jfilename') {
        row += '<td style="text-align: center; "><input type="checkbox" id="chkRegionEditUpdateGde" checked onchange="app.ui.regionEdit.confirmCheckBoxesValidate()"></td>'
    } else {
        row += '<td style="text-align: center; font-size: 15px; color: ' + ((field.canUpdateGde !== undefined && field.canUpdateGde === true) ? 'var(--ydb-status-green)' : 'var(--ydb-status-red)') + ';"><i style="font-weight: bold; " class="bi-' + ((field.canUpdateGde !== undefined && field.canUpdateGde === true) ? 'check-lg' : 'x-lg') + '"></i></td>';
    }

    return row
};

app.ui.regionEdit.Overview.drawCell = (field, value) => {
    let ret = '';

    switch (field.type) {
        case 'number':
        case 'file': {
            ret = '<td>' + value + '</td>';
            break;
        }
        case 'boolean': {
            if (field.display === 'comboYesNo') {
                ret = '<td>' + (value === 0 ? 'No' : 'Yes') + '</td>';

            } else if (field.display === 'comboOnOff') {
                ret = '<td>' + (value === 0 ? 'Off' : 'On') + '</td>';

            } else {
                ret = '<td>' + (value === 0 ? 'Never' : value === 1 ? 'Always' : 'Existing') + '</td>';
            }

            break
        }
        case 'external': {
            if (field.id === 'accessType') {
                ret = '<td>' + (value === 'mm' ? 'MM' : 'BG') + '</td>';

            }
            if (field.id === 'journalEnabled') {
                ret = '<td>' + (value === 0 ? 'DISABLED' : 'ENABLED') + '</td>';

            }
        }
    }

    return ret
};

app.ui.regionEdit.Overview.okPressed = async () => {
    const payload = app.ui.regionEdit.Overview.payload;

    // append the (eventual) checkbox status
    payload.journalUpdateMupip = $('#chkRegionEditUpdateMupip').is(':checked');
    payload.journalUpdateGde = $('#chkRegionEditUpdateGde').is(':checked');

    // let's keep this until fully debugged
    console.log(payload)

    $('#modalRegionEdit').modal('hide');
    $('#modalRegionEditOverview').modal('hide');

    // **********************
    //execute REST call
    // **********************
    try {
        const res = await app.REST._editRegion(payload);

        switch (res.result) {
            case 'OK':
            case 'WARNING': {

                if (Array.isArray(res.warnings)) {
                    let warningList = '';

                    res.warnings.forEach(warning => {
                        if (warning.indexOf('JNLSWITCHSZCHG') > -1) {
                            warningList += 'The value AUTOSWITCHLIMIT has been rounded to: ' + warning.split(' ')[9].substring(1) + '<br>';

                        } else {
                            warningList += warning.split(',')[1] + '<br>';
                        }
                    });

                    app.ui.msgbox.show('Database got update successfully. However, some warnings were returned from the REST call:<br><br>' + warningList, 'WARNING');
                }

                app.ui.dashboard.refresh();

                break
            }
            case 'ERROR': {
                let error = res.error.description + '<br>';
                let singleAccess = false;


                if (Array.isArray(res.error.dump)) {
                    res.error.dump.forEach(dumpLine => {
                        error += '<br>' + dumpLine
                        if (dumpLine.indexOf('File already open by another process') > -1) {
                            singleAccess = true
                        }
                    })
                }

                app.ui.msgbox.show('An error occurred while executing the request<br><br>' + (singleAccess === true ? 'To perform the requested changes you need exclusive access to the database' : error), 'ERROR');

                return
            }
        }
    } catch (err) {
        app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');

    }
};
