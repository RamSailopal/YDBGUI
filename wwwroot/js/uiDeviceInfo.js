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
app.ui.deviceInfo.init = () => {

};

//*********************************************
// show()
//*********************************************
app.ui.deviceInfo.show = (index) => {
    const device = app.system.devices[index];
    const rngDeviceInfoPercentUsed = $('#rngDeviceInfoPercentUsed');
    $('#lblDeviceInfoMountpoint').text(device.mountPoint);
    $('#lblDeviceInfoFileSystem').text(device.type);
    $('#lblDeviceInfoBlockAvailable').text(app.ui.formatThousands(device.freeBlocks));
    $('#lblDeviceInfoBlocksUsed').text(app.ui.formatThousands(device.usedBlocks));
    $('#lblDeviceInfoTotalBlocks').text(app.ui.formatThousands(device.totalBlocks));

    const rangeStyle = {};
    app.userSettings.dashboard.storageRanges.forEach(el => {
        if (device.percentUsed >= el.min && device.percentUsed <= el.max) {
            rangeStyle.class = el.class;
        }
    });

    rngDeviceInfoPercentUsed
        .removeClass('ydb-status-red ydb-status-green ydb-status-amber ydb-status-gray')
        .addClass(rangeStyle.class)
        .css('width',device.percentUsed + '%')
        .text(device.percentUsed + ' %');

    $('#modalDeviceInfo').modal({show: true, backdrop: 'static'});
};

