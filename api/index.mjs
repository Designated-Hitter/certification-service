import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import FormData from 'form-data';
import axios from 'axios';

const corsHeader = {
  'Access-Control-Allow-Origin': '*'
};

const optionsCorsHeader = {
  'Access-Control-Allow-Headers' : 'CContent-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,GET,POST'

};

export const handler = async(event) => {
  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  const bodyString = event.body;
  const body = bodyString ? JSON.parse(bodyString) : null;

  const pool = mysql.createPool({
    host: 'db-private-cert-jeong.cluster-cqdqncbrwk60.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    database: 'membership',
    password: process.env.DB_PASSWORD,
    port: '3306',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })

  const connection = pool.promise();

  // Root
  if (method === 'GET' && path === '/') {
    return {
      statusCode: 200,
      headers: corsHeader,
      body: JSON.stringify({
        message: 'api backend test'
      })
    }
  }

  //회원가입
  if (method === 'POST' && path === '/Join') {
    const email = body.email;
    const nickname = body.nickname;

    //중복 가입 체크
    const [rowsEmailCheck] = await connection.execute(`SELECT email FROM membership_list WHERE email = ?`, [email]);

    if (rowsEmailCheck.length) {
      
      return {
        statusCode: 402,
        headers: corsHeader,
        body: JSON.stringify({
          message: '이미 가입된 이메일 입니다.'
        })
      };
    };

    //중복 닉네임 체크
    const [rowsNicknameCheck] = await connection.execute(`SELECT nickname FROM membership_list WHERE nickname = ?`, [nickname]);

    if (rowsNicknameCheck.length) {
      
      return {
        statusCode: 402, 
        headers: corsHeader,
        body: JSON.stringify({
          message: '중복된 닉네임은 사용할 수 없습니다.'
        }),
      };
    };

    const [rowsSuccessfullyJoined] = await connection.execute(`INSERT INTO membership_list(email, nickname) VALUES (?, ?)`, [email, nickname]);
    
    //인증 이메일 보내기
    const randomCode = bcrypt.hashSync(email, 10);

    const [rowsVerification] = await connection.execute(`INSERT INTO verification_data(email, verification_code) VALUES (?, ?)`, [email, randomCode])

    let emailForm = new FormData()
    emailForm.append("from", `no-reply@mail.okayu.xyz`)
    emailForm.append("to", email)
    emailForm.append("subject", `이메일 인증 코드입니다.`)
    emailForm.append("html", `<a href="https://d34d11yyckhjad.cloudfront.net/EmailVerify.html?email=${email}code=${randomCode}">여기를 클릭해주세요.</a>`)
    
    await axios({
      method: 'POST',
      url: "https://api.mailgun.net/v3/mail.okayu.xyz/messages",
      auth: {
        username: "api",
        password: process.env.MAILGUN_API_PASSWORD,
      },
      headers : emailForm.getHeaders(),
      data: emailForm
    })
    
    
    return {
      statusCode: 200,
      headers: corsHeader,
      body: JSON.stringify({
        message: `${nickname}님의 회원가입을 축하합니다! 인증메일을 확인해주세요.`
      }),
    }
  }

  //인증메일 체크
  if (method === 'POST' && path ==='/EmailVerify') {
    const email = ''; //params로 받은 메일
    const code = ''; //params로 받은 코드

    const [rowsEmailVerify] = await connection.execute(`SELECT email, verification_code,used_code FROM verification_data WHERE email = ?`, [email]);

    if (rowsEmailVerify.used_code !== 0) {

      return {
        statusCode: 400,
        headers: corsHeader,
        body: JSON.stringify({
          message: '이미 사용된 코드입니다.'
        }),
      }

    }

    if (rowsEmailVerify.verification_code === code) {

      const [rowsUsedVerificationCode] = await connection.execute(`UPDATE verification_data SET used_code = '1' WHERE email = ?`, [email]);

      return {
        statusCode: 200,
        headers: corsHeader,
        body: JSON.stringify({
          message: '성공.'
        }),
      }
      
    }

    if (rowsEmailVerify.verification_code !== code) {

      return {
        statusCode: 401,
        headers: corsHeader,
        body: JSON.stringify({
          message: '잘못된 접근입니다.'
        }),
      }

    }

  }


  //로그인하기
  if (method === 'POST' && path === '/Login') {
    const email = body.email;
    const hashedMail = bcrypt.hashSync(email, 10);
    const now = (+ new Date()).toString();
    const hashedDate = bcrypt.hashSync(now, 10);
    const loginCode = bcrypt.hashSync(hashedMail + hashedDate, 10);
    const [rowsLoginCode] = await connection.execute(`INSERT INTO login_data(email, login_code) VALUES (?, ?)`, [email, loginCode]);

    let emailForm = new FormData()
    emailForm.append("from", `no-reply@mail.okayu.xyz`)
    emailForm.append("to", email)
    emailForm.append("subject", `이메일 인증 코드입니다.`)
    emailForm.append("html", `<a href="https://d34d11yyckhjad.cloudfront.net/Login.html?code=${loginCode}">여기를 클릭해주세요.</a>`) 

    await axios({
      method: 'POST',
      url: "https://api.mailgun.net/v3/mail.okayu.xyz/messages",
      auth: {
        username: "api",
        password: process.env.MAILGUN_API_PASSWORD,
      },
      headers : emailForm.getHeaders(),
      data: emailForm
    })

    return {
      statusCode: 200,
      headers: corsHeader,
      body: JSON.stringify({
        message: '로그인을 완료 하려면 메일을 확인해주세요.'
      }),
    }
  }

  //로그인 메일 확인
  if (method === 'GET' && path === '/Login') {
    const email = body.email;
    const loginCode = body.loginCode; //수정필요

    const [rowsCompare] = await connection.execute(`SELECT email, login_code, used_code FROM login_data WHERE email = ?`, [email]);

    if (rowsCompare.used_code !== 0) {

      return {
        statusCode: 400,
        headers: corsHeader,
        body: JSON.stringify({
          message: '이미 사용된 코드입니다.'
        }),
      }

    }

    if (rowsCompare.login_code !== loginCode) {

      return {
        statusCode: 401,
        headers: corsHeader,
        body: JSON.stringify({
          message: '잘못된 접근입니다.'
        }),
      }
    }

    if (rowsCompare.login_code === loginCode) {

      const [rowsUsedLoginCode] = await connection.execute(`UPDATE login_data SET used_code = '1' WHERE login_code = ?`, [loginCode]);

      return {
        statusCode: 200,
        headers: corsHeader,
        body: JSON.stringify({
          message: '로그인 성공.'
        }),
      }
    }

  }

  if (method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: optionsCorsHeader,
    }
  }

};
