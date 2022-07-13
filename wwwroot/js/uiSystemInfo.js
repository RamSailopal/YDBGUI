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

//*********************************************
// init()
//*********************************************
app.ui.systemInfo.init = () => {
    $('#btnSystemInfoEnvironmentVariables').on('click', () => app.ui.systemInfo.envVars.show());

    $('#chkEnvVarsSystem').on('click', () => app.ui.systemInfo.populateEnvVarsTable());
    $('#chkEnvVarsGtm').on('click', () => app.ui.systemInfo.populateEnvVarsTable());
    $('#chkEnvVarsYdb').on('click', () => app.ui.systemInfo.populateEnvVarsTable());
};

//*********************************************
// show()
//*********************************************
app.ui.systemInfo.show = () => {
    $('#lblSystemInfoRoutines').html(app.system.systemInfo.zroutines.replace(/ /g, '<br>'));
    $('#lblSystemInfoGlobalDirectory').text(app.system.systemInfo.gld);
    $('#lblSystemInfoMode').text(app.system.systemInfo.chset);
    $('#lblSystemInfoEncryption').text(app.system.systemInfo.encryptionLibrary === true ? 'Installed' : 'Not installed');

    const tblSystemInfoPlugins = $('#tblSystemInfoPlugins > tbody');

    tblSystemInfoPlugins.empty();

    if ( Array.isArray(app.system.systemInfo.plugins) ) {
        app.system.systemInfo.plugins.forEach(plugin => {
            let row = '<tr>';

            const descriptionSplitted = plugin.description.split("<br>");
            let description = descriptionSplitted[0] + '<br><span class="inconsolata">' + descriptionSplitted[1] + '</span>';

            row += '<td>' + plugin.name + '</td>';
            row += '<td>' + description + '</td>';
            row += '<td>' + plugin.version + '</td>';
            row += '<td>' + plugin.vendor + '</td></tr>';
            tblSystemInfoPlugins.append(row)
        });
    }
    $('#modalSystemInfo').modal({show: true, backdrop: 'static'});
};

//*********************************************
// envVars.show()
//*********************************************
app.ui.systemInfo.envVars.show = () => {
    $('#modalEnvVars').modal({show: true, backdrop: 'static'});

    app.ui.systemInfo.populateEnvVarsTable();
};

app.ui.systemInfo.populateEnvVarsTable = () => {
    const systemInfo = app.system.systemInfo;

    let envVars = systemInfo.envVars;
    if ( $('#chkEnvVarsSystem').is(':checked') === false ) {
        envVars = envVars.filter(el => el.name.indexOf('ydb') > -1 || el.name.toUpperCase().indexOf('GTM') > -1 )
    }
    if ( $('#chkEnvVarsYdb').is(':checked') === false ) {
        envVars = envVars.filter(el => el.name.indexOf('ydb') === -1)
    }
    if ( $('#chkEnvVarsGtm').is(':checked') === false ) {
        envVars = envVars.filter(el => el.name.toUpperCase().indexOf('GTM') === -1  )
    }

    const tblEnvVars = $('#tblEnvVars > tbody');

    tblEnvVars.empty();

    envVars.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0
    });


    envVars.forEach(envVar => {
        let row = '<tr>';

        row += '<td class="inconsolata">' + envVar.name + '</td>';
        row += '<td class="inconsolata">' + envVar.value + '</td>';

        row += '</tr>';

        tblEnvVars.append(row)
    })
};
