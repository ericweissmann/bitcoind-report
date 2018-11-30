"use strict"

const fs = require('fs');

console.log("hello Mr. eric");
console.log(fs.readFileSync('/root/.bitcoin/bitcoin.conf'));

// get config file & display
// parse config file
// connect to bitcoind & display balance
