import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";


function Login () {

  async function tryJoin () {
    Navigate('./join.html');
  }

  async function tryLogin() {
    const {data} = { //axios가 아닌 api gateway로 보내는 방법 조사하기
      method: "POST",
      url: "https://ri2ar9z645.execute-api.ap-northeast-2.amazonaws.com",
      data: {
        email: email
      }
    }
  }

  return (
    <div className="Login">
      <div className="email-box">
        <input type="email" name="email" placeholder="E-mail" value={ email }/><br />
      </div>
      <div className="button-area">
        <button className="join" onClick={tryJoin()}>JOIN</button>
        <button className="login" onClick={tryLogin()}>LOGIN</button>
      </div>
    </div>
  ) 
  
}

export default Login;