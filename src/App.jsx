import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useBalance,
  useBlockNumber,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { sepolia } from "viem/chains";
import { http } from "viem";

import "./App.css";

const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_hello",
        type: "string",
      },
    ],
    name: "setHello",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getHello",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const CONTRACT_ADDRESS = "0x309049B5d8A9428577B691439565594C11Ac1090";

function App() {
  const [nameInput, setNameInput] = useState("");
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: blockNumber } = useBlockNumber();
  const wagmiContractConfig = {
    chain: sepolia,
    transport: http(),
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  };
  const { data: hello } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getHello",
  });

  const { writeContract } = useWriteContract();

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p>Hello Web 3</p>
        </div>
        <div>
          <ConnectButton />
        </div>
      </div>
      <div className="card" style={{ fontSize: "2rem" }}>
        <p>Block Number: {blockNumber?.toString()}</p>
        <p>Wallet address: {address}</p>
        <p>Balance: {balance?.formatted ? balance?.formatted : 0} ETH</p>
        <p>Hello {hello}</p>
        <label htmlFor="name">Name</label>{" "}
        <input
          type="text"
          id="name"
          onChange={(e) => setNameInput(e.target.value)}
        />
        <button
          onClick={() =>
            writeContract({
              abi: CONTRACT_ABI,
              address: CONTRACT_ADDRESS,
              functionName: "setHello",
              args: [nameInput],
            })
          }
        >
          Set Name
        </button>
      </div>
    </>
  );
}

export default App;