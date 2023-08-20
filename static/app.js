import React from "react";
import { useState, useEffect, createContext, useContext } from "react";
import ReactDOM from "react-dom";

const AccountContext = createContext();

function InputBar() {
  const account = useContext(AccountContext);
  const [message, setMessage] = useState("");

  const handleMessage = () => {
    fetch("/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId: account.id,
        content: message,
      }),
    }).then((res) => {
      const status = res.status;

      if (status == 200) {
        setMessage("");
      } else {
        setMessage(status);
      }
    });
  };

  return (
    <div className="input-bar">
      <input
        className="message-input"
        placeholder="Input message..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button className="message-send" onClick={handleMessage}>
        <ion-icon name="search-outline"></ion-icon>
      </button>
    </div>
  );
}

function MessageList() {
  const account = useContext(AccountContext);
  const [timestamp, setTimestamp] = useState(undefined);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setInterval(() => {
      var params = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (timestamp) {
        params.body = {
          startTime: timestamp,
        };
      }

      fetch("/messages", params)
        .then((res) => res.json())
        .then((json) => {
          setMessages(messages.concat(json.messages));
          setTimestamp(json.timestamp);
        });
    }, 2000);
  }, []);

  return (
    <ul className="message-list">
      {messages.map((msg) => {
        return (
          <li
            key={Math.random()}
            className={
              "message" + (msg.halfId == account.halfId ? " user" : "")
            }
          >
            <h1 className="nick">{msg.nick}</h1>
            <p className="content">{msg.content}</p>
          </li>
        );
      })}
    </ul>
  );
}

function App() {
  const [account, setAccount] = useState({});

  useEffect(() => {
    if (localStorage.account) {
      const json = JSON.parse(localStorage.account);
      setAccount(json);
      return;
    }

    fetch("/create-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nick: randomKey(11),
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        json.halfId = json.id.substring(8, 16);
        localStorage.account = JSON.stringify(json);
        setAccount(json);
      });
  }, []);

  return (
    <div className="app">
      <AccountContext.Provider value={account}>
        <MessageList />
        <InputBar />
      </AccountContext.Provider>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

function randomKey(size) {
  var key = "";
  for (let i = 0; i < size; i++) {
    key += Math.floor(Math.random() * 16).toString(16);
  }

  return key;
}
