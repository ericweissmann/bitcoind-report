
"use strict";

// TODO running balance
// TODO access bitcoind
// TODO deploy
// TODO webrequest

const fs = require('fs');

const envfile = require('envfile');
const bitcoinRpc = require('bitcoin-rpc-promise');
const yargs = require('yargs');
const moment = require('moment');
const _ = require('lodash');

// Fields to include
const outputLayout = {
    address: {
        heading: 'Address'
    },
    category: {
        heading: 'Send/Receive'
    },
    amount: {
        heading: 'Amount',
        format: function (data) {return data.toFixed(8)},
        total: 0
    },
    fee: {
        heading: 'Fee',
        format: function (data) {
            if (!data) return '0.00000000'
            else return data.toFixed(8)
        },
        total: 0
    },
    time: {
        heading: 'Time',
        format: function (data) {
            return moment.unix(data).utc().format()
        }
    }
};

// Output function
let buildStr = '';
function output(theStr) {
    if (buildStr) buildStr = buildStr + ',';
    buildStr = `${buildStr}"${theStr}"`;
};
function finishOutput() {
    console.log(buildStr);
    buildStr = '';
}

function processTxns(inputTxns) {

    // Output the headers
    _.forIn(outputLayout, function (value, key, object) {output(object[key].heading)});
    finishOutput();

    // Output each item
    const includeSend = !(!argv.s && argv.r);
    const includeReceive = !(!argv.r && argv.s);
    let itemMonth, itemYear;

    inputTxns.forEach(function (item, index) {
        itemMonth = moment.unix(item.time).utc().month();
        itemYear = moment.unix(item.time).utc().year();
        if (((includeSend && (item.category == 'send')) || (includeReceive && (item.category == 'receive'))) &&
            (!monthScreen ||(monthScreen &&(year == itemYear) && (month == itemMonth))))
        {
            _.forIn(outputLayout, function (value, key, object)
            {
                if (object[key].format)
                {
                    output(object[key].format(item[key]))
                } else
                {
                    output(item[key]);
                }
                ;
                if (!_.isUndefined(object[key].total) && item[key])
                {
                    object[key].total = object[key].total + item[key];
                }
            });
            finishOutput();
        }
    });

    // output totals
    _.forIn(outputLayout, function (value, key, object) {
        if (object[key].total) {
            output(object[key].format(object[key].total))
        } else {
            output('');
        };
    });
    finishOutput();

    // output grand total (hard coded)
    output('Total (after fees)');
    output('');
    output((outputLayout.amount.total + outputLayout.fee.total).toFixed(8));
    finishOutput();

}


// -----------------------------
// main executable
// -----------------------------

// Get the arguments
const argv = yargs
    .options({
        // o: {
        //     alias: 'output',
        //     describe: 'File to receive report; if blank or not present, console',
        //     string: true
        // },
        m: {
            alias: 'month',
            describe: 'yyyymm/"previous"/"current" (all if not specified)',
            string: true
        },
        s: {
            alias: 'send',
            describe: 'Include "send" transactions only',
            boolean: true
        },
        r: {
            alias: 'receive',
            describe: 'Include "receive" transactions only',
            boolean: true
        }

    })
    .help()
    .alias('h', 'help')
    .strict(true)
    .fail(function (msg, err, yargs) {
        console.error(msg)
        console.error(yargs.help())
        process.exit(1)
    })
    .argv;

// handle the month parameter
let monthScreen = argv.m;
let month = 0;
let year = 1970;
let now = moment().utc();
if (monthScreen == '') {monthScreen = 'current';};
if (monthScreen == 'current') {
    month = now.month();
    year = now.year();
} else if (monthScreen == 'previous') {
    month = now.subtract(1, 'months').utc().month();
    year = now.subtract(1, 'months').utc().year();
} else if (monthScreen) {
    let monthArg = moment(monthScreen, 'YYYYMM');
    if (!monthArg.isValid())
    {
        console.log('Invalid Month -- must be YYYYMM');
        process.exit(1)
    };
    month = monthArg.month();
    year = monthArg.year();
}

// Get the bitcoin configuration
const sourcePath = '/root/.bitcoin/bitcoin.conf';
let bitcoinConfig = envfile.parseFileSync(sourcePath);

// Connect to bitcoind
let btcURL = `http://${bitcoinConfig.rpcuser}:${bitcoinConfig.rpcpassword}@localhost:8332`;
let btc = new bitcoinRpc(btcURL);

//get the transactions
btc.listtransactions('*', 100000)
    .then(result => {
        processTxns(result)
    }).catch(error => console.log('listtransactions failed: ', error))

