const Web3 = require('web3').Web3;
const abi = require('../build/contracts/SharedWallet.json').abi;

const inputData = '0xb504cd1e000000000000000000000000e6fe9d329417ce5d302b4b29777eb070036a63e200000000000000000000000000000000000000000000000000071afd498d0000'

const web3 = new Web3();
const contract = new web3.eth.Contract(abi);

// Extract the function signature hash from the input data
const functionSignature = inputData.slice(0, 10);

// Find the corresponding ABI entry
const functionAbi = abi.find(abiEntry => 
    abiEntry.type === "function" && 
    functionSignature === web3.eth.abi.encodeFunctionSignature(abiEntry)
);

console.log("Function Signature:", functionSignature);
console.log("Function ABI:", abi);

if (!functionAbi) {
    console.error("Function not found in ABI");
    return;
}

// Decode the input data
const decodedData = web3.eth.abi.decodeParameters(functionAbi.inputs, inputData.slice(10));

console.log("Function Name:", functionAbi.name);
console.log("Decoded Input Data:", decodedData);
