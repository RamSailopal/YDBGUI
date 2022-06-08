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
            dirty: false
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
            dirty: false
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
        },
        {
            id: 'collation',
            caption: 'Collation',
            type: 'number',
            min: 0,
            max: 0,
            step: 1,
            unit: '',
            helpLink: 'https://docs.yottadb.com/ProgrammersGuide/internatn.html',
            value: null,
            oldValue: null,
            dirty: false,
            advancedMode: true,
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
        },
        {
            id: 'qbRundown',
            caption: 'QDB RUNDOWN',
            type: 'boolean',
            display: 'comboYesNo',
            unit: '',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#no-q-dbrundown',
            value: null,
            oldValue: null,
            dirty: false,
            advancedMode: true,
        },
        {
            id: 'stats',
            caption: 'Stats',
            type: 'boolean',
            display: 'comboYesNo',
            unit: '',
            helpLink: 'https://docs.yottadb.com/ProgrammersGuide/utility.html#ygblstat',
            value: null,
            oldValue: null,
            dirty: false,
            advancedMode: true,
        },

    ],
    dbFile: {
        bg: [
            {
                id: 'filename',
                caption: 'Filename',
                type: 'file',
                helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#file',
                value: null,
                unit: '',
                oldValue: null,
                dirty: false
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
                dirty: false
            },
            {
                id: 'globalBufferCount',
                caption: 'Global buffer count',
                type: 'number',
                min: 0,
                max: 0,
                step: 1,
                unit: 'blocks',
                helpLink: '',
                value: 67,
                oldValue: null,
                dirty: false
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
                dirty: false
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
                dirty: false
            },
            {
                id: 'asyncIo',
                caption: 'Async IO',
                type: 'boolean',
                display: 'comboOnOff',
                unit: '',
                helpLink: '',
                value: null,
                oldValue: null,
                dirty: false,
                advancedMode: true,
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
            },
            {
                id: 'mutexSlots',
                caption: 'Mutex slots',
                type: 'number',
                unit: 'slots',
                min: 0,
                max: 0,
                step: 1,
                helpLink: '',
                value: null,
                oldValue: null,
                dirty: false,
                advancedMode: true,
            },
            {
                id: 'reservedBytes',
                caption: 'Reserved bytes',
                type: 'number',
                unit: 'bytes',
                min: 0,
                max: 0,
                step: 1,
                helpLink: '',
                value: null,
                oldValue: null,
                dirty: false,
                advancedMode: true,
            },
            {
                id: 'encryptionFlag',
                caption: 'Encryption',
                type: 'boolean',
                display: 'comboYesNo',
                unit: '',
                min: 0,
                max: 0,
                step: 1,
                helpLink: '',
                value: null,
                oldValue: null,
                dirty: false,
                advancedMode: true,
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
                dirty: false
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
                dirty: false
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
                dirty: false
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
                dirty: false
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
            },
            {
                id: 'reservedBytes',
                caption: 'Reserved bytes',
                type: 'number',
                unit: 'bytes',
                min: 0,
                max: 0,
                step: 1,
                helpLink: '',
                value: null,
                oldValue: null,
                dirty: false,
                advancedMode: true,
            },
            {
                id: 'encryptionFlag',
                caption: 'Encryption',
                type: 'boolean',
                display: 'comboYesNo',
                unit: '',
                min: 0,
                max: 0,
                step: 1,
                helpLink: '',
                value: null,
                oldValue: null,
                dirty: false,
                advancedMode: true,
            },
        ]
    },
    journal: [
        {
            id: 'journalEnabled',
            caption: '',
            type: 'external',
            helpLink: '',
            value: null,
            unit: '',
            oldValue: null,
            dirty: false
        },
        {
            id: 'jfilename',
            caption: 'Filename',
            type: 'file',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#f-ilename-journal-filename',
            value: null,
            unit: '',
            oldValue: null,
            dirty: false
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
            dirty: false
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
            dirty: false
        },
        {
            id: 'allocation',
            caption: 'Allocation',
            type: 'number',
            min: 0,
            max: 0,
            step: 1,
            unit: 'journal blocks',
            helpLink: '',
            value: null,
            oldValue: null,
            dirty: false,
            advancedMode: true,
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
        },
        {
            id: 'extension',
            caption: 'Extension',
            type: 'number',
            min: 0,
            max: 0,
            step: 1,
            unit: 'journal blocks',
            helpLink: '',
            value: null,
            oldValue: null,
            dirty: false,
            advancedMode: true,
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
        },
    ],
    names: []
};
