const index = require('./index');

describe('5 O\'Clock Lambda function', () => {
  test('returns CORS headers for OPTIONS requests', async () => {
    const mockOptionsEvent = {
      httpMethod: 'OPTIONS'
    };
    
    const response = await index.handler(mockOptionsEvent);
    
    expect(response.statusCode).toBe(200);
    expect(response.headers).toBeDefined();
    expect(JSON.parse(response.body).message).toBe('CORS enabled');
  });

  test('returns a valid response for GET requests', async () => {
    const mockEvent = {
      httpMethod: 'GET'
    };
    
    const response = await index.handler(mockEvent);
    const body = JSON.parse(response.body);
    
    // Basic structure tests
    expect(response.statusCode).toBe(200);
    expect(body.city).toBeDefined();
    expect(body.country).toBeDefined();
    expect(body.localTime).toBeDefined();
    expect(body.minutesPast5pm).toBeDefined();
    expect(body.countryFacts).toBeDefined();
    expect(Array.isArray(body.countryFacts)).toBe(true);
    expect(body.timezone).toBeDefined();
  });
});
