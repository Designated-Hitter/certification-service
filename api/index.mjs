export const handler = async(event) => {

  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  const bodyString = event.body;
  const body = bodyString ? JSON.parse(bodyString) : null;

  // Root
  if (method === 'GET' && path === '/') {
    return {
      statusCode: 200,
      body: 'Hello World!'
    }
  }

  if (method === 'POST' && path === '/register') {
    return {
      statusCode: 200,
      body: `${body.id}님의 회원가입을 축하합니다!`
    }
  }
};
