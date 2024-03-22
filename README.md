# Demo dApps for Polymer by yurakas97

This project uses ERC20, and ERC721 token standards, oppenZeppelin lib. and custom solydity smart-contracts.

**The key idea** is to mint the original NFT based on randomly gotten jokes on the Optimism network, and write that joke as metadata of the NFT. Then user could bridge the NFT to the BASE network through IBC channel. The process of bridging means sending a packet with the user's wallet address, and joke as a string (from saved mapping in a smart contract by token ID or through IBC as well) to the BASE and automatically minting(after the packet receiving) a new NFT with the same metadata, while the original one is burnt.


**Proof of interaction**:

EVM wallet address: ```0x633DCc2b348D0343B8071ced530E3c32171Ce2B9```. 

Optimism Smart-contract: ```0x1166a3269c9a766458C735B6E1F62ad461948960```.

BASE Smark-contract: ```0x3AEfecAa39018057E634dB71C580ca2b1196e17f```

tx of channel creating: https://optimism-sepolia.blockscout.com/tx/0x231664e10dfdc02a6c6f14035e84ca40ea8b1196211006df53c19257e15034ae

tx of packet sending: https://optimism-sepolia.blockscout.com/tx/0x571829ed0fc2607acae7c2e8f67367c6e9af4f0f680fc85c7d36d8cd369eadc1?tab=index

tx of minting NFT on BASE: https://base-sepolia.blockscout.com/tx/0x322c4c44dcc5d0615be0a69dd2cc16f119d7373cdb73e4538c28c7351ed998e0?tab=index

IBC channel: ```37850(Op)``` and ```37851(BASE)```

Video: https://youtu.be/x7wLKytRFLc?si=eiMy3pq7zmrzPHDM

## 📚 Documentation

This repository is forked from [the IBC app template repo](https://open-ibc/ibc-app-solidity-template) so check it out if you haven't or find its docs [here](ibc-app-template.md).

There's some basic information here in the README but all of the dApps found here are documented more extensively in [the official Polymer documentation](https://docs.polymerlabs.org/docs/quickstart/start).

## 📋 Prerequisites

The demo dapps repository has been based on the project structure found in the [IBC app template for Solidity](https://github.com/open-ibc/ibc-app-solidity-template) so it has the same requirements:

- Have [git](https://git-scm.com/downloads) installed
- Have [node](https://nodejs.org) installed (v18+)
- Have [Foundry](https://book.getfoundry.sh/getting-started/installation) installed (Hardhat will be installed when running `npm install`)
- Have [just](https://just.systems/man/en/chapter_1.html) installed (recommended but not strictly necessary)

Some basic knowledge of all of these tools is also required, although the details are abstracted away for basic usage.

## 🧱 Repository Structure

This repository has a project structure that set it up to be compatible with the Hardhat and Foundry EVM development environments, as in the [IBC app template for Solidity repo](https://github.com/open-ibc/ibc-app-solidity-template). 

The main logic specific to the dApps can be found in the `/contracts` directory:

# Example tree structure with only one custom dApp, joke-nft
```
contracts
├── base
│   ├── CustomChanIbcApp.sol
│   ├── GeneralMiddleware.sol
│   └── UniversalChanIbcApp.sol
├── jokes
│   ├── BaseContract.sol
│   └── OptContract.sol
└── arguments.js
``` 

## 🦮 Dependency management

This repo depends on Polymer's [vibc-core-smart-contracts](https://github.com/open-ibc/vibc-core-smart-contracts) which are tracked as git submodules. 

There are two ways to install these dependencies.

### Using IBC app template just recipe

If you have Node and Foundry installed, simply run:
```bash
just install
```

To install the required dependencies.

### Using git submodules directly

If you prefer not to use Foundry / Forge, you can use git submodules directly.

After cloning the repo, run this command additionally:
```bash
git submodule update --init --recursive
```

Find more documentation on using git submodules from the [official docs](https://git-scm.com/book/en/v2/Git-Tools-Submodules) or [in this tutorial](https://www.atlassian.com/git/tutorials/git-submodule).

Also run ```npm install``` additionally and ```npm install express```.

## 💻 Interacting with demos

To interact with any of the demos, there are a couple of things to do. (Assuming the dependencies have been installed).

1. Convert the `.env.example` file into an `.env` file. This will ignore the file for future git commits as well as expose the environment variables. Add your private keys and update the other values if you want to customize (advanced usage feature).

2. Check out the configuration file; `config.json` or the alternate configs in the `/config` directory. Depending on which application you'll want to interact with, update the contract type in the `deploy` field to the desired contract (use the `just set-contracts` recipe for that).

3. Once the configuration file is updated and saved, you can look at the `just` commands with `just --list`.

## 💻 How to run

1. Place this repo on the local server with the required dependencies installed. And run the next commands in the CLI.
2. ```cp .env.example .env``` set up private keys and APIs, then
3. ```CONFIG_PATH='config/jokes-config.json' ```  
4. ```nvm use 20```

**There're couple ways to run and interact, option 5 or 6 or 7:**

5. Run just file to put everything together: ```just do-it``` (will cover all functionality: contract deployment, channel creation, NFT minting and packet sending)
6. Run a contract creating and deployment:
- ```just set-contracts optimism OptContract``` and
- ```just set-contracts base BaseContract false```
- ```just deploy optimism base``` to deploy.
- ```just create-channel``` to create a custom IBC channel.
- Then run ```just do-it-main``` as many times as you wish to create and bridge Joke NFT through IBC.
7. Use the Live Server extension (VSCode) to run or just open the ```interface/index.html``` file through the browser to start the UI/UX interface
- Run a local server ```node app.js``` that listens to requests from the web page and sends packets through IBC.
- Go to the web page and interact with the UI/UX interface that does the same as above.