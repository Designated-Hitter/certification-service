import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";


function Login () {

  const [email, setEmail] = useState("");

  function handleEmail (event) {
    setEmail(event.target.value);
  }

  async function tryJoin () {
    Navigate('./join.html');
  }

  async function tryLogin() {
    const result = await axios({
      method: "POST",
      url: "https://ri2ar9z645.execute-api.ap-northeast-2.amazonaws.com/Login",
      data: {
        email: email
      }
    })
    
  }

  return (
    <div className="Login">
      <div className="email-box">
        <input type="email" name="email" placeholder="E-mail" value={ email } onChange={ handleEmail }/><br />
      </div>
      <div className="button-area">
        <button className="join" onClick={tryJoin()}>JOIN</button>
        <button className="login" onClick={tryLogin()}>LOGIN</button>
      </div>
    </div>
  ) 
  
}

export default Login;