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

        app.REST.execute('get', 'regions/'+ region + '/get', {}, data => {
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
        data: DATA,
        type: type,
        crossDomain: true,
        success: (data) => {
            //debug info
            console.log('REST success: ');
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

