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

const fs = require('fs');
const path = require('path');

const header = [
    '<!--\n',
    '/****************************************************************\n',
    '*                                                              *\n',
    '* Copyright (c) 2022 YottaDB LLC and/or its subsidiaries.      *\n',
    '* All rights reserved.                                         *\n',
    '*                                                              *\n',
    '* This source code contains the intellectual property          *\n',
    '* of its copyright holder(s), and is made available            *\n',
    '* under a license.  If you do not know the terms of            *\n',
    '* the license, please stop and do not read further.            *\n',
    '*                                                              *\n',
    '****************************************************************/\n',
    '-->\n',
    '\n',
    '## TESTING\n',
    '\n',
    'The testing is performed by the means of standard Java Script testing tools: chai and puppeteer.\n',
    'While chai manages the tests, puppeteer provides a headless Chrome browser with DOM access, to inspect graphic elements.\n',
    '\n',
    'We test Client and Server independently, in the following way:\n',
    '\n',
    '### Client\n',
    '\n',
    'The Client testing is performed by generating different mock data in the `app.system` object, thus emulating multiple server responses scenario\'s. Each test number generates a different response, stimulating the interface to react according, so that we can inspect the graphic elements and determine the validity of the test.\n',
    '\n',
    '### Server\n',
    '\n',
    'The Server testing is not using the interface at all and is fully focused on the response returned by the REST call. By modifying the database structure, using OS or YDB MUPIP calls, we alter the REST response, so that we can analyze it and determine the validity of the test.];\n',
    '\n\n',
];

let result = [].concat(header);

// ****************************
// Client
// ****************************
let filesList = [];

result.push('# **CLIENT**\n\n');

walkSync('wwwroot/test/test_files/client');

let filesData = [];
filesList.forEach(file => {
    filesData.push(parseFile(file));
});

filesData.sort((a, b) => {
    if (a.max < b.min) return -1;
    if (a.min > b.max) return 1;
    return 0
});

filesData.forEach(el => {
    result = result.concat(el.result)
});

// ****************************
// Server
// ****************************
filesList = [];

result.push('# **SERVER**\n\n');

walkSync('wwwroot/test/test_files/server');

filesData = [];
filesList.forEach(file => {
    filesData.push(parseFile(file));
});

filesData.sort((a, b) => {
    if (a.min < b.max) return -1;
    if (a.max > b.min) return 1;
    return 0
});

filesData.forEach(el => {
    result = result.concat(el.result)

});

// write to file
const destinationFile = 'wwwroot/test/README.md';
fs.writeFileSync(destinationFile, result.join(''));

console.log('File: ' + destinationFile + ' successful created...\n');

// *********************
// Local functions
// *********************
function walkSync(currentDirPath) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        let filePath = path.join(currentDirPath, name);
        let stat = fs.statSync(filePath);

        if (stat.isFile()) {
            filesList.push(filePath)

        } else if (stat.isDirectory()) {
            walkSync(filePath);
        }
    });
}

function parseFile(file) {
    const fileData = fs.readFileSync(file).toString().split('\n');
    let result = [];
    let min = 999999;
    let max = 0;
    const tableHeader = [
        '| Number | Description |\n',
        '| :---:| ---      |\n'
    ];

    fileData.forEach(line => {
        if (line.indexOf('describe') === 0) {
            const start = line.indexOf(': ') + 2;
            const end = line.lastIndexOf('"');
            const header = line.substring(start, end);

            result.push('\n#### ' + header + '\n\n');
            result = result.concat(tableHeader)

        } else if (line.indexOf('it(') > -1) {
            let start = line.indexOf('# ') + 2;
            let end = line.indexOf(':');
            const testNumber = parseInt(line.substring(start, end));
            if (testNumber < min) min = testNumber;
            if (testNumber > max) max = testNumber;

            start = line.indexOf(': ') + 2;
            end = line.lastIndexOf('"');
            const testDescription = line.substring(start, end);

            result.push('| ' + testNumber + ' | ' + testDescription + '|\n')
        }
    });

    result.push(' \n');

    return {
        min: min,
        max: max,
        result: result
    }
}
