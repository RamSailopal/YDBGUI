/*
#################################################################
#                                                               #
# Copyright (c) 2022 YottaDB LLC and/or its subsidiaries.       #
# All rights reserved.                                          #
#                                                               #
#   This source code contains the intellectual property         #
#   of its copyright holder(s), and is made available           #
#   under a license.  If you do not know the terms of           #
#   the license, please stop and do not read further.           #
#                                                               #
#################################################################
*/

const {randomBytes} = require('crypto');
const http = require('http');
const fetch = require("node-fetch");

const delay = (time) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
};

const getCssDisplay = async (element) => {
    return await page.$eval(element, function (elem) {
        return window.getComputedStyle(elem).getPropertyValue('display')
    });
};

const getCssColor = async (element) => {
    return await page.$eval(element, function (elem) {
        return window.getComputedStyle(elem).getPropertyValue('color')
    });
};

const getCssBackground = async (element) => {
    return await page.$eval(element, function (elem) {
        return window.getComputedStyle(elem).getPropertyValue('background-color')
    });
};

async function clickOnElement(elem, x = null, y = null) {
    const rect = await page.evaluate(el => {
        const {top, left, width, height} = el.getBoundingClientRect();
        return {top, left, width, height};
    }, elem);
    const _x = x !== null ? x : rect.width / 2;
    const _y = y !== null ? y : rect.height / 2;

    await page.mouse.click(rect.left + _x, rect.top + _y);
}

const randomRegionName = () => {
    return 'R' + randomBytes(6).toString('hex').toUpperCase()
};

const _REST = path => {
    return new Promise(async function (resolve, reject) {
        http.get('http://localhost:8089/api/' + path, res => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    resolve(JSON.parse(data))
                } catch (err) {
                    reject(err)
                }
            });

            res.on('error', err => {
                reject(err)
            })
        })
    });
};

const _RESTpost = (path, data = {}) => {
    return new Promise(async function (resolve, reject) {
        fetch('http://localhost:8089/api/' + path,
            {
                method: "POST",
                body: JSON.stringify(data),
            }).then(async response => resolve(JSON.parse(await response.text()))).catch(err => reject(err))
    })
};

const _RESTdelete = (path, data = {}) => {
    return new Promise(async function (resolve, reject) {
        fetch('http://localhost:8089/api/' + path,
            {
                method: "DELETE",
                body: JSON.stringify(data),
            }).then(async response => resolve(JSON.parse(await response.text()))).catch(err => reject(err))
    })
};

module.exports.delay = delay;
module.exports.getCssDisplay = getCssDisplay;
module.exports.getCssColor = getCssColor;
module.exports.getCssBackground = getCssBackground;
module.exports.randomRegionName = randomRegionName;
module.exports._REST = _REST;
module.exports._RESTpost = _RESTpost;
module.exports._RESTdelete = _RESTdelete;
module.exports.clickOnElement = clickOnElement;
