#!/usr/bin/env node

'use strict';

const fs = require('fs');
const argv = require('yargs').argv;
const PageUploader = require('./page-uploader');
const uploader = new PageUploader();
const ParseCSV = require('./parse-csv');

if (argv.help) {

    console.log('user requested help');

} else if (argv.input !== '') {

    fs.createReadStream(argv.input).pipe(new ParseCSV()).on('data', (buffer) => {

        uploader.upload(JSON.parse(buffer.toString())).then(() => {
            console.log("Upload complete!");
        }).catch(err => {
            console.log(err);
        });

    });

}