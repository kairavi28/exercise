const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContract } = require("ethereum-waffle");
const BardArtifact = require("../src/artifacts/contracts/Bard.sol/Bard.json");
const BardFactoryArtifact = require("../src/artifacts/contracts/Bard.sol/BardFactory.json");

describe("Bard", () => {
  let bardFactory,
    bard,
    bard2,
    wallet,
    wallet2,
    walletAddr,
    walletAddr2,
    signers,
    bardAddress;
  const metadataURI = "01234";

  beforeEach(async () => {
    signers = await ethers.getSigners();
    wallet = signers[0];
    wallet2 = signers[1];
    walletAddr = await wallet.getAddress();
    walletAddr2 = await wallet2.getAddress();
    bardFactory = await deployContract(wallet, BardFactoryArtifact);
    await bardFactory.createBard("Bard", "BARD", metadataURI);
    [bardAddress] = await bardFactory.getDeployedBards();
    bard = new ethers.Contract(bardAddress, BardArtifact.abi, wallet);
    bard2 = new ethers.Contract(bardAddress, BardArtifact.abi, wallet2);
  });

  it("mints single token", async () => {
    const promises = [
      await bard.mint(0, 6),
      await bard.balanceOf(walletAddr, 0),
      await bard.tokenSupply(0),
    ];
    const [_, albumCount, tokenSupply] = await Promise.all(promises);
    expect(albumCount).to.eq(6);
    expect(tokenSupply).to.eq(6);
  });

  it("batch mints multiple tokens", async () => {
    // 1. Create tokens using bard.mintBatch()
    // 2. Using bard.balanceOfBatch() assert the balance of all token holders to be as expected
    // 3. Using bard.tokenSupply assert that the tokenSupply for each tokenID should be as expected.
  });
  it("manager or approved address can set prices for assets", async () => {
    const setPrices = [
      bard.setPrice(0, 1),
      bard.setPrice(1, 2),
      bard.setPrice(2, 3),
      bard.setPrice(3, 4),
      bard.setPrice(4, 5),
    ];
    await Promise.all(setPrices);
    const getPrices = [
      bard.tokenPrices(0),
      bard.tokenPrices(1),
      bard.tokenPrices(2),
      bard.tokenPrices(3),
      bard.tokenPrices(4),
    ];
    const [album, song, video, screenplay, book] = await Promise.all(getPrices);
    expect(album).to.eq(1);
    expect(song).to.eq(2);
    expect(video).to.eq(3);
    expect(screenplay).to.eq(4);
    expect(book).to.eq(5);
  });

  it("sell individual tokens", async () => {
    // 1. Create tokens using bard.mintBatch
    // 2. Using bard.setPrice, set the price for each token created above
    // 3. Customer creates an order using bard2.customerDeposit for tokens created previously.
    //    customer will have to send ether >= token price
    // 4. Using bard.getCustomerDeposit() assert that the price set while creating an order
    //    is as expected
    // 5. Assert that and Event called Order gets emitted when bard2.customerDeposit is called
    // 6. Call bard.fillOrder to fill one of the above created order
    // 7. Assert the balance of tokens for bard and bard2.
  });

  it("batch sell tokens", async () => {
    const actions = [
      bard.mintBatch([0, 1], [10, 10 ** 5]),
      bard.setPrice(0, 1),
      bard.setPrice(1, 2),
    ];
    await Promise.all(actions);

    await bard2.customerDepositBatch([0, 1], [1, 1], {
      value: ethers.utils.parseEther("3"),
    });

    const getDeposits = [
      bard.getCustomerDeposit(walletAddr2, 0),
      bard.getCustomerDeposit(walletAddr2, 1),
    ];
    const [dep0, dep1] = await Promise.all(getDeposits);

    expect(dep0).to.eq(1);
    expect(dep1).to.eq(1);

    bard.on("OrderBatch", async (_customer, _ids, _amounts) => {
      await bard.fillOrderBatch(_customer, _ids, _amounts);

      const balances = [
        bard2.balanceOf(walletAddr, 0),
        bard.balanceOf(walletAddr2, 0),
        bard2.balanceOf(walletAddr, 1),
        bard.balanceOf(walletAddr2, 1),
      ];
      const [mgrBal0, custBal0, mgrBal1, custBal1] = await Promise.all(
        balances
      );
      expect(mgrBal0).to.eq(9);
      expect(custBal0).to.eq(1);
      expect(mgrBal1).to.eq(99999);
      expect(custBal1).to.eq(1);
    });
  });

  it("has unique URI metadata for each token", async () => {
    const urlArr = [
      bard.uri(0),
      bard.uri(1),
      bard.uri(2),
      bard.uri(3),
      bard.uri(4),
    ];
    const [uri_0, uri_1, uri_2, uri_3, uri_4] = await Promise.all(urlArr);
    const getURI = [
      bard.getURI(uri_0, 0),
      bard.getURI(uri_1, 1),
      bard.getURI(uri_2, 2),
      bard.getURI(uri_3, 3),
      bard.getURI(uri_4, 4),
    ];
    const [album, song, video, screenplay, book] = await Promise.all(getURI);
    expect(album).to.eq(`${metadataURI}/0.json`);
    expect(song).to.eq(`${metadataURI}/1.json`);
    expect(video).to.eq(`${metadataURI}/2.json`);
    expect(screenplay).to.eq(`${metadataURI}/3.json`);
    expect(book).to.eq(`${metadataURI}/4.json`);
  });
  it("can reset URI", async () => {
    await bard.setURI(
      `https://ipfs.io/ipfs/QmRa52zzgCq2Vsaxb8nUxUVmpYhsULKtHtkCFPskL39aFK`
    );
    const uri = await bard.uri(0);
    expect(await bard.getURI(uri, 0)).to.eq(
      `https://ipfs.io/ipfs/QmRa52zzgCq2Vsaxb8nUxUVmpYhsULKtHtkCFPskL39aFK/0.json`
    );
    await bard.setURI(metadataURI);
    const resetURI = await bard.uri(0);
    expect(await bard.getURI(resetURI, 0)).to.eq(`${metadataURI}/0.json`);
  });
});
