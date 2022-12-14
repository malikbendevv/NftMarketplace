import React, { useState, useEffect } from "react";

import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { MarketAddress, MarketAddressABI } from "./constants";
import { create as ipfsHttpClient } from "ipfs-http-client";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const projectSecretKey = process.env.NEXT_PUBLIC_PROJECT_KEY;

const authorization = `Basic ${Buffer.from(
  `${projectId}:${projectSecretKey}`
).toString("base64")}`;

const options = {
  host: "ipfs.infura.io",
  protocol: "https",
  port: 5001,
  headers: { authorization },
};

const client = ipfsHttpClient(options);

const dedicatedEndPoint = "https://malikben.infura-ipfs.io";

export const NFTContext = React.createContext();

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");

  const nftCurrency = "JSM TOKEN";

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert("Please install Metamask");
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log("No accounts found");
    }

    console.log({ accounts });
  };

  const ConnectWallet = async () => {
    console.log("frome here");
    if (!window.ethereum) return alert("Please install Metamask");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setCurrentAccount(accounts[0]);
    window.location.reload();
  };

  const uploadToIPFS = async (file) => {
    try {
      console.log(projectId, projectSecretKey);
      const added = await client.add({ content: file });
      console.log(2);
      console.log({ added });
      const url = `${dedicatedEndPoint}/ipfs/${added.path}`;

      console.log(3);
      return url;
    } catch (error) {
      console.log(error, "error uplaoding files to ipfs");
    }
  };

  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) return;

    const data = JSON.stringify({ name, description, image: fileUrl });
    try {
      const added = await client.add(data);
      console.log({ added });

      const url = `${dedicatedEndPoint}/ipfs/${added.path}`;

      await createSale(url, price);

      router.push("/");
    } catch (error) {
      console.log(error, "error uplaoding files to ipfs");
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    console.log(11);
    const price = ethers.utils.parseUnits(formInputPrice, "ether");
    console.log({ price });
    const contract = fetchContract(signer);
    console.log(12);

    const listingPrice = await contract.getListingPrice();
    console.log(13);

    const transaction = await contract.createToken(url, price, {
      value: listingPrice.toString(),
    });
    console.log(14);
    await transaction.wait();
    console.log(15);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <NFTContext.Provider
      value={{
        nftCurrency,
        ConnectWallet,
        currentAccount,
        uploadToIPFS,
        createNFT,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};
