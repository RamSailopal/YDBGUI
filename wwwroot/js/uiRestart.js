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


app.ui.restartManager.init = () => {
    $('#btnRestartManagerRefresh').on('click', () => { app.ui.restartManager.refreshPressed()});

    $('#btnRestartManagerRestart').on('click', () => { app.ui.RestartManager.restartPressed() });
};


app.ui.restartManager.restartData = {};

app.ui.restartManager.show = () => {
    app.ui.restartManager.refresh();

    $('#modalRestartManager').modal({show: true, backdrop: 'static'});
};

app.ui.restartManager.refresh = async () => {
    let restartData;

    
    try {
            restartData = await app.REST._RestartStatus();
            app.ui.restartManager.restartData = restartData;

            if (restartData.result !== 'OK') {
                app.ui.msgbox.show('The following error occurred while fetching locks information:' + restartData.error.description, 'ERROR');

                return

            }
    } catch (err) {
            app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');

            return
    }

};

app.ui.restartManager.restart = async () => {
    let restartData;

    
    try {
            restartData = await app.REST._Restart();
            app.ui.restartManager.restartData = restartData;

            if (restartData.result !== 'OK') {
                app.ui.msgbox.show('The following error occurred while fetching locks information:' + restartData.error.description, 'ERROR');

                return

            }
    } catch (err) {
            app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');

            return
    }

};

app.ui.restartManager.refreshPressed = () => {
    app.ui.restartManager.refresh()
};

app.ui.restartManager.restartPressed = () => {
    app.ui.restartManager.restart()
};