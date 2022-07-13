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

app.ui.regionShared.clearManifest = () => {
    app.ui.regionShared.manifest.dbFile.bg.forEach(el => {
        el.value = null;
        el.oldValue = null;
        el.dirty = false;
        el.readOnly = false;
    });

    app.ui.regionShared.manifest.dbFile.mm.forEach(el => {
        el.value = null;
        el.oldValue = null;
        el.dirty = false;
        el.readOnly = false;
    });

    app.ui.regionShared.manifest.dbAccess.forEach(el => {
        el.value = null;
        el.oldValue = null;
        el.dirty = false;
        el.readOnly = false;
    });

    app.ui.regionShared.manifest.journal.forEach(el => {
        el.value = null;
        el.oldValue = null;
        el.dirty = false;
        el.readOnly = false;
    });

    app.ui.regionShared.manifest.names = [];

    app.ui.regionShared.manifest.dbFile.accessType.value = '';
    app.ui.regionShared.manifest.dbFile.accessType.oldValue = '';
    app.ui.regionShared.manifest.dbFile.accessType.dirty = false;
};

app.ui.regionShared.renderTable = ($tableTbody, editMode = false) => {
    const tableId = $tableTbody.parent().attr('id');

    // Clear the table
    $tableTbody.empty();

    // Table reference
    const tableRef = tableId.slice(-2);

    const manifestArray = app.ui.regionShared.getArray(tableRef);

    // Render
    manifestArray.forEach(el => {
        //if (el.id === 'journalEnabled') return;
        if (el.id === 'createFile' && editMode === true) return;
        if (el.id === 'switchOn' && editMode === true) return;
        if (el.displayInTable !== undefined) return;

        if (el.id === 'encryptionFlag' && app.system.systemInfo.encryptionLibrary === false) return;

        const isAdvancedMode = editMode === false ? $('#chkRegionAddAdvancedMode').is(':checked') : $('#chkRegionEditAdvancedMode').is(':checked');
        if (el.advancedMode !== undefined && el.advancedMode === true && isAdvancedMode === false) return;

        const rowColor = el.dirty ? 'var(--ydb-status-amber)' : el.advancedMode !== undefined && el.advancedMode === true && isAdvancedMode ? 'var(--ydb-lightgray)' : 'white';
        let trStart = '<tr class="region-view-detail-table-row" id="row-' + tableRef + '-' + el.id + '" style="background: ' + rowColor + ';">';
        let trEnd = '</tr>';
        let cell1 = '<td>';
        let cell12 = '<td style="min-width: 50px;">';
        let cell2 = '<td>';
        let cell3 = '<td>';
        let currentId = '';

        // FIRST CELL

        // helpLink
        if (el.helpLink !== undefined && el.helpLink !== '') {
            cell1 = '<td><a href="' + el.helpLink + ' " target="_blank" class="region-view-detail-table-row">';
            cell1 += '<span style="text-decoration: underline;">' + el.caption + ':</span></a>';
        } else {
            cell1 += el.caption + ':';
        }
        // popover
        if (el.captionMessage !== undefined) {
            if (editMode === true && el.captionMessage.onEdit === true || editMode === false && el.captionMessage.onAdd === true) {
                cell1 += '<a tabindex="-1" data-toggle="popover" data-placement="bottom" data-trigger="hover" title="' + el.caption + '" id="puRegionViewDbUsage" data-content="' + el.captionMessage.message + '">';
                cell1 += '<i class="hand ' + el.captionMessage.icon + '" style="padding-left: 14px; color:' + el.captionMessage.color + '!important;"></i></a>';
            }
        }

        cell1 += '</td>';

        // SECOND AND THIRD CELL

        switch (el.type) {
            // spin input
            case 'number': {
                cell2 = '<td onclick="app.ui.regionShared.cellClicked(\'cell-' + tableRef + '-' + el.id + '\')" class="hand" style="display: flex;">';

                const inpId = 'inp-' + tableRef + '-' + el.id;
                const popoverId = 'pop-' + tableRef + '-' + el.id;
                currentId = inpId;
                const popText = 'Min: ' + app.ui.formatThousands(el.min) + '<br>Max: ' + app.ui.formatThousands(el.max); // + '<br>Default value: ' + app.ui.formatThousands(el.oldValue);
                cell2 += '<a id="' + popoverId + '" tabindex="0" data-toggle="popover" data-placement="bottom" data-trigger="hover" title="' + el.caption + '" id="puRegionViewDbUsage" data-content="' + popText + '">';
                cell2 += '<input type="number" min="' + el.min + '" max="' + el.max + '" step="' + el.step + '" value="' + el.value + '" id="' + inpId + '" style="display: none;" class="form-control form-control-sm table-controls" onclick="app.ui.regionShared.numChange(\'' + inpId + '\')" onfocusout="app.ui.regionShared.lostFocus(\'' + inpId + '\')" onchange="app.ui.regionShared.numChange(\'' + inpId + '\')" onkeydown="return app.ui.regionShared.cellKeyUp(event, \'' + inpId + '\')">';
                cell2 += '<span id="cell-' + tableRef + '-' + el.id + '" style=" color: var(--ydb-purple);">' + el.value + '</span></a></td>';

                break
            }
            // combo box
            case 'boolean': {
                el.choices = [];
                if (el.display === 'comboOnOff') {
                    el.choices.push('Off');
                    el.choices.push('On');
                } else if (el.display === 'comboYesNo') {
                    el.choices.push('No');
                    el.choices.push('Yes');
                } else if (el.display === 'comboSubscripts') {
                    el.choices.push('Never');
                    el.choices.push('Always');
                    el.choices.push('Existing');

                }
                cell2 = '<td onclick="app.ui.regionShared.cellClicked(\'cell-' + tableRef + '-' + el.id + '\', \'sel\')" class="hand" style="display: flex;">';

                const selId = 'sel-' + tableRef + '-' + el.id;
                currentId = selId;
                cell2 += '<select id="' + selId + '" style="display: none" class="form-control form-control-sm  table-controls" onclick="app.ui.regionShared.cellClicked(\'' + selId + '\', \'sel\')" onchange="app.ui.regionShared.selChange(\'' + selId + '\')" onfocusout="app.ui.regionShared.lostFocus(\'' + selId + '\')">';
                cell2 += '<option value="0" ' + (el.value === 0 ? 'selected' : '') + '>' + el.choices[0] + '</option>';
                cell2 += '<option value="1" ' + (el.value === 1 ? 'selected' : '') + '>' + el.choices[1] + '</option>';
                if (el.display === 'comboSubscripts') {
                    cell2 += '<option value="2" ' + (el.value === 2 ? 'selected' : '') + '>' + el.choices[2] + '</option></select>';
                } else {
                    cell2 += '</select>'
                }

                cell2 += '<span id="cell-' + tableRef + '-' + el.id + '">' + el.choices[el.value] + '</span></td>';

                break
            }
            // file paths
            case 'file': {
                const fileId = 'file-' + tableRef + '-' + el.id;
                currentId = fileId;
                cell2 = '<td  style="display: flex;"><span style="padding-right: ' + (tableRef === 'Jo' ? 35 : 5) + 'px;" id="' + fileId + '">' + el.value + '</span>'
                    + '<button class="btn btn-outline-info btn-sm region-filename-button" id="btn-' + tableRef + '-' + el.id + '" type="button" onclick="app.ui.regionShared.fileClicked(\'' + fileId + '\')">...</button></td>'
                    + '</td>'
            }
        }

        const buttonId = 'reset-' + currentId.split('-')[1] + '-' + currentId.split('-')[2] + '-' + currentId.split('-')[0];
        currentId = 'reset-' + currentId.split('-')[1] + '-' + currentId.split('-')[2];
        cell12 += '<i id="' + currentId + '" style="font-size: 11px; display: none;" class="bi-x-circle  hand" onmousedown="app.ui.regionShared.resetClicked(\'' + buttonId + '\')" title="Reset to original value"></i></button></td>';

        // FOURTH CELL

        cell3 += el.unit + '</td>';

        $tableTbody.append(
            trStart + cell1 + cell12 + cell2 + cell3 + trEnd
        )
    });

    $('[data-toggle="popover"]').popover({
        html: true, container: 'body', template: '<div class="popover" role="tooltip"><div class="arrow "></div><h5 class="popover-header ydb-popover-header "></h5><div class="popover-body"></div></div>'
    });
};

// ****************************
// Events
// ****************************

// key up to filter unwanted chars from Firefox
app.ui.regionShared.cellKeyUp = event => {
    let charCode = event.which;
    const id = event.target.id;

    if (charCode === 13) {
        app.ui.regionShared.numChange(id);
        app.ui.regionShared.lostFocus(event.target.id)
    }

    // enable only numbers, backspace, tab and delete
    return (charCode > 47 && charCode < 58) || charCode === 8 || charCode === 46 || charCode === 9 || (charCode > 95 && charCode < 106)
};


// cell gets clicked
app.ui.regionShared.cellClicked = (id, type = 'inp') => {
    const idSplitted = id.split('-');
    const tableRef = idSplitted[1];

    idSplitted[0] = type;
    const inputId = idSplitted.join('-');

    // find out the related array
    const manifestArray = app.ui.regionShared.getArray(tableRef);

    let currentEl;

    // hide all inputs and show all cells
    manifestArray.forEach(el => {
        // hide inputs
        let hideId = 'inp-' + tableRef + '-' + el.id;
        $('#' + hideId).css('display', 'none');

        // hide combos
        hideId = 'sel-' + tableRef + '-' + el.id;
        $('#' + hideId).css('display', 'none');

        // show current
        const showId = 'cell-' + tableRef + '-' + el.id;
        $('#' + showId).css('display', 'block');

        // get element used for delete button status
        if (el.id === idSplitted[2]) {
            currentEl = el
        }
    });

    // hide the selected cell
    $('#' + id).css('display', 'none');

    // display the input and set the focus
    $('#' + inputId)
        .css('display', 'block').focus()
        .on('wheel', function () {
            return false
        });
};

// Numeric value changed
app.ui.regionShared.numChange = async id => {
    const array = app.ui.regionShared.getArray(app.ui.regionShared.getTableRef(id));
    const cellEl = array.find(el => el.id === id.split('-')[2]);
    const $id = $('#' + id);
    const newValue = parseInt($id.val());

    if (newValue < cellEl.min || newValue > cellEl.max) {
        await app.ui.msgbox.show('The field "' + cellEl.caption + '" must be between ' + cellEl.min + ' and ' + cellEl.max, 'WARNING', true);

        $id.text(cellEl.value);
        const splittedId = id.split('-');
        $('#inp-' + splittedId[1] + '-' + splittedId[2]).val(cellEl.value);

        return
    }

    // set the new value in array
    cellEl.value = newValue;
    cellEl.dirty = cellEl.value !== cellEl.oldValue;

    app.ui.regionShared.setResetButtonStatus(cellEl, id);
    app.ui.regionAdd.enableTemplatesRegion();
    app.ui.regionAdd.enableTemplatesJournal();
    app.ui.regionShared.lostFocus(id);

    app.ui.regionEdit.validateOk();
};

// select value changed
app.ui.regionShared.selChange = id => {
    const array = app.ui.regionShared.getArray(app.ui.regionShared.getTableRef(id));
    const cellEl = array.find(el => el.id === id.split('-')[2]);

    // set the new value in array
    cellEl.value = parseInt($('#' + id + ' option:selected').val());
    if (cellEl.id !== 'switchOn' && cellEl.id !== 'createFile') cellEl.dirty = cellEl.value !== cellEl.oldValue;

    app.ui.regionShared.setResetButtonStatus(cellEl, id);
    app.ui.regionAdd.enableTemplatesRegion();
    app.ui.regionAdd.enableTemplatesJournal();

    app.ui.regionShared.lostFocus(id);

    app.ui.regionEdit.validateOk();
};

app.ui.regionShared.setResetButtonStatus = (cellEl, id) => {
    const resetButton = $('#reset-' + id.split('-')[1] + '-' + id.split('-')[2]);

    resetButton.css('display', cellEl.dirty === true ? 'block' : 'none');
};

app.ui.regionShared.resetClicked = id => {
    const idSplitted = id.split('-');
    const tableRef = idSplitted[1];

    // find out the related array
    const manifestArray = app.ui.regionShared.getArray(tableRef);

    // get the element
    const el = manifestArray.find(el => {
        return el.id === idSplitted[2]
    });

    // and reset it
    el.value = el.oldValue;
    el.dirty = false;

    app.ui.regionShared.setResetButtonStatus(el, id);
    app.ui.regionAdd.enableTemplatesRegion();
    app.ui.regionAdd.enableTemplatesJournal();
    id = idSplitted[3] + '-' + idSplitted[1] + '-' + idSplitted[2];
    app.ui.regionShared.lostFocus(id);
    app.ui.regionEdit.validateOk();
};

app.ui.regionShared.lostFocus = id => {
    const array = app.ui.regionShared.getArray(app.ui.regionShared.getTableRef(id));
    const cellEl = array.find(el => el.id === id.split('-')[2]);

    // update and display the cell
    const splittedId = id.split('-');

    // cell
    const cellId = 'cell-' + splittedId[1] + '-' + splittedId[2];
    $('#' + cellId)
        .text(splittedId[0] === 'sel' ? cellEl.choices[cellEl.value] : cellEl.value)
        .css('display', 'block');

    // row
    const rowId = 'row-' + splittedId[1] + '-' + splittedId[2];
    $('#' + rowId)
        .css('background', cellEl.dirty ? 'var(--ydb-status-amber)' : cellEl.advancedMode === true ? 'var(--ydb-lightgray)' : 'white');

    // input
    const inpId = 'inp-' + splittedId[1] + '-' + splittedId[2];
    $('#' + inpId)
        .css('display', 'none')
        .val(cellEl.value);

    // file
    const fileId = 'file-' + splittedId[1] + '-' + splittedId[2];
    $('#' + fileId).text(cellEl.value);

    // popup
    const popupId = 'pop-' + splittedId[1] + '-' + splittedId[2];
    $('#' + popupId).popover('hide');

    // sel
    const selId = 'sel-' + splittedId[1] + '-' + splittedId[2];
    $('#' + selId)
        .css('display', 'none')
        .val(cellEl.value)
};

app.ui.regionShared.fileClicked = async id => {
    const splittedId = id.split('-');
    let array;

    switch (splittedId[1]) {
        case 'Bg': {
            array = app.ui.regionShared.manifest.dbFile.bg;
            break
        }
        case 'Mm': {
            array = app.ui.regionShared.manifest.dbFile.mm;
            break
        }
        case 'Jo': {
            array = app.ui.regionShared.manifest.journal;
        }
    }

    if (app.ui.regionEdit.inProgress !== null) {
        if (splittedId[1] === 'Bg' || splittedId[1] === 'Mm') {
            const region = app.ui.regionEdit.inProgress;
            if (region.dbFile.flags.fileExist === true) {
                await app.ui.msgbox.show('You are allowed to change the database file name or path ONLY when the file doesn\'t exist.<br><br>' +
                    'If you wish to change the database file / path on a running instance, please contact YottaDB support', 'WARNING', true);

                return
            }
        }
    }

    const el = array.find(el => el.id === splittedId[2]);
    el.cellId = id;

    app.ui.regionFilename.show(el);
};

// ****************************
// Filename
// ****************************
app.ui.regionFilename.init = () => {
    $('#btnRegionFilenameValidate').on('click', () => app.ui.regionFilename.validate());
    $('#btnRegionFilenameOk').on('click', () => app.ui.regionFilename.okPressed());
    $('#txtRegionFilenameFile').on('keyup', () => app.ui.regionFilename.validateOkButton());

    $('#chkRegionAddAFilenameOverride').on('click', () => app.ui.regionFilename.overrideValidation());

    $('#modalRegionFilename').on('hide.bs.modal', () => {
        $('.modal-backdrop').css('z-index', 1040)
    });
};

app.ui.regionFilename.show = (el) => {
    app.ui.regionFilename.el = el;

    $('#txtRegionFilenameFile').val(el.value);

    $('#modalRegionFilename').modal({show: true, backdrop: 'static', keyboard: true});

    // used to ensure that the dialog stands out
    $('.modal-backdrop').css('z-index', 1060);
};

app.ui.regionFilename.validate = async () => {
    const btnRegionFilenameOk = $('#btnRegionFilenameOk');
    const txtRegionFilenameFile = $('#txtRegionFilenameFile');
    let result = false;
    let res;

    if (txtRegionFilenameFile.val().charAt(0) !== '$' && txtRegionFilenameFile.val().charAt(0) !== '/') {
        app.ui.msgbox.show('You can not use relative paths...', 'WARNING');
        return
    }

    try {
        res = await app.REST._validatePath(txtRegionFilenameFile.val());

        if (res.error !== undefined || res.data.fileExist !== '') {
            app.ui.msgbox.show('The file already exists...', 'ERROR');
            result = false;

        } else if (res.data.validation !== '') {
            app.ui.msgbox.show('The path was successful validated: ' + res.data.validation, 'SUCCESS');
            result = true;

        } else {
            app.ui.msgbox.show('Could NOT validate the path.', 'ERROR');
            result = false;
        }

    } catch (err) {
        if (res.result === 'ERROR') {
            app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');
            result = false;
        }

        return
    }

    if ((res.data !== undefined && res.data.fileExist !== '') || result === false) {
        btnRegionFilenameOk
            .prop('disabled', true)
            .addClass('disabled');

    } else {
        btnRegionFilenameOk
            .prop('disabled', false)
            .removeClass('disabled');
    }
};

app.ui.regionFilename.okPressed = () => {
    const txtRegionFilenameFile = $('#txtRegionFilenameFile').val();
    if (txtRegionFilenameFile !== app.ui.regionFilename.el.oldValue) {
        const idSplitted = app.ui.regionFilename.el.cellId.split('-');
        const id = 'file-' + idSplitted[1] + '-' + idSplitted[2];

        // find out the related array
        const manifestArray = app.ui.regionShared.getArray(idSplitted[1]);

        // get the element
        let el = manifestArray.find(el => {
            return el.id === idSplitted[2]
        });
        el.dirty = true;
        el.value = txtRegionFilenameFile;

        app.ui.regionShared.setResetButtonStatus(el, app.ui.regionFilename.el.cellId);
        app.ui.regionShared.lostFocus(id);
        app.ui.regionEdit.validateOk();
    }

    $('#' + app.ui.regionFilename.el.cellId).text(txtRegionFilenameFile);

    $('#modalRegionFilename').modal('hide');

    if (app.ui.regionEdit.inProgress !== null) {
        app.ui.regionEdit.validateOk()
    }
};

app.ui.regionFilename.validateOkButton = () => {
    const btnRegionFilenameOk = $('#btnRegionFilenameOk');

    if ($('#chkRegionAddAFilenameOverride').is(':checked') === false) {
        btnRegionFilenameOk
            .prop('disabled', true)
            .addClass('disabled');

    } else {
        btnRegionFilenameOk
            .prop('disabled', false)
            .removeClass('disabled');
    }
};

app.ui.regionFilename.overrideValidation = () => {
    const btnRegionFilenameOk = $('#btnRegionFilenameOk');

    if ($('#chkRegionAddAFilenameOverride').is(':checked') === true) {
        btnRegionFilenameOk
            .prop('disabled', false)
            .removeClass('disabled');

    } else {
        btnRegionFilenameOk
            .prop('disabled', true)
            .addClass('disabled');
    }
};

// ****************************
// Utils
// ****************************
app.ui.regionShared.getArray = tableRef => {
    switch (tableRef) {
        case 'Bg': {
            return app.ui.regionShared.manifest.dbFile.bg;
        }
        case 'Mm': {
            return app.ui.regionShared.manifest.dbFile.mm;
        }
        case 'Ac': {
            return app.ui.regionShared.manifest.dbAccess;
        }
        case 'Jo': {
            return app.ui.regionShared.manifest.journal;
        }
    }
};

app.ui.regionShared.getTableRef = id => {
    return id.split('-')[1]
};

app.ui.regionShared.redrawNames = ($namesTable) => {
    const names = app.ui.regionShared.manifest.names;
    const isEditMode = $namesTable.parent().attr('id').indexOf('Edit') > -1;

    names.sort((a, b) => {
        if (a.value < b.value) return -1;
        if (a.value > b.value) return 1;
        return 0
    });

    $namesTable.empty();

    let rowCounter = 0;
    names.forEach(name => {
        rowCounter++;
        const newName = name.value.replace(/"/gi, '_');
        let classes = '';
        if (isEditMode === true) {
            if (name.new !== undefined && name.new === true) {
                classes = 'ydb-fore-green'
            }

            if (name.existing === false) {
                classes = 'ydb-fore-green'

            } else if (name.deleted === true) {
                classes = 'ydb-fore-red font-strike'
            }
        }
        classes += ' hand';
        $namesTable.append('<tr class="' + classes + '" id="row' + rowCounter + '" onclick="app.ui.regionShared.selectNameRow(' + $namesTable.parent('table').attr('id') + ', \'' + newName + '\')"><td>' + name.value + '</td></tr>');
    })
};

app.ui.regionShared.selectNameRow = (table, name) => {
    const tableId = table.getAttribute('id');
    let $selectedRow;

    $('#' + tableId + ' > tbody > tr').each((index, tr) => {
        const rowId = tr.getAttribute('id');

        if (tr.childNodes[0].innerHTML === (name.replace(/_/gi, '"'))) {
            $selectedRow = $('#' + rowId)
            $selectedRow
                .css('background-color', 'var(--ydb-lightgray)')
                .attr('row-selected', true)

        } else {
            $('#' + rowId)
                .css('background-color', 'white')
                .attr('row-selected', false)
        }
    });

    const $deleteButton = tableId.indexOf('Add') > -1 ? $('#btnRegionAddNamesDelete') : $('#btnRegionEditNamesDelete');
    $deleteButton
        .removeClass('disabled')
        .attr('disabled', false)
        .text($selectedRow.hasClass('font-strike') === true ? 'Undelete...' : 'Delete...');
};

app.ui.regionShared.computeJournalBasePath = () => {
    let defaultRegion = false;
    let secondaryRegion = false;
    let journalBasePath;

    Object.keys(app.system.regions).forEach((regionName) => {
        const region = app.system.regions[regionName];

        if (region.journal !== undefined) {
            if (secondaryRegion === false && region.journal.flags.file !== undefined && region.journal.flags.file !== '') secondaryRegion = region;
            if (regionName === 'DEFAULT' && region.journal.flags.file !== undefined && region.journal.flags.file !== '') defaultRegion = region;
        }
    });
    if (defaultRegion !== false) secondaryRegion = defaultRegion;

    journalBasePath = secondaryRegion.journal.flags.file.split('/');
    journalBasePath = journalBasePath.slice(0, journalBasePath.length - 1).join('/') + '/';

    return journalBasePath
};
