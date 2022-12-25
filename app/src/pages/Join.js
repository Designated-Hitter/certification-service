import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function Join () {

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");

  function handleEmail (event) {
    setEmail(event.target.value);
  }

  function handleNickname (event) {
    setNickname(event.target.value)
  }

  async function tryJoin () {

    const {data} = {
      method: "POST",
      url: 'https://ri2ar9z645.execute-api.ap-northeast-2.amazonaws.com/Join',
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

export default Join;