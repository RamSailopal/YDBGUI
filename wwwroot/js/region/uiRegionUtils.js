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
        row += filename;
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
    app.ui.regionSelect.onOkPressed(selElement.split('_')[1])
};

// **************************************
// Region Delete
// **************************************
app.ui.regionDelete.show = (region) => {
    const checkbox = '<div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="chkRegionDeleteFiles" checked>' +
        '<label class="custom-control-label" for="chkRegionDeleteFiles">Delete also all the files</label></div>';


    app.ui.inputbox.show('WARNING: you are deleting the region: ' + region + '<br><br>This will delete all the references to the region.<br><br>Are you really sure this is what you want to do ?<br><br>' + checkbox, 'WARNING', ret => {
        if (ret === 'YES') {
            setTimeout(app.ui.regionDelete.confirmAgain, 600, region, $('#chkRegionDeleteFiles').is(':checked'));
        }
    })
};

app.ui.regionDelete.confirmAgain = (region, withDelete) => {
    const deleteText = withDelete === true ? '<br><br>This will delete also all the database and journal files.' : '';

    app.ui.inputbox.show('THIS OPERATION CAN NOT BE UNDONE !!!' + deleteText + '<br><br>Is this what you really want to do ?', 'WARNING', async ret => {
        if (ret === 'YES') {
            try {
                const res = await app.REST._regionDelete(region, withDelete);

                $('#modalExtend').modal('hide');

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
        }
    })
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

app.ui.regionExtend.show = regionName => {
    app.ui.regionExtend.regionName = regionName;

    const region = app.system.regions[regionName];

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
    $('#lblRegionExtendModalHeader').text('Extend region: ' + regionName);
    $('#lblRegionExtendCurrentSize').text(app.ui.formatThousands(region.dbFile.usage.totalBlocks) + ' blocks ( ' + app.ui.formatBytes(region.dbFile.usage.totalBlocks * blockSize) + ' )');
    $('#lblRegionExtendAvailableSpace').text(app.ui.formatThousands(availableSpace / blockSize) + ' blocks ( ' + app.ui.formatBytes(availableSpace) + ' )');
    $('#lblRegionExtendBlockSize').text(app.ui.formatBytes(blockSize));

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
    $('#lblRegionExtendGrandSize').text(app.ui.formatThousands(grandTotalBlocks) + ' blocks ( ' + app.ui.formatBytes(grandTotalBlocks * blockSize) + ' )');

    const grandFreeSpace = (availableBlocks - parseInt(numRegionExtendBlocks.val())).toString();
    $('#lblRegionExtendGrandAvailableSize').text(app.ui.formatThousands(grandFreeSpace) + ' blocks ( ' + app.ui.formatBytes(grandFreeSpace * blockSize) + ' )');
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

app.ui.regionCreateDbFile.show = regionName => {
    app.ui.regionCreateDbFile.regionName = regionName;

    const region = app.system.regions[regionName];

    if (region.dbFile.flags.device === undefined) {
        app.ui.msgbox.show('The database path has not been set.', 'FATAL');

        return
    }

    const blockSize = app.ui.getKeyValue(region.dbFile.data, 'BLOCK_SIZE');
    const availableSpace = region.dbFile.flags.device.split(' ')[3] * 1024;
    const allocation = app.ui.getKeyValue(region.dbFile.data, 'ALLOCATION');

    // fill labels
    $('#lblRegionCreateDbFileHeader').text('Create database file: ' + regionName);

    $('#lblRegionCreateDbAllocation').text(app.ui.formatThousands(allocation) + ' blocks ( ' + app.ui.formatBytes(blockSize * allocation) + ' )');
    $('#lblRegionCreateDbAvailableSpace').text(app.ui.formatThousands(availableSpace / blockSize) + ' blocks ( ' + app.ui.formatBytes(availableSpace) + ' )');

    // update grand total
    const newSpaceBlocks = (availableSpace / blockSize) - allocation;
    $('#lblRegionCreateDbNewAvailableSpace').text(app.ui.formatThousands(newSpaceBlocks) + ' blocks ( ' + app.ui.formatBytes(newSpaceBlocks * blockSize) + ' )');

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
app.ui.regionJournalSwitch.show = (regionName) => {
    const region = app.system.regions[regionName];
    let mode = region.journal.flags.state === 1 ? 'on' : 'off';
    const repairJournal = $('#btnRegionViewJournalSwitch').text() === 'Recreate...';
    let message = '';

    if (repairJournal === true) {
        message = 'This will recreate the journal file ';
        mode = 'on';

    } else {
        message = 'This will turn the journaling ' + mode.toUpperCase()
    }

    app.ui.inputbox.show(message + ' in the region: ' + regionName + '<br><br>Are you sure ?', mode === 'on' ? 'Warning' : 'WARNING', async ret => {
            if (ret === 'YES') {
                try {
                    const res = await app.REST._JournalSwitch(regionName, mode);

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
