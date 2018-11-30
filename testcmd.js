"use strict"

const fs = require('fs');

const envfile = require('envfile');
const bitcoinRpc = require('bitcoin-rpc-promise');


// Get the bitcoin configuration
const sourcePath = '/root/.bitcoin/bitcoin.conf';
let bitcoinConfig = envfile.parseFileSync(sourcePath);
console.log(bitcoinConfig);

console.log("hello Mr. eric");

// Connect to bitcoind
let btcURL = `http://${bitcoinConfig.rpcuser}:${bitcoinConfig.rpcpassword}@localhost:8332`;
console.log('siging in to: ', btcURL)
let btc = new bitcoinRpc(btcURL);

// get and print balance
btc.getbalance().then(result => {
    console.log(result);
});

//get 10 transactions
btc.listtransactions('*', 10)
    .then(result => {
        console.log(result);
        console.log('get the blocktime', result[0].blocktime);
    }).catch(error => console.log('listtransactions failed: ', error))
// console.log(fs.readFileSync('/root/.bitcoin/bitcoin.conf').toString());

