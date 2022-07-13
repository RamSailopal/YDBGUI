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

// **************************************
// Region Select
// **************************************
app.ui.regionSelect.init = () => {
    $('#btnRegionSelectOk').on('click', () => app.ui.regionSelect.okPressed());

    $('#modalRegionSelect').on('keydown', (e) => app.ui.regionSelect.processCursorKeys(e.which))
};

app.ui.regionSelect.onOkPressed = null;

app.ui.regionSelect.show = (regions, onOkPressed) => {
    const divRegionSelectList = $('#divRegionSelectList');

    divRegionSelectList.empty();

    let isFirst = true;
    regions.forEach(region => {
        let filename = '';

        if (app.system.regions[region] === undefined) return;

        if (app.system.regions[region].dbFile !== undefined) {
            filename = app.ui.getKeyValue(app.system.regions[region].dbFile.data, 'FILE_NAME');
        }

        let row = '<a class="nav-link ' + (isFirst ? 'active' : '') + '" id="navRegionSelect_' + region + '" data-toggle="pill" role="tab" ondblclick="app.ui.regionSelect.okPressed()"><div class="row"><div class="col-3">';

        row += region;
        row += '</div><div class="col-9" style="font-size: 14px; font-weight: normal">';
        row += '<span class="inconsolata">' + filename + '</span>';
        row += '</div></div></a>';

        divRegionSelectList.append(row);

        if (isFirst === true) isFirst = false;
    });

    app.ui.regionSelect.onOkPressed = onOkPressed;

    $('#modalRegionSelect').modal({show: true, backdrop: 'static', keyboard: true});
};

app.ui.regionSelect.okPressed = () => {
    const selElement = $('#divRegionSelectList').find('.active').attr('id');

    $('#modalRegionSelect').modal('hide');
    app.ui.regionView.currentRegion = selElement.split('_')[1];
    app.ui.regionSelect.onOkPressed()
};

app.ui.regionSelect.processCursorKeys = charCode => {
    if (charCode === 13) {
        app.ui.regionSelect.okPressed();
        return;
    }

    const list = $('#divRegionSelectList').children();
    const totalLength = list.length;
    let nextIx = 0;

    let ix = 0;
    list.each(function () {
        ix++;

        if ($(this).hasClass('active')) {
            if (charCode === 40) {
                // going down
                if (ix === totalLength) return;

                $(this).removeClass('active');
                nextIx = ix + 1;

            } else if (charCode === 38) {
                // going up
                if (ix === 1) return;

                $(this).removeClass('active');
                nextIx = ix - 1;
            }
        }
    });

    if (nextIx > 0) {
        let ix = 0;
        list.each(function () {
            ix++;

            if (ix === nextIx) {
                $(this).addClass('active');
            }
        })
    }
};

// **************************************
// Region Delete
// **************************************
app.ui.regionDelete.regionName = '';
app.ui.regionDelete.withDelete = false;

app.ui.regionDelete.init = () => {
    $('#btnRegionConfirmDeleteOk').on('click', () => app.ui.regionDelete.submitDelete());

    $('#txtRegionDeleteConfirmDelete')
        .on('change', () => app.ui.regionDelete.validateConfirm())
        .on('keyup', () => app.ui.regionDelete.validateConfirm());
};

app.ui.regionDelete.show = () => {
    const region = app.ui.regionView.currentRegion;
    const fileExist = app.system.regions[region].dbFile.flags.fileExist;

    const checkbox = '<div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="chkRegionDeleteFiles"' + (fileExist ? ' checked' : ' disabled') + '>' +
        '<label class="custom-control-label" for="chkRegionDeleteFiles">Delete also all the files</label></div>';


    app.ui.inputbox.show('WARNING: you are deleting the region: ' + region + '<br><br>This will delete all the references to the region.<br><br>Are you really sure this is what you want to do ?<br><br>' + checkbox, 'WARNING', ret => {
        if (ret === 'YES') {
            setTimeout(app.ui.regionDelete.confirmAgain, 600, region, $('#chkRegionDeleteFiles').is(':checked'));
        }
    })
};

app.ui.regionDelete.validateConfirm = () => {
    const txtRegionDeleteConfirmDelete = $('#txtRegionDeleteConfirmDelete');
    const btnRegionConfirmDeleteOk = $('#btnRegionConfirmDeleteOk');
    if (txtRegionDeleteConfirmDelete.val().toUpperCase() === app.ui.regionDelete.regionName.toUpperCase()) {
        txtRegionDeleteConfirmDelete
            .addClass('is-valid')
            .removeClass('is-invalid');

        btnRegionConfirmDeleteOk
            .removeClass('disabled')
            .attr('disabled', false)

    } else {
        txtRegionDeleteConfirmDelete
            .removeClass('is-valid')
            .addClass('is-invalid');

        btnRegionConfirmDeleteOk
            .addClass('disabled')
            .attr('disabled', true)
    }
};

app.ui.regionDelete.confirmAgain = (region, withDelete) => {
    app.ui.regionDelete.regionName = region;
    app.ui.regionDelete.withDelete = withDelete;
    const deleteText = region + '  ' + (withDelete === true ? '<br>This will delete also the database and all the journal files.' : '');

    $('#spanRegionDeleteConfirmHeader').html(deleteText);

    const txtRegionDeleteConfirmDelete = $('#txtRegionDeleteConfirmDelete');
    txtRegionDeleteConfirmDelete.val('');

    $('#btnRegionConfirmDeleteOk')
        .addClass('disabled')
        .attr('disabled', true);

    $('#modalRegionConfirmDelete')
        .modal({show: true, backdrop: 'static', keyboard: true})
        .on('shown.bs.modal', () => {
            txtRegionDeleteConfirmDelete.focus()
        })
};

app.ui.regionDelete.submitDelete = async () => {
    try {
        const res = await app.REST._regionDelete(app.ui.regionDelete.regionName, app.ui.regionDelete.withDelete);

        $('#modalRegionConfirmDelete').modal('hide');

        if (res.result === 'OK') {
            app.ui.msgbox.show('The database has been deleted', 'SUCCESS');

            app.ui.dashboard.refresh();

        } else {
            let messageText = 'The following error occurred while deleting the region: ' + res.error.description;

            if (Array.isArray(res.error.dump)) {
                messageText += '<br> Details:';

                res.error.dump.forEach(dumpLine => {
                    messageText += '<br>' + dumpLine
                })
            }
            app.ui.msgbox.show(messageText, 'FATAL')
        }

    } catch (err) {
        app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');
    }
};


// **************************************
// Region Extend
// **************************************
app.ui.regionExtend.regionName = '';
app.ui.regionExtend.lastValue = '';

app.ui.regionExtend.init = () => {
    $('#optRegionExtendTypeBlocks').on('click', () => app.ui.regionExtend.switchMode());
    $('#optRegionExtendTypeBytes').on('click', () => app.ui.regionExtend.switchMode());

    $('#btnRegionExtendOk').on('click', () => app.ui.regionExtend.okPressed());

    // used to ensure that the dialog stands out
    $('#modalExtend').on('hide.bs.modal', () => {
        $('.modal-backdrop').css('z-index', 1040)
    });
};

app.ui.regionExtend.show = () => {
    app.ui.regionExtend.regionName = app.ui.regionView.currentRegion;

    const region = app.system.regions[app.ui.regionExtend.regionName];

    const blockSize = app.ui.getKeyValue(region.dbFile.data, 'BLOCK_SIZE');
    const availableSpace = region.dbFile.flags.device.split(' ')[3] * 1024; // Piece [3] is the free space * 1024 (disk sector size)

    const numRegionExtendBlocks = $('#numRegionExtendBlocks');
    const numRegionExtendByes = $('#numRegionExtendBytes');

    // mount handlers
    numRegionExtendBlocks.on('click', () => app.ui.regionExtend.refreshProgress(region));
    numRegionExtendByes.on('click', () => app.ui.regionExtend.refreshProgress(region));
    numRegionExtendBlocks.on('keyup', () => app.ui.regionExtend.refreshProgress(region));
    numRegionExtendByes.on('keyup', () => app.ui.regionExtend.refreshProgress(region));

    // populate dialog
    $('#lblRegionExtendModalHeader').text('Extend region: ' + app.ui.regionExtend.regionName);

    const currentSizeBytes = app.ui.formatBytes(region.dbFile.usage.totalBlocks * blockSize).split(' ');
    $('#lblRegionExtendCurrentSize').text(app.ui.formatThousands(region.dbFile.usage.totalBlocks));
    $('#lblRegionExtendCurrentSizeBytes').text(currentSizeBytes[0]);
    $('#lblRegionExtendCurrentSizeBytesUnit').text(currentSizeBytes[1]);

    const availableSpaceBytes = app.ui.formatBytes(availableSpace).split(' ');
    $('#lblRegionExtendAvailableSpace').text(app.ui.formatThousands(availableSpace / blockSize));
    $('#lblRegionExtendAvailableSpaceBytes').text(availableSpaceBytes[0]);
    $('#lblRegionExtendAvailableSpaceBytesUnit').text(availableSpaceBytes[1]);

    $('#lblRegionExtendBlockSize').text(app.ui.formatThousands(blockSize));

    const extensionCount = app.ui.getKeyValue(region.dbFile.data, 'EXTENSION_COUNT');
    numRegionExtendBlocks.val(extensionCount > 0 ? extensionCount : 1000);
    app.ui.regionExtend.refreshProgress(region);

    $('#modalExtend').modal({show: true, backdrop: 'static', keyboard: true});

    // used to ensure that the dialog stands out
    $('.modal-backdrop').css('z-index', 1060)
};

app.ui.regionExtend.switchMode = () => {
    const selOption = $('input[name=optRegionExtendType]:checked').attr('id');
    const divRegionExtendTypeBlocks = $('#divRegionExtendTypeBlocks');
    const divRegionExtendTypeBlocks2 = $('#divRegionExtendTypeBlocks2');
    const divRegionExtendTypeBytes = $('#divRegionExtendTypeBytes');
    const divRegionExtendTypeBytes2 = $('#divRegionExtendTypeBytes2');

    if (selOption === 'optRegionExtendTypeBlocks') {
        divRegionExtendTypeBlocks.css('display', 'block');
        divRegionExtendTypeBlocks2.css('display', 'block');
        divRegionExtendTypeBytes.css('display', 'none');
        divRegionExtendTypeBytes2.css('display', 'none')

    } else {
        divRegionExtendTypeBlocks.css('display', 'none');
        divRegionExtendTypeBlocks2.css('display', 'none');
        divRegionExtendTypeBytes.css('display', 'block');
        divRegionExtendTypeBytes2.css('display', 'block')
    }
};

app.ui.regionExtend.refreshProgress = async region => {
    const numRegionExtendBytes = $('#numRegionExtendBytes');
    const numRegionExtendBlocks = $('#numRegionExtendBlocks');

    const blockSize = app.ui.getKeyValue(region.dbFile.data, 'BLOCK_SIZE');
    const availableBlocks = region.dbFile.flags.device.split(' ')[3] * 1024 / blockSize;
    const totalBlocks = region.dbFile.usage.totalBlocks;

    const inputTypeId = $('input[name=optRegionExtendType]:checked').attr('id');
    const btnRegionExtendOk = $('#btnRegionExtendOk');

    // Verify lower limits
    if ((inputTypeId === 'optRegionExtendTypeBytes' && numRegionExtendBytes.val() <= 0) || inputTypeId === 'optRegionExtendTypeBlocks' && numRegionExtendBlocks.val() <= 0) {
        btnRegionExtendOk
            .addClass('disabled', true)
            .attr('disabled')
    } else {
        btnRegionExtendOk
            .removeClass('disabled')
            .attr('disabled', false)
    }

    if (inputTypeId === 'optRegionExtendTypeBlocks') {
        // we are changing blocks
        numRegionExtendBytes.val(parseInt(numRegionExtendBlocks.val()) * blockSize.toString())

    } else {
        // we are changing megabytes
        numRegionExtendBlocks.val(parseInt(numRegionExtendBytes.val() / blockSize))
    }

    // Verify upper limits
    if (parseInt(numRegionExtendBlocks.val()) + totalBlocks >= availableBlocks) {
        await app.ui.msgbox.show('The value you entered won\'t fit in the device...', 'Warning', true);

        if (inputTypeId === 'optRegionExtendTypeBlocks') {
            numRegionExtendBlocks.val(app.ui.regionExtend.lastValue);

        } else {
            numRegionExtendBytes.val(app.ui.regionExtend.lastValue);

        }
        app.ui.regionExtend.refreshProgress(region);

        return
    }

    // remember last entry to roll back and make alert not appear anymore
    if (inputTypeId === 'optRegionExtendTypeBlocks') {
        app.ui.regionExtend.lastValue = numRegionExtendBlocks.val();

    } else {
        app.ui.regionExtend.lastValue = numRegionExtendBytes.val();
    }

    // update progress
    const total = availableBlocks + totalBlocks;
    const usedPercent = (totalBlocks / total * 100).toString();
    const extensionPercent = (numRegionExtendBlocks.val() / total * 100).toString();

    $('#rngRegionExtendRegionUsedSpace').css('width', parseInt(usedPercent).toString() + '%');
    $('#rngRegionExtendRegionUsedSpace2').css('width', parseInt(extensionPercent).toString() + '%');

    // update grand totals
    const grandTotalBlocks = (totalBlocks + parseInt(numRegionExtendBlocks.val())).toString();
    const grandTotalBytes = app.ui.formatBytes(grandTotalBlocks * blockSize).split(' ');
    $('#lblRegionExtendGrandSize').text(app.ui.formatThousands(grandTotalBlocks));
    $('#lblRegionExtendGrandSizeBytes').text(grandTotalBytes[0]);
    $('#lblRegionExtendGrandSizeBytesUnit').text(grandTotalBytes[1]);

    const grandFreeSpace = (availableBlocks - parseInt(numRegionExtendBlocks.val())).toString();
    const grandFreeSpaceBytes = app.ui.formatBytes(grandFreeSpace * blockSize).split(' ');
    $('#lblRegionExtendGrandAvailableSize').text(app.ui.formatThousands(grandFreeSpace));
    $('#lblRegionExtendGrandAvailableSizeBytes').text(grandFreeSpaceBytes[0]);
    $('#lblRegionExtendGrandAvailableSizeBytesUnit').text(grandFreeSpaceBytes[1]);
};

app.ui.regionExtend.okPressed = () => {
    const numRegionExtendBlocks = $('#numRegionExtendBlocks');
    app.ui.inputbox.show('This will extend the current database with ' + app.ui.formatThousands(numRegionExtendBlocks.val()) + ' blocks.' +
        '<br><br>Are you sure ?', 'Warning', async ret => {
            if (ret === 'YES') {
                try {
                    const res = await app.REST._regionExtend(app.ui.regionExtend.regionName, numRegionExtendBlocks.val());

                    $('#modalExtend').modal('hide');

                    if (res.result === 'OK') {
                        app.ui.RegionUtilsRefresh()

                    } else {
                        app.ui.msgbox.show('The following error occurred while extending the database: ' + res.error.description, 'FATAL')
                    }

                } catch (err) {
                    app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');

                }
            }
        }
    );
};

// **************************************
// Create Db File
// **************************************
app.ui.regionCreateDbFile.regionName = '';
app.ui.regionCreateDbFile.init = () => {
    $('#btnRegionCreateDbOk').on('click', () => app.ui.regionCreateDbFile.okPressed());

    $('#modalRegionCreateDbFile').on('hide.bs.modal', () => {
        $('.modal-backdrop').css('z-index', 1040)
    });
};

app.ui.regionCreateDbFile.show = () => {
    app.ui.regionCreateDbFile.regionName = app.ui.regionView.currentRegion;

    const region = app.system.regions[app.ui.regionCreateDbFile.regionName];

    if (region.dbFile.flags.device === undefined) {
        app.ui.msgbox.show('The database path has not been set.', 'FATAL');

        return
    }

    const blockSize = app.ui.getKeyValue(region.dbFile.data, 'BLOCK_SIZE');
    const availableSpace = region.dbFile.flags.device.split(' ')[3] * 1024;
    const allocation = app.ui.getKeyValue(region.dbFile.data, 'ALLOCATION');

    // fill labels
    $('#lblRegionCreateDbFileHeader').text('Create database file: ' + app.ui.regionCreateDbFile.regionName);

    const allocationBytes = app.ui.formatBytes(blockSize * allocation).split(' ');
    $('#lblRegionCreateDbAllocation').text(app.ui.formatThousands(allocation));
    $('#lblRegionCreateDbAllocationBytes').text(allocationBytes[0]);
    $('#lblRegionCreateDbAllocationBytesUnit').text(allocationBytes[1]);

    const availableBytes = app.ui.formatBytes(availableSpace).split(' ');
    $('#lblRegionCreateDbAvailableSpace').text(app.ui.formatThousands(availableSpace / blockSize));
    $('#lblRegionCreateDbAvailableSpaceBytes').text(availableBytes[0]);
    $('#lblRegionCreateDbAvailableSpaceBytesUnit').text(availableBytes[1]);

    // update grand total
    const newSpaceBlocks = (availableSpace / blockSize) - allocation;
    const newSpaceBytes = app.ui.formatBytes(newSpaceBlocks * blockSize).split(' ');
    $('#lblRegionCreateDbNewAvailableSpace').text(app.ui.formatThousands(newSpaceBlocks));
    $('#lblRegionCreateDbNewAvailableSpaceBytes').text(newSpaceBytes[0]);
    $('#lblRegionCreateDbNewAvailableSpaceBytesUnit').text(newSpaceBytes[1]);

    $('#modalRegionCreateDbFile').modal({show: true, backdrop: 'static', keyboard: true});
    $('.modal-backdrop').css('z-index', 1060)
};

app.ui.regionCreateDbFile.okPressed = () => {
    app.ui.inputbox.show('This will create the database file' + '<br><br>Are you sure ?', 'Warning', async ret => {
            if (ret === 'YES') {
                try {
                    const res = await app.REST._regionCreateDbFile(app.ui.regionCreateDbFile.regionName);

                    $('#modalRegionCreateDbFile').modal('hide');

                    if (res.result === 'OK') {
                        app.ui.RegionUtilsRefresh()

                    } else {
                        app.ui.msgbox.show('The following error occurred while creating the database: ' + res.error.description, 'FATAL')

                    }

                } catch (err) {
                    app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');

                }
            }
        }
    );
};

// **************************************
// Journal switch
// **************************************
app.ui.regionJournalSwitch.show = () => {

    const region = app.system.regions[app.ui.regionView.currentRegion];
    let mode = region.journal.flags.state === 1 ? 'on' : 'off';
    const repairJournal = $('#btnRegionViewJournalSwitch').text() === 'Recreate...';
    let message = '';

    if (repairJournal === true) {
        message = 'This will recreate the journal file ';
        mode = 'on';

    } else {
        message = 'This will turn the journaling ' + mode.toUpperCase()
    }

    app.ui.inputbox.show(message + ' in the region: ' + app.ui.regionView.currentRegion + '<br><br>Are you sure ?', mode === 'on' ? 'Warning' : 'WARNING', async ret => {
            if (ret === 'YES') {
                try {
                    const res = await app.REST._JournalSwitch(app.ui.regionView.currentRegion, mode);

                    $('#modalExtend').modal('hide');

                    if (res.result === 'OK') {
                        app.ui.RegionUtilsRefresh()

                    } else {
                        app.ui.msgbox.show('The following error occurred while switching the journal: ' + res.error.description, 'FATAL')
                    }

                } catch (err) {
                    app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');

                }
            }
        }
    );
};

app.ui.RegionUtilsRefresh = () => {
    if ($('#modalRegionView').css('display') === 'block') {
        app.ui.regionView.refreshBtn()

    } else {
        app.ui.dashboard.refresh()
    }
};
