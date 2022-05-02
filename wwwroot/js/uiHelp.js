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


app.ui.help.init = () => {

    // caption:         The text to display in the table
    // helpLink:        The (optional) link to the help topic

    // isPositiveClass: The (optional) class to use to color the cell if the value > 0
    // format:          The (optional) supported string formatting: 'thousands','bytes','date'
    // inBgOnly:        The (optional) true flag to display only if BG
    // unit:            The (optional) unit / text that will be appended to the value (with a space in between)
    // booleanYesNo     The (optional) flag to display boolean as Yes and No
    // booleanOnOff     The (optional) flag to display boolean as On and Off
    // statsSection     The (optional) statistics section where the entry will be displayed

    // Fields with dots (.) in the name must be surrounded by quotes

    app.ui.help.region = {
// DATABASE FILE
        FILE_NAME: { // Use $ZSEARCH() to expand file name from GDE, e.g., yottadb -run %XCMD 'w $zsearch("$ydb_dir/$ydb_rel/g/yottadb.dat"),!' or "sgmnt_data.basedb_fname" (null terminated) or use "sgmnt_data.basedb_fname_len"
            caption: 'File Name',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#file',
        },
        currentSize: { // "sgmnt_data.trans_hist.total_blks"; "sgmnt_data.blk_size" is the block size
            caption: 'Current Size',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/dse.html#examples-for-dump',
            format: 'bytes'
        },
        maximumSize: { // "sgmnt_data.master_map_len" â€“ 992Mi blocks if 253952; x*1040187392/253952 if x
            caption: 'Maximum Size',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/dse.html#examples-for-dump',
            format: 'bytes'
        },
        extensionLeft: { // maximumSize-currentSize
            caption: 'Extension Available',
            helpLink: '', // no help needed
            format: 'bytes'
        },
        ACCESS_METHOD: { // "sgmnt_data.acc_meth" - 1=BG; 2=MM
            caption: 'Access Method',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#ac-cess-method-code',
        },
        GLOBAL_BUFFER_COUNT: { // "sgmnt_data.n_bts"
            caption: 'Global Buffer Count',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#g-lobal-buffer-count-size',
            format: 'thousands',
            unit: 'blocks',
            inBgOnly: true
        },
        LOCK_SPACE: { // "sgmnt_data.lock_space_size" - each block is 512 bytes
            caption: 'Lock space',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#l-ock-space-integer',
            format: 'thousands',
            unit: 'blocks'
        },
        ASYNCIO: { // "sgmnt_data.asyncio" - 1 means async IO (0 is default)
            caption: 'Async IO',
            helpLink: '',
            inBgOnly: true,
            booleanOnOff: true
        },
        DEFER_ALLOCATE: { // "sgmnt_data.defer_allocate" - 1 is to defer (default)
            caption: 'Defer allocate',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/dbmgmt.html#defer-allocate',
            booleanYesNo: true
        },
        EXTENSION_COUNT: { // "sgmnt_data.extension_size"
            caption: 'Extension count',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#ex-tension-count-blocks',
            format: 'thousands',
            unit: 'blocks'
        },
        TRANSACTION_NUMBER: { // "sgmnt_data.trans_hist.curr_tn"
            caption: 'Transaction number',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/dse.html#examples-for-dump',
        },
        LAST_BACKUP: { // "sgmnt_data.last_com_backup"
            caption: 'Last backup',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/dbmgmt.html#backup',
        },
        ALLOCATION: { // This comes from GDE
            caption: 'Allocation',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#gde-command-summary',
            format: 'thousands',
            unit: 'blocks'
        },
        BLOCK_SIZE: { // "sgmnt_data.blk_size"
            caption: 'Block size',
            helpLink: '',
            format: 'bytes'
        },
        ENCRYPTION_FLAG: { // "sgmnt_data.is_encrypted" - This is an advanced feature; defer for later when we implement an Advanced button
            caption: 'Encryption',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/encryption.html',
            booleanOnOff: true
        },
        MUTEX_SLOTS: { // "sgmnt_data.mutex_spin_parms.mutex_que_entry_space_size" - defer for when we implement Advanced button
            caption: 'Mutex slot',
            helpLink: '',
            format: 'thousands',
            inBgOnly: true
        },

        // DATABASE ACCESS
        RECORD_SIZE: { // "sgmnt_data.max_rec_size"
            caption: 'Record size',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#r-ecord-size-size-in-bytes',
            format: 'bytes'
        },
        KEY_SIZE: { // "sgmnt_data.max_key_size"
            caption: 'Key size',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#k-ey-size-size-in-bytes',
            format: 'bytes'
        },
        COLLATION_DEFAULT: { // "sgmnt_data.def_coll" - defer to Advanced
            caption: 'Collation',
            helpLink: 'https://docs.yottadb.com/ProgrammersGuide/internatn.html',
            format: 'thousands'
        },
        AUTO_DB: { // From GDE
            caption: 'Auto DB',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#no-au-todb',
            booleanYesNo: true
        },
        INST_FREEZE_ON_ERROR: { // â€œjnlpool_ctl_struct.instfreeze_environ_initedâ€ - defer to Advanced
            caption: 'Freeze on error',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/dbrepl.html#instance-freeze',
            booleanYesNo: true
        },
        LOCK_CRIT_SEPARATE: { // "sgmnt_data.lock_crit_with_db" - 0 means separate; defer to Advanced
            caption: 'Lock critical separate',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#no-l-ock-crit-separate',
            booleanYesNo: true
        },
        NULL_SUBSCRIPTS: { // "sgmnt_data.null_subs" - 0 (Default) means null subscripts are not allowed, 1 means allowed, 2 means allow existing nodes but no new nodes; defer to Advanced
            caption: 'Null subscripts',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#no-n-ull-subscripts-always-never-existing'
        },
        QDBRUNDOWN: { // Need to find the parameter for this - defer to Advanced
            caption: 'Rundown',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#no-q-dbrundown',
            booleanYesNo: true
        },
        STATS: { // Need to find the parameter for this - defer to Advanced
            caption: 'Statistics',
            helpLink: 'https://docs.yottadb.com/ProgrammersGuide/utility.html#ygblstat',
            booleanOnOff: true
        },
        STDNULLCOLL: { // "sgmnt_data.std_null_coll" - defer to Advanced
            caption: 'Null Collation',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/gde.html#no-std-nullcoll',
            booleanYesNo: true
        },

        // JOURNAL
        JFILE_NAME: { // "sgmnt_data.jnl_file_name" - null terminated or "sgmnt_data.jnl_file_len"
            caption: 'File Name',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#f-ilename-journal-filename',
        },
        BEFORE: { // "sgmnt_data.jnl_before_image" - 1 is before_image
            caption: 'Before image',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#before-image-journaling',
            booleanYesNo: true
        },
        EPOCH_INTERVAL: { // "sgmnt_data.epoch_interval"
            caption: 'Epoch interval',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#ep-och-interval-seconds',
            format: 'thousands'
        },
        EPOCH_TAPER: { // "sgmnt_data.epoch_taper" - defer to Advanced
            caption: 'Epoch taper',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/dbmgmt.html#epochtaper',
            booleanOnOff: true
        },
        SYNC_IO: { // "sgmnt_data.jnl_sync_io" - 1 means sync_io
            caption: 'Sync IO',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#no-s-ync-io',
            booleanOnOff: true
        },
        AUTO_SWITCH_LIMIT: { // "sgmnt_data.autoswitchlimit" - defer to Advanced
            caption: 'Auto switch limit',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#au-toswitchlimit-blocks',
        },
        ALIGNSIZE: { // "sgmnt_data.alignsize" - defer to Advanced
            caption: 'Align size',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#ali-gnsize-blocks',
        },
        BUFFER_SIZE: { // "sgmnt_data.jnl_buffer_size"
            caption: 'Buffer size',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#bu-ffer-size-blocks',
            format: 'thousands'
        },
        YIELD_LIMIT: { // "sgmnt_data.yield_lmt" - defer to Advanced
            caption: 'Yield limit',
            helpLink: 'https://docs.yottadb.com/AdminOpsGuide/ydbjournal.html#y-ield-limit-yieldcount',
        },

        // Transactions
        'sgmnt_data.gvstats_rec.n_nontp_retries_0': {
            caption: '# of Tp transaction Conflicts at try 0',
            format: 'thousands',
            class: 'align-right'
        },
        'sgmnt_data.gvstats_rec.n_nontp_retries_1': {
            caption: '# of Tp transaction Conflicts at try 1',
            format: 'thousands',
            class: 'align-right'
        },
        'sgmnt_data.gvstats_rec.n_nontp_retries_2': {
            caption: '# of Tp transaction Conflicts at try 2',
            format: 'thousands',
            isPositiveClass: 'ydb-status-amber',
            class: 'align-right'
        },
        'sgmnt_data.gvstats_rec.n_nontp_retries_3': {
            caption: '# of Tp transaction Conflicts at try 3',
            format: 'thousands',
            isPositiveClass: 'ydb-status-red',
            class: 'align-right'
        },

        // Logical database operations
        'sgmnt_data.gvstats_rec.n_get': {
            caption: 'GET ',
            format: 'thousands',
            class: 'align-right'
        },
        'sgmnt_data.gvstats_rec.n_set': {
            caption: 'SET ',
            format: 'thousands',
            class: 'align-right'
        },
        'sgmnt_data.gvstats_rec.n_kill': {
            caption: 'KILL ',
            format: 'thousands',
            class: 'align-right'
        },
        'sgmnt_data.gvstats_rec.n_data': {
            caption: '$DATA ',
            format: 'thousands',
            class: 'align-right'
        },
        'sgmnt_data.gvstats_rec.n_order': {
            caption: '$ORDER',
            format: 'thousands',
            class: 'align-right'
        },
        'sgmnt_data.gvstats_rec.n_zprev': {
            caption: '$ZPREVIOUS',
            format: 'thousands',
            class: 'align-right'
        },
        'sgmnt_data.gvstats_rec.n_query': {
            caption: '$QUERY',
            format: 'thousands',
            class: 'align-right'
        },

        // M lock operations
        'sgmnt_data.gvstats_rec.n_lock_success': {
            caption: 'Success ',
            format: 'thousands',
            class: 'align-right'
        },
        'sgmnt_data.gvstats_rec.n_lock_fail': {
            caption: 'Failures ',
            format: 'thousands',
            class: 'align-right'
        },

        // Journal
        'sgmnt_data.gvstats_rec.n_jfile_bytes': {
            caption: '# of Journal File Bytes written to the journal file on disk',
            format: 'bytes',
            class: 'align-right'
        },
        'sgmnt_data.gvstats_rec.n_jnl_flush': {
            caption: '# of Journal FLushes of all dirty journal buffers in shared memory to disk',
            format: 'thousands',
            class: 'align-right'
        },
        'sgmnt_data.gvstats_rec.n_jnl_fsync': {
            caption: '# of Journal FSync operations on the journal file ',
            format: 'thousands',
            class: 'align-right'
        },
        'sgmnt_data.gvstats_rec.n_jrec_epoch_regular': {
            caption: '# of Journal Regular Epoch records written to the journal file',
            format: 'thousands',
            class: 'align-right'
        },

        // Critical Section Aquisition
        'sgmnt_data.gvstats_rec.n_crit_success': {
            caption: 'Total Acquisitions successes',
            format: 'thousands',
            class: 'align-right'
        },
        'sgmnt_data.gvstats_rec.n_crit_fail': {
            caption: 'Failed (blocked) acquisition Total',
            format: 'thousands',
            class: 'align-right'
        },
        'sgmnt_data.gvstats_rec.n_crit_in_epch': {
            caption: 'Failed (blocked) acquisition total caused by Epochs',
            format: 'thousands',
            class: 'align-right'
        },

    };

    app.ui.help.getRegionByKey = key => {
        return app.ui.help.region[key]
    }

};

