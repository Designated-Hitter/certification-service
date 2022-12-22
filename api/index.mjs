export const handler = async(event) => {

  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  const bodyString = event.body;
  const body = bodyString ? JSON.parse(bodyString) : null;

  const mysql = require ('mysql2');
  const bcrypt = require ('bcrypt');
  const jwt = require('jsonwebtoken');
  const code = requre('randexp');

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
      res.json({
        success: false,
        error: '이미 가입된 이메일 입니다.'
        });
      return;
    };
    //중복 닉네임 체크
    const [rowsNicknameCheck] = await connection.execute(`SELECT nickname FROM membership-list WHERE nickname = ?`, [nickname]);

    if (rowsNicknameCheck.length) {
      res.json({
        success: false,
        error: '중복된 닉네임은 사용할 수 없습니다.'
      });
      return;
    };

    return {
      
      

      statusCode: 200,
      body: `${nickname}님의 회원가입을 축하합니다!`
    }
  }
};
