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

app.userSettings = {
    dashboard: {
        flashInterval: 500,
        storageRanges: [
            {
                min: 0,
                max: 70,
                class: 'ydb-status-green',
                flash: false
            },
            {
                min: 71,
                max: 90,
                class: 'ydb-status-amber',
                flash: false
            },
            {
                min: 91,
                max: 97,
                class: 'ydb-status-red',
                flash: false
            },
            {
                min: 98,
                max: 100,
                class: 'ydb-status-red',
                flash: true
            },
        ],
        regionRanges: [
            {
                min: 0,
                max: 70,
                class: 'ydb-status-green',
                flash: false
            },
            {
                min: 71,
                max: 90,
                class: 'ydb-status-amber',
                flash: false
            },
            {
                min: 91,
                max: 97,
                class: 'ydb-status-red',
                flash: false
            },
            {
                min: 98,
                max: 100,
                class: 'ydb-status-red',
                flash: false
            },
        ]
    }
};
