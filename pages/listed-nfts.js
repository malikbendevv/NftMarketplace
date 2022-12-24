import React, { useState, useEffect, useContext } from "react";

import { NFTContext } from "../context/NFTContext";
import { NFTCard } from "../components";
import Loader from "../components";
import Image from "next/image";
import images from "../assets";

const ListedNFTs = () => {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const { fetchMyNFTsOrListedNFTs } = useContext(NFTContext);

  useEffect(() => {
    fetchMyNFTsOrListedNFTs("fetchItemsListed").then((items) => {
      setNfts(items);
      setisLoading(false);
      console.log(items);
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

  if (!isLoading && nfts.length === 0) {
    return (
      <div className="flexCenter sm:p-4 p16 min-h-screen">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-3xl font-extrabold">
          No Nfts Listed for sale
        </h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12 min-h-screen">
      <div className="w-full minmd:w-4/5">
        <div className=" font-poppins dark:text-white text-nft-black-1 text-2xl font-semibold mt-2 ml-4 sm:ml-2">
          <h2>Nfts listed for sale</h2>
          <div className="mt-3 w-full flex-wrap justify-start md:jsutify-center">
            {nfts?.map((nft) => (
              <NFTCard key={nft.tokenId} nft={nft} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListedNFTs;
