'use strict';

const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const CREDENTIALS = JSON.parse(String(fs.readFileSync('./credentials.json')));
const UPLOAD_URL = 'CORPUS_URL';

class PageScraper
{

    /**
     * Scrape's the given url and then returns the contents
     * @param url
     * @returns {Promise}
     */
    static scrape(url)
    {
        return new Promise( (resolve, reject)  => {

            let title = '';

            request(url)
                .on('response', (r) => {
                    console.log('content loaded');
                    let $ = cheerio.load(r.body);
                    title = $('title').text();
                })
                .pipe(fs.createWriteStream(title))
                .pipe(request.post({ url:UPLOAD_URL, form: { key:'value' }}, (e, r, b) => {
                    if (e) {
                        console.log(e);
                        reject(e);
                    } else {
                        console.log(b);
                        resolve(r);
                    }
                }));

        });
    }

}

module.exports = PageScraper;


