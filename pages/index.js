import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { abi, contractAddress } from "./constants.js";
import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  // allows us to keep track of the state between renders
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();

  async function connect() {
    if (typeof window.ethereum != "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setIsConnected(true);
      try {
        let connectedProvider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        setSigner(connectedProvider.getSigner());
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnect(f);
    }
  }

  // fund function
  // For this demo, I will simply fund a fixed amount behind the scene.
  async function fund(/*ethAmount*/) {
    //const ethAmount = document.getElementById("ethAmount").value;
    const ethAmount = "5";
    console.log("fund being called");
    if (typeof window.ethereum != "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const transactionResponse = await contract.fund({
          value: ethers.utils.parseEther(ethAmount),
        });
        await listenForTransactionMine(transactionResponse, provider);
        console.log("Done!");
        document.getElementById("display-area").innerHTML = "Done!";
      } catch (error) {
        console.log(error);
      }
    } else {
      fundButton.innerHTML = "Please install Metamask";
    }
  }

  function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    return new Promise((resolve, reject) => {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations`
        );
        resolve();
      });
    });
  }

  return (
    <div className={styles.container}>
      {isConnected ? (
        <>
          <text>
            Already connected to wallet! Select Fund to fund the contract or Get
            Balance to get the current balance of the contract.
          </text>
          <button onClick={() => fund()}>Fund</button>
          <div id="display-area"> </div>
        </>
      ) : (
        <>
          <text>
            This is a quick PoC of Next.js and Ethers frame. Select Connect to
            the connect to Metamask.
          </text>
          <button onClick={() => connect()}>Connect</button>
        </>
      )}
    </div>
  );
}
