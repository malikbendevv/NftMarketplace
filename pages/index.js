import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Banner } from "../components";
import CreatorCard from "../components/CreatorCard";
import images from "../assets";
import { makeId } from "../utils/makeId";

const Home = () => {
  const [hideButtons, sethideButtons] = useState(false);

  const { theme } = useTheme();
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
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
    if (current.scrollWidth >= parent?.offsetWidth) {
      sethideButtons(false);
    } else {
      sethideButtons(true);
    }
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener("resize", isScrollable);

    return () => {
      window.removeEventListener("resize", isScrollable);
    };
  });

  return (
    <div className=" justify-center sm:px-4 p-12 ">
      <div className="w-full minmd:w-4/5">
        <Banner
          name="Discover, collect, and sell extraordinary NFTs"
          childStyles="md-text-4xl sm:text-2xl xs:text-xl text-left"
          parentStyles="justify-start mb-9 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl "
        />
      </div>

      <div>
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl text-semibold xs:ml-0">
          {" "}
          Best Creators{" "}
        </h1>

        <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
          <div
            className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none"
            ref={scrollRef}
          >
            {[6, 7, 8, 9, 10].map((i) => (
              <CreatorCard
                key={`creator-${i}`}
                rank={i}
                creatorImage={images[`creator${i}`]}
                creatorName={`0*${makeId(3)}...${makeId(4)}`}
                creatorEths={10 - i * 0.5}
              />
            ))}
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
                    className={theme === "light" && "filter invert"}
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
    </div>
  );
};

export default Home;
