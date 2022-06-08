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

module.exports.delay = delay;
module.exports.getCssDisplay = getCssDisplay;
module.exports.getCssColor = getCssColor;
module.exports.getCssBackground = getCssBackground;