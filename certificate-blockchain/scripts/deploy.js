async function main() {
  const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");

  const certificateRegistry = await CertificateRegistry.deploy();

  await certificateRegistry.waitForDeployment();

  console.log("Contract deployed to:", await certificateRegistry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});