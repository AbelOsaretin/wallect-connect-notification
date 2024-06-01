import logo from "./logo.svg";
import "./App.css";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider } from "ethers";

const BOT_TOKEN = process.env.REACT_APP_BOT_TOKEN;
const CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;

// 1. Get projectId
const projectId = `${process.env.REACT_APP_PROJECT_ID}`;

console.log(projectId);
// 2. Set chains
const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
};

// 3. Create a metadata object
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

function Components() {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  async function sendNotification() {
    if (!isConnected) throw Error("User disconnected");

    try {
      console.log(BOT_TOKEN);
      console.log(CHAT_ID);
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${address}`
      );

      const data = await response.json();

      if (data.ok) {
        console.log("Message sent successfully!");
      } else {
        console.error("Error sending message:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  return (
    <button
      onClick={() => {
        // Call both functions here
        sendNotification();
        // Add any other functionality from the w3m-button here
      }}
    >
      Send Notification
    </button>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Connect wallet to send notification to Telegram Bot</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Telegram Bot
        </a>
        <br />

        <w3m-button />
        <br />
        <Components />
      </header>
    </div>
  );
}

export default App;
