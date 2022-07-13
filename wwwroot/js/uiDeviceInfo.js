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

    const divideFactor = device.fsBlockSize / 1024;

    $('#lblDeviceInfoMountpoint').text(device.mountPoint);
    $('#lblDeviceInfoFileSystem').text(device.type);
    $('#lblDeviceInfoBlockSize').text(app.ui.formatThousands(device.fsBlockSize));
    $('#lblDeviceInfoId').text(device.deviceId);

    const bytesTotal = app.ui.formatBytes(device.totalBlocks * 1024).split(' ');
    $('#lblDeviceInfoTotalBlocks').text(app.ui.formatThousands(device.totalBlocks / divideFactor));
    $('#lblDeviceInfoTotalBytes').text(bytesTotal[0]);
    $('#lblDeviceInfoTotalBytesUnit').text(' ' + bytesTotal[1]);

    const bytesUsed = app.ui.formatBytes(device.usedBlocks * 1024).split(' ');
    $('#lblDeviceInfoBlocksUsed').text(app.ui.formatThousands(device.usedBlocks / divideFactor));
    $('#lblDeviceInfoBytesUsed').text(bytesUsed[0]);
    $('#lblDeviceInfoBytesUsedUnit').text(' ' + bytesUsed[1]);

    const bytesAvail = app.ui.formatBytes(device.freeBlocks * 1024).split(' ');
    $('#lblDeviceInfoBlockAvailable').text(app.ui.formatThousands(device.freeBlocks / divideFactor));
    $('#lblDeviceInfoBytesAvailable').text(bytesAvail[0]);
    $('#lblDeviceInfoBytesAvailableUnit').text(' ' + bytesAvail[1]);

    $('#lblDeviceInfoINodesTotal').text(app.ui.formatThousands(device.iNodesTotal));
    $('#lblDeviceInfoINodesFree').text(app.ui.formatThousands(device.iNodesFree));
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

