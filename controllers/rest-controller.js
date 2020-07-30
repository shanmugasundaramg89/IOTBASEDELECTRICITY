/*
   Copyright 2018 Makoto Consulting Group, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/**
 * Controller for the Shopping List application's
 * REST interface.
 */

const url = require('url');

const logger = require('../utils/logger');
//logger.setLogLevel(logger.Level.DEBUG);

const utils = require('../utils/utils');
const listsDao = require('../models/lists-dao');
const itemsDao = require('../models/items-dao');


function read(req, res, next) {
    let listId = req.params.listId;
    listsDao.findById(listId).then((result) => {
        utils.writeServerJsonResponse(res, result.data, result.statusCode);
    }).catch((err) => {
        next(err);
    });
}

function readall(req, res, next) {
    let listId = req.params.listId;
    listsDao.findById(listId).then((result) => {
        utils.writeServerJsonResponse(res, result.data, result.statusCode);
    }).catch((err) => {
        next(err);
    });
}
/**
 * 
 * @param {Request} req - the Request object
 * @param {Response} res - the Response object
 * @param {Object} next - the next middleware function in the req/res cycle
 */
function unitSearch(req, res, next) {
    let query = url.parse(req.url, true).query;
    if (query.consumerID) {
        // Query DAO: 
        itemsDao.findByDescription(query.consumerID).then((result) => {
            utils.writeServerJsonResponse(res, result.data, result.statusCode);
        }).catch((err) => {
            next(err);
        });
    // By upc?
    } else {
        let message = `Unsupported search param: ${query}`;
        logger.error(message, 'itemSearch()');
        next(message);
    }
}

function findSearch(req, res, next) {
    let query = url.parse(req.url, true).query;
    if (query.month) {
        // Query DAO: 
        itemsDao.findByMonth(query.month).then((result) => {
            utils.writeServerJsonResponse(res, result.data, result.statusCode);
        }).catch((err) => {
            next(err);
        });
    // By upc?
    } else {
        let message = `Unsupported search param: ${query}`;
        logger.error(message, 'itemSearch()');
        next(message);
    }
}
function daySearch(req, res, next) {
    listsDao.fetchAll().then((result) => {
        logger.debug(`Writing JSON response: ${JSON.stringify(result)}`, 'fetchAll()');
        utils.writeServerJsonResponse(res, result.data, result.statusCode);
    }).catch((err) => {
        next(err);
    });
}


module.exports.read = read;
module.exports.readall=readall;
module.exports.unitSearch = unitSearch;
module.exports.daySearch=daySearch;
module.exports.findSearch=findSearch;
