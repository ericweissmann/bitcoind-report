"use strict"

const fs = require('fs');

const envfile = require('envfile');
const BitcoinRpc = require('bitcoin-rpc-promise');


// Get the bitcoin configuration
const sourcePath = '/root/.bitcoin/bitcoin.conf';
let bitcoinConfig = envfile.parseFileSync(sourcePath);
console.log(bitcoinConfig);

console.log("hello Mr. eric");

// Connect to bitcoind
let btc = new BitcoinRpc(`http://${bitcoinConfig.rpcuser}:${bitcoinConfig.rpcpassword}@localhost:8332`);

// get and print balance
btc.getbalance().then(result => {
    console.log(result);
});
// console.log(fs.readFileSync('/root/.bitcoin/bitcoin.conf').toString());

// get config file & display
// parse config file
// connect to bitcoind & display balance
