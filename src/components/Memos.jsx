import { useState, useEffect } from "react";
import "./Memos.css";

const Memos = ({ state }) => {
  const [memos, setMemos] = useState([]);
  const { contract } = state;

  useEffect(() => {
    const fetchMemos = async () => {
      if (contract) {
        const memos = await contract.getMemos();
        setMemos(memos);
      }
    };
    fetchMemos();
  }, [contract]);

  return (
    <div className="memos-container">
      <h3>Messages</h3>
      {memos.length === 0 && <p className="no-messages">No messages yet.</p>}
      <div className="memos-list">
        {memos.map((memo, index) => (
          <div key={index} className={`memo-card ${memo.isCompleted ? "completed" : ""}`}>
            <div className="memo-header">
              <span className="memo-name">{memo.name}</span>
              <span className="memo-timestamp">
                {new Date(memo.timestamp * 1000).toLocaleString()}
              </span>
            </div>
            <p className="memo-message">{memo.message}</p>
            <p className="memo-from">From: {memo.from}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Memos;