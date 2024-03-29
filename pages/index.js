/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Banner, NFTCard, SearchBar } from "../components";
import CreatorCard from "../components/CreatorCard";
import images from "../assets";
import { makeId } from "../utils/makeId";
import { getCreators } from "../utils/getTopCreators";

import { NFTContext } from "../context/NFTContext";
import { shortenAddress } from "../utils/shortenAddress";

const Home = () => {
  const [hideButtons, sethideButtons] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [activeSelect, setActiveSelect] = useState("Recently added");

  const { theme } = useTheme();
  const parentRef = useRef(null);
  const scrollRef = useRef(null);

  const { fetchNFTs } = useContext(NFTContext);

  const handleScroll = (direction) => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 120 : 210;
    if (direction === "left") {
      current.scrollLeft -= scrollAmount;
    } else if (direction === "right") {
      current.scrollLeft += scrollAmount;
    }
  };

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;
    if (current?.scrollWidth >= parent?.offsetWidth) {
      sethideButtons(false);
    } else {
      sethideButtons(true);
    }
  };

  useEffect(() => {
    fetchNFTs().then((items) => {
      setNfts(items);
      setNftsCopy(items);
      setisLoading(false);
      console.log(items);
    });
  }, []);

  useEffect(() => {
    isScrollable();
    window.addEventListener("resize", isScrollable);

    return () => {
      window.removeEventListener("resize", isScrollable);
    };
  });

  useEffect(() => {
    const sortedNfts = [...nfts];
    switch (activeSelect) {
      case "Price (low to high)":
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      case "Price (high to low)":
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      case "Recently added":
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        break;
    }
  }, [activeSelect]);

  const onHandleSearch = (value) => {
    const filteredNfts = nfts.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredNfts.length) {
      setNfts(filteredNfts);
    } else {
      // re-show all nfts
      setNfts(nftsCopy);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  const creators = getCreators(nftsCopy);
  console.log("topCreators", creators);
  return (
    <div className=" justify-center sm:px-4 p-12 ">
      <div className="w-full minmd:w-4/5">
        <Banner
          name={
            <>
              Discover, collect, and sell <br /> extraordinary NFTs
            </>
          }
          childStyles="md-text-4xl sm:text-2xl xs:text-xl text-left"
          parentStyles="justify-start mb-9 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl "
        />
        {!isLoading && !nfts.length ? (
          <h1
            className=" font-poppins
          dark:text-white
          text-nft-black-1
          text-2xl
          minlg:text-4xl
          font-semibold
          ml-4
          xs:ml-0"
          >
            That's weird... No Nfts for sale!
          </h1>
        ) : isLoading ? (
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
        ) : (
          <>
            <div>
              <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold xs:ml-0">
                top SELLERS{" "}
              </h1>

              <div
                className="relative flex-1 max-w-full flex mt-3"
                ref={parentRef}
              >
                <div
                  className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none"
                  ref={scrollRef}
                >
                  {creators.map((creator, i) => (
                    <CreatorCard
                      key={creator.seller}
                      rank={i + 1}
                      creatorImage={images[`creator${i + 1}`]}
                      creatorName={shortenAddress(creator?.seller)}
                      creatorEths={creator.sumall}
                    />
                  ))}
                  {/* {[6, 7, 8, 9, 10].map((i) => (
                  <CreatorCard
                    key={`creator-${i}`}
                    rank={i}
                    creatorImage={images[`creator${i}`]}
                    creatorName={`0x${makeId(3)}...${makeId(4)}`}
                    creatorEths={10 - i * 0.534}
                  />
                ))} */}
                  {!hideButtons && (
                    <>
                      <div
                        className=" absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0"
                        onClick={() => {
                          handleScroll("left");
                        }}
                      >
                        <Image
                          src={images.left}
                          fill
                          alt="left_arrow"
                          className={
                            theme === "light" ? "filter invert" : undefined
                          }
                        />
                      </div>{" "}
                      <div
                        className=" absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0"
                        onClick={() => {
                          handleScroll("right");
                        }}
                      >
                        <Image
                          src={images.right}
                          fill
                          alt="left_arrow"
                          className={theme === "light" && "filter invert"}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-10 ">
              <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
                <h1 className="flex-1 before:first:font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold  xs:mb-4">
                  Hot NFTs{" "}
                </h1>
                <div className="flex-2 sm:w-full flex flex-row sm:flex-col">
                  <SearchBar
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    handleSearch={onHandleSearch}
                    clearSearch={onClearSearch}
                  />
                </div>
              </div>

              <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
                {nfts?.map((nft) => (
                  <NFTCard Key={nft.TokenId} nft={nft} />
                ))}
                {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <NFTCard
                    key={`nft-${i}`}
                    nft={{
                      i,
                      name: `Nifty NFT ${i}`,
                      price: (10 - i * 0.534).toFixed(2),
                      seller: `0*${makeId(3)}...${makeId(4)}`,
                      owner: `0*${makeId(3)}...${makeId(4)}`,
                      description: "Cool NFT on sale",
                    }}
                  />
                ))} */}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
