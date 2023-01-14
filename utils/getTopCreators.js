export const getCreators = (array) => {
  const finalized = [];

  const result = array?.reduce((res, currentValue) => {
    (res[currentValue.seller] = res[currentValue.seller] || []).push(
      currentValue
    );

    return res;
  }, {});

  Object.entries(result).forEach((itm) => {
    const seller = itm[0];
    const sumall = itm[1]
      .map((item) => Number(item.price))
      .reduce((prev, curr) => prev + curr, 0);

    finalized.push({ seller, sumall });
  });

  return finalized;
};

// export const getCreators = (nfts) => {
//   let creators = [];
//   let nftsSum = [];
//   console.log("nfts from to pcreators", nfts);
//   nfts?.map((nft) => creators.push(nft.seller));

//   console.log({ creators });
//   const filterecreators = creators.filter(
//     (creator, index) => creators.indexOf(creator) === index
//   );
//   console.log({ filterecreators });

//   filterecreators.map((Creatorr) => {
//     const filteredNfts = nfts.filter((nft) => nft.seller === Creatorr);
//     var sum = 0;

//     console.log({ filteredNfts });
//     filteredNfts.map((nft) => {
//       const price = +nft.price;
//       sum = sum + price;
//       console.log(sum);
//       nftsSum.push({ seller: nft.seller, sum });

//       return nftsSum;
//     });
//   });

//   let sellers = [];
//   nftsSum.map((nft) => sellers.push(nft.seller));

//   const filteredSelleres = sellers.filter(
//     (seller, index) => sellers.indexOf(seller) === index
//   );
//   console.log({ filteredSelleres });

//   let sellersWithAmounts = [];

//   let finalArray = [];
//   filteredSelleres.map((seller) => {
//     let filteredNftsSum = nftsSum.filter((nft) => nft.seller === seller);

//     console.log({ filteredNftsSum });
//     filteredNftsSum.map((nft) => {
//       console.log(11);

//       const seller = nft.seller;
//       if (nft.seller === seller) {
//         sellersWithAmounts = [...sellersWithAmounts, nft.sum];
//       }

//       const biggestAmount = Math.max(...sellersWithAmounts);

//       finalArray.push({ seller: seller, amount: biggestAmount });
//       console.log({ biggestAmount });
//     });
//     console.log({ finalArray });
//   });

//   // here we have nft seller with sum now we have to choose bigest one

//   return sellersWithAmounts;
// };
// getCreators();
// console.log("function from top creatos", getCreators());
