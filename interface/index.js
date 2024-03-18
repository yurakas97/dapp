//const { exec } = require("child_process");

var humorButton = document.querySelector(".button-joke");
var connectButton = document.querySelector(".wallet-conect");
var firstLine = document.getElementsByClassName("text-setup")[0];
var secondLine = document.getElementsByClassName("text-punch")[0];
var jokeBox = document.getElementsByClassName("joke-box")[0];
var nftButton = document.getElementsByClassName("button-nft")[0];
const txInfo = document.getElementsByClassName("succesedMint")[0];
const bridge = document.getElementsByClassName("button-bridge")[0];

var timeOutVar;
var requiredNetworkId;
let web3;
var isWalletConnected = false;
var timer1;
let accounts;
let currentTokenID;

async function executeCommand() {
    //const command = 'echo "fdfdfdfdfd"'
    const command = `just send-nft-info "${firstLine.textContent}___${secondLine.textContent}"`;
    await fetch('http://localhost:3000/execute-command', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command })
    });

    // const result = await response.text();
    // console.log(result);

}


// Адреса контракту
const contractAddress = '0xdd1060a36c7933bce29e86693678a6b4a62cb709';  // Замініть на адресу свого контракту
// Або використовуйте абстракцію контракту
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
];  // Замініть на ваш ABI

const contractAddress_Nft = "0xf3d961368738c109e4859acf4849309757f97428";

const contractABI_Nft = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_symbol",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ERC721IncorrectOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ERC721InsufficientApproval",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidOperator",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ERC721NonexistentToken",
        "type": "error"
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
    }
];

var contract;
var contractNFT;

bridge.addEventListener("click", async function (event) {
    if (bridge.classList.contains("button-bridge-activated")) {
        event.preventDefault();

        try {
            const result = await contract.methods.payService().send({
                from: accounts[0],
                value: web3.utils.toWei('0.0005', 'ether'), // Замініть на вашу вартість послуги
            });
            console.log("bridge")
            await contractNFT.methods.burn(currentTokenID).send({ from: accounts[0] })
            executeCommand()
            console.log('Bringe successful:', result);

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

            // Do something with the value
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
        // Використання MetaMask провайдера
        web3 = await new Web3(window.ethereum);
        // Запит на підключення акаунта MetaMask
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

// Функція для виклику контракту при натисканні на кнопку
async function payForService() {
    accounts = await web3.eth.getAccounts();

    try {
        const result = await contract.methods.payService().send({
            from: accounts[0],
            value: web3.utils.toWei('0.0001', 'ether'), // Замініть на вашу вартість послуги
        });

        console.log('Transaction successful:', result);
        getHumor()
    } catch (error) {
        console.error('Transaction failed:', error.message);
    }
}

async function mintNft() {
    const accounts = await web3.eth.getAccounts();
    //alert("this feature under development")

    const fromAddress = accounts[0]; // Використовуємо перший аккаунт у списку

    // Функція для мінтингу нового NFT
    async function mintNFT2(joke) {
        try {
            // Виклик функції мінтингу на контракті
            const result = await contractNFT.methods.mint(joke).send({ from: fromAddress });

            console.log('Transaction hash:', result.transactionHash);
            console.log('New token ID:', result.events.Transfer.returnValues.tokenId);
            currentTokenID = result.events.Transfer.returnValues.tokenId;
            let explorerLink = `https://optimism-sepolia.blockscout.com/tx/${result.transactionHash}`;
            txInfo.children[0].innerHTML = `<a href=${explorerLink} target="_blank">Your NFT is minted</a>`;
            txInfo.classList.remove("tx-hidden");
            setTimeout(() => {
                txInfo.classList.add("tx-hidden");
            }, 20000)
        } catch (error) {
            console.error('Помилка мінтингу NFT:', error);
        }
    }

    // Виклик функції мінтингу NFT з текстом анекдоту

    const jokeText = `${firstLine.textContent} ___ ${secondLine.textContent}`;
    let jokeTextArray = jokeText.split(" ");
    let jokeTextString = "";
    for (let i = 0; i < jokeTextArray.length; i++) {
        jokeTextString += jokeTextArray[i] + "_";
    }
    //const jokeText = `yuraraajagjhh`
    await mintNFT2(jokeTextString);
    bridge.classList.add("button-bridge-activated")
    //return
}

// Отримайте інформацію про обрану мережу в MetaMask
async function getSelectedNetwork() {
    try {
        const networkId = await web3.eth.net.getId();
        return networkId;
    } catch (error) {
        console.error('Error getting network ID:', error.message);
        return null;
    }
}

// Перевірте, чи обрана мережа відповідає вашим вимогам
function checkNetwork() {
    const requiredNetworkId = 11155420; // ID потрібної мережі (1 для mainnet)

    // Спробуйте переключитись на потрібну мережу
    switchToRequiredNetwork(requiredNetworkId).then((success) => {
        if (!success) {
            // Якщо переключення не вдалося, спробуйте додати мережу
            addAndSwitchToNetwork(requiredNetworkId);
        }
    });
    return true
}

// Функція для переключення на задану мережу
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
                // Вже на потрібній мережі
                resolve(true);
            }
        });
    });
}

// Функція для додавання та переключення на задану мережу
function addAndSwitchToNetwork(requiredNetworkId) {
    // Отримайте інформацію про мережу для додавання та переключення
    const networkInfo = {
        chainId: `0x${requiredNetworkId.toString(16)}`, // Hex формат ID мережі
        chainName: 'OP Sepolia',
        nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://sepolia.optimism.io'], // Замініть на свій Infura Project ID
        blockExplorerUrls: ['https://sepolia-optimism.etherscan.io'],
    };

    // Додайте та переключіться на мережу
    window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkInfo],
    }).then(() => {
        console.log('Network added successfully');
        // Переключення на додану мережу
        switchToRequiredNetwork(requiredNetworkId);
    }).catch((error) => {
        console.error('Error adding network:', error.message);
    });
}

// Викличте перевірку мережі
//checkNetwork();

async function checkBalance() {

    contract.methods.getContractBalance().call()
        .then(balance => {
            console.log('Баланс контракту:', balance);
        })
        .catch(error => {
            console.error('Помилка:', error);
        });
} 