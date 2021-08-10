import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import Bard from "./artifacts/contracts/Bard.sol/Bard.json";

const bardAddress = "0xa769f59b5C5d40DF4e17CB6282AE7029765F7C10";

function App() {
  const [tokenID, setTokenID] = useState();
  const [tokenAmount, setTokenAmount] = useState();

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function fetchTokenData() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const bardContract = new ethers.Contract(bardAddress, Bard.abi, provider);
      try {
        const signer = provider.getSigner();
        console.log(bardContract)
        const balance = await bardContract.balanceOf(
          await signer.getAddress(),
          ethers.BigNumber.from(tokenID)
        );
        const tokenSupply = await bardContract.tokenSupply(tokenID);
        console.log("Balance: ", balance.toString());
        console.log("tokenSupply: ", tokenSupply.toString());
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  async function mintToken() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const bardContract = new ethers.Contract(bardAddress, Bard.abi, signer);
      const transaction = await bardContract.mint(tokenID, tokenAmount);
      await transaction.wait();
      console.log(
        `Token ID : ${tokenID} with amount ${tokenAmount} successfully minted for ${await signer.getAddress()}`
      );
      fetchTokenData()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Please watch the output in inspect window</p>
        <p>Mint Single Token (Example)</p>
        <p style={{ fontSize: "medium" }}>Mint</p>
        <input
          onChange={(e) => setTokenID(e.target.value)}
          placeholder="Token ID"
        />
        <input
          onChange={(e) => setTokenAmount(e.target.value)}
          placeholder="Token Amount"
        />
        <button onClick={mintToken}>Mint Token</button>
        <p style={{ fontSize: "medium" }}>Fetch Single Token Data</p>
        <input
          onChange={(e) => setTokenID(e.target.value)}
          placeholder="Token ID"
        />
        <button onClick={fetchTokenData}>Fetch Token Data</button>
        <p>Mint tokens in batch</p>
        <p style={{fontSize:"medium"}}>
          Add your code in src/App.js
        </p>
      </header>
    </div>
  );
}

export default App;
