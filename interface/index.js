//const { exec } = require("child_process");

var humorButton = document.querySelector(".button-joke");
var connectButton = document.querySelector(".wallet-conect");
var firstLine = document.getElementsByClassName("text-setup")[0];
var secondLine = document.getElementsByClassName("text-punch")[0];
var jokeBox = document.getElementsByClassName("joke-box")[0];
var nftButton = document.getElementsByClassName("button-nft")[0];
const txInfo = document.getElementsByClassName("succesedMint")[0];
const bridge = document.getElementsByClassName("button-bridge")[0];
const txInfoBridge = document.getElementsByClassName("succesedBridge")[0];

var timeOutVar;
var requiredNetworkId;
let web3;
var isWalletConnected = false;
var timer1;
let accounts;
let currentTokenID;


const contractAddress = '0xdd1060a36c7933bce29e86693678a6b4a62cb709';
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_serviceCost",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "payer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ServicePaid",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Withdrawal",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getContractBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "payService",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "serviceCost",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const contractAddress_Nft = "0xeAe53b9b8d181b87DA0B4F6393D87a9DE62c2177";
const contractABI_Nft = [
  {
    "inputs": [
      {
        "internalType": "contract IbcDispatcher",
        "name": "_dispatcher",
        "type": "address"
      },
      {
        "internalType": "bytes32[]",
        "name": "proposalNames",
        "type": "bytes32[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "invalidCounterPartyPortId",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "channelId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "sequence",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "voteNFTid",
        "type": "uint256"
      }
    ],
    "name": "AckNFTMint",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "_jokes",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "_minter",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "ackPackets",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "chairperson",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "connectedChannels",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "channelId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "cpChannelId",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "portId",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "channelId",
            "type": "bytes32"
          },
          {
            "internalType": "string",
            "name": "version",
            "type": "string"
          }
        ],
        "internalType": "struct CounterParty",
        "name": "local",
        "type": "tuple"
      },
      {
        "internalType": "uint8",
        "name": "ordering",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "feeEnabled",
        "type": "bool"
      },
      {
        "internalType": "string[]",
        "name": "connectionHops",
        "type": "string[]"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "portId",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "channelId",
            "type": "bytes32"
          },
          {
            "internalType": "string",
            "name": "version",
            "type": "string"
          }
        ],
        "internalType": "struct CounterParty",
        "name": "counterparty",
        "type": "tuple"
      },
      {
        "components": [
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "bytes",
                    "name": "prefix",
                    "type": "bytes"
                  },
                  {
                    "internalType": "bytes",
                    "name": "suffix",
                    "type": "bytes"
                  }
                ],
                "internalType": "struct OpIcs23ProofPath[]",
                "name": "path",
                "type": "tuple[]"
              },
              {
                "internalType": "bytes",
                "name": "key",
                "type": "bytes"
              },
              {
                "internalType": "bytes",
                "name": "value",
                "type": "bytes"
              },
              {
                "internalType": "bytes",
                "name": "prefix",
                "type": "bytes"
              }
            ],
            "internalType": "struct OpIcs23Proof[]",
            "name": "proof",
            "type": "tuple[]"
          },
          {
            "internalType": "uint256",
            "name": "height",
            "type": "uint256"
          }
        ],
        "internalType": "struct Ics23Proof",
        "name": "proof",
        "type": "tuple"
      }
    ],
    "name": "createChannel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dispatcher",
    "outputs": [
      {
        "internalType": "contract IbcDispatcher",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getConnectedChannels",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "channelId",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "cpChannelId",
            "type": "bytes32"
          }
        ],
        "internalType": "struct CustomChanIbcApp.ChannelMapping[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "tokenURI_",
        "type": "string"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "portId",
                "type": "string"
              },
              {
                "internalType": "bytes32",
                "name": "channelId",
                "type": "bytes32"
              }
            ],
            "internalType": "struct IbcEndpoint",
            "name": "src",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "string",
                "name": "portId",
                "type": "string"
              },
              {
                "internalType": "bytes32",
                "name": "channelId",
                "type": "bytes32"
              }
            ],
            "internalType": "struct IbcEndpoint",
            "name": "dest",
            "type": "tuple"
          },
          {
            "internalType": "uint64",
            "name": "sequence",
            "type": "uint64"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          },
          {
            "components": [
              {
                "internalType": "uint64",
                "name": "revision_number",
                "type": "uint64"
              },
              {
                "internalType": "uint64",
                "name": "revision_height",
                "type": "uint64"
              }
            ],
            "internalType": "struct Height",
            "name": "timeoutHeight",
            "type": "tuple"
          },
          {
            "internalType": "uint64",
            "name": "timeoutTimestamp",
            "type": "uint64"
          }
        ],
        "internalType": "struct IbcPacket",
        "name": "packet",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "bool",
            "name": "success",
            "type": "bool"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "internalType": "struct AckPacket",
        "name": "ack",
        "type": "tuple"
      }
    ],
    "name": "onAcknowledgementPacket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "channelId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "onCloseIbcChannel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "channelId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "counterpartyChannelId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "counterpartyVersion",
        "type": "string"
      }
    ],
    "name": "onConnectIbcChannel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "version",
        "type": "string"
      },
      {
        "internalType": "enum ChannelOrder",
        "name": "",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      },
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "portId",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "channelId",
            "type": "bytes32"
          },
          {
            "internalType": "string",
            "name": "version",
            "type": "string"
          }
        ],
        "internalType": "struct CounterParty",
        "name": "counterparty",
        "type": "tuple"
      }
    ],
    "name": "onOpenIbcChannel",
    "outputs": [
      {
        "internalType": "string",
        "name": "selectedVersion",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "portId",
                "type": "string"
              },
              {
                "internalType": "bytes32",
                "name": "channelId",
                "type": "bytes32"
              }
            ],
            "internalType": "struct IbcEndpoint",
            "name": "src",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "string",
                "name": "portId",
                "type": "string"
              },
              {
                "internalType": "bytes32",
                "name": "channelId",
                "type": "bytes32"
              }
            ],
            "internalType": "struct IbcEndpoint",
            "name": "dest",
            "type": "tuple"
          },
          {
            "internalType": "uint64",
            "name": "sequence",
            "type": "uint64"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          },
          {
            "components": [
              {
                "internalType": "uint64",
                "name": "revision_number",
                "type": "uint64"
              },
              {
                "internalType": "uint64",
                "name": "revision_height",
                "type": "uint64"
              }
            ],
            "internalType": "struct Height",
            "name": "timeoutHeight",
            "type": "tuple"
          },
          {
            "internalType": "uint64",
            "name": "timeoutTimestamp",
            "type": "uint64"
          }
        ],
        "internalType": "struct IbcPacket",
        "name": "",
        "type": "tuple"
      }
    ],
    "name": "onRecvPacket",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "success",
            "type": "bool"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "internalType": "struct AckPacket",
        "name": "ackPacket",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "portId",
                "type": "string"
              },
              {
                "internalType": "bytes32",
                "name": "channelId",
                "type": "bytes32"
              }
            ],
            "internalType": "struct IbcEndpoint",
            "name": "src",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "string",
                "name": "portId",
                "type": "string"
              },
              {
                "internalType": "bytes32",
                "name": "channelId",
                "type": "bytes32"
              }
            ],
            "internalType": "struct IbcEndpoint",
            "name": "dest",
            "type": "tuple"
          },
          {
            "internalType": "uint64",
            "name": "sequence",
            "type": "uint64"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          },
          {
            "components": [
              {
                "internalType": "uint64",
                "name": "revision_number",
                "type": "uint64"
              },
              {
                "internalType": "uint64",
                "name": "revision_height",
                "type": "uint64"
              }
            ],
            "internalType": "struct Height",
            "name": "timeoutHeight",
            "type": "tuple"
          },
          {
            "internalType": "uint64",
            "name": "timeoutTimestamp",
            "type": "uint64"
          }
        ],
        "internalType": "struct IbcPacket",
        "name": "packet",
        "type": "tuple"
      }
    ],
    "name": "onTimeoutPacket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "recvedPackets",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "portId",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "channelId",
            "type": "bytes32"
          }
        ],
        "internalType": "struct IbcEndpoint",
        "name": "src",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "portId",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "channelId",
            "type": "bytes32"
          }
        ],
        "internalType": "struct IbcEndpoint",
        "name": "dest",
        "type": "tuple"
      },
      {
        "internalType": "uint64",
        "name": "sequence",
        "type": "uint64"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "components": [
          {
            "internalType": "uint64",
            "name": "revision_number",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "revision_height",
            "type": "uint64"
          }
        ],
        "internalType": "struct Height",
        "name": "timeoutHeight",
        "type": "tuple"
      },
      {
        "internalType": "uint64",
        "name": "timeoutTimestamp",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "channelId",
        "type": "bytes32"
      },
      {
        "internalType": "uint64",
        "name": "timeoutSeconds",
        "type": "uint64"
      },
      {
        "internalType": "address",
        "name": "voterAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "str",
        "type": "string"
      }
    ],
    "name": "sendPacket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "baseURI_",
        "type": "string"
      }
    ],
    "name": "setBaseURI",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "timeoutPackets",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "portId",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "channelId",
            "type": "bytes32"
          }
        ],
        "internalType": "struct IbcEndpoint",
        "name": "src",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "portId",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "channelId",
            "type": "bytes32"
          }
        ],
        "internalType": "struct IbcEndpoint",
        "name": "dest",
        "type": "tuple"
      },
      {
        "internalType": "uint64",
        "name": "sequence",
        "type": "uint64"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "components": [
          {
            "internalType": "uint64",
            "name": "revision_number",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "revision_height",
            "type": "uint64"
          }
        ],
        "internalType": "struct Height",
        "name": "timeoutHeight",
        "type": "tuple"
      },
      {
        "internalType": "uint64",
        "name": "timeoutTimestamp",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenID",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "channelId",
        "type": "bytes32"
      }
    ],
    "name": "triggerChannelClose",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IbcDispatcher",
        "name": "_dispatcher",
        "type": "address"
      }
    ],
    "name": "updateDispatcher",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "_supportedVersions",
        "type": "string[]"
      }
    ],
    "name": "updateSupportedVersions",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

var contract;
var contractNFT;

async function executeCommand() {
  const command = "node scripts/private/_send-nft-info-config.js";
  await fetch('https://sweeping-forcibly-gannet.ngrok-free.app/execute-command', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ command })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(text => {
      console.log(text);
      txInfoBridge.children[0].innerHTML = `<a href=${text} target="_blank">Your NFT is bridged to BASE</a>`;
      setTimeout(function () {
        txInfoBridge.classList.add("tx-hidden");
      }, 20000)
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
}

bridge.addEventListener("click", async function (event) {
  if (bridge.classList.contains("button-bridge-activated")) {
    event.preventDefault();

    try {
      const result = await contract.methods.payService().send({
        from: accounts[0],
        value: web3.utils.toWei('0.0005', 'ether'),
      });
      console.log("bridge")
      await contractNFT.methods.burn(currentTokenID).send({ from: accounts[0] })
      executeCommand()
      console.log('Bringe successful:', result);
      bridge.classList.remove("button-bridge-activated");

      txInfo.classList.add("tx-hidden");
      txInfoBridge.classList.remove("tx-hidden");

    } catch (error) {
      console.error('Transaction failed:', error.message);
    }
  }
})

nftButton.addEventListener("click", function () {
  if (nftButton.classList.contains("button-nft__active")) {
    if (isWalletConnected) mintNft()
    console.log("nft")
  }
});

humorButton.addEventListener("click", function () {
  if (isWalletConnected) payForService()
  console.log("joke")
  bridge.classList.remove("button-bridge-activated");
});

connectButton.addEventListener("click", function () {
  if (!isWalletConnected) walletConnect()
  if (isWalletConnected) walletDisconnect()
});

function getHumor() {

  firstLine.textContent = "";
  secondLine.textContent = "";
  clearTimeout(timeOutVar)

  const apiUrl = 'https://official-joke-api.appspot.com/random_joke';

  // Use the fetch() function to make a GET request to the API
  fetch(apiUrl)
    .then(response => {
      // Check if the response status is OK (200)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Parse the response body as JSON
      return response.json();
    })
    .then(data => {

      jokeBox.style.boxShadow = "0px 0px 20px 7px rgba(148, 206, 0, 1)";
      firstLine.textContent = data.setup;

      timeOutVar = setTimeout(function () {
        secondLine.textContent = data.punchline;
        humorButton.textContent = "ANOTHER ONE";
        nftButton.classList.add("button-nft__active");
      }, 3000)

    })
    .catch(error => {
      // Handle any errors that occurred during the fetch
      console.error('There was a problem with the fetch operation:', error);
    });


  return
}

function walletDisconnect() {
  connectButton.textContent = "Connect wallet";
  isWalletConnected = false;
}

async function walletConnect() {
  console.log("wallet")
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {

    web3 = await new Web3(window.ethereum);

    await window.ethereum.enable();
    isWalletConnected = true;

  } else {
    console.error('MetaMask not detected');
  }
  contract = await new web3.eth.Contract(contractABI, contractAddress);
  contractNFT = await new web3.eth.Contract(contractABI_Nft, contractAddress_Nft);
  checkNetwork()
  connectButton.textContent = "Disconnect"
}


async function payForService() {
  accounts = await web3.eth.getAccounts();

  try {
    const result = await contract.methods.payService().send({
      from: accounts[0],
      value: web3.utils.toWei('0.0001', 'ether'),
    });

    console.log('Transaction successful:', result);
    getHumor()
  } catch (error) {
    console.error('Transaction failed:', error.message);
  }
}

async function mintNft() {
  const accounts = await web3.eth.getAccounts();

  const fromAddress = accounts[0];

  async function mintNFT2(joke) {
    try {

      const result = await contractNFT.methods.mint(joke).send({ from: fromAddress });

      console.log('Transaction hash:', result.transactionHash);
      console.log('New token ID:', result.events.Transfer.returnValues.tokenId);
      currentTokenID = result.events.Transfer.returnValues.tokenId;
      let explorerLink = `https://optimism-sepolia.blockscout.com/tx/${result.transactionHash}`;
      txInfo.children[0].innerHTML = `<a href=${explorerLink} target="_blank">Your NFT is minted</a>`;
      txInfo.classList.remove("tx-hidden");
      bridge.classList.add("button-bridge-activated");

      setTimeout(() => {
        txInfo.classList.add("tx-hidden");
      }, 20000)
    } catch (error) {
      console.error('Помилка мінтингу NFT:', error);
    }
  }

  // Виклик функції мінтингу NFT з текстом анекдоту
  const jokeText = `${firstLine.textContent}_______${secondLine.textContent}`;

  await mintNFT2(jokeText);
  //return
}


async function getSelectedNetwork() {
  try {
    const networkId = await web3.eth.net.getId();
    return networkId;
  } catch (error) {
    console.error('Error getting network ID:', error.message);
    return null;
  }
}


function checkNetwork() {
  const requiredNetworkId = 11155420;


  switchToRequiredNetwork(requiredNetworkId).then((success) => {
    if (!success) {

      addAndSwitchToNetwork(requiredNetworkId);
    }
  });
  return true
}


function switchToRequiredNetwork(requiredNetworkId) {
  return new Promise((resolve) => {
    getSelectedNetwork().then((networkId) => {
      if (networkId !== null && networkId !== requiredNetworkId) {
        // Запит на переключення мережі
        window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${requiredNetworkId.toString(16)}` }],
        }).then(() => {
          console.log('Network switched successfully');
          resolve(true);
        }).catch((error) => {
          console.error('Error switching network:', error.message);
          resolve(false);
        });
      } else {
        resolve(true);
      }
    });
  });
}


function addAndSwitchToNetwork(requiredNetworkId) {

  const networkInfo = {
    chainId: `0x${requiredNetworkId.toString(16)}`,
    chainName: 'OP Sepolia',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia.optimism.io'],
    blockExplorerUrls: ['https://sepolia-optimism.etherscan.io'],
  };


  window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [networkInfo],
  }).then(() => {
    console.log('Network added successfully');

    switchToRequiredNetwork(requiredNetworkId);
  }).catch((error) => {
    console.error('Error adding network:', error.message);
  });
}

async function checkBalance() {

  contract.methods.getContractBalance().call()
    .then(balance => {
      console.log('Баланс контракту:', balance);
    })
    .catch(error => {
      console.error('Помилка:', error);
    });
} 
