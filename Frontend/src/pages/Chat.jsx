import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Chat.css";
import socket from "../socket";
import { ArrowLeft, Calendar, Send, Trash2, ShieldAlert } from "lucide-react";

function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const currentUserId = localStorage.getItem("userId");
  const currentUserName = localStorage.getItem("userName") || "Me";

  const isOnline = onlineUsers.includes(userId);

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ================= FETCH MESSAGES =================
  const fetchMessages = async () => {
    try {
      const res = await API.get(`/chat/${userId}`);
      setMessages(res.data.chats || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH USER =================
  const fetchUser = async () => {
    try {
      const res = await API.get(`/users/${userId}`);
      setUserName(res.data.username || "User");
    } catch (err) {
      console.log(err);
    }
  };

  // ================= CHECK MY MESSAGE =================
  const isMe = (sender) => {
    if (!sender) return false;

    const senderId = typeof sender === "object" ? sender._id : sender;

    return String(senderId) === String(currentUserId);
  };

  // ================= INIT =================
  useEffect(() => {
    setLoading(true);

    fetchMessages();
    fetchUser();

    socket.emit("join", currentUserId);
  }, [userId]);

  // ================= SOCKET =================
  useEffect(() => {
    // RECEIVE MESSAGE
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id === data._id);

        if (exists) return prev;

        return [...prev, data];
      });
    });

    // ONLINE USERS
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    // TYPING
    socket.on("typing", () => {
      setTyping(true);
    });

    socket.on("stopTyping", () => {
      setTyping(false);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("onlineUsers");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);

  // ================= SEND MESSAGE =================
  const sendMessage = async () => {
    if (!text.trim() || sending) return;

    const messageText = text.trim();

    const tempMsg = {
      _id: Date.now().toString(),
      sender: {
        _id: currentUserId,
        username: currentUserName,
      },
      receiver: userId,
      message: messageText,
      createdAt: new Date().toISOString(),
      status: "sent",
    };

    // INSTANT UI
    setMessages((prev) => [...prev, tempMsg]);

    setText("");
    setSending(true);

    // SOCKET SEND
    socket.emit("sendMessage", tempMsg);

    try {
      await API.post("/chat/send", {
        receiver: userId,
        message: messageText,
      });
    } catch (err) {
      console.log("Send Error:", err);
    } finally {
      setSending(false);
    }
  };

  // ================= TYPING =================
  const handleTyping = (value) => {
    setText(value);

    socket.emit("typing", {
      sender: currentUserId,
      receiver: userId,
    });

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        receiver: userId,
      });
    }, 800);
  };

  // ================= DELETE =================
  const deleteMessageForMe = async (id) => {
    if (id.length < 20) return;

    try {
      await API.delete(`/chat/message/${id}/me`);

      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteMessageForEveryone = async (id) => {
    if (id.length < 20) return;

    try {
      await API.delete(`/chat/message/${id}/everyone`);

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === id
            ? {
                ...msg,
                message: "This message was deleted",
                isDeleted: true,
              }
            : msg,
        ),
      );
    } catch (err) {
      console.log(err);
    }
  };

  // FORMAT TIME
  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // ui
  return (
    <div className="chat-container-modern glass-card">
      {/* HEADER */}
      <div className="chat-header-modern">
        <div className="header-left-modern">
          <button className="chat-back-btn" onClick={() => navigate("/dashboard")} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>

          <div className="chat-header-avatar">
            {userName?.charAt(0)?.toUpperCase()}
          </div>

          <div className="chat-header-info">
            <span className="chat-header-name">{userName}</span>
            <div className="chat-header-status-wrapper">
              <span className={`status-dot ${isOnline ? "online" : "offline"}`} />
              <span className="chat-header-status">
                {typing ? "typing..." : isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>
        
        <button
          className="premium-btn premium-btn-secondary schedule-session-btn"
          onClick={() =>
            navigate("/sessions", {
              state: {
                learnerId: userId,
                learnerName: userName,
              },
            })
          }
        >
          <Calendar size={16} />
          <span>Schedule Session</span>
        </button>
      </div>

      {/* MESSAGES */}
      <div className="chat-messages-modern" onClick={() => setSelectedMsg(null)}>
        {loading ? (
          <div className="loading-state">Loading chat history...</div>
        ) : messages.length === 0 ? (
          <div className="chat-empty-state">
            <MessageSquare size={48} className="empty-icon" />
            <p>No messages yet</p>
            <span>Start the conversation by sending a message below.</span>
          </div>
        ) : (
          messages.map((msg) => {
            const mine = isMe(msg.sender);

            return (
              <div
                key={msg._id}
                className={`msg-row-modern ${mine ? "msg-sent" : "msg-received"}`}
              >
                {/* AVATAR */}
                <div className="msg-avatar-circle">
                  {mine ? currentUserName?.charAt(0)?.toUpperCase() : userName?.charAt(0)?.toUpperCase()}
                </div>

                {/* BODY */}
                <div className="msg-body-modern">
                  {/* MESSAGE */}
                  <div
                    className="msg-bubble-modern"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMsg(selectedMsg === msg._id ? null : msg._id);
                    }}
                  >
                    <div className="msg-text-content">
                      {msg.isDeleted ? (
                        <span className="deleted-message-text">
                          <ShieldAlert size={14} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                          <i>This message was deleted</i>
                        </span>
                      ) : (
                        msg.message
                      )}
                    </div>

                    <div className="msg-footer-info">
                      <span className="msg-time-label">
                        {formatTime(msg.createdAt)}
                      </span>
                      {mine && <span className="msg-status-tick">✓✓</span>}
                    </div>

                    {/* DELETE MENU */}
                    {selectedMsg === msg._id && !msg.isDeleted && (
                      <div className="msg-delete-dropdown glass-card">
                        <button className="delete-option" onClick={() => deleteMessageForMe(msg._id)}>
                          <Trash2 size={14} />
                          <span>Delete for Me</span>
                        </button>

                        {mine && (
                          <button
                            className="delete-option everyone"
                            onClick={() => deleteMessageForEveryone(msg._id)}
                          >
                            <Trash2 size={14} />
                            <span>Delete for Everyone</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* TYPING */}
        {typing && (
          <div className="msg-row-modern msg-received">
            <div className="msg-avatar-circle">
              {userName?.charAt(0)?.toUpperCase()}
            </div>
            <div className="msg-body-modern">
              <div className="msg-bubble-modern typing-bubble">
                <span className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="chat-input-bar-modern">
        <input
          className="chat-input-field"
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Write a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button 
          className="premium-btn premium-btn-primary chat-send-btn" 
          onClick={sendMessage} 
          disabled={sending || !text.trim()}
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

export default Chat;
