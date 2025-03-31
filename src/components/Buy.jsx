import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./Buy.css";

const Buy = ({ state }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [tip, setTip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pricePerChai, setPricePerChai] = useState(0.001);
  const [balance, setBalance] = useState("0.0");
  const [memos, setMemos] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { contract } = state;
        if (contract) {
          const price = await contract.chaiPrice();
          setPricePerChai(ethers.utils.formatEther(price));
          
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const balance = await provider.getBalance(await signer.getAddress());
          setBalance(ethers.utils.formatEther(balance));
          
          const memos = await contract.getMemos();
          setMemos(memos);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [state]);

  const buyChai = async (event) => {
    event.preventDefault();
    if (!name.trim() || !message.trim()) {
      alert("Please enter both name and message.");
      return;
    }
    if (quantity < 1) {
      alert("Please enter a valid quantity (at least 1).");
      return;
    }

    setLoading(true);
    try {
      const { contract } = state;
      const totalAmount = (pricePerChai * quantity + Number(tip)).toFixed(3);
      const amount = { value: ethers.utils.parseEther(totalAmount) };

      const transaction = await contract.buyChai(name, message, amount);
      await transaction.wait();

      alert(`Thanks for buying ${quantity} chai!`);
      setName("");
      setMessage("");
      setQuantity(1);
      setTip(0);

      const memos = await contract.getMemos();
      setMemos(memos);
    } catch (error) {
      alert(`Transaction failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`buy-container ${darkMode ? "dark-mode" : ""}`}>
      <h1>Buy a Chai ☕</h1>
      <p>Your Balance: <strong>{balance} ETH</strong></p>
      <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light Mode 🌞" : "Dark Mode 🌙"}
      </button>

      <form onSubmit={buyChai}>
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
        </div>
        <div className="input-group">
          <label htmlFor="message">Message</label>
          <input type="text" id="message" value={message} onChange={(e) => setMessage(e.target.value)} required disabled={loading} />
        </div>
        <div className="input-group">
          <label htmlFor="quantity">How many chai?</label>
          <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" required disabled={loading} />
        </div>
        <div className="input-group">
          <label htmlFor="tip">Add Tip (ETH)</label>
          <input type="number" id="tip" value={tip} onChange={(e) => setTip(Math.max(0, parseFloat(e.target.value) || 0))} min="0" step="0.001" required disabled={loading} />
        </div>
        <p>Total: <strong>{(pricePerChai * quantity + Number(tip)).toFixed(3)} ETH</strong></p>
        <button type="submit" className="buy-button" disabled={!state.contract || loading}>
          {loading ? "Processing..." : `Pay ${(pricePerChai * quantity + Number(tip)).toFixed(3)} ETH`}
        </button>
      </form>

      <h2>Recent Messages 💬</h2>
      {memos.length === 0 && <p>No messages yet. Be the first to leave one! 😊</p>}
      <div className="memos-list">
        {memos.map((memo, index) => (
          <div key={index} className="memo-card">
            <div className="memo-header">
              <span className="memo-name">{memo.name}</span>
              <span className="memo-timestamp">{new Date(memo.timestamp * 1000).toLocaleString()}</span>
            </div>
            <p className="memo-message">📝 {memo.message}</p>
            <p className="memo-from">💌 From: {memo.from.slice(0, 6)}...{memo.from.slice(-4)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Buy;