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


// ************************************
// add handlers
// ************************************

app.ui.addHandlers = () => {
    // msgbox
    app.ui.msgbox.init();

    // input box
    app.ui.inputbox.init();

    // help
    app.ui.help.init();

    // dashboard
    app.ui.dashboard.init();

    // systemInfo
    app.ui.systemInfo.init();

    //deviceInfo
    app.ui.deviceInfo.init();

    // region view
    app.ui.regionView.init();

    // region select
    app.ui.regionSelect.init();

    // region extend
    app.ui.regionExtend.init();

    // regionCreateDbFile
    app.ui.regionCreateDbFile.init();

    // menu handlers
    app.ui.menu.init();
};

// ************************************
// msgbox
// ************************************
app.ui.msgbox.init = () => {
    $('#btnMsgboxOk').on('click', (e) => app.ui.msgbox.hide());
    $('#modalMsgbox').on('shown.bs.modal', () => {
        $('#btnMsgBoxOk').focus()
    });
};

app.ui.msgbox.show = (msg, title = '', withPromise = false) => {
    $('#txtMsgboxText').html(msg);
    $('#txtMsgboxTitle').text(title !== '' && title !== undefined ? title : 'WARNING');

    const msgboxHeader = $('#msgboxHeader');
    switch (title) {
        case 'ERROR':
        case 'FATAL': {
            msgboxHeader.css('background', 'var(--ydb-status-red)');
            msgboxHeader.css('color', 'white');
            break

        }
        case 'WARNING': {
            msgboxHeader.css('background', 'var(--ydb-status-amber)');
            msgboxHeader.css('color', 'var(--jhTertiary3)');
            break

        }
        default: {
            msgboxHeader.css('background', 'var(--ydb-status-green)');
            msgboxHeader.css('color', 'white');
        }
    }

    $('#modalMsgbox').modal({show: true, backdrop: 'static', keyboard: true});
    if ( withPromise ) {
        return new Promise(function (resolve) {
            $('#modalMsgbox').on('hide.bs.modal', () => {
                resolve()
            })
        })
    }
};

app.ui.msgbox.hide = () => {
    $('#modalMsgbox').modal({show: false});
};

// ************************************
// Inputbox
// ************************************

app.ui.inputbox.init = () => {
    $('#btnInputboxYes').on('click', (e) => app.ui.inputbox.yesSelected());
    $('#btnInputboxNo').on('click', (e) => app.ui.inputbox.noSelected());

    $('#modalInputbox').on('shown.bs.modal', () => {
        $('#btnInputboxNo').focus()
    });
};

app.ui.inputbox.show = (msg, title, callback, options) => {
    options = options|| {};

    if ( options.buttons === undefined ){
        options.buttons = {
            left: 'Yes',
            right: 'No'
        }
    }

    const inputboxHeader = $('#inputboxHeader');
    switch (title) {
        case 'ERROR':
        case 'WARNING':
        case 'FATAL': {
            inputboxHeader.css('background', 'var(--ydb-status-red)');
            inputboxHeader.css('color', 'white');
            break

        }
        case 'Warning': {
            inputboxHeader.css('background', 'var(--ydb-status-amber)');
            inputboxHeader.css('color', 'var(--ydb-purple)');
            break

        }
        default: {
            inputboxHeader.css('background', 'var(--ydb-status-green)');
            inputboxHeader.css('color', 'white');
        }
    }

    $('#btnInputboxYes').html(options.buttons.left);
    $('#btnInputboxNo').html(options.buttons.right);
    $('#txtInputboxText').html(msg);
    $('#txtInputboxTitle').text(title !== '' && title !== undefined ? title : 'WARNING');

    app.ui.inputbox.callback = callback;

    $('#modalInputbox').modal({show: true, backdrop: 'static'});
};

app.ui.inputbox.hide = () => {
    $('#modalInputbox').modal({show: false});
};

app.ui.inputbox.yesSelected = () => {
    app.ui.inputbox.callback("YES")
};

app.ui.inputbox.noSelected = () => {
    app.ui.inputbox.callback("NO")
};

// ************************************
// Wait
// ************************************
app.ui.wait.show = message => {
    return new Promise(function (resolve, reject) {
        const modalWait = $('#modalWait');
        $('#txtWaitText').text(message);

        modalWait.modal({show: true, backdrop: 'static', keyboard: false});
        resolve();

        modalWait.on('shown.bs.modal', function (e) {
            resolve()
        });
    })
};

app.ui.wait.hide = () => {
    $('#modalWait').modal('hide');
};

// *************************************************
// Libraries
// *************************************************

app.ui.formatBytes = (a, b = 2) => {
    if (0 === a) return "0 Bytes";
    const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024));
    return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["bytes", "Kib", "Mib", "Gib", "Tib", "Pib", "Eib", "Zib", "Yib"][d]
};

app.ui.formatThousands = x => {
    //inserts a comma as thousands separator each 3 chars
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

app.ui.getKeyValue = (array, key) =>{
    if ( Array.isArray(array) ) {
        const flag = array.find(el => {
            return !(el[key] === undefined)
        });

        if ( flag !== undefined ) {
            return flag[key]
        } else return ''
    } else return ''
};
