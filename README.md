# bitcoind-report
This is a command to extract and summarize bitcoind transactions.  It outputs the selected transactions (just address, send/receive, amount, fee, time) to the console (so you can redirect it to a file).  The output is in CSV format, and contains a first row of column headers, totals of the transactions and fees, plus a net total, at the bottom.

Use
```bash
bitcoind-report -h
```
to see a list of the available options.
