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
        el.dirty = false
    });

    app.ui.regionShared.manifest.dbFile.mm.forEach(el => {
        el.value = null;
        el.oldValue = null;
        el.dirty = false
    });

    app.ui.regionShared.manifest.dbAccess.forEach(el => {
        el.value = null;
        el.oldValue = null;
        el.dirty = false
    });

    app.ui.regionShared.manifest.journal.forEach(el => {
        el.value = null;
        el.oldValue = null;
        el.dirty = false
    });
};

app.ui.regionShared.renderTable = $tableTbody => {
    const tableId = $tableTbody.parent().attr('id');

    // Clear the table
    $tableTbody.empty();

    // Table reference
    const tableRef = tableId.slice(-2);

    const manifestArray = app.ui.regionShared.getArray(tableRef);

    // Render
    manifestArray.forEach(el => {
        if (el.id === 'journalEnabled') return;

        if (el.id === 'encryptionFlag' && app.system.systemInfo.encryptionLibrary === false) return;

        const isAdvancedMode = $('#chkRegionAddAdvancedMode').is(':checked');
        if (el.advancedMode !== undefined && el.advancedMode === true && isAdvancedMode === false) return;

        const rowColor = el.dirty ? 'var(--ydb-status-amber)' : el.advancedMode !== undefined && el.advancedMode === true && isAdvancedMode ? 'var(--ydb-lightgray)' : 'white';
        let trStart = '<tr class="region-view-detail-table-row" id="row-' + tableRef + '-' + el.id + '" style="background: ' + rowColor + ';">';
        let trEnd = '</tr>';
        let cell1 = '<td>';
        let cell2 = '<td>';
        let cell3 = '<td>';

        // helpLink
        if (el.helpLink !== undefined && el.helpLink !== '') {
            cell1 = '<td><a href="' + el.helpLink + ' " target="_blank" class="region-view-detail-table-row">';
            cell1 += '<span style="text-decoration: underline;">' + el.caption + ':</span></a></td>';

        } else {
            cell1 += el.caption + ':</td>';
        }

        switch (el.type) {
            case 'number': {
                cell2 = '<td onclick="app.ui.regionShared.cellClicked(\'cell-' + tableRef + '-' + el.id + '\')" class="hand">';

                const inpId = 'inp-' + tableRef + '-' + el.id;
                const popText = 'Min: ' + app.ui.formatThousands(el.min) + '<br>Max: ' + app.ui.formatThousands(el.max); // + '<br>Default value: ' + app.ui.formatThousands(el.oldValue);
                cell2 += '<a tabindex="-1" data-toggle="popover" data-placement="bottom" data-trigger="hover" title="' + el.caption + '" id="puRegionViewDbUsage" data-content="' + popText + '">';
                cell2 += '<input type="number" min="' + el.min + '" max="' + el.max + '" step="' + el.step + '" value="' + el.value + '" id="' + inpId + '" style="display: none;" class="form-control form-control-sm table-controls" onclick="app.ui.regionShared.numChange(\'' + inpId + '\')" onfocusout="app.ui.regionShared.lostFocus(\'' + inpId + '\')" onchange="app.ui.regionShared.numChange(\'' + inpId + '\')" onkeydown="return app.ui.regionShared.cellKeyUp(event, \'' + inpId + '\')">';
                cell2 += '<span id="cell-' + tableRef + '-' + el.id + '" style=" color: var(--ydb-purple);">' + el.value + '</span></a></td>';

                break
            }
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
                cell2 = '<td onclick="app.ui.regionShared.cellClicked(\'cell-' + tableRef + '-' + el.id + '\', \'sel\')" class="hand">';

                const selId = 'sel-' + tableRef + '-' + el.id;
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
            case 'file': {
                const fileId = 'file-' + tableRef + '-' + el.id;
                cell2 = '<td><span style="padding-right: ' + (tableRef === 'Jo' ? 35 : 5) + 'px;" id="' + fileId + '">' + el.value + '</span>'
                    + '<button class="btn btn-outline-info btn-sm region-filename-button" id="btn-' + tableRef + '-' + el.id + '" type="button" onclick="app.ui.regionShared.fileClicked(\'' + fileId + '\')">...</button>'
                    + '</td>'
            }
        }

        cell3 += el.unit + '</td>';

        $tableTbody.append(
            trStart + cell1 + cell2 + cell3 + trEnd
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
    const charCode = event.which;

    // enable only numbers, backspace and delete
    return (charCode > 47 && charCode < 58) || charCode === 8 || charCode === 46
};


// cell gets clicked
app.ui.regionShared.cellClicked = (id, type = 'inp') => {
    const idSplitted = id.split('-');
    const tableRef = idSplitted[1];

    idSplitted[0] = type;
    const inputId = idSplitted.join('-');

    // find out the related array
    const manifestArray = app.ui.regionShared.getArray(tableRef);

    // hide all inputs and show all cells
    manifestArray.forEach(el => {
        let hideId = 'inp-' + tableRef + '-' + el.id;
        $('#' + hideId).css('display', 'none');

        hideId = 'sel-' + tableRef + '-' + el.id;
        $('#' + hideId).css('display', 'none');

        const showId = 'cell-' + tableRef + '-' + el.id;
        $('#' + showId).css('display', 'block')
    });

    // hide the selected cell
    $('#' + id).css('display', 'none');

    // display the input and set the focus
    $('#' + inputId).css('display', 'block').focus();
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


    app.ui.regionAdd.enableTemplatesRegion();
    app.ui.regionAdd.enableTemplatesJournal();
    app.ui.regionShared.lostFocus(id);
};

// select value changed
app.ui.regionShared.selChange = id => {
    const array = app.ui.regionShared.getArray(app.ui.regionShared.getTableRef(id));
    const cellEl = array.find(el => el.id === id.split('-')[2]);

    // set the new value in array
    cellEl.value = parseInt($('#' + id + ' option:selected').val());
    if (cellEl.id !== 'switchOn' && cellEl.id !== 'createFile') cellEl.dirty = cellEl.value !== cellEl.oldValue;

    app.ui.regionAdd.enableTemplatesRegion();
    app.ui.regionAdd.enableTemplatesJournal();

    app.ui.regionShared.lostFocus(id);
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
    $('#' + inpId).css('display', 'none');

    // sel
    const selId = 'sel-' + splittedId[1] + '-' + splittedId[2];
    $('#' + selId).css('display', 'none');
};

app.ui.regionShared.fileClicked = id => {
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

        if (res.data.fileExist !== '') {
            app.ui.msgbox.show('The file already exists', 'ERROR');
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

    if (res.data.fileExist !== '' || result === false) {
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
    app.ui.regionFilename.el.value = $('#txtRegionFilenameFile').val();

    $('#' + app.ui.regionFilename.el.cellId).text(app.ui.regionFilename.el.value);

    $('#modalRegionFilename').modal('hide');
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
        $namesTable.append('<tr class="hand" id="row' + rowCounter + '" onclick="app.ui.regionShared.selectNameRow(' + $namesTable.parent('table').attr('id') + ', \'' + newName + '\')"><td>' + name.value + '</td></tr>');
    })
};

app.ui.regionShared.selectNameRow = (table, name) => {
    const tableId = table.getAttribute('id');

    $('#' + tableId + ' > tbody > tr').each((index, tr) => {
        const rowId = tr.getAttribute('id');

        if (tr.childNodes[0].innerHTML === (name.replace(/_/gi, '"'))) {
            $('#' + rowId)
                .css('background-color', 'var(--ydb-lightgray)')
                .attr('row-selected', true)

        } else {
            $('#' + rowId)
                .css('background-color', 'white')
                .attr('row-selected', false)
        }
    });

    $('#btnRegionAddNamesDelete')
        .removeClass('disabled')
        .attr('disabled', false)
};

