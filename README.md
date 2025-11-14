# Token Utility

This repository contains a small command line tool for managing a rotating
request token.  The `i.py` script stores the token in `token.json`, lets you set
or clear the value, and can validate the token by issuing a HEAD request against
a target endpoint.  Run `python i.py --help` to see the available commands.
