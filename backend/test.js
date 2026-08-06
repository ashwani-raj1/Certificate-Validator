const contract = require("./blockchain/blockChain");

async function main() {
    try {

        const tx = await contract.addCertificate(
            "CERT001",
            "ABC123HASH"
        );

        await tx.wait();

        console.log("Stored!");

    } catch (err) {

        console.log("Cannot Store:", err.reason || err.shortMessage);

    }

    const hash = await contract.getCertificateHash("CERT001");

    console.log("Blockchain Hash:", hash);
}

main();