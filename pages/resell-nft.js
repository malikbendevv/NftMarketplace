import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { NFTContext } from "../context/NFTContext";
import { Banner, Button, Input } from "../components";
import Image from "next/image";

import images from "../assets";
import { shortenAddress } from "../utils/shortenAddress";
import axios from "axios";

const ResellNFT = () => {
  const { createSale, isLoadingNFT } = useContext(NFTContext);
  const router = useRouter();
  const { tokenId, tokenURI } = router.query;

  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const fetchNFT = async () => {
    const { data } = await axios.get(tokenURI);

    setPrice(data.price);
    setImage(data.image);
  };

  useEffect(() => {
    if (tokenURI) fetchNFT();
  }, [tokenURI]);

  const resell = async () => {
    if (!price) return;
    await createSale(tokenURI, price, true, tokenId);

    router.push("/");
  };

  if (isLoadingNFT) {
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
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full ">
        <h1 className="font-poppins dark:text-white text-nft-black font-semibold text-2xl">
          Ressel NFT
        </h1>

        <Input
          inputType="number"
          title="Price"
          placeholder="NFT Price"
          handleClick={(e) => setPrice(e.target.value)}
        />

        {image && (
          <Image
            src={image}
            className="rounded mt-4"
            width={350}
            height={350}
            alt=""
          />
        )}
        <div className="mt-7 w-full flex justify-end">
          <Button
            btnName="List NFT"
            classStyles="rounded-xl"
            handleClick={resell}
          />
        </div>
      </div>
    </div>
  );
};

export default ResellNFT;
