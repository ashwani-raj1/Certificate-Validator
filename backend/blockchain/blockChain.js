require("dotenv").config();

const { ethers } = require("ethers");
const abi = require("./abi.json").abi;

const provider = new ethers.JsonRpcProvider( // this will help my backend to connect with sepolia test network
    process.env.SEPOLIA_RPC_URL //API URL of an Ethereum node provider like Alchemy.
);

const wallet = new ethers.Wallet( //Creates a wallet object using the private key
    process.env.PRIVATE_KEY,
    provider //Connects this wallet with the Sepolia provider.
);

const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS, //address where my CertificateRegistry contract is deployed.
    abi, //tells Ethers.js which functions are present.
    wallet //allows calling both read and write functions.
);

module.exports = contract;