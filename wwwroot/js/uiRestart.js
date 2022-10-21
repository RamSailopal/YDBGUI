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

    $('#btnRestartManagerRestart').on('click', () => { app.ui.restartManager.restartPressed() });
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
                app.ui.msgbox.show('The following error occurred while fetching restart Status information:' + restartData.error.description, 'ERROR');

                return

            }
    } catch (err) {
            app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');

            return
    }

    app.ui.restartManager.populateStatus(restartData);

};

app.ui.restartManager.restart = async () => {
    let restartData;

    
    try {
            restartData = await app.REST._Restart();
            app.ui.restartManager.restartData = restartData;

            if (restartData.result !== 'OK') {
                app.ui.restartManager.refresh();
                app.ui.msgbox.show('The following error occurred while fetching restart information:' + restartData.error.description, 'ERROR');
                return

            }
    } catch (err) {
            app.ui.msgbox.show(app.REST.parseError(err), 'ERROR');
            return
    }

    app.ui.restartManager.populateStatus(restartData);
    app.ui.restartManager.refresh();

};



app.ui.restartManager.refreshPressed = () => {
    app.ui.restartManager.refresh()
};

app.ui.restartManager.restartPressed = () => {
    app.ui.inputbox.show('You are about to perform t he configured restart process: ' + app.ui.locksManager.currentMask.clear + '<br><br>' +
        'Do you want to proceed ?', 'WARNING', async ret => {
        if (ret === 'YES') {
            app.ui.restartManager.restart();
            app.ui.restartManager.refresh() 
        }
    });
};

app.ui.restartManager.populateStatus = restartData => {

    let status = restartData.status;
    let date = restartData.date;
    let time = restartData.time;
    let routine = restartData.routine;
    let process = restartData.process;
    const statusData = [];            
    statusData.push({
                id: '',
                text: '<strong class="locks-manager-font-inconsolata">Status - ' + status + '</strong>',
                icon: '',
                children: [
                    {
                        id: '',
                        text: 'Date: ' + date,
                        icon: '',
                        children: ''
                    },
                    {
                        id: '',
                        text: 'Time: ' + time,
                        icon: '',
                        children: ''
                    },
                    {
                        id: '',
                        text: 'Routine: ' + routine,
                        icon: '',
                        children: ''
                    },
                    {
                        id: '',
                        text: 'Process: ' + process,
                        icon: '',
                        children: ''
                    },
                ]
            })

    app.ui.restartManager.initTree($("#treeRestartManagerByStatus"), statusData);
};

app.ui.restartManager.initTree = ($tree, treeData) => {
    $tree
        .jstree("destroy")
        .jstree({
            'core': {
                'check_callback': true,
                //'dblclick_toggle': false,
                'multiple': false,
                'data': treeData,
                'themes': {
                    'name': 'proton',
                }
            },
        });
};