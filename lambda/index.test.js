const moment = require('moment-timezone');
jest.mock('moment-timezone');

// Create mock for countries
jest.mock('countries-list', () => ({
  countries: {
    'US': { name: 'United States' },
    'GB': { name: 'United Kingdom' },
    'FR': { name: 'France' }
  }
}));

describe('5oclock Lambda Handler', () => {
  let handler;
  let headers;
  let mockEvent;
  let mockMomentObj;
  
  beforeEach(() => {
    jest.resetModules();
    
    // Mock headers (defined in the module but not exported)
    headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };
    
    // Create a mock moment object with the appropriate methods
    mockMomentObj = {
      hour: jest.fn().mockReturnValue(17), // 5 PM by default
      minute: jest.fn().mockReturnValue(0), // 0 minutes by default
      format: jest.fn().mockReturnValue('5:00 PM')
    };
    
    // Mock the moment function itself
    moment.mockImplementation(() => {
      return {
        tz: jest.fn().mockReturnValue(mockMomentObj)
      };
    });
    
    // Make moment.tz also available at the top level
    moment.tz = jest.fn().mockReturnValue(mockMomentObj);
    
    // Import handler after mocking dependencies
    ({ handler } = require('./index'));
    
    mockEvent = {
      httpMethod: 'GET',
      path: '/api/5oclock'
    };
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('handles OPTIONS requests for CORS', async () => {
    const optionsEvent = { httpMethod: 'OPTIONS' };
    const response = await handler(optionsEvent);
    
    expect(response.statusCode).toBe(200);
    expect(response.headers).toEqual(headers);
    expect(JSON.parse(response.body).message).toBe('CORS enabled');
  });
  
  test('finds a city at exactly 5pm', async () => {
    // Default is 17:00 (5 PM)
    
    const response = await handler(mockEvent);
    const data = JSON.parse(response.body);
    
    expect(response.statusCode).toBe(200);
    expect(data.city).toBeDefined();
    expect(data.minutesPast5pm).toBe(0);
  });
  
  test('finds cities at 5:30 PM and calculates correct minutes past 5', async () => {
    mockMomentObj.hour.mockReturnValue(17); // 5 PM
    mockMomentObj.minute.mockReturnValue(30); // 30 minutes
    
    const response = await handler(mockEvent);
    const data = JSON.parse(response.body);
    
    expect(response.statusCode).toBe(200);
    expect(data.minutesPast5pm).toBe(30);
  });
  
  test('finds cities at exactly 6:00 PM and calculates correct minutes past 5', async () => {
    mockMomentObj.hour.mockReturnValue(18); // 6 PM
    mockMomentObj.minute.mockReturnValue(0); // 0 minutes
    
    const response = await handler(mockEvent);
    const data = JSON.parse(response.body);
    
    expect(response.statusCode).toBe(200);
    expect(data.minutesPast5pm).toBe(60);
  });
  
  test('does not include cities past 6:00 PM (outside the window)', async () => {
    // First set of calls: outside the window (6:01 PM)
    mockMomentObj.hour
      .mockReturnValueOnce(18) // First time, for filtering
      .mockReturnValueOnce(18) // Second time, for checking the minute
      .mockReturnValueOnce(17) // Third time, for the second city
      .mockReturnValue(17);    // All subsequent calls
      
    mockMomentObj.minute
      .mockReturnValueOnce(1)  // First time, checking 6:01
      .mockReturnValue(30);    // All other times, checking 5:30
      
    const response = await handler(mockEvent);
    const data = JSON.parse(response.body);
    
    expect(response.statusCode).toBe(200);
    expect(data.city).toBeDefined();
    expect(data.minutesPast5pm).toBe(30); // Should find the 5:30 city
  });
  
  test('handles server errors', async () => {
    // Force an error
    mockMomentObj.hour.mockImplementation(() => {
      throw new Error('Test error');
    });
    
    const response = await handler(mockEvent);
    
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).error).toBe('Internal server error');
  });
  
  test('formats the time correctly', async () => {
    mockMomentObj.format.mockReturnValue('5:45 PM');
    
    const response = await handler(mockEvent);
    const data = JSON.parse(response.body);
    
    expect(data.localTime).toBe('5:45 PM');
    expect(mockMomentObj.format).toHaveBeenCalledWith('h:mm A');
  });
  
  test('includes country facts in response', async () => {
    const response = await handler(mockEvent);
    const data = JSON.parse(response.body);
    
    expect(data.country).toBeDefined();
    expect(data.countryFacts).toBeDefined();
    expect(Array.isArray(data.countryFacts)).toBe(true);
    expect(data.countryFacts.length).toBeGreaterThan(0);
  });
  
  test('includes timezone information', async () => {
    const response = await handler(mockEvent);
    const data = JSON.parse(response.body);
    
    expect(data.timezone).toBeDefined();
  });
  
  test('returns random city when no cities are in the 5-6 PM window', async () => {
    // Set all cities to be at noon (12 PM)
    mockMomentObj.hour.mockReturnValue(12);
    mockMomentObj.minute.mockReturnValue(0);
    
    const response = await handler(mockEvent);
    const data = JSON.parse(response.body);
    
    expect(response.statusCode).toBe(200);
    expect(data.city).toBeDefined();
  });
});
