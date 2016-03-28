'use strict';

const scraper = require('./page-scraper');

scraper.scrape(URL).then(body => {

    converter.convert(body).then(data => {
        console.log(data);
    }).catch(err => {
       console.log(err);
    });

}).catch(err => {

    console.log(err);

});
