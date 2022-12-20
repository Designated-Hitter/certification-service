export const handler = async(event) => {

  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  const bodyString = event.pathParameters?.body;
  const body = bodyString ? JSON.parse(bodyString) : null;

  // Root
  if (method === 'GET' && path === '/') {
    return {
      statusCode: 200,
      body: 'Hello World!'
    }
  }

  if (method === 'POST' && path === '/registr') {
    return {
      statusCode: 200,
      body
    }
  }
};
