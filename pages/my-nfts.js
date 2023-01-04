import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { NFTContext } from "../context/NFTContext";
import { Banner, NFTCard } from "../components";
import Loader from "../components";

import images from "../assets";
import { shortenAddress } from "../utils/shortenAddress";

const MyNfts = () => {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { fetchMyNFTsOrListedNFTs, currentAccount } = useContext(NFTContext);

  useEffect(() => {
    fetchMyNFTsOrListedNFTs().then((items) => {
      setNfts(items);
      setIsLoading(false);
      console.log("from my nft", items);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <div className="flexCenter w-full my-4">
          <Image
            src={images.loader}
            alt="loader"
            width={100}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-start items-center flex-col min-h-screen">
      <div className="w-full flexCenter flex-col">
        <Banner
          name="Your Nifty NFTs"
          childStyles="text-center mb-4"
          parentStyles="h-80 justify-center"
        />
        <div className="flexCenter flex-col -mt-20  z-0">
          <div className="flexCenter w-40 h-40 sm:w-36 sm:h-36 p-1 bg-nft-black-2 rounded-full">
            <Image
              src={images.creator1}
              alt="creator"
              className="rounded-full object-cover"
              style={{ objectFit: "cover" }}
            />
          </div>
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6">
            {shortenAddress(currentAccount)}
          </p>
        </div>
      </div>
      {!isLoading && !nfts.length ? (
        <div className="flexCenter sm:p-4 p-16">
          <h1 className="font-poppins dark:text-white text-nft-black-1 font-extrabold text-3xl ">
            No NFTs Owned
          </h1>
        </div>
      ) : (
        <div className="px-4 p-12 w-full minmd:w-4/5 flexCenter flex-col">
          <div className="flex-1 w-full flex flex-row sm:flex-col px-4 xs:px-0 minlg:px-8">
            SearchBar
          </div>
          <div className="mt-3 w-full flex flex-wrap">
            {console.log("Nfts from my nft", nfts)}
            {nfts.map((nft) => (
              <NFTCard key={nft.token} nft={nft} onProfilePage />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNfts;
