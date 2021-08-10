# Hiring Exercise
Develop a full stack Ethereum DApp

### General Instructions

- Click the green "Use this template" button. **Make your solution repo private**, and invite **dhruvinparikh** to the repo once you're ready to submit. 

- AT THE TOP OF EACH FILE, PLEASE LIST GITHUB LINKS TO ANY AND ALL REPOS YOU BORROW FROM THAT YOU DO NOT EXPLICITLY IMPORT FROM ETC.
- PLEASE WRITE AS MUCH OR AS LITTLE CODE AS YOU THINK IS NEEDED TO COMPLETE THE TASK
- LIBRARIES AND OTHER UTILITIES  (SUCH AS HARDHAT PLUGIN, UI COMPONENTS, etc) ARE FAIR GAME

### Bard Unit test

- Fill in the Bard's missing test suite in `test/Bard.test.js`

  1. Please be overly explicit with your code comments
  2. Since the contracts written according to the incomplete unit test, please do not rename functions or variables
  3. In case you're unfamiliar, please read about the [ERC1155 standard here](https://docs.openzeppelin.com/contracts/4.x/erc1155)

### Front End

  1. Run `yarn start` and check browser at __http://localhost:3000__
  2. open terminal and run `yarn chain`
  3. Connect MetaMask to __http://localhost:8545__ and make sure your account shows `1000 Ether`
  4. open another terminal and run `yarn deploy:local`. Note the contract Address of BardFactory and Bard.
  5. You have to modify __src/App.js__ by changing `bardAddress` as well as by adding code to facilitate batch minting of tokens and displaying details like balance and tokenSupply of tokens using batch functions. Feel free to use to `console.log()` for logging outputs. This task involves knowledge check about functionality.
  6. Please do not spend any time beautifying the frontend


### Pre Requisites

### Secrets

Create an `.env` same as `.env.example`. Please keep mnemonic same as MetaMask 

Before running any command, make sure to install dependencies:

```sh
$ yarn install
```

### Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```

### Chain

Start the hardhat node

```sh
$ yarn chain
```

### Deploy

Deploy the contracts to Local chain:

```sh
$ yarn deploy:local
```

### Test

Run the Mocha tests:

```sh
$ yarn test
```

### Starting front end

```sh
yarn start
```
