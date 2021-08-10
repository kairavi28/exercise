// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const metadataURI = "01234";
  const bardfactoryFactory = await hre.ethers.getContractFactory("BardFactory");
  let bardfactory = await bardfactoryFactory.deploy();
  await bardfactory.deployed();
  await bardfactory.createBard("Bard", "BARD", metadataURI);
  const [bardAddress] = await bardfactory.getDeployedBards();

  console.log("BardFactory to:", bardfactory.address);
  console.log("Bard to:", bardAddress);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
