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
'use strict';

const async = require('async');
const url = require('url');


const request = require('../utils/utils').httpRequest;

const logger = require('../utils/logger');

function renderViewPage(req, res, next) {
    // Get the ID of the page to update from the request
    let listId = "52deb5f30c2bb052871d6d60683773e8";
    // TODO: replace with common version shared with renderAddItemsPage
    async.parallel({
        list: function(callback) {
            request('GET', '/rest/search/'+listId, null, (err, data) => {
                if (err) {
                    next(err);
                } else {
                    // Parse the JSON object string coming back from the service
                    let jsonData = JSON.parse(data);
                    callback(null, jsonData);
                }
            });
        },
    }, function(err, results) {
        if (err) {
            next(err);
        }
        let month_data = results.list.month;
        let number_of_posts_data = results.list.totalunits;
        console.log(month_data,number_of_posts_data);
        // Now render the page
        res.render('dashboard/barchart', { 
            title: 'IOT BASED ELECTRICITY',  
            datai: JSON.stringify(number_of_posts_data),
            labeli: JSON.stringify(month_data)
        });
    });
}


/**
 * Page to search for Items to add to a shopping list
 * 
 * @param {Request} req - the Request object
 * @param {Response} res - the Response object
 * @param {Object} next - the next middleware function in the req/res cycle
 */
function renderUnitSearchPage(req, res, next) {
    // Get the ID of the page to update from the request
     // Get the data for the list, and if all is well, render the page
    // TODO: Refactor into common method with callback shared with renderViewPage
    async.parallel({
        searchResults: function(callback) {
            let query = url.parse(req.url).query;
            if (query) {
                request('GET', '/rest/unitsearch?'+query, null, (err, data) => {
                    if (err) {
                        next(err);
                    } else {
                        let jsonData = JSON.parse(data);
                        callback(null, jsonData);
                    }
                });
            } else {
                callback(null, { });
            }
        }
    }, function(err, results) {
            if (err) {
                next(err);
            }
            res.render('search', { 
                title: 'IOT BASED ELECTRICITY', 
                searchResults: results.searchResults
            });
        }
    );
}

function rendersearchmonthfind(req, res, next) {
    // Get the ID of the page to update from the request
    let listId = req.params.listId;
    // TODO: replace with common version shared with renderAddItemsPage
    async.parallel({
        list: function(callback) {
            request('GET', '/rest/findsearch/'+listId, null, (err, data) => {
                if (err) {
                    next(err);
                } else {
                    // Parse the JSON object string coming back from the service
                    let jsonData = JSON.parse(data);
                    callback(null, jsonData);
                }
            });
        },
    }, function(err, results) {
        if (err) {
            next(err);
        }
        let noofdays_data = results.list.noofdays;
        let daysunit_data = results.list.daysunit;
       console.log(noofdays_data,daysunit_data);
        // Now render the page
        res.render('dashboard/linechart', { 
            title: 'IOT BASED ELECTRICITY',  
               unitsi: JSON.stringify(daysunit_data),
                daysi: JSON.stringify(noofdays_data)
        });
    });
}

/**
 * Perform items search
 * This is a function chain:
 * Validation input fields
 * Sanitize input fields
 * If errors, render page with errors
 * Else call the /rest/list REST service to create the list, 
 * then redirects back to the main page
 * 
 * @param {Request} req - the Request object
 * @param {Response} res - the Response object
 * @param {Object} next - the next middleware function in the req/res cycle
 */
const viewunitSearch = [
    // Sanitize fields.

    // Send the request!
    (req, res, next) => {
        let consumerID = req.body.consumerID;
        res.redirect('/search?consumerID='+consumerID);
    }
];

const viewmonthfind = [
    // Sanitize fields.

    // Send the request!
    (req, res, next) => {
        let month = req.body.month;
        let listId = req.params.listId;
        res.redirect('/search/'+listId+'/monthfind?month='+month);
    }
];

function rendermonthSearch(req, res, next) {
    // Get the ID of the page to update from the request
     // Get the data for the list, and if all is well, render the page
    // TODO: Refactor into common method with callback shared with renderViewPage
                request('GET', '/rest/daysearch', null, (err, data) => {
                    if (err) {
                        next(err);
                    } else {
            let jsonData = JSON.parse(data);
            console.log(jsonData);
            res.render('month', { 
                title: 'IOT BASED ELECTRICITY', data:jsonData[0]});
        }
    });
}

// Pages

module.exports.read = renderViewPage;
module.exports.unitSearch = renderUnitSearchPage;// input search criteria
module.exports.searchmonthfind=rendersearchmonthfind;

// Services

module.exports.viewunitSearch = viewunitSearch;// perform item search
module.exports.viewmonthSearch=rendermonthSearch;
module.exports.viewmonthfind=viewmonthfind;
