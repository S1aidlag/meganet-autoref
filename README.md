# Meganet Autoreff

A script to automate Meganet wallet creation and registration using referral codes.

---

## Features
- **Wallet Generation**: Automatically generates Ethereum wallets.
- **Referral Registration**: Registers wallets with Meganet using a referral code.
- **Proxy Support**: Supports HTTP proxies for anonymity.
- **Logging**: Saves successful wallets to `accounts.txt`.

---

## Prerequisites
- Node.js (v18 or higher)
- npm (Node Package Manager)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/s1aidlag/meganet-autoref.git
   cd meganet-autoref
   
2. Install dependencies:
   ```bash
   npm install
   
3. Add your proxies to proxy.txt (one proxy per line):
   ```bash
   http://username:password@ip:port
   http://username:password@ip:port

## Usage
1. Run the script:
    ```bash
    npm start
2. Follow the prompts:

Put your ref code: Enter your  referral code.

How many reff?: Enter the number of wallets to create.

Use proxy? (yes/no): Choose whether to use proxies.

Successful wallets will be saved to accounts.txt.
