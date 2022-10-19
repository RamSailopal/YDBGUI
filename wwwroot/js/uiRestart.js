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




app.ui.RestartManager.RestartData = {};

app.ui.RestartManager.show = () => {
    app.ui.RestartManager.refresh();

    $('#modalRestartManager').modal({show: true, backdrop: 'static'});
};

app.ui.RestartManager.refresh = async () => {
    let restartData;

    
    try {
            restartData = await app.REST._RestartStatus();
            app.ui.RestartManager.RestartData = restartData;

            if (restartData.result !== 'OK') {
                app.ui.msgbox.show('The following error occurred while fetching locks information:' + restartData.error.description, 'ERROR');

                return

            }
    } catch (err) {
            app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');

            return
    }

};

