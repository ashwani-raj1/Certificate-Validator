async function main() {
  const CertificateRegistry = await ethers.getContractFactory( //- Factory is used to deploy a new contract instance.
    "CertificateRegistry",
  );

  const certificateRegistry = await CertificateRegistry.deploy();

  await certificateRegistry.waitForDeployment();

  console.log("Contract deployed to:", await certificateRegistry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Command to deploy:
// npx hardhat run scripts/deploy.js --network sepolia
