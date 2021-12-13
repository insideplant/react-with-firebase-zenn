import React, {useState} from 'react'
import { Link, useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { currentUser, logout, sendEmailVerification } = useAuth();
  const history = useHistory();
  const [error, setError] = useState("");

  async function handleLogout() {
    setError("");
    try {
      await logout();
      history.push("/");
    } catch {
      setError("Failed to log out");
    }
   }
  
  async function handlesendEmailVerification() {
    setError("");
    try {
      await sendEmailVerification();
      setError("メールをおくりました。メール有効化をお願いします");
    } catch (e) {
      console.log(e);
      setError("有効化メールの送信に失敗しました");
    }
  }

  return (
    <div>
      Dashboard：
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div>
        <strong>Email:</strong> {currentUser.email}
      </div>
      <div>
        <strong>ハンドル名:</strong> {currentUser.displayName}
      </div>
      <h2>
        <Link to="/login">Login</Link>
      </h2>
      <h2>
        <Link to="/signup">signup</Link>
      </h2>
      <Button color="primary" onClick={handleLogout}>
        Logout
      </Button>
      {!currentUser.emailVerified && (
        <div>
          メールアドレスが有効化されていません{" "}
          <Button color="primary" onClick={handlesendEmailVerification}>
            メールアドレス有効化
          </Button>
        </div>
      )}

    </div>
  )
}
export default Dashboard