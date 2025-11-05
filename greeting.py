#!/usr/bin/env python3
"""
A simple greeting program
"""

def send_greeting(name="World"):
    """Send a friendly greeting"""
    return f"Hello, {name}! Welcome!"

if __name__ == "__main__":
    print(send_greeting())
    print(send_greeting("Friend"))
