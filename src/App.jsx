
// import { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function generateAnswer() {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await axios.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBb2kwtJZ7Wt6aXc5bwdPn6gF37BZ0pf6k", {
//         contents: [{ parts: [{ text: question }] }]
//       });
//       const newAnswer = response.data.candidates[0].content.parts[0].text;
//       setAnswer(newAnswer);
//       const newChat = { question, answer: newAnswer };
//       setChatHistory([...chatHistory, newChat]);
//     } catch (error) {
//       console.error("Error generating answer:", error);
//       setError("Error generating answer. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   function deleteChatEntry(index) {
//     const updatedChatHistory = [...chatHistory];
//     updatedChatHistory.splice(index, 1);
//     setChatHistory(updatedChatHistory);
//   }

//   return (
//     <div className="app">
//       <h1>Chat AI</h1>
//       <div className="chat-container">
//         <div className="chat-history">
//           {chatHistory.map((entry, index) => (
//             <div key={index} className="chat-entry">
//               <p>Q: {entry.question}</p>
//               <p>A: {entry.answer}</p>
//               <button className="delete-btn" onClick={() => deleteChatEntry(index)}>Delete</button>
//             </div>
//           ))}
//         </div>
//         <div className="input-container">
//           <textarea
//             className="question-input"
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             placeholder="Enter your question..."
//             rows="5"
//             cols="50"
//           ></textarea>
//           <button
//             className="generate-btn"
//             onClick={generateAnswer}
//             disabled={loading}
//           >
//             {loading ? 'Generating...' : 'Generate Answer'}
//           </button>
//         </div>
//       </div>
//       {error && <p className="error">{error}</p>}
//     </div>
//   );
// }

// export default App;
































import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
// C:\Users\soura\OneDrive\Desktop\CHAT-AI\CHAT-AI\src\App.jsx
function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("date"); // Default sorting by date
  const [user, setUser] = useState(null); // Assuming user authentication

  // Function to fetch chat history from API
  async function fetchChatHistory() {
    try {
      const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBb2kwtJZ7Wt6aXc5bwdPn6gF37BZ0pf6k/chat-history?user=${user}&page=${currentPage}&limit=${itemsPerPage}&sortBy=${sortBy}`);
      // Update chat history only if response is successful
      setChatHistory(response.data.chatHistory);
      setError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setError("Error fetching chat history. Please try again later.");
    }
  }

  // Function to generate answer
  async function generateAnswer() {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBb2kwtJZ7Wt6aXc5bwdPn6gF37BZ0pf6k", {
        contents: [{ parts: [{ text: question }] }]
      });
      const newAnswer = response.data.candidates[0].content.parts[0].text;
      setAnswer(newAnswer);
      const newChat = { question, answer: newAnswer };
      setChatHistory([...chatHistory, newChat]);
    } catch (error) {
      console.error("Error generating answer:", error);
      setError("Error generating answer. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  // Function to delete chat entry
  function deleteChatEntry(index) {
    const updatedChatHistory = [...chatHistory];
    updatedChatHistory.splice(index, 1);
    setChatHistory(updatedChatHistory);
  }

  // Function to handle pagination
  function paginate(pageNumber) {
    setCurrentPage(pageNumber);
  }

  // Function to handle sorting
  function handleSortChange(event) {
    setSortBy(event.target.value);
  }

  useEffect(() => {
    fetchChatHistory();
  }, [currentPage, sortBy]); // Fetch chat history on page change or sorting change

  return (
    <div className="app">
      <h1>Chat AI</h1>
      {/* User authentication component */}
      <div className="user-auth">
        {user ? (
          <p>Welcome, {user}!</p>
        ) : (
          <button onClick={() => setUser("Guest")}>Login as Guest</button>
        )}
      </div>
      <div className="chat-container">
        <div className="chat-history">
          {chatHistory.map((entry, index) => (
            <div key={index} className="chat-entry">
              <p>Q: {entry.question}</p>
              <p>A: {entry.answer}</p>
              <button className="delete-btn" onClick={() => deleteChatEntry(index)}>Delete</button>
            </div>
          ))}
          {/* Pagination component */}
          <div className="pagination">
            {[...Array(Math.ceil(chatHistory.length / itemsPerPage)).keys()].map(number => (
              <button key={number} onClick={() => paginate(number + 1)}>
                {number + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="input-container">
          <textarea
            className="question-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question..."
            rows="5"
            cols="50"
          ></textarea>
          <button
            className="generate-btn"
            onClick={generateAnswer}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Answer'}
          </button>
        </div>
        {/* Sorting options */}
        <div className="sort-options">
          <label htmlFor="sort">Sort by:</label>
          <select id="sort" value={sortBy} onChange={handleSortChange}>
            <option value="date">Date</option>
            <option value="relevance">Relevance</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;







