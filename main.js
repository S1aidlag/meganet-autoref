import * as ethers from 'ethers'; // Use namespace import for ethers
import axios from 'axios';
import fs from 'fs';
import readline from 'readline';
import { HttpsProxyAgent } from 'https-proxy-agent'; // Use https-proxy-agent for HTTP proxies
import chalk from 'chalk';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const proxyList = fs.readFileSync('proxy.txt', 'utf8').split('\n').filter(Boolean);

// Function to pick a random proxy
function getRandomProxy() {
    const randomIndex = Math.floor(Math.random() * proxyList.length);
    return proxyList[randomIndex];
}

// Function to generate a new Ethereum wallet
async function generateWallet() {
    const wallet = ethers.Wallet.createRandom();
    return wallet;
}

// Function to make a request using a proxy
async function getWithProxy(url, proxy) {
    try {
        const agent = new HttpsProxyAgent(proxy); // Use HttpsProxyAgent for HTTP proxies
        const response = await axios.get(url, {
            httpsAgent: agent,
            httpAgent: agent,
            headers: getHeaders()
        });
        return response.data;
    } catch (error) {
        console.error(chalk.red(`Proxy ${proxy} failed: ${error.message}`));
        return null;
    }
}

// Function to generate headers for the API request
function getHeaders() {
    return {
        'Host': 'api.meganet.app',
        'Connection': 'keep-alive',
        'sec-ch-ua-platform': '"Windows"',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'Accept': '*/*',
        'Origin': 'https://meganet.app',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://meganet.app/',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9'
    };
}

// Function to save successful wallets to accounts.txt
function saveSuccessWallet(address, privateKey) {
    const data = `Address: ${address}\nPrivate Key: ${privateKey}\n\n`;
    fs.appendFileSync('accounts.txt', data, 'utf8');
}

// Main function
async function main() {
    console.log(chalk.blue.bold('=== Meganet Autoreff ===\n'));

    rl.question(chalk.yellow('Put your ref code: '), async (refcode) => {
        rl.question(chalk.yellow('How many reff? '), async (numAccounts) => {
            rl.question(chalk.yellow('Use proxy? (yes/no): '), async (useProxy) => {
                console.log(chalk.green('\nStarting wallet generation...\n'));

                for (let i = 0; i < numAccounts; i++) {
                    const wallet = await generateWallet();
                    const address = wallet.address;
                    const privateKey = wallet.privateKey;
                    const url = `https://api.meganet.app/wallets?address=${address}&refcode=${refcode}`;

                    if (useProxy.toLowerCase() === 'yes' || useProxy.toLowerCase() === 'y') {
                        const proxy = getRandomProxy(); // Pick a random proxy
                        console.log(chalk.cyan(`Using proxy: ${proxy}`));
                        const result = await getWithProxy(url, proxy);
                        if (result) {
                            console.log(chalk.green(`Account ${i + 1}: ${address} - Success with proxy ${proxy}`));
                            saveSuccessWallet(address, privateKey); // Save successful wallet
                        } else {
                            console.log(chalk.red(`Account ${i + 1}: ${address} - All proxies failed`));
                        }
                    } else {
                        try {
                            const response = await axios.get(url, {
                                headers: getHeaders()
                            });
                            console.log(chalk.green(`Account ${i + 1}: ${address} - Success without proxy`));
                            saveSuccessWallet(address, privateKey); // Save successful wallet
                        } catch (error) {
                            console.error(chalk.red(`Account ${i + 1}: ${address} - Failed without proxy: ${error.message}`));
                        }
                    }
                }

                console.log(chalk.blue.bold('\nWallet generation completed!'));
                console.log(chalk.blue('Successful wallets saved to accounts.txt\n'));
                rl.close();
            });
        });
    });
}

main();
