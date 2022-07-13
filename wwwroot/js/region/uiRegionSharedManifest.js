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

// ****************************
// Manifest
// ****************************
const MSG_EXCL_ACCESS = {
    onEdit: true,
    onAdd: false,
    icon: 'bi-info-circle',
    color: 'var(--ydb-status-red)',
    message: 'Single-user mode is required to alter this value in the current database.'
};

const MSG_GDE_ONLY = {
    onEdit: true,
    onAdd: false,
    icon: 'bi-info-circle',
    color: 'var(--ydb-purple)',
    message: 'This setting has no effect on the current database and will take effect when you create a new database.'
};

app.ui.regionShared.manifest = {
    dbAccess: [
        {
            id: 'recordSize',
            caption: 'Record size',
            type: 'number',
            min: 0,
            max: 0,
            step: 1,
            unit: 'bytes',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#r-ecord-size-size-in-bytes',
            value: null,
            oldValue: null,
            dirty: false,
            readOnly: false,
            captionMessage: MSG_EXCL_ACCESS,
        },
        {
            id: 'keySize',
            caption: 'Key size',
            type: 'number',
            min: 0,
            max: 0,
            step: 1,
            unit: 'bytes',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#k-ey-size-size-in-bytes',
            value: null,
            oldValue: null,
            dirty: false,
            readOnly: false,
            captionMessage: MSG_EXCL_ACCESS,
        },
        {
            id: 'nullSubscripts',
            caption: 'Null subscripts',
            type: 'boolean',
            display: 'comboSubscripts',
            unit: '',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#no-n-ull-subscripts-always-never-existing',
            value: null,
            oldValue: null,
            dirty: false,
            advancedMode: true,
            readOnly: false,
            captionMessage: MSG_EXCL_ACCESS,
        },
        {
            id: 'lockCriticalSeparate',
            caption: 'Lock critical Separate',
            type: 'boolean',
            display: 'comboYesNo',
            unit: '',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#no-l-ock-crit-separate',
            value: null,
            oldValue: null,
            dirty: false,
            advancedMode: true,
            readOnly: false,
            captionMessage: MSG_EXCL_ACCESS,
        },
        {
            id: 'qbRundown',
            caption: 'QDB Rundown',
            type: 'boolean',
            display: 'comboYesNo',
            unit: '',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#no-q-dbrundown',
            value: null,
            oldValue: null,
            dirty: false,
            advancedMode: true,
            readOnly: false,
            captionMessage: MSG_EXCL_ACCESS,
        },
        {
            id: 'stats',
            caption: 'Statistics',
            type: 'boolean',
            display: 'comboYesNo',
            unit: '',
            helpLink: 'https://docs.yottadb.com/ProgrammersGuide/utility.html#ygblstat',
            value: null,
            oldValue: null,
            dirty: false,
            advancedMode: true,
            readOnly: false,
            captionMessage: MSG_EXCL_ACCESS,
        },

    ],
    dbFile: {
        accessType:
            {
                id: 'accessType',
                caption: 'Access Type',
                type: 'external',
                min: 0,
                max: 0,
                step: 1,
                unit: '',
                helpLink: '',
                value: null,
                oldValue: null,
                dirty: false,
                readOnly: false,
                hidden: true,
                captionMessage: MSG_EXCL_ACCESS,
            },
        bg: [
            {
                id: 'filename',
                caption: 'Filename',
                type: 'file',
                helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#file',
                value: null,
                unit: '',
                oldValue: null,
                dirty: false,
                readOnly: false,
                captionMessage: MSG_EXCL_ACCESS,
            },
            {
                id: 'createFile',
                caption: 'Create db file',
                type: 'boolean',
                display: 'comboYesNo',
                helpLink: '',
                value: null,
                unit: '',
                oldValue: null,
                dirty: false,
                readOnly: false
            },
            {
                id: 'globalBufferCount',
                caption: 'Global buffer count',
                type: 'number',
                min: 0,
                max: 0,
                step: 1,
                unit: 'blocks',
                helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#g-lobal-buffer-count-size',
                value: 67,
                oldValue: null,
                dirty: false,
                readOnly: false,
                captionMessage: MSG_EXCL_ACCESS,
            },
            {
                id: 'lockSpace',
                caption: 'Lock space',
                type: 'number',
                min: 0,
                max: 0,
                step: 1,
                unit: 'pages',
                helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#l-ock-space-integer',
                value: null,
                oldValue: null,
                dirty: false,
                readOnly: false,
                captionMessage: MSG_EXCL_ACCESS,
            },
            {
                id: 'autoDb',
                caption: 'Auto DB',
                type: 'boolean',
                display: 'comboYesNo',
                unit: '',
                helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#no-au-todb',
                value: null,
                oldValue: null,
                dirty: false,
                readOnly: false,
                advancedMode: true,
                canUpdateGde: true,
                canUpdateMupip: false,
                captionMessage: MSG_GDE_ONLY,
            },
            {
                id: 'asyncIo',
                caption: 'Async IO',
                type: 'boolean',
                display: 'comboOnOff',
                unit: '',
                helpLink: 'https://docs.yottadb.com/AdminOpsGuide/dbmgmt.html#asyncio',
                value: null,
                oldValue: null,
                dirty: false,
                advancedMode: true,
                readOnly: false,
                captionMessage: MSG_EXCL_ACCESS,
            },
            {
                id: 'deferAllocate',
                caption: 'Defer allocate',
                type: 'boolean',
                display: 'comboYesNo',
                unit: '',
                helpLink: 'https://docs.yottadb.com/AdminOpsGuide/dbmgmt.html#defer-allocate',
                value: null,
                oldValue: null,
                dirty: false,
                advancedMode: true,
                readOnly: false
            },
            {
                id: 'extensionCount',
                caption: 'Extension count',
                type: 'number',
                unit: 'blocks',
                min: 0,
                max: 0,
                step: 1,
                helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#ex-tension-count-blocks',
                value: null,
                oldValue: null,
                dirty: false,
                advancedMode: true,
                readOnly: false
            },
            {
                id: 'initialAllocation',
                caption: 'Initial allocation',
                type: 'number',
                unit: 'blocks',
                min: 0,
                max: 0,
                step: 1,
                helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#gde-command-summary',
                value: null,
                oldValue: null,
                dirty: false,
                advancedMode: true,
                readOnly: false,
                canUpdateGde: true,
                canUpdateMupip: false,
                captionMessage: MSG_GDE_ONLY,
            },
            {
                id: 'blockSize',
                caption: 'Block size',
                type: 'number',
                unit: 'bytes',
                min: 0,
                max: 0,
                step: 512,
                helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#bl-ock-size-size',
                value: null,
                oldValue: null,
                dirty: false,
                advancedMode: true,
                readOnly: false,
                canUpdateGde: true,
                canUpdateMupip: false,
                captionMessage: MSG_GDE_ONLY,
            },
            {
                id: 'mutexSlots',
                caption: 'Mutex slots',
                type: 'number',
                unit: 'slots',
                min: 0,
                max: 0,
                step: 1,
                helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#m-utex-slots-integer',
                value: null,
                oldValue: null,
                dirty: false,
                advancedMode: true,
                readOnly: false,
                captionMessage: MSG_EXCL_ACCESS,
            },
        ],
        mm: [
            {
                id: 'filename',
                caption: 'Filename',
                type: 'file',
                helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#file',
                value: null,
                unit: '',
                oldValue: null,
                dirty: false,
                readOnly: false,
                canUpdateGde: true,
                captionMessage: MSG_EXCL_ACCESS,
            },
            {
                id: 'createFile',
                caption: 'Create db file',
                type: 'boolean',
                display: 'comboYesNo',
                helpLink: '',
                value: null,
                unit: '',
                oldValue: null,
                dirty: false,
                readOnly: false
            },
            {
                id: 'lockSpace',
                caption: 'Lock space',
                type: 'number',
                min: 0,
                max: 0,
                step: 1,
                unit: 'pages',
                helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#l-ock-space-integer',
                value: null,
                oldValue: null,
                dirty: false,
                readOnly: false,
                captionMessage: MSG_EXCL_ACCESS,
            },
            {
                id: 'deferAllocate',
                caption: 'Defer allocate',
                type: 'boolean',
                display: 'comboYesNo',
                unit: '',
                helpLink: 'https://docs.yottadb.com/AdminOpsGuide/dbmgmt.html#defer-allocate',
                value: null,
                oldValue: null,
                dirty: false,
                advancedMode: true,
                readOnly: false
            },
            {
                id: 'autoDb',
                caption: 'Auto DB',
                type: 'boolean',
                display: 'comboYesNo',
                unit: '',
                helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#no-au-todb',
                value: null,
                oldValue: null,
                dirty: false,
                readOnly: false,
                advancedMode: true,
                canUpdateGde: true,
                canUpdateMupip: false,
                captionMessage: MSG_GDE_ONLY,
            },
            {
                id: 'extensionCount',
                caption: 'Extension count',
                type: 'number',
                unit: 'blocks',
                min: 0,
                max: 0,
                step: 1,
                helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#ex-tension-count-blocks',
                value: null,
                oldValue: null,
                dirty: false,
                advancedMode: true,
                readOnly: false
            },
            {
                id: 'initialAllocation',
                caption: 'Initial allocation',
                type: 'number',
                unit: 'blocks',
                min: 0,
                max: 0,
                step: 1,
                helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#gde-command-summary',
                value: null,
                oldValue: null,
                dirty: false,
                advancedMode: true,
                readOnly: false,
                canUpdateGde: true,
                canUpdateMupip: false,
                captionMessage: MSG_GDE_ONLY,
            },
            {
                id: 'blockSize',
                caption: 'Block size',
                type: 'number',
                unit: 'bytes',
                min: 0,
                max: 0,
                step: 512,
                helpLink: '',
                value: null,
                oldValue: null,
                dirty: false,
                advancedMode: true,
                readOnly: false,
                canUpdateGde: true,
                canUpdateMupip: false,
                captionMessage: MSG_GDE_ONLY,
            },
        ]
    },
    journal: [
        {
            id: 'journalEnabled',
            caption: 'Enabled',
            type: 'external',
            helpLink: '',
            value: null,
            unit: '',
            oldValue: null,
            dirty: false,
            readOnly: false,
            displayInTable: false,
            captionMessage: MSG_EXCL_ACCESS,
        },
        {
            id: 'jfilename',
            caption: 'Filename',
            type: 'file',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#f-ilename-journal-filename',
            value: null,
            unit: '',
            oldValue: null,
            dirty: false,
            readOnly: false
        },
        {
            id: 'switchOn',
            caption: 'Switch journaling on',
            type: 'boolean',
            display: 'comboYesNo',
            helpLink: '',
            value: null,
            unit: '',
            oldValue: null,
            dirty: false,
            readOnly: false
        },
        {
            id: 'beforeImage',
            caption: 'Before image',
            type: 'boolean',
            display: 'comboYesNo',
            unit: '',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#before-image-journaling',
            value: null,
            oldValue: null,
            dirty: false,
            readOnly: false
        },
        {
            id: 'allocation',
            caption: 'Initial allocation',
            type: 'number',
            min: 0,
            max: 0,
            step: 1,
            unit: 'journal blocks',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#all-ocation-blocks',
            value: null,
            oldValue: null,
            dirty: false,
            advancedMode: true,
            readOnly: false
        },
        {
            id: 'autoSwitchLimit',
            caption: 'Auto switch limit',
            type: 'number',
            min: 0,
            max: 0,
            step: 1,
            unit: 'journal blocks',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#au-toswitchlimit-blocks',
            value: null,
            oldValue: null,
            dirty: false,
            advancedMode: true,
            readOnly: false
        },
        {
            id: 'bufferSize',
            caption: 'Buffer size',
            type: 'number',
            min: 0,
            max: 0,
            step: 1,
            unit: 'journal blocks',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#bu-ffer-size-blocks',
            value: null,
            oldValue: null,
            dirty: false,
            advancedMode: true,
            readOnly: false,
            captionMessage: MSG_EXCL_ACCESS,
        },
        {
            id: 'epochTaper',
            caption: 'Epoch taper',
            type: 'boolean',
            display: 'comboYesNo',
            unit: '',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/dbmgmt.html#epochtaper',
            value: null,
            oldValue: null,
            dirty: false,
            advancedMode: true,
            readOnly: false
        },
        {
            id: 'epochInterval',
            caption: 'Epoch interval',
            type: 'number',
            min: 0,
            max: 0,
            step: 1,
            unit: 'seconds',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#ep-och-interval-seconds',
            value: null,
            oldValue: null,
            dirty: false,
            advancedMode: true,
            readOnly: false
        },
        {
            id: 'extension',
            caption: 'Extension',
            type: 'number',
            min: 0,
            max: 0,
            step: 1,
            unit: 'journal blocks',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#ex-tension-blocks',
            value: null,
            oldValue: null,
            dirty: false,
            advancedMode: true,
            readOnly: false
        },
        {
            id: 'syncIo',
            caption: 'Sync IO',
            type: 'boolean',
            display: 'comboYesNo',
            unit: '',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#no-s-ync-io',
            value: null,
            oldValue: null,
            dirty: false,
            advancedMode: true,
            readOnly: false
        },
        {
            id: 'yieldLimit',
            caption: 'Yield limit',
            type: 'number',
            unit: 'times',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#y-ield-limit-yieldcount',
            value: null,
            oldValue: null,
            dirty: false,
            advancedMode: true,
            readOnly: false
        },
    ],
    names: []
};

