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


// ********************************
// Add region
// ********************************
app.REST._addRegion = (payload) => {
    return new Promise(function (resolve, reject) {
        app.REST.execute('post', 'regions/add', payload, data => {
            resolve(data)

        }, err => {
            reject(err)
        })
    })
};

// ********************************
// Validate path
// ********************************
app.REST._validatePath = (path) => {
    return new Promise(function (resolve, reject) {
        app.REST.execute('post', 'regions/validatePath', {path: path}, data => {
            resolve(data)

        }, err => {
            reject(err)
        })
    })
};

// ********************************
// Parse namespace
// ********************************
app.REST._parseNamespace = (namespace) => {
    return new Promise(function (resolve, reject) {
        app.REST.execute('post', 'regions/parseNamespace', {namespace: namespace}, data => {
            resolve(data)

        }, err => {
            reject(err)
        })
    })
};

// ********************************
// Get templates
// ********************************
app.REST._getTemplates = () => {
    return new Promise(function (resolve, reject) {
        app.REST.execute('get', 'dashboard/getTemplates', {}, data => {
            resolve(data)

        }, err => {
            reject(err)
        })
    })
};

// ********************************
// Get dashboard info
// ********************************
app.REST._dashboardGetAll = () => {
    return new Promise(function (resolve, reject) {
        app.REST.execute('get', 'dashboard/getAll', {}, data => {
            resolve(data)

        }, err => {
            reject(err)
        })
    })
};

// ********************************
// Get region info
// ********************************
app.REST._regionGet = (region) => {
    return new Promise(function (resolve, reject) {

        app.REST.execute('get', 'regions/' + region, {}, data => {
            resolve(data)

        }, err => {
            reject(err)
        })
    })
};

// ********************************
// delete region
// ********************************
app.REST._regionDelete = (region, withDelete) => {
    return new Promise(function (resolve, reject) {

        app.REST.execute('delete', 'regions/' + region + '?' + (withDelete === true ? 'deleteFiles=true' : ''), {}, data => {
            resolve(data)

        }, err => {
            reject(err)
        })
    })
};

// ********************************
// create region Db file
// ********************************
app.REST._regionCreateDbFile = (region) => {
    return new Promise(function (resolve, reject) {

        app.REST.execute('post', 'regions/' + region + '/createDb', {}, data => {
            resolve(data)

        }, err => {
            reject(err)
        })
    })
};

// ********************************
// extend region(blocks)
// ********************************
app.REST._regionExtend = (region, blocks) => {
    return new Promise(function (resolve, reject) {
        app.REST.execute('post', 'regions/' + region + '/extend?blocks=' + blocks, {}, data => {
            resolve(data)

        }, err => {
            reject(err)
        })
    })
};

// ********************************
// switch region(mode)
// state: 'on' || 'off'
// ********************************
app.REST._JournalSwitch = (region, mode) => {
    return new Promise(function (resolve, reject) {
        if ( mode !== 'on' && mode !== 'off' ) {
            reject({
                err: {
                    description: 'The mode parameter is invalid: ' + mode
                }
            });

            return
        }

        app.REST.execute('post', 'regions/' + region + '/journalSwitch?turn=' + mode, {}, data => {
            resolve(data)

        }, err => {
            reject(err)
        })
    })
};

// ********************************
// Global Ajax handlers
// ********************************
app.REST.execute = (type, command, DATA = {}, okCallback, errCallback) => {

    //debug info
    console.log('REST command: ' + command);

    $.ajax({
        url: window.location.origin + '/api/' + command,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(DATA),
        type: type,
        crossDomain: true,
        success: (data) => {
            //debug info
            console.log('REST success: ');
            console.log(data)
            okCallback(data);
        },
        error: (err) => {
            //debug info
            console.log('REST error: ');
            console.dir(err);
            errCallback(err);
        }
    });
};

app.REST.parseError = err => {
    let message = 'The following error occurred while fetching the data: ';

    if (err.status === 500) {
        if (typeof err.responseJSON === 'object') {
            const error = err.responseJSON.error.errors[0];

            message += '<br>';
            message += '<br>Location: ' + error.message.split(',')[1];
            message += '<br>Mcode: ' + error.mcode;
            message += '<br>Error: ' + error.message.split(',')[3];

        } else {
            if (err.error !== undefined) {
                message += err.error.description
            } else {
                message += 'Internal error ' + err.responseText
            }
        }
    } else {
        message += 'REST status: ' + err.status
    }

    return message
};
