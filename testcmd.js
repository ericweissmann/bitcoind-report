"use strict"

const fs = require('fs');

const envfile = require('envfile')
const sourcePath = '/root/.bitcoin/bitcoin.conf';

// Parse an envfile path

console.log(
    envfile.parseFileSync(sourcePath)
)
console.log("hello Mr. eric");
// console.log(fs.readFileSync('/root/.bitcoin/bitcoin.conf').toString());

// get config file & display
// parse config file
// connect to bitcoind & display balance
