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


app.ui.menu.init = () => {
    // connect
    $('#menuDashboard').on('click', () => app.ui.dashboard.refresh());

    // system info
    $('#menuSystemInfo').on('click', () => app.ui.systemInfo.show());

    // Database administration
    $('#menuSystemAdministrationRegionAddLi').on('click', () => app.ui.regionAdd.name.show());
    $('#menuSystemAdministrationRegionAdd').on('click', () => app.ui.regionAdd.name.show());
    $('#menuSystemAdministrationLocksManagerLi').on('click', () => app.ui.locksManager.show());

    // documentation
    $('#menuDocumentationAdministration').on('click', () => window.open('https://docs.yottadb.com/AdminOpsGuide/index.html', '_blank'));
    $('#menuDocumentationMessages').on('click', () => window.open('https://docs.yottadb.com/MessageRecovery/index.html', '_blank'));
    $('#menuDocumentationMprogrammer').on('click', () => window.open('https://docs.yottadb.com/ProgrammersGuide/index.html', '_blank'));
    $('#menuDocumentationMultiLanguage').on('click', () => window.open('https://docs.yottadb.com/MultiLangProgGuide/index.html', '_blank'));
    $('#menuDocumentationOcto').on('click', () => window.open('https://docs.yottadb.com/Octo/index.html', '_blank'));
    $('#menuDocumentationPlugins').on('click', () => window.open('https://docs.yottadb.com/Plugins/index.html', '_blank'));
    $('#menuDocumentationAcculturation').on('click', () => window.open('https://docs.yottadb.com/AcculturationGuide/acculturation.html', '_blank'));
    $('#menuDebugInformation').on('click', () => {
        const text = JSON.stringify(app.system, null, 4);

        // converts the spaces into non-breaking spaces and new lines as <BR>
        $('#txtDumpResponse').html(text.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>"));

        $('#modalDumpResponse').modal({show: true, backdrop: 'static', keyboard: true});
    });
};

app.ui.menu.processRefresh = () => {
    let status = {
        journal: [],          // used to disable the journaling menu and build the list for the select menu
        dbFile: [],           // used to disable the create db file menu and build the list for the select menu
        extendDbFile: [],     // used to build the list for the extend menu (or disabled if all is bad)
        regions: []           // list of regions for view / edit / delete
    };

    Object.keys(app.system.regions).forEach((regionName) => {
        const region = app.system.regions[regionName];

        status.regions.push(regionName);

        // check if at least one database needs to have the file created
        if (region.dbFile.flags.fileExist === false) status.dbFile.push(regionName);

        // check if at least one database have a journal
        if (region.journal !== undefined && region.journal.flags !== undefined && region.journal.flags.state > 0) status.journal.push(regionName);

        // check if db can be extended
        if (region.dbFile.flags.fileExist) status.extendDbFile.push(regionName);
    });

    // journaling start / stop
    const menuSystemAdministrationRegionJournaling = $('#menuSystemAdministrationRegionJournaling');
    const menuSystemAdministrationRegionJournalingLi = $('#menuSystemAdministrationRegionJournalingLi');
    if (status.journal.length === 0) {
        menuSystemAdministrationRegionJournaling.addClass('disabled').addClass('default').removeClass('hand');
        menuSystemAdministrationRegionJournalingLi.addClass('disabled').addClass('default').removeClass('hand');

    } else {
        menuSystemAdministrationRegionJournaling.removeClass('disabled').removeClass('default').addClass('hand');
        menuSystemAdministrationRegionJournalingLi.removeClass('disabled').removeClass('default').addClass('hand');

        // add handler
        menuSystemAdministrationRegionJournalingLi.on('click', () => app.ui.regionSelect.show(status.journal, app.ui.regionJournalSwitch.show));
    }

    // Create db file
    const menuSystemAdministrationRegionCreateDatabaseLi = $('#menuSystemAdministrationRegionCreateDatabaseLi');
    const menuSystemAdministrationRegionCreateDatabase = $('#menuSystemAdministrationRegionCreateDatabase');
    if (status.dbFile.length === 0) {
        menuSystemAdministrationRegionCreateDatabase.addClass('disabled').addClass('default').removeClass('hand');
        menuSystemAdministrationRegionCreateDatabaseLi.addClass('disabled').addClass('default').removeClass('hand');

    } else {
        menuSystemAdministrationRegionCreateDatabase.removeClass('disabled').removeClass('default').addClass('hand');
        menuSystemAdministrationRegionCreateDatabaseLi.removeClass('disabled').removeClass('default').addClass('hand');

        // add handler
        menuSystemAdministrationRegionCreateDatabaseLi.on('click', () => app.ui.regionSelect.show(status.dbFile, app.ui.regionCreateDbFile.show));
    }

    // extend db file
    const menuSystemAdministrationRegionExtendDatabaseLi = $('#menuSystemAdministrationRegionExtendDatabaseLi');
    const menuSystemAdministrationRegionExtendDatabase = $('#menuSystemAdministrationRegionExtendDatabase');
    if (status.extendDbFile.length === 0) {
        menuSystemAdministrationRegionExtendDatabase.addClass('disabled').addClass('default').removeClass('hand');
        menuSystemAdministrationRegionExtendDatabaseLi.addClass('disabled').addClass('default').removeClass('hand');

    } else {
        menuSystemAdministrationRegionExtendDatabase.removeClass('disabled').removeClass('default').addClass('hand');
        menuSystemAdministrationRegionExtendDatabaseLi.removeClass('disabled').removeClass('default').addClass('hand');

        // add handler
        menuSystemAdministrationRegionExtendDatabaseLi.on('click', () => app.ui.regionSelect.show(status.extendDbFile, app.ui.regionExtend.show));
    }

    // region view handlers
    $('#menuSystemAdministrationRegionViewLi').on('click', () => app.ui.regionSelect.show(status.regions, app.ui.regionView.show));
    // region delete handlers
    $('#menuSystemAdministrationRegionDeleteLi').on('click', () => app.ui.regionSelect.show(status.regions, app.ui.regionDelete.show));
    $('#menuSystemAdministrationRegionEditLi').on('click', () => app.ui.regionSelect.show(status.regions, app.ui.regionEdit.show));
};
