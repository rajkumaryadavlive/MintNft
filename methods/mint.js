const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Common = require('ethereumjs-common');

const web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;

const coinABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":true,"internalType":"address","name":"_approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":true,"internalType":"address","name":"_operator","type":"address"},{"indexed":false,"internalType":"bool","name":"_approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"},{"indexed":true,"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"CANNOT_TRANSFER_TO_ZERO_ADDRESS","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"NOT_CURRENT_OWNER","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_approved","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"no_of_tokens_to_create","type":"uint256"},{"internalType":"string","name":"_uri","type":"string"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"_name","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_operator","type":"address"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"_interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"_symbol","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"}],"name":"tokensOwned","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const coinAddress = "0xbf98E2c93E59215464cb60efbB2dEe51a3208f62";

const from = '0x7A0Fb15634a9939cA928789ba500749D63899E03'
const privateKey = '4625d266bb4f4088d6d714d4b6036f2a6371f22bb4b225343d4420dde9abb064'

const privateKey1 = Buffer.from(privateKey, 'hex')
const web3js = new web3(
    new web3.providers.HttpProvider(
        "https://bsc-dataseed1.binance.org:443"
    )
);

let Contract = new web3js.eth.Contract(coinABI, coinAddress);
const Mint = async function (address_to, no_of_token_to_create, token_uri) {
    let estimates_gas = await web3js.eth.estimateGas({
        "from": from,
        "to": coinAddress,
        "data": Contract.methods.mint(address_to, no_of_token_to_create, token_uri).encodeABI(),
    });

    let gasLimit = web3js.utils.toHex(estimates_gas * 2);
    let gasPrice_bal = await web3js.eth.getGasPrice();
    let gasPrice = web3js.utils.toHex(gasPrice_bal * 2);
    let v = await web3js.eth.getTransactionCount(from);
    let rawTransaction = {
        "from": from,
        "gasPrice": gasPrice,
        "gasLimit": gasLimit,
        "to": coinAddress,
        "data": Contract.methods.mint(address_to, no_of_token_to_create, token_uri).encodeABI(),
        "nonce": web3js.utils.toHex(v)
    };
    const common = Common.default.forCustomChain('mainnet', {
        name: 'bnb',
        networkId: 56,
        chainId: 56
    }, 'petersburg');
    let transaction = new Tx(rawTransaction, { common });
    transaction.sign(privateKey1);
    let hash = await web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
    console.log(hash)
    const totalsupply = await Contract.methods.totalSupply().call()
    console.log(`Total Supply.................:::::::::`, totalsupply)

    let arr = []

    for (i = parseInt(totalsupply); i > totalsupply - no_of_token_to_create; i--) {
        arr.push(i)
    }
    console.log(arr)
    const balance = await Contract.methods.balanceOf(address_to).call()
    return arr;
}

module.exports =
    { "Mint": Mint }