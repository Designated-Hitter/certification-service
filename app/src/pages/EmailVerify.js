import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";


function EmailVerify () {
  const email = 'email' //pathparams로 받은 이메일
  const code = 'code' //pathparams로 받은 코드
  
  const {data} = {
    method: "POST",
    url: "https://ri2ar9z645.execute-api.ap-northeast-2.amazonaws.com/EmailVerify",
    data: {
      email: email,
      code: code
    }
  }

  if(data.success === false) {
    prompt(data.message);
  }

  if(data.succes === true) {
    Navigate('./');
  }
  
}

export default EmailVerify;