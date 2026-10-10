
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!localStorage.getItem("token")) {
        setError("Please log in to view your calculation history.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/calculations/history");
        setCalculations(response.data.calculations || []);
      } catch (error) {
        if (error.response) {
          setError(
            error.response.data.message ||
              "Unable to load calculation history."
          );
        } else {
          setError("Unable to connect to the server.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Please log in</h2>
          <p>You need to log in to view your profile.</p>
          <Link to="/login">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>My Profile</h2>
        <p>Your account details are shown below.</p>

        <div className="input-group">
          <label>Name</label>
          <p>{user.name}</p>
        </div>

        <div className="input-group">
          <label>Email</label>
          <p>{user.email}</p>
        </div>

        <button
          type="button"
          className="calculate-btn"
          onClick={() => navigate("/")}
        >
          Back to Calculator
        </button>

        <button
          type="button"
          className="clear-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

        <hr />

        <h2>My Calculation History</h2>

        {loading && <p>Loading your calculations...</p>}

        {error && <p className="error">{error}</p>}

        {!loading && !error && calculations.length === 0 && (
          <p>You haven't saved any calculations yet.</p>
        )}

        {!loading && !error && calculations.length > 0 && (
          <div className="history-list">
            {calculations.map((item) => (
              <div
                className="example-card"
                key={item._id}
              >
                <strong>
                  {item.dividend} ÷ {item.divisor}
                </strong>

                <p>Quotient: {item.quotient}</p>

                <p>Remainder: {item.remainder}</p>

                <small>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : "Date unavailable"}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
