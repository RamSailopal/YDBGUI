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

    //region add
    app.ui.regionAdd.init();
    app.ui.regionAdd.name.init();
    app.ui.regionFilename.init();

    //region edit
    app.ui.regionEdit.init();
    app.ui.regionEdit.Overview.init();

    // region names
    app.ui.regionNames.add.init();

    // region delete
    app.ui.regionDelete.init()
    // region select
    app.ui.regionSelect.init();

    // region extend
    app.ui.regionExtend.init();

    // regionCreateDbFile
    app.ui.regionCreateDbFile.init();

    // locksManager
    app.ui.locksManager.init();

    // restartManager

    app.ui.restartManager.init();

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
    if (withPromise) {
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
    options = options || {};

    if (options.buttons === undefined) {
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
    let value = parseFloat((a / Math.pow(1024, d)).toFixed(c)).toString().split('.');
    if (value[1] === undefined) value.push('00');
    else if (value[1].length === 1) value[1] += '0';

    return value.join('.') + " " + ["bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"][d]
};

app.ui.formatThousands = x => {
    //inserts a comma as thousands separator each 3 chars
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

app.ui.getKeyValue = (array, key) => {
    if (Array.isArray(array)) {
        const flag = array.find(el => {
            return !(el[key] === undefined)
        });

        if (flag !== undefined) {
            return flag[key]
        } else return ''
    } else return ''
};

app.ui.countChar = (string, char) => {
    const regex = new RegExp('[^' + char + ']', 'g');

    return string.replace(regex, '').length;
};

app.ui.nthIndex = (string, pattern, n) => {
    let L = string.length, i = -1;

    while (n-- && i++ < L) {
        i = string.indexOf(pattern, i);
        if (i < 0) break;
    }
    return i;
};

// This code is currently not used, but it will be needed for the Global Viewer
app.ui.validateNamespace = () => {

    // **************************
    // Local routines
    // **************************
    // This returns the token type: 0 error 1: numeric 2: string
    const parseToken = tokens => {


    };

    const parseSubscript = subscript => {
        // is it a range ?
        const colonCount = app.ui.countChar(subscript, ':');
        if (colonCount === 1) {
            // get the tokens
            const tokens = subscript.split(':');
            // and parse them
            tokens.forEach(token => {
                const tokenType = parseToken(token);
                console.log('token type: ' + tokenType)

            });


        } else if (colonCount === 0) {
            // No range, parse as single token
            const result = parseToken(subscript);
            console.log('token parse: ' + result)

        }

    };

    const computeErrorPosition = (ix, result) => {
        return -2
    };

    // **************************
    // Parser
    // **************************
    let name = $('#txtNameAddName').val();
    let withPercent = false;

    // First determine if the name has a % and if more than 1
    const percentCount = app.ui.countChar(name, '%');
    if (percentCount === 1) {
        // is the first character ?
        if (name.indexOf('%') !== 0) {
            // Wrong position, abort
            return name.indexOf('%')

        } else {
            withPercent = true
        }
    } else if (percentCount > 1) {
        // Error, return the position of second %
        return app.ui.nthIndex(name, '%', 2)
    }

    // Now we check the validity of the global name
    let global = name.split('(')[0];

    // remove % if present
    if (withPercent) global = global.substring(1);

    // ensure first char is alpha
    if (global.substring(0, 1).replace(/[a-z]/gi, '').length > 0) {
        // error, return first char pos
        return withPercent ? 1 : 0
    }

    // ensure the rest of string is alphanumeric or has *
    if (global.replace(/[a-z0-9*]/gi, '').length > 0) {
        // error, return 1
        return 1
    }

    // and that there is only ONE *
    const starCount = app.ui.countChar(name, '*');
    if (starCount > 1) {
        return app.ui.nthIndex(name, '*', 2)

    } else if (starCount === 1) {
        // and it is the last char of the global name
        if (global.indexOf('*') !== (global.length - 1)) {
            return global.indexOf('*')
        }
    }

    // and length <= 31 chars
    if (global.length > (withPercent ? 30 : 31)) {
        return 31
    }

    // name is good, now the subscripts, if present
    const openParenCount = app.ui.countChar(name, '(');

    if (openParenCount > 1) {
        //more than one open paren, error
        return app.ui.nthIndex(name, '(', 2);

    } else if (openParenCount === 1) {
        // make sure the global name doesn't have a star
        if (starCount > 0) {
            return global.indexOf('*')
        }

        // now look for closing paren
        const closeParenCount = app.ui.countChar(name, ')');

        if (closeParenCount === 0) {
            return name.indexOf('(')
        }

        if (closeParenCount > 1) {
            //more than one open paren, error
            return app.ui.nthIndex(name, ')', 2);

        } else if (closeParenCount === 1) {
            // Make sure it is the last char
            if (name.indexOf(')') !== (name.length - 1)) {
                return name.indexOf(')')
            }

            // time to extract the subscripts
            const subscripts = name.substring(name.indexOf('(') + 1, name.indexOf(')')).split(',');

            // and validate them
            subscripts.forEach((subscript, ix) => {
                const result = parseSubscript(subscript);
                if (result !== 0) {
                    return computeErrorPosition(ix, result)
                }
            })
        }
    }

    return -1

};
