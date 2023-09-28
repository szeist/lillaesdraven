const keythereum = require("keythereum");

function generateWallet() {
    const params = { keyBytes: 32, ivBytes: 16 };
    const dk = keythereum.create(params);

    const privateKey = dk.privateKey.toString('hex');
    const address = `${keythereum.privateKeyToAddress(dk.privateKey)}`;

    console.log(`Private Key: ${privateKey}`);
    console.log(`Address: ${address}`);
}

// Generate two wallets
generateWallet();
generateWallet();

