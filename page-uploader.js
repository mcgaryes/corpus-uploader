'use strict';

const request = require('request');
const watson = require('watson-developer-cloud');
const fs = require('fs');
const credentials = JSON.parse(String(fs.readFileSync('./credentials.json')));
const slugify = require('slug');

var conceptInsights = watson.concept_insights({
    username: credentials.username,
    password: credentials.password,
    version: 'v2'
});


class PageUploader
{
    upload(pages)
    {
        this.pages = pages;
        this.currentPage = 0;
        this.uploadPage();
        return new Promise((resolve,reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
    
    uploadPage()
    {

        if (this.currentPage === this.pages.length) {
            this.resolve();
            return;
        }

        let page = this.pages[this.currentPage];

        console.log(`Downloading ${page.url}...`);

        request(page.url, (error, response, body) => {


            if (error) {
                console.log(error);
                this.currentPage++;
                this.uploadPage();
                return;
            }

            console.log(`Page downloaded.`);

            let slug = slugify(page.title);
            let params = {
                id: `/corpora/${config.accountId}/my_corpus/documents/${slug}`,
                document: {
                    label: page.name,
                    parts: [
                        {
                            name: `${slug}-part1`,
                            'content-type': 'text/plain',
                            data: body
                        }
                    ]
                }
            };

            console.log(`Creating document with id ${params.id}...`);

            conceptInsights.corpora.createDocument(params, (err,res) => {

                if (err) {

                    this.reject(err);

                } else {

                    console.log('Document created...');

                    console.log(`Created ${this.currentPage + 1} of ${this.pages.length} documents.`);
                    this.currentPage++;
                    this.uploadPage();

                }
            });

        });
    }
}

module.exports = PageUploader;