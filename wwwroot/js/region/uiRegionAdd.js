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

// ***************************************
// region add name
// ***************************************
app.ui.regionAdd.name.region = '';
app.ui.regionAdd.name.init = () => {
    $('#btnRegionAddNameNext').on('click', () => app.ui.regionAdd.name.nextPressed());

    const txtRegionAddName = $('#txtRegionAddName');
    txtRegionAddName.on('keypress', (e) => app.ui.regionAdd.name.keypress(e));
    txtRegionAddName.on('keyup', () => app.ui.regionAdd.name.keyup());
};

app.ui.regionAdd.name.show = () => {
    const txtRegionAddName = $('#txtRegionAddName');

    txtRegionAddName.val('');
    app.ui.regionAdd.name.keyup();
    $('#modalRegionAddName')
        .modal({show: true, backdrop: 'static', keyboard: true})
        .on('shown.bs.modal', () => {
            txtRegionAddName.focus()
        })
};

app.ui.regionAdd.name.nextPressed = () => {

    $('#modalRegionAddName').modal('hide');
    app.ui.regionAdd.show();
};

app.ui.regionAdd.name.keypress = e => {
    const charCode = e.which;
    const caretPos = e.target.selectionStart;

    // submit if enter is pressed AND name is valid
    if (charCode === 13 && $('#btnRegionAddNameNext').prop('disabled') === false) {
        app.ui.regionAdd.name.nextPressed();
    }
    if (caretPos === 0) {
        // only chars
        return (charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123);

    } else {
        // chars and numbers
        return (charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123 || (charCode > 47 && charCode < 58));
    }
};

app.ui.regionAdd.name.keyup = () => {
    const txtRegionAddName = $('#txtRegionAddName');
    const hlpRegionAddName = $('#hlpRegionAddName');
    const btnRegionAddNameNext = $('#btnRegionAddNameNext');
    const newText = txtRegionAddName.val().toUpperCase();

    const hlpTextRegionFound = 'The region already exists<br><br>';
    const hlpTextDescription = 'The region name must be between 1 and 31 characters long, having the first char a letter and\n' +
        'the other chars alphanumeric';

    // Look for existing region
    let found = false;
    Object.keys(app.system.regions).forEach((regionName) => {
        if (newText === regionName) found = true
    });

    // Process the help
    if (found || newText.length === 0) {
        // invalid
        txtRegionAddName
            .removeClass('is-valid').addClass('is-invalid')
            .css('border-color', 'var(--ydb-status-red');

        btnRegionAddNameNext
            .prop('disabled', true)
            .addClass('disabled');

        if (found) {
            hlpRegionAddName
                .html(hlpTextRegionFound)
                .css('color', 'var(--ydb-status-red')

        } else {
            hlpRegionAddName
                .html(hlpTextDescription)
                .css('color', 'var(--ydb-status-red')
        }

    } else {
        // valid
        txtRegionAddName
            .removeClass('is-invalid').addClass('is-valid')
            .css('border-color', 'var(--ydb-status-green');

        hlpRegionAddName
            .html(hlpTextDescription)
            .css('color', 'var(--ydb-status-green');

        btnRegionAddNameNext
            .prop('disabled', false)
            .removeClass('disabled');

    }

    app.ui.regionAdd.name.region = newText
};

// ***************************************
// region add
// ***************************************
app.ui.regionAdd.init = () => {
    $('#regionAddSegmentNameBg').on('click', () => app.ui.regionAdd.SwitchSegmentType('bg'));
    $('#regionAddSegmentNameMm').on('click', () => app.ui.regionAdd.SwitchSegmentType('mm'));

    $('#chkRegionAddAdvancedMode').on('click', () => app.ui.regionAdd.SwitchAdvancedMode());

    $('#optRegionAddJournalTypeNo').on('click', () => app.ui.regionAdd.SwitchJournal('off'));
    $('#optRegionAddJournalTypeYes').on('click', () => app.ui.regionAdd.SwitchJournal('on'));

    $('#btnRegionAddNamesAdd').on('click', () => app.ui.regionAdd.nameAdd());
    $('#btnRegionAddNamesDelete').on('click', () => app.ui.regionAdd.nameDelete());

    $('#btnRegionAddOk').on('click', () => app.ui.regionAdd.okPressed());

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (event) {
        $('#divRegionAddAdvancedParameters').css('display', event.target.toString().indexOf('Names') > -1 ? 'none' : 'block');
    });

    $('#modalRegionAdd').on('hide.bs.modal', () => {
        // Clear all tables
        $('#tblRegionAddBg > tbody').empty();
        $('#tblRegionAddMm > tbody').empty();
        $('#tblRegionAddAc > tbody').empty();
        $('#tblRegionAddJo > tbody').empty();
    });
};

app.ui.regionAdd.show = async () => {
    let templates;

    try {
        templates = await app.REST._getTemplates()

    } catch (err) {
        await app.ui.msgbox.show(app.REST.parseError(err), 'ERROR', true);

        return
    }

    // Header title
    $('#lblRegionAddTitle').text(app.ui.regionAdd.name.region);

    // Clear manifest
    app.ui.regionShared.clearManifest();

    // Populate the manifest with templates
    app.ui.regionAdd.populateManifest(templates);

    // set journal status
    if (templates.data.region.JOURNAL.value === 0) {
        $('#optRegionAddJournalTypeNo').prop('checked', true);
        app.ui.regionAdd.SwitchJournal('off');

    } else {
        $('#optRegionAddJournalTypeYes').prop('checked', true);
        app.ui.regionAdd.SwitchJournal('on')
    }

    // reset the names
    app.ui.regionShared.manifest.names = [];
    $('#tblRegionAddNames > tbody').empty();

    // reset the tabs
    $('#navRegionEditorRegion').tab('show');

    // reset the switches
    app.ui.regionAdd.SwitchSegmentType('bg');
    $('#regionAddSegmentNameBg').prop('checked', true);

    $('#chkRegionAddAdvancedMode').prop('checked', false);

    // Populate all tables
    app.ui.regionShared.renderTable($('#tblRegionAddBg > tbody'));
    app.ui.regionShared.renderTable($('#tblRegionAddMm > tbody'));
    app.ui.regionShared.renderTable($('#tblRegionAddAc > tbody'));
    app.ui.regionShared.renderTable($('#tblRegionAddJo > tbody'));

    // Display form
    $('#modalRegionAdd').modal({show: true, backdrop: 'static', keyboard: false});
};

app.ui.regionAdd.SwitchSegmentType = type => {
    $('#' + (type === 'bg' ? 'divRegionAddBg' : 'divRegionAddMm')).css('display', 'block');
    $('#' + (type === 'bg' ? 'divRegionAddMm' : 'divRegionAddBg')).css('display', 'none');

    app.ui.regionAdd.enableTemplatesRegion()
};

app.ui.regionAdd.SwitchAdvancedMode = () => {
    // Re=populate all tables
    app.ui.regionShared.renderTable($('#tblRegionAddBg > tbody'));
    app.ui.regionShared.renderTable($('#tblRegionAddMm > tbody'));
    app.ui.regionShared.renderTable($('#tblRegionAddAc > tbody'));
    app.ui.regionShared.renderTable($('#tblRegionAddJo > tbody'));
};

app.ui.regionAdd.enableTemplatesRegion = () => {
    let somethingIsDirty = false;

    app.ui.regionShared.manifest.dbAccess.forEach(el => {
        if (el.dirty) somethingIsDirty = true;
    });

    if (somethingIsDirty === false) {
        const array = $('#regionAddSegmentNameBg').is(':checked') ? app.ui.regionShared.manifest.dbFile.bg : app.ui.regionShared.manifest.dbFile.mm;
        array.forEach(el => {
            if (el.dirty) somethingIsDirty = true;

        })
    }

    const swcRegionAddUpdateTemplatesRegion = $('#swcRegionAddUpdateTemplatesRegion');
    swcRegionAddUpdateTemplatesRegion.attr('disabled', !somethingIsDirty);
    if (!somethingIsDirty) swcRegionAddUpdateTemplatesRegion.prop('checked', false)
};

app.ui.regionAdd.enableTemplatesJournal = () => {
    let somethingIsDirty = false;

    app.ui.regionShared.manifest.journal.forEach(el => {
        if (el.dirty) somethingIsDirty = true;
    });

    const swcRegionAddUpdateTemplatesJournal = $('#swcRegionAddUpdateTemplatesJournal');
    swcRegionAddUpdateTemplatesJournal.attr('disabled', !somethingIsDirty);

    if (!somethingIsDirty) swcRegionAddUpdateTemplatesJournal.prop('checked', false)
};

app.ui.regionAdd.SwitchJournal = val => {
    $('#divRegionAddJournalParams').css('display', val === 'on' ? 'block' : 'none');
    $('#divRegionAddJournalSpacer').css('display', val === 'on' ? 'none' : 'block');

    const el = getEl(app.ui.regionShared.manifest.journal, 'journalEnabled');
    el.value = val === 'on' ? 1 : 0;
    el.dirty = el.value !== el.oldValue;

    app.ui.regionAdd.enableTemplatesJournal();
};

app.ui.regionAdd.nameAdd = () => {
    // Display form
    app.ui.regionNames.add.show();
};

app.ui.regionAdd.nameDelete = () => {
    app.ui.regionNames.delete.show('tblRegionAddNames');
};

app.ui.regionAdd.okPressed = async () => {

    if (app.ui.regionShared.manifest.names.length === 0) {
        await app.ui.msgbox.show('You need to enter at least one name...', 'WARNING', true);

        $('#navRegionEditorNames').tab('show');

        return
    }

    // Get status of switches
    const updateTemplateDb = $('#swcRegionAddUpdateTemplatesRegion').is(':checked');
    const updateTemplateJournal = $('#swcRegionAddUpdateTemplatesJournal').is(':checked');

    const dbFileModeBg = $('#regionAddSegmentNameBg').is(':checked');

    // Get modifiers for input box
    const segmentArray = dbFileModeBg === true ? app.ui.regionShared.manifest.dbFile.bg : app.ui.regionShared.manifest.dbFile.mm;
    const dbAccessArray = app.ui.regionShared.manifest.dbAccess;
    const journalArray = app.ui.regionShared.manifest.journal;
    const journalEnabled = getEl(journalArray, 'journalEnabled').value === 1;
    const createDbFile = getEl(segmentArray, 'createFile').value === 1;
    const switchJournalOn = getEl(journalArray, 'switchOn').value === 1;

    // Perform basic validation

    // BG and journal type
    if (dbFileModeBg === false && journalEnabled === true && getEl(journalArray, 'beforeImage').value === 1) {
        app.ui.msgbox.show('A region with MM segment can not have a "beforeImage" journaling', 'WARNING');
        return
    }

    // BG asyncIO sector size
    if (dbFileModeBg === true && getEl(segmentArray, 'asyncIo').value === 1) {
        // fetch the file system sector size
        let res;
        try {
            res = await app.REST._validatePath(getEl(segmentArray, 'filename').value);

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
            app.ui.msgbox.show('The region block size must be equal or a multiple of the device block size, which is: ' + res.data.deviceBlockSize, 'WARNING')

            return
        }
    }

    const inputboxText = 'You are going to create a new region called: ' + app.ui.regionAdd.name.region + '<br><br>' +
        'The database file will ' + (createDbFile === true ? '' : 'NOT') + ' be created' +
        (journalEnabled === true ? '<br>The journaling will ' + (switchJournalOn === true ? '' : 'NOT') + ' be started immediately' : '') +
        '<br><br>Are you sure you want to proceed ?';

    app.ui.inputbox.show(inputboxText, 'WARNING', async ret => {
        if (ret === 'YES') {
            const payload = {};

            // fields data
            payload.regionName = app.ui.regionAdd.name.region;
            payload.segmentTypeBg = dbFileModeBg;
            payload.journalEnabled = journalEnabled;
            payload.segmentData = [];
            payload.dbAccess = {
                region: [],
                journal: []
            };

            // segment
            segmentArray.forEach(el => {
                if (el.dirty === true) {
                    if (el.id === 'autoDb') {
                        payload.dbAccess.region.push({
                            id: el.id,
                            value: el.value
                        })

                    } else {
                        payload.segmentData.push({
                            id: el.id,
                            value: el.value
                        })
                    }
                }
            });

            // region
            dbAccessArray.forEach(el => {
                if (el.dirty === true) {
                    payload.dbAccess.region.push({
                        id: el.id,
                        value: el.value
                    })
                }
            });

            // journal
            journalArray.forEach(el => {
                if (el.id === 'epoChTaper') {
                    payload.epochTaper = el.value;
                    return
                }
                if (el.dirty === true) {
                    payload.dbAccess.journal.push({
                        id: el.id,
                        value: el.value
                    })
                }
            });

            // Templates flags
            payload.templates = {
                updateTemplateDb: updateTemplateDb,
                updateTemplateJournal: updateTemplateJournal
            };

            // names
            payload.names = app.ui.regionShared.manifest.names;
            if (app.ui.regionShared.manifest.names.length === 0) {
                return
            }

            // filenames
            payload.segmentFilename = dbFileModeBg === true ? getEl(app.ui.regionShared.manifest.dbFile.bg, 'filename').value : getEl(app.ui.regionShared.manifest.dbFile.mm, 'filename').value;
            payload.journalFilename = getEl(app.ui.regionShared.manifest.journal, 'jfilename').value;

            // Post-creation operations
            payload.postProcessing = {
                createDbFile: createDbFile,
                switchJournalOn: switchJournalOn
            };

            // let's keep this until fully debugged
            console.log(payload)
            // **********************
            //execute REST call
            // **********************
            try {
                const res = await app.REST._addRegion(payload);

                $('#modalRegionAdd').modal('hide');

                switch (res.result) {
                    case 'OK': {
                        app.ui.dashboard.refresh();

                        break
                    }
                    case 'WARNING': {
                        let errorList = '';

                        if (Array.isArray(res.error)) {
                            res.error.forEach(err => {
                                errorList += 'Error description: ' + err.description + '<br>Error details:<br>';
                                if (Array.isArray(err.dump)) {
                                    errorList = err.dump[0].split(',')[1] + '<br>'
                                }
                            });
                        }

                        app.ui.msgbox.show('Some warnings are returned from the REST call:<br>' + errorList, 'WARNING');

                        app.ui.dashboard.refresh();

                        break
                    }
                    case 'ERROR': {
                        let error = '';

                        if (Array.isArray(res.error.dump)) {
                            error = res.error.dump[0].split(',')[1]
                        }

                        app.ui.msgbox.show('An error occurred while executing the request<br><br>' + error, 'ERROR');

                        return
                    }
                }
            } catch (err) {
                $('#modalRegionAdd').modal('hide');
                app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');

            }
        }
    })
};

// *************************************************
// Populate arrays with fetched data
// *************************************************
app.ui.regionAdd.populateManifest = templates => {
    getEl = (array, id) => {
        return array.find(el => el.id === id);
    };

    const bg = app.ui.regionShared.manifest.dbFile.bg;
    const mm = app.ui.regionShared.manifest.dbFile.mm;
    const dbAccess = app.ui.regionShared.manifest.dbAccess;
    const journal = app.ui.regionShared.manifest.journal;

    let el;

    // finds the base directory
    let defaultRegion = false;
    let secondaryRegion = false;
    let basePath;
    let journalBasePath;

    // Db path
    Object.keys(app.system.regions).forEach((regionName) => {
        const region = app.system.regions[regionName];

        if (secondaryRegion === false && region.dbFile.flags.file !== '') secondaryRegion = region;
        if (regionName === 'DEFAULT') defaultRegion = region;
    });
    if (defaultRegion !== false) secondaryRegion = defaultRegion;

    basePath = secondaryRegion.dbFile.flags.file.split('/');
    basePath = basePath.slice(0, basePath.length - 1).join('/') + '/';

    // Journal path
    journalBasePath = app.ui.regionShared.computeJournalBasePath();

    // BG
    el = getEl(bg, 'filename');
    el.oldValue = basePath + app.ui.regionAdd.name.region.toLowerCase() + '.dat';
    el.value = basePath + app.ui.regionAdd.name.region.toLowerCase() + '.dat';
    el.min = 0;
    el.max = 0;

    el = getEl(bg, 'createFile');
    el.oldValue = 1;
    el.value = 1;
    el.min = 0;
    el.max = 0;

    el = getEl(bg, 'globalBufferCount');
    el.oldValue = templates.data.segment.BG.GLOBAL_BUFFER_COUNT.value;
    el.value = templates.data.segment.BG.GLOBAL_BUFFER_COUNT.value;
    el.min = templates.data.segment.BG.GLOBAL_BUFFER_COUNT.min;
    el.max = templates.data.segment.BG.GLOBAL_BUFFER_COUNT.max;

    el = getEl(bg, 'initialAllocation');
    el.oldValue = templates.data.segment.BG.ALLOCATION.value;
    el.value = templates.data.segment.BG.ALLOCATION.value;
    el.min = templates.data.segment.BG.ALLOCATION.min;
    el.max = templates.data.segment.BG.ALLOCATION.max;

    el = getEl(bg, 'asyncIo');
    el.oldValue = templates.data.segment.BG.ASYNCIO.value;
    el.value = templates.data.segment.BG.ASYNCIO.value;
    el.min = templates.data.segment.BG.ASYNCIO.min;
    el.max = templates.data.segment.BG.ASYNCIO.max;

    el = getEl(bg, 'blockSize');
    el.oldValue = templates.data.segment.BG.BLOCK_SIZE.value;
    el.value = templates.data.segment.BG.BLOCK_SIZE.value;
    el.min = templates.data.segment.BG.BLOCK_SIZE.min;
    el.max = templates.data.segment.BG.BLOCK_SIZE.max;

    el = getEl(bg, 'deferAllocate');
    el.oldValue = templates.data.segment.BG.DEFER_ALLOCATE.value;
    el.value = templates.data.segment.BG.DEFER_ALLOCATE.value;
    el.min = templates.data.segment.BG.DEFER_ALLOCATE.min;
    el.max = templates.data.segment.BG.DEFER_ALLOCATE.max;

    el = getEl(bg, 'extensionCount');
    el.oldValue = templates.data.segment.BG.EXTENSION_COUNT.value;
    el.value = templates.data.segment.BG.EXTENSION_COUNT.value;
    el.min = templates.data.segment.BG.EXTENSION_COUNT.min;
    el.max = templates.data.segment.BG.EXTENSION_COUNT.max;

    el = getEl(bg, 'lockSpace');
    el.oldValue = templates.data.segment.BG.LOCK_SPACE.value;
    el.value = templates.data.segment.BG.LOCK_SPACE.value;
    el.min = templates.data.segment.BG.LOCK_SPACE.min;
    el.max = templates.data.segment.BG.LOCK_SPACE.max;

    el = getEl(bg, 'mutexSlots');
    el.oldValue = templates.data.segment.BG.MUTEX_SLOTS.value;
    el.value = templates.data.segment.BG.MUTEX_SLOTS.value;
    el.min = templates.data.segment.BG.MUTEX_SLOTS.min;
    el.max = templates.data.segment.BG.MUTEX_SLOTS.max;

    el = getEl(bg, 'autoDb');
    el.oldValue = templates.data.region.AUTODB.value;
    el.value = templates.data.region.AUTODB.value;
    el.min = templates.data.region.AUTODB.min;
    el.max = templates.data.region.AUTODB.max;

    // MM
    el = getEl(mm, 'filename');
    el.oldValue = basePath + app.ui.regionAdd.name.region.toLowerCase() + '.dat';
    el.value = basePath + app.ui.regionAdd.name.region.toLowerCase() + '.dat';
    el.min = 0;
    el.max = 0;

    el = getEl(mm, 'createFile');
    el.oldValue = 1;
    el.value = 1;
    el.min = 0;
    el.max = 0;

    el = getEl(mm, 'initialAllocation');
    el.oldValue = templates.data.segment.MM.ALLOCATION.value;
    el.value = templates.data.segment.MM.ALLOCATION.value;
    el.min = templates.data.segment.MM.ALLOCATION.min;
    el.max = templates.data.segment.MM.ALLOCATION.max;

    el = getEl(mm, 'blockSize');
    el.oldValue = templates.data.segment.MM.BLOCK_SIZE.value;
    el.value = templates.data.segment.MM.BLOCK_SIZE.value;
    el.min = templates.data.segment.MM.BLOCK_SIZE.min;
    el.max = templates.data.segment.MM.BLOCK_SIZE.max;

    el = getEl(mm, 'deferAllocate');
    el.oldValue = templates.data.segment.MM.DEFER_ALLOCATE.value;
    el.value = templates.data.segment.MM.DEFER_ALLOCATE.value;
    el.min = templates.data.segment.MM.DEFER_ALLOCATE.min;
    el.max = templates.data.segment.MM.DEFER_ALLOCATE.max;

    el = getEl(mm, 'extensionCount');
    el.oldValue = templates.data.segment.MM.EXTENSION_COUNT.value;
    el.value = templates.data.segment.MM.EXTENSION_COUNT.value;
    el.min = templates.data.segment.MM.EXTENSION_COUNT.min;
    el.max = templates.data.segment.MM.EXTENSION_COUNT.max;

    el = getEl(mm, 'lockSpace');
    el.oldValue = templates.data.segment.MM.LOCK_SPACE.value;
    el.value = templates.data.segment.MM.LOCK_SPACE.value;
    el.min = templates.data.segment.MM.LOCK_SPACE.min;
    el.max = templates.data.segment.MM.LOCK_SPACE.max;

    el = getEl(mm, 'autoDb');
    el.oldValue = templates.data.region.AUTODB.value;
    el.value = templates.data.region.AUTODB.value;
    el.min = templates.data.region.AUTODB.min;
    el.max = templates.data.region.AUTODB.max;

    // dbAccess
    el = getEl(dbAccess, 'recordSize');
    el.oldValue = templates.data.region.RECORD_SIZE.value;
    el.value = templates.data.region.RECORD_SIZE.value;
    el.min = templates.data.region.RECORD_SIZE.min;
    el.max = templates.data.region.RECORD_SIZE.max;

    el = getEl(dbAccess, 'keySize');
    el.oldValue = templates.data.region.KEY_SIZE.value;
    el.value = templates.data.region.KEY_SIZE.value;
    el.min = templates.data.region.KEY_SIZE.min;
    el.max = templates.data.region.KEY_SIZE.max;

    el = getEl(dbAccess, 'nullSubscripts');
    el.oldValue = templates.data.region.NULL_SUBSCRIPTS.value;
    el.value = templates.data.region.NULL_SUBSCRIPTS.value;
    el.min = templates.data.region.NULL_SUBSCRIPTS.min;
    el.max = templates.data.region.NULL_SUBSCRIPTS.max;

    el = getEl(dbAccess, 'lockCriticalSeparate');
    el.oldValue = templates.data.region.LOCK_CRIT_SEPARATE.value;
    el.value = templates.data.region.LOCK_CRIT_SEPARATE.value;
    el.min = templates.data.region.LOCK_CRIT_SEPARATE.min;
    el.max = templates.data.region.LOCK_CRIT_SEPARATE.max;

    el = getEl(dbAccess, 'qbRundown');
    el.oldValue = templates.data.region.QDBRUNDOWN.value;
    el.value = templates.data.region.QDBRUNDOWN.value;
    el.min = templates.data.region.QDBRUNDOWN.min;
    el.max = templates.data.region.QDBRUNDOWN.max;

    el = getEl(dbAccess, 'stats');
    el.oldValue = templates.data.region.STATS.value;
    el.value = templates.data.region.STATS.value;
    el.min = templates.data.region.STATS.min;
    el.max = templates.data.region.STATS.max;

    // journal
    el = getEl(journal, 'journalEnabled');
    el.oldValue = templates.data.region.JOURNAL.value;
    el.value = templates.data.region.JOURNAL.value;

    el = getEl(journal, 'jfilename');
    el.oldValue = journalBasePath + app.ui.regionAdd.name.region.toLowerCase() + '.mjl';
    el.value = journalBasePath + app.ui.regionAdd.name.region.toLowerCase() + '.mjl';
    el.min = 0;
    el.max = 0;

    el = getEl(journal, 'switchOn');
    el.oldValue = 1;
    el.value = 1;
    el.min = 0;
    el.max = 0;

    el = getEl(journal, 'beforeImage');
    el.oldValue = templates.data.region.BEFORE_IMAGE.value;
    el.value = templates.data.region.BEFORE_IMAGE.value;
    el.min = templates.data.region.BEFORE_IMAGE.min;
    el.max = templates.data.region.BEFORE_IMAGE.max;

    el = getEl(journal, 'allocation');
    el.oldValue = templates.data.region.ALLOCATION.value;
    el.value = templates.data.region.ALLOCATION.value;
    el.min = templates.data.region.ALLOCATION.min;
    el.max = templates.data.region.ALLOCATION.max;

    el = getEl(journal, 'autoSwitchLimit');
    el.oldValue = templates.data.region.AUTOSWITCHLIMIT.value;
    el.value = templates.data.region.AUTOSWITCHLIMIT.value;
    el.min = templates.data.region.AUTOSWITCHLIMIT.min;
    el.max = templates.data.region.AUTOSWITCHLIMIT.max;

    el = getEl(journal, 'bufferSize');
    el.oldValue = templates.data.region.BUFFER_SIZE.value;
    el.value = templates.data.region.BUFFER_SIZE.value;
    el.min = templates.data.region.BUFFER_SIZE.min;
    el.max = templates.data.region.BUFFER_SIZE.max;

    el = getEl(journal, 'epochTaper');
    el.oldValue = templates.data.region.EPOCHTAPER.value;
    el.value = templates.data.region.EPOCHTAPER.value;
    el.min = templates.data.region.EPOCHTAPER.min;
    el.max = templates.data.region.EPOCHTAPER.max;

    el = getEl(journal, 'epochInterval');
    el.oldValue = templates.data.region.EPOCH_INTERVAL.value;
    el.value = templates.data.region.EPOCH_INTERVAL.value;
    el.min = templates.data.region.EPOCH_INTERVAL.min;
    el.max = templates.data.region.EPOCH_INTERVAL.max;

    el = getEl(journal, 'extension');
    el.oldValue = templates.data.region.EXTENSION.value;
    el.value = templates.data.region.EXTENSION.value;
    el.min = templates.data.region.EXTENSION.min;
    el.max = templates.data.region.EXTENSION.max;

    el = getEl(journal, 'syncIo');
    el.oldValue = templates.data.region.SYNC_IO.value;
    el.value = templates.data.region.SYNC_IO.value;
    el.min = templates.data.region.SYNC_IO.min;
    el.max = templates.data.region.SYNC_IO.max;

    el = getEl(journal, 'yieldLimit');
    el.oldValue = templates.data.region.YIELD_LIMIT.value;
    el.value = templates.data.region.YIELD_LIMIT.value;
    el.min = templates.data.region.YIELD_LIMIT.min;
    el.max = templates.data.region.YIELD_LIMIT.max;
};
