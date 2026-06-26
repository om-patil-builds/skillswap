import { useEffect, useState } from "react";
import API from "../services/api";
import "./Requests.css";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests/my");
      setRequests(res.data.requests || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await API.put(`/requests/${id}`, { status });

      // 🔥 remove from UI instantly
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="requests-container">
      <h2>Requests 🔔</h2>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p className="empty">No pending requests</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} className="request-card">
            
            <div className="user-info">
              <h3>{req.sender.username}</h3>
              <p>{req.sender.email}</p>
              <p><b>Skills:</b> {req.sender.skillsHave?.join(", ")}</p>
            </div>

            <div className="actions">
              <button
                className="accept"
                onClick={() => handleAction(req._id, "accepted")}
              >
                Accept ✔
              </button>

              <button
                className="reject"
                onClick={() => handleAction(req._id, "rejected")}
              >
                Reject ❌
              </button>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default Requests;