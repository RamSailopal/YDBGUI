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


  $('#menuSystemInfo').on('click', () => app.ui.systemInfo.show());

  // connect
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
