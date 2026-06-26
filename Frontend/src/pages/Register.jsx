import { useState } from "react";
import API from "../services/api";
import "./form.css"; // same styling reuse
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, UserPlus } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/register", {
        username,
        email,
        password,
      });

      alert("Registration successful! Redirecting to login...");
      console.log(res.data);
      navigate("/");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Create Account ⚡</h2>
        <p className="subtitle">Join our community of skills swappers</p>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <User className="icon" size={18} />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Mail className="icon" size={18} />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Lock className="icon" size={18} />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? (
              "Registering..."
            ) : (
              <>
                <span>Register</span>
                <UserPlus size={18} style={{ marginLeft: "8px" }} />
              </>
            )}
          </button>
        </form>

        <p className="footer-text">
          Already have an account?{" "}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;