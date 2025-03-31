import { useState, useEffect } from "react";
import "./App.css";
import { ethers } from "ethers";
import Memos from "./components/Memos";
import Buy from "./components/Buy";
import abi from "./contractJson/chai.json";
import chai from "./assets/chai.png";
function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  const [account, setAccount] = useState("Not Connected");

  useEffect(() => {
    const template = async () => {
      const contractAddress = "0x70cA4EB1fD061Ee766352F8763B224cF7b9745a1";
      const contractABI = abi.abi;

      try {
        if (!window.ethereum) {
          alert("MetaMask not detected. Please install MetaMask.");
          return;
        }

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        setAccount(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("Connected contract:", contract);
        setState({ provider, signer, contract });
      } catch (error) {
        console.error("Error connecting to contract:", error);
        alert(error.message);
      }
    };

    template();
  }, []);

  return (
    <div style={{ backgroundColor: "#EFEFEF", height: "100%" }}>
      <img src={chai} className="img-fluid" alt=".." width="100%" />
      <p className="text-muted lead" style={{ marginTop: "10px", marginLeft: "5px" }}> {/* ✅ Fixed `class` to `className` */}
        <small style={{color: "#000"}}>Connected Account: {account}</small>
      </p>
      <div className="container">
        <Buy state={state} />
        <Memos state={state} />
      </div>
    </div>
  );
}

export default App;