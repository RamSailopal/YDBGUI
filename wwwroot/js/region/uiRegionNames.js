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
// region name add
// ***************************************
app.ui.regionNames.add.init = () => {
    const txtNameAddName = $('#txtNameAddName');
    txtNameAddName.on('change', () => app.ui.regionNames.txtChanged());
    txtNameAddName.on('keydown', e => app.ui.regionNames.txtKeyDown(e));

    $('#btnNameAddOk').on('click', () => app.ui.regionNames.okPressed());
    $('#btnNameAddManyOk').on('click', () => app.ui.regionNames.okManyPressed());

    $('#modalRegionNameAdd').on('hide.bs.modal', () => {
        $('.modal-backdrop').css('z-index', 1040)
    });
};

app.ui.regionNames.add.editMode = false;
app.ui.regionNames.add.show = (editMode = false) => {
    app.ui.regionNames.add.editMode = editMode;

    const txtNameAddName = $('#txtNameAddName');
    txtNameAddName.val('');

    app.ui.regionNames.validateOkButton();

    $('#modalRegionNameAdd')
        .modal({show: true, backdrop: 'static', keyboard: true})
        .on('shown.bs.modal', () => {
            txtNameAddName.focus();
        });

    // used to ensure that the dialog stands out
    $('.modal-backdrop').css('z-index', 1060);
};

app.ui.regionNames.txtChanged = () => {

    app.ui.regionNames.validateOkButton(true)
};

app.ui.regionNames.txtKeyDown = e => {
    if (e.which === 13) return false;

    app.ui.regionNames.validateOkButton();
};

app.ui.regionNames.validateOkButton = (forceDisable = false) => {
    const txtNameAddName = $('#txtNameAddName');
    const btnNameAddOk = $('#btnNameAddOk');
    const btnNameAddManyOk = $('#btnNameAddManyOk');

    if (txtNameAddName.val().length > 0 || forceDisable) {
        btnNameAddOk
            .removeClass('disabled')
            .attr('disabled', false);

        btnNameAddManyOk
            .removeClass('disabled')
            .attr('disabled', false)
    } else {
        btnNameAddOk
            .addClass('disabled')
            .attr('disabled', true);

        btnNameAddManyOk
            .addClass('disabled')
            .attr('disabled', true)
    }
};

app.ui.regionNames.okManyPressed = async () => {
    const txtNameAddName = $('#txtNameAddName');

    // Validate content
    const isValid = await app.ui.regionNames.validateName(txtNameAddName.val());
    if (isValid === false) return;

    app.ui.regionShared.manifest.names.push({
        value: txtNameAddName.val(),
        new: true
    });
    const $namesTable = app.ui.regionNames.add.editMode === true ? $('#tblRegionEditNames > tbody') : $('#tblRegionAddNames > tbody');
    app.ui.regionShared.redrawNames($namesTable);

    txtNameAddName
        .val('')
        .focus();

    if (app.ui.regionNames.add.editMode === true) app.ui.regionEdit.validateOk();


    app.ui.regionNames.validateOkButton()
};

app.ui.regionNames.okPressed = async () => {
    const txtNameAddName = $('#txtNameAddName');

    // Validate content
    const isValid = await app.ui.regionNames.validateName(txtNameAddName.val());
    if (isValid === false) return;

    // update array
    app.ui.regionShared.manifest.names.push({
        value: txtNameAddName.val(),
        new: true
    });

    // and update screen
    $('#modalRegionNameAdd').modal('hide');

    if (app.ui.regionNames.add.editMode === true) app.ui.regionEdit.validateOk();

    const $namesTable = app.ui.regionNames.add.editMode === true ? $('#tblRegionEditNames > tbody') : $('#tblRegionAddNames > tbody');
    app.ui.regionShared.redrawNames($namesTable);

    app.ui.regionNames.validateOkButton()
};

app.ui.regionNames.validateName = async namespace => {
    let remoteParsing = false;
    let localFound = false;

    try {
        const res = await app.REST._parseNamespace(namespace);
        if (res.data.parseResult === 'OK') {
            remoteParsing = true;

        } else {
            await app.ui.msgbox.show('Error parsing the namespace:<br>' + res.data.parseResult.split(',')[1], 'ERROR', true);
            remoteParsing = false;
        }

    } catch (err) {
        await app.ui.msgbox.show(app.REST.parseError(err), 'ERROR', true);
        remoteParsing = false
    }

    if (remoteParsing) {
        // check for duplicates locally
        app.ui.regionShared.manifest.names.find(async name => {
            if (name.value === namespace) {
                await app.ui.msgbox.show('This namespace is already mapped to the new region.', 'ERROR', true);
                localFound = true
            }
        });
    } else {
        $('#txtNameAddName').focus()
    }

    return remoteParsing && !localFound
};

// ***************************************
// region name delete
// ***************************************
app.ui.regionNames.delete.show = (namesTableId) => {
    const isEditMode = namesTableId.indexOf('Edit') > -1;

    $('#' + namesTableId + ' > tbody > tr').each((ix, tr) => {
        if (tr.getAttribute('row-selected') === 'true') {
            const nameEl = tr.childNodes[0].innerHTML;
            const name = app.ui.regionShared.manifest.names.find(name => name.value === nameEl);

            if (name.deleted === true) {
                name.deleted = false;
            } else if (isEditMode === true && name.existing === true && name.deleted === false) {
                name.deleted = true;

            } else {
                app.ui.regionShared.manifest.names = app.ui.regionShared.manifest.names.filter(function (item) {
                    return item.value !== nameEl
                });
            }
        }

        // redraw table
        app.ui.regionShared.redrawNames($('#' + namesTableId + ' > tbody'));

        // and disable the delete button if no more items
        if (app.ui.regionShared.manifest.names.length === 0) {
            $('#btnRegionAddNamesDelete')
                .addClass('disabled')
                .attr('disabled', true)
        }
    });

    if (isEditMode === true) {
        // force the button to "delete..."
        $('#btnRegionEditNamesDelete').text('Delete...');

        app.ui.regionEdit.validateOk();
    }
};
