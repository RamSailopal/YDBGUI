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

let settings = {};

// *******************
// Initialization
// *******************

// System Initialization at startup
window.onload = async () => {
    // loads all included HTML
    await loadFiles('data-include');

    // initialize popper
    $('[data-toggle="popover"]').popover({
        html: true, container: 'body', template: '<div class="popover" role="tooltip"><div class="arrow "></div><h3 class="popover-header ydb-popover-header "></h3><div class="popover-body"></div></div>'
    });

    // Init handlers
    app.ui.addHandlers();

    // detect testMode
    testMode = window.location.search.indexOf('?test=') > -1;

    // Load test file if needed
    if ( testMode ) {
        await loadTestScript()
    }

    // get YDBGUI version number
    try {
        $.getJSON('./ydbguiVersion.json', json => {
            app.version = json.version;

            // Start
            app.ui.dashboard.refresh()
        })

    } catch (err) {
        console.log('The following error occurred while fetching the version.json file:');
        console.log(err)
    }

};

const loadFiles = async (tag) => {
    let promises = [];

    let includes = $('[' + tag + ']');
    jQuery.each(includes, async function () {
        let def = new $.Deferred();

        const newThis = this;
        let file = './html/' + $(newThis).data('include') + '.html';
        $(this).load(file, () => {
            def.resolve();
        });
        promises.push(def)
    });

    return $.when.apply(undefined, promises).promise();
};

const loadTestScript = () => {
    return new Promise(function (resolve) {
        $.ajax({
            url: 'test/mockData.js',
            dataType: "script",
            success: resolve,
        });
    });
};

// *******************
// Main app object
// *******************

let app = {
    libs: {},

    REST: {
        host: window.location.hostname,
        port: window.location.port,
        root: '/api/',
        username: '',
        password: ''
    },
    ui: {
        menu: {},

        timings: {},

        msgbox: {},
        inputbox: {},
        wait: {},

        dashboard: {},

        regionView: {},
        regionCreateDbFile: {},
        regionSelect: {},
        regionDelete: {},
        regionExtend: {},
        regionJournalSwitch: {},

        help: {},
        tabs: {},

        compact: {},
        repair: {},
        storageSettings: {},
        storageRegion: {},
        storageWizard: {},
        backupWizard: {},

        systemInfo: {
            envVars: {}
        },
        deviceInfo: {},

    },
    system: {},

    config: {
        timeout: 3600
    },
    currMouseTime: 0,
    timeoutId: 0
};

