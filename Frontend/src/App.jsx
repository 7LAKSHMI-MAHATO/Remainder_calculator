import { useState } from "react";
import api from "./api";
import "./App.css";

function App() {
  const [dividend, setDividend] = useState("");
  const [divisor, setDivisor] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculateRemainder = async (e) => {
    e.preventDefault();

    setResult(null);
    setError("");

    if (dividend === "" || divisor === "") {
      setError("Please enter both numbers.");
      return;
    }

    if (Number(divisor) === 0) {
      setError("Divisor cannot be zero.");
      return;
    }

    try {
      const response = await api.post(
    "/calculate",
    {
        dividend: Number(dividend),
        divisor: Number(divisor)
    }
);

const data = response.data;

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setResult(data);
    } catch (error) {
      setError("Unable to connect to the server.");
    }
  };

  const clearCalculator = () => {
    setDividend("");
    setDivisor("");
    setResult(null);
    setError("");
  };

  return (
    <div className="page">
      <nav className="navbar">
        <div className="logo">RemainderCalc</div>

        <div className="nav-links">
          <a href="#calculator">Calculator</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#examples">Examples</a>
          <button className="login-btn">Login</button>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="small-heading">SIMPLE • FAST • FREE</p>

            <h1>
              Remainder Calculator
            </h1>

            <p className="hero-text">
              Quickly calculate the quotient and remainder of any division.
              No login required.
            </p>
          </div>

          <div className="calculator-card" id="calculator">
            <h2>Calculate Remainder</h2>

            <form onSubmit={calculateRemainder}>
              <div className="input-group">
                <label>Dividend</label>

                <input
                  type="number"
                  value={dividend}
                  onChange={(e) => setDividend(e.target.value)}
                  placeholder="Enter dividend"
                />
              </div>

              <div className="input-group">
                <label>Divisor</label>

                <input
                  type="number"
                  value={divisor}
                  onChange={(e) => setDivisor(e.target.value)}
                  placeholder="Enter divisor"
                />
              </div>

              <div className="button-row">
                <button type="submit" className="calculate-btn">
                  Calculate
                </button>

                <button
                  type="button"
                  className="clear-btn"
                  onClick={clearCalculator}
                >
                  Clear
                </button>
              </div>
            </form>

            {error && <p className="error">{error}</p>}

            {result && (
              <div className="result-box">
                <h3>Result</h3>

                <div className="result-grid">
                  <div>
                    <span>Quotient</span>
                    <strong>{result.quotient}</strong>
                  </div>

                  <div>
                    <span>Remainder</span>
                    <strong>{result.remainder}</strong>
                  </div>
                </div>

                <div className="calculation">
                  {result.dividend} ÷ {result.divisor} = {result.quotient}{" "}
                  remainder {result.remainder}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="info-section" id="how-it-works">
          <h2>How to Calculate a Remainder</h2>

          <p>
            A remainder is the amount left over after dividing one number by
            another number.
          </p>

          <div className="formula">
            Dividend = Divisor × Quotient + Remainder
          </div>

          <div className="example">
            <h3>Example: 25 ÷ 4</h3>

            <p>4 × 6 = 24</p>

            <p>25 − 24 = 1</p>

            <strong>Remainder = 1</strong>
          </div>
        </section>

        <section className="info-section" id="examples">
          <h2>Common Examples</h2>

          <div className="examples-grid">
            <div className="example-card">
              <strong>10 ÷ 3</strong>
              <span>Remainder = 1</span>
            </div>

            <div className="example-card">
              <strong>25 ÷ 4</strong>
              <span>Remainder = 1</span>
            </div>

            <div className="example-card">
              <strong>100 ÷ 7</strong>
              <span>Remainder = 2</span>
            </div>

            <div className="example-card">
              <strong>81 ÷ 9</strong>
              <span>Remainder = 0</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 RemainderCalc. Free online remainder calculator.</p>
      </footer>
    </div>
  );
}

export default App;