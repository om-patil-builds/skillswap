import { useState } from "react";
import API from "../services/api";
import "./form.css";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN:", res.data);
      const user = res.data.user || res.data;

      localStorage.setItem("userId", user._id || user.id);
      localStorage.setItem("userName", user.username);

      console.log("SAVED USER ID:", localStorage.getItem("userId"));
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-container">
      <div className="login-box">
        <h2>SkillSwap Login ⚡</h2>
        <p className="subtitle">Connect and grow your expertise today</p>

        <form onSubmit={handleLogin}>
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
              "Logging in..."
            ) : (
              <>
                <span>Login</span>
                <LogIn size={18} style={{ marginLeft: "8px" }} />
              </>
            )}
          </button>
        </form>

        <p className="footer-text">
          Don't have an account?{" "}
          <a
            href="/register"
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
          >
            Register
          </a>
        </p>
      </div>
    </main>
  );
}

export default Login;
