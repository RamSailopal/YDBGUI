<!--
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
-->

# Parameter list

| Parameter                | Check | Immutable | .gld | .dat | Confirmation | Exclusive | Advanced |
| ------------------------ | ----- | --------- | ---- | ---- | ------------ | --------- | -------- |
| Access Method            | Y     |           | Y    | Y    |              | Y         |          |
| Allocation               |       |           | Y    |      |              |           |          |
| Async IO                 | Y     |           | Y    | Y    |              | Y         |          |
| AutoDB                   |       |           | Y    |      |              | N.A       |          |
| Block Size               | Y     | Y         | Y    | Y    | Y            | N.A.      | Y        |
| Collation Default        | Y     |           | Y    | Y    |              |           | Y        |
| Database filename        | Y     | Y         | Y    | Y    |              | Y         | YY       |
| Defer Allocate           | Y     |           | Y    | Y    |              |           |          |
| Defer Time               | Y     |           |      | Y    |              |           | Y        |
| Epoch Taper              | Y     |           | Y    | Y    |              |           |          |
| Extension Count          | Y     |           | Y    | Y    |              |           |          |
| Flush Time               |       |           |      | Y    |              |           | Y        |
| Global Buffers           | Y     |           | Y    | Y    |              | Y         |          |
| Hard Spin Count          | Y     |           |      | Y    |              |           | Y        |
| Inst Freeze on Err       | Y     |           | Y    | Y    |              |           | Y        |
| Instance File Name       |       |           | Y    |      |              |           | Y        |
| Journal Enable/Disable   | Y     |           | Y    | Y    |              | Y         |          |
| Journal Allocation       | Y     |           | Y    | Y    |              |           | Y        |
| Journal Autoswitch Limit | Y     |           | Y    | Y    |              |           | Y        |
| Journal Before Image     | Y     |           | Y    | Y    |              |           | Y        |
| Journal Buffer Size      | Y     |           | Y    | Y    |              | Y         | Y        |
| Journal Extension        | Y     |           | Y    | Y    |              |           | Y        |
| Journal File Name        | Y     |           | Y    | Y    |              |           |          |
| Key Size                 | Y     |           | Y    | Y    |              | Y         |          |
| Lock Space               | Y     |           | Y    | Y    |              | Y         |          |
| Lock Shares DB Crit      | Y     |           | Y    | Y    |              | Y         | Y        |
| Locks                    |       |           | Y    |      |              |           | Y        |
| Null Subscripts          | Y     |           | Y    | Y    |              | Y         | Y        |
| Mutex Slots              | Y     |           | Y    | Y    |              | Y         | Y        |
| Partial Recov Bypass     |       |           |      | Y    |              |           | YY       |
| QDBRundown               | Y     |           | Y    | Y    |              | Y         | Y        |
| Read Only                |       |           |      | Y    |              |           | Y        |
| Record Size              | Y     |           | Y    | Y    |              | Y         |          |
| Reorg Sleep Nsec         |       |           |      | Y    |              |           | Y        |
| Reserved Bytes           | Y     |           | Y    | Y    |              |           | Y        |
| Sleep Spin Count         |       |           |      | Y    |              |           | Y        |
| Sleep Spint Mask         |       |           |      | Y    |              |           | Y        |
| Stats                    | Y     |           | Y    | Y    |              | Y         |          |
| Std Null Coll            | Y     |           | Y    | Y    |              |           | Y        |
| Trigger Flush            |       |           |      | Y    |              |           | Y        |
| Version                  | Y     |           |      | Y    |              |           | Y        |
| Wait Disk                |       |           |      | Y    |              |           | Y        |
| Writes Per Flush         |       |           |      | Y    |              |           | Y        |
