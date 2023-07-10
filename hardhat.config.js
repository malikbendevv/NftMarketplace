// const fs = require("fs");
// require("@nomiclabs/hardhat-waffle");

// const privateKey = fs.readFileSync(".secret").toString().trim();

// module.exports = {
//   networks: {
//     hardhat: {
//       chainId: 1337,
//     },
//   },
//   solidity: "0.8.4",
// };

require("@nomiclabs/hardhat-waffle");

// Go to https://infura.io, sign up, create a new API key
// in its dashboard, and replace "KEY" with it
const INFURA_API_KEY = "63297c08a3304c9ea60709449515f606";

// Replace this private key with your Sepolia account private key
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const SEPOLIA_PRIVATE_KEY = "ea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0"

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};