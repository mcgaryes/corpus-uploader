'use strict';

const Transform = require('stream').Transform;
const util = require('util');

class ParseCSV
{
    constructor(options)
    {
        Transform.call(this, options);
    }

    _transform(chunk, encoding, callback)
    {
        let lines = String(chunk).split('\n');

        let entries = [];

        lines.forEach((line,index) => {
            if (index != 0) {
                let entry = {};
                entry[lines[0].split(',')[0]] = line.split(',')[0];
                entry[lines[0].split(',')[1]] = line.split(',')[1];
                entries.push(entry);
            }
        });

        let buffer = new Buffer(JSON.stringify(entries));
        this.push(buffer);
        callback();
    }
}

util.inherits(ParseCSV, Transform);

module.exports = ParseCSV;


