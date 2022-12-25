import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function Join () {

  const email = 'email'; //임시
  const nickname = 'nickname'; //임시

  async function tryJoin () {

    const {data} = {
      method: "POST",
      url: 'https://ri2ar9z645.execute-api.ap-northeast-2.amazonaws.com',
      data: {
        email: email,
        nickname: nickname
      }
    }

  }

  return (
    <div className="Join">
      <div className="FillHere">
        <input type="email" name="email" placeholder="E-mail" value={ email } /><br />
        <input type="nickname" name="nickname" placeholder="nickname" value={ nickname } />
      </div>
      <div className="button-area">
        <button className="join" onClick={tryJoin()}>JOIN</button>
      </div>
    </div>
  ) 







}