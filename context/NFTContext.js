import React, { useState, useEffect } from "react";

import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { MarketAddress, MarketAddressABI } from "./constants";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";

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

  const nftCurrency = "ETH";

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

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const ConnectWallet = async () => {
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
    const price = ethers.utils.parseUnits(formInputPrice, "ether");

    const contract = fetchContract(signer);

    const listingPrice = await contract.getListingPrice();

    const transaction = await contract.createToken(url, price, {
      value: listingPrice.toString(),
    });
    await transaction.wait();
  };

  const fetchNFTs = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();

      const contract = fetchContract(provider);
      const data = await contract.fetchMarketItems();
      console.log({ data });

      const items = await Promise.all(
        data?.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);

            const {
              data: { image, name, description },
            } = await axios.get(tokenURI);

            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              price,
              TokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );
      return items;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMyNFTsOrListedNFTs = async (type) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);

    const data =
      type === "fetchItemsListed"
        ? await contract.fetchItemsListed()
        : await contract.fetchMyNfts;

    const items = await Promise.all(
      data?.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId);

        const {
          data: { image, name, description },
        } = await axios.get(tokenURI);

        const price = ethers.utils.formatUnits(
          unformattedPrice.toString(),
          "ether"
        );

        return {
          price,
          TokenId: tokenId.toNumber(),
          seller,
          owner,
          image,
          name,
          description,
          tokenURI,
        };
      })
    );
    return items;
  };

  const buyNft = async (nft) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      MarketAddress,
      MarketAddressABI,
      signer
    );

    const price = ethers.utils.parseUnits(nft.price, "ether");
    console.log(price);
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });

    await transaction.wait();
  };
  return (
    <NFTContext.Provider
      value={{
        nftCurrency,
        ConnectWallet,
        currentAccount,
        uploadToIPFS,
        createNFT,
        fetchNFTs,
        fetchMyNFTsOrListedNFTs,
        buyNft,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};
