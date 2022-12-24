export const handler = async(event) => {

  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  const bodyString = event.body;
  const body = bodyString ? JSON.parse(bodyString) : null;

  const mysql = require ('mysql2');
  const bcrypt = require ('bcrypt');
  const jwt = require('jsonwebtoken');
  const code = requre('randexp');
  const FormData = require('form-data');

  const pool = mysql.createPool({
    host: 'db-private-cert-jeong.cluster-cqdqncbrwk60.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    database: 'db-private-cert-jeong',
    password: 'qBQTcReq56vm7SqV2BkQ',
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
      body: 'api backend test'
    }
  }

  //회원가입
  if (method === 'POST' && path === '/register') {
    const email = body.email;
    const nickname = body.nickname;

    //중복 가입 체크
    const [rowsEmailCheck] = await connection.execute(`SELECT email FROM membership-list WHERE email = ?`, [email]);

    if (rowsEmailCheck.length) {
      
      return {
        success: false,
        error: '이미 가입된 이메일 입니다.'
        };
    };

    //중복 닉네임 체크
    const [rowsNicknameCheck] = await connection.execute(`SELECT nickname FROM membership-list WHERE nickname = ?`, [nickname]);

    if (rowsNicknameCheck.length) {
      
      return {
        success: false,
        error: '중복된 닉네임은 사용할 수 없습니다.'
      };
    };

    const [rowsSuccessfullyJoined] = await connection.execute(`INSERT INTO membership-list(email, nickname) VALUES (?, ?)`, [email, nickname]);
    
    //인증 이메일 보내기
    const randomCode = new RandExp(/[a-z0-9]{32}/).gen();

    const [rowsVerification] = await connection.execute(`INSERT INTO verification_data(email, verification_code) VALUES (?, ?)`, [email, randomCode])

    let emailForm = new FormData()
    emailForm.append("from", `no-reply@mail.okayu.xyz`)
    emailForm.append("to", email)
    emailForm.append("subject", `이메일 인증 코드입니다.`)
    emailForm.append("html", `<a href="https://critique.okayu.xyz/emailVerify.html?code=${randomCode}">여기를 클릭해주세요.</a>`) //URL 수정해라
    
    return {
      statusCode: 200,
      success: true,
      body: `${nickname}님의 회원가입을 축하합니다! 인증메일을 확인해주세요.`
    }
  }
};
