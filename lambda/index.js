const moment = require('moment-timezone');
const { countries } = require('countries-list');

// Major cities with their timezones and countries
const majorCities = [
  { name: 'New York', timezone: 'America/New_York', country: 'US' },
  { name: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'US' },
  { name: 'London', timezone: 'Europe/London', country: 'GB' },
  { name: 'Paris', timezone: 'Europe/Paris', country: 'FR' },
  { name: 'Berlin', timezone: 'Europe/Berlin', country: 'DE' },
  { name: 'Madrid', timezone: 'Europe/Madrid', country: 'ES' },
  { name: 'Rome', timezone: 'Europe/Rome', country: 'IT' },
  { name: 'Moscow', timezone: 'Europe/Moscow', country: 'RU' },
  { name: 'Dubai', timezone: 'Asia/Dubai', country: 'AE' },
  { name: 'Mumbai', timezone: 'Asia/Kolkata', country: 'IN' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'JP' },
  { name: 'Sydney', timezone: 'Australia/Sydney', country: 'AU' },
  { name: 'Shanghai', timezone: 'Asia/Shanghai', country: 'CN' },
  { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', country: 'HK' },
  { name: 'Seoul', timezone: 'Asia/Seoul', country: 'KR' },
  { name: 'Singapore', timezone: 'Asia/Singapore', country: 'SG' },
  { name: 'São Paulo', timezone: 'America/Sao_Paulo', country: 'BR' },
  { name: 'Mexico City', timezone: 'America/Mexico_City', country: 'MX' },
  { name: 'Cairo', timezone: 'Africa/Cairo', country: 'EG' },
  { name: 'Cape Town', timezone: 'Africa/Johannesburg', country: 'ZA' },
  { name: 'Istanbul', timezone: 'Europe/Istanbul', country: 'TR' },
  { name: 'Bangkok', timezone: 'Asia/Bangkok', country: 'TH' },
  { name: 'Jakarta', timezone: 'Asia/Jakarta', country: 'ID' },
  { name: 'Auckland', timezone: 'Pacific/Auckland', country: 'NZ' },
  { name: 'Toronto', timezone: 'America/Toronto', country: 'CA' },
  { name: 'Vancouver', timezone: 'America/Vancouver', country: 'CA' },
  { name: 'Zurich', timezone: 'Europe/Zurich', country: 'CH' },
  { name: 'Vienna', timezone: 'Europe/Vienna', country: 'AT' },
  { name: 'Amsterdam', timezone: 'Europe/Amsterdam', country: 'NL' },
  { name: 'Stockholm', timezone: 'Europe/Stockholm', country: 'SE' },
];

// Fun facts about countries
const countryFacts = {
  'US': [
    'The United States has 50 states and more than 17,000 islands.',
    'The US has the world\'s largest economy by nominal GDP.',
    'Baseball, known as "America\'s pastime", was invented in the US in the 18th century.',
    'The Grand Canyon in Arizona is one of the Seven Natural Wonders of the World.',
    'Alaska has more coastline than the rest of the United States combined.'
  ],
  'GB': [
    'The UK consists of four countries: England, Scotland, Wales, and Northern Ireland.',
    'The London Underground is the oldest underground railway network in the world.',
    'English is the official language, but over 300 languages are spoken in London.',
    'The British drink more tea per capita than any other nation except Ireland.',
    'The Queen doesn\'t need a passport to travel internationally.'
  ],
  'FR': [
    'France is the most visited country in the world with over 89 million tourists annually.',
    'There are over 1,000 different types of cheese made in France.',
    'The Louvre Museum in Paris is the largest art museum in the world.',
    'French was the official language of England for about 300 years.',
    'The French consume around 11.2 billion glasses of wine each year.'
  ],
  'DE': [
    'Germany has over 1,000 varieties of sausages and 1,500 different types of beer.',
    'The first printed book was in German, printed by Johannes Gutenberg.',
    'Germany is home to over 2,100 castles.',
    'The Berlin Wall fell on November 9, 1989, reuniting East and West Germany.',
    'German is the most widely spoken language in the European Union.'
  ],
  'ES': [
    'Spain has the third-largest number of UNESCO World Heritage Sites.',
    'Spanish is the world\'s second-most spoken native language.',
    'La Tomatina is an annual festival in Spain where people throw tomatoes at each other.',
    'Spain produces 44% of the world\'s olive oil, more than twice that of Italy.',
    'The Spanish national anthem has no words.'
  ],
  'IT': [
    'Italy has the most UNESCO World Heritage Sites in the world.',
    'The Italian flag was inspired by the French flag.',
    'Pizza was invented in Naples, Italy.',
    'Vatican City, located in Rome, is the smallest country in the world.',
    'Italy has more than 1,500 lakes.'
  ],
  'RU': [
    'Russia is the largest country in the world, covering more than one-eighth of the Earth\'s inhabited land area.',
    'Lake Baikal in Russia is the deepest lake in the world and contains 20% of the world\'s unfrozen freshwater.',
    'Russia has 11 time zones, more than any other country.',
    'The Moscow Metro is one of the deepest subway systems in the world.',
    'Russians celebrate Christmas on January 7th, following the Julian calendar.'
  ],
  'AE': [
    'The UAE has the tallest building in the world, the Burj Khalifa.',
    'Dubai Police has luxury cars including Bugatti, Ferrari, and Lamborghini.',
    'The UAE has no rivers but has about 200 natural islands.',
    'Only about 15% of Dubai\'s population is native Emirati.',
    'The UAE has the sixth-largest oil reserves in the world.'
  ],
  'IN': [
    'India is the world\'s largest democracy with over 1.3 billion people.',
    'Chess was invented in India around the 6th century AD.',
    'India has the world\'s highest cricket ground, located in Chail, Himachal Pradesh.',
    'India has more than 300,000 mosques and more than 2 million Hindu temples.',
    'The Indian film industry, Bollywood, produces more films than any other country.'
  ],
  'JP': [
    'Japan consists of 6,852 islands.',
    'Japan has more than 200 volcanoes and experiences about 1,500 earthquakes every year.',
    'Sumo is Japan\'s national sport, but baseball is the most popular spectator sport.',
    'Japan has one of the world\'s lowest crime rates.',
    'The Japanese have a word for "death from overwork" - Karoshi.'
  ],
  'AU': [
    'Australia is the only country that is also a continent.',
    'Australia has over 10,000 beaches, you could visit a new beach every day for over 27 years.',
    'Kangaroos and emus cannot walk backward, which is why they are on the Australian coat of arms.',
    'Australia has the world\'s longest golf course, measuring more than 850 miles.',
    '80% of the animals in Australia are unique to the country.'
  ],
  'CN': [
    'China has the world\'s longest wall - the Great Wall of China.',
    'China is known as the "Middle Kingdom" in Chinese.',
    'The Chinese invented paper, printing, gunpowder, and the compass.',
    'China uses 45 billion chopsticks per year.',
    'Table tennis (ping pong) is China\'s national sport.'
  ],
  'HK': [
    'Hong Kong has more skyscrapers than any other city in the world.',
    'Hong Kong means "Fragrant Harbor" in Chinese.',
    'The Hong Kong subway system is the most profitable in the world.',
    'Hong Kong has the world\'s longest covered outdoor escalator system.',
    'Over 90% of Hong Kong\'s population uses the Mass Transit Railway (MTR) for daily travel.'
  ],
  'KR': [
    'South Korea has the fastest average internet connection in the world.',
    'Kimchi is considered the national dish of Korea.',
    'South Korea is known for its "Bang" culture - PC bang, DVD bang, etc., which are rooms for activities.',
    'Age is calculated differently in Korea - babies are considered 1 year old when they are born.',
    'South Korea has one of the highest rates of plastic surgery per capita in the world.'
  ],
  'SG': [
    'Singapore is one of only three city-states in the world.',
    'It\'s illegal to chew gum in Singapore (with exceptions for therapeutic gum).',
    'Singapore has one of the most powerful passports in the world.',
    'The Singapore Botanic Gardens is the only tropical garden to be honored as a UNESCO World Heritage Site.',
    'Singapore is one of the smallest countries in the world, yet has one of the highest GDPs per capita.'
  ],
  'BR': [
    'Brazil is home to the Amazon, the world\'s largest rainforest and river by volume.',
    'The Brazilian carnival is the largest in the world, attracting millions of people annually.',
    'Brazil is the largest producer of coffee in the world.',
    'More than 70% of Brazil\'s population lives within 100 miles of the coast.',
    'Brazil is the fifth largest country in the world, both by geographical area and population.'
  ],
  'MX': [
    'Mexico is home to the world\'s smallest volcano, Cuexcomate, which stands at just 43 feet tall.',
    'Mexico introduced chocolate, chilies, and corn to the world.',
    'Mexico City is built on a lake and is sinking at a rate of 6 to 8 inches a year.',
    'The Mexican flag has a picture of an eagle eating a snake, based on an Aztec legend.',
    'Mexico has 68 official languages.'
  ],
  'EG': [
    'Egypt is home to one of the Seven Wonders of the Ancient World, the Great Pyramid of Giza.',
    'The ancient Egyptians invented the 365-day calendar.',
    'The Nile River in Egypt is the longest river in the world.',
    'Ancient Egyptians believed that cats were sacred animals and killing a cat was punishable by death.',
    'Egypt has the largest Arabic-speaking population in the world.'
  ],
  'ZA': [
    'South Africa has 11 official languages.',
    'South Africa is the only country in the world to have hosted the Soccer, Cricket, and Rugby World Cup.',
    'Table Mountain in Cape Town is one of the oldest mountains in the world.',
    'South Africa is the largest producer of platinum in the world.',
    'The world\'s first heart transplant was performed in Cape Town, South Africa, in 1967.'
  ],
  'TR': [
    'Turkey is the only country that spans two continents: Europe and Asia.',
    'Santa Claus (St. Nicholas) was born in Turkey.',
    'Turkey is one of the largest tea producers in the world.',
    'The Turkish city of Istanbul is the only city in the world located on two continents.',
    'Tulips originated in Turkey and were exported to Holland in the 16th century.'
  ],
  'TH': [
    'Thailand is the only Southeast Asian country that was never colonized by a European power.',
    'The name Thailand means "Land of the Free".',
    'Thailand is home to the world\'s largest solid gold Buddha statue.',
    'It\'s illegal to leave your house without underwear in Thailand.',
    'Thailand has more than 35,000 temples.'
  ],
  'ID': [
    'Indonesia is the world\'s largest archipelago, consisting of more than 17,000 islands.',
    'Indonesia has the world\'s largest lizard, the Komodo dragon.',
    'Borobudur in Indonesia is the world\'s largest Buddhist temple.',
    'Indonesia has the third-largest area of rainforest in the world, after Brazil and the Democratic Republic of Congo.',
    'Indonesia is located on the "Ring of Fire", an area with a high degree of tectonic activity.'
  ],
  'NZ': [
    'New Zealand was the first country to give women the right to vote in 1893.',
    'There are more sheep than people in New Zealand, approximately 6 sheep per person.',
    'New Zealand is home to the world\'s smallest dolphin species, the Hector\'s dolphin.',
    'The Lord of the Rings trilogy was filmed in New Zealand.',
    'New Zealand has no land snakes.'
  ],
  'CA': [
    'Canada has more lakes than the rest of the world combined.',
    'Canada is the second-largest country in the world after Russia.',
    'Canada has the longest coastline in the world.',
    'The border between Canada and the US is the longest international border in the world.',
    'Basketball was invented by a Canadian, Dr. James Naismith.'
  ],
  'CH': [
    'Switzerland has four official languages: German, French, Italian, and Romansh.',
    'Switzerland is famous for its neutrality and hasn\'t been involved in a war since 1815.',
    'Switzerland has the highest chocolate consumption per capita in the world.',
    'The Swiss take more train trips than any other country in the world.',
    'The Large Hadron Collider, the world\'s largest and most powerful particle accelerator, is located in Geneva, Switzerland.'
  ],
  'AT': [
    'Austria is home to the oldest zoo in the world, Tiergarten Schönbrunn.',
    'The Austrian flag is one of the oldest national flags in the world.',
    'Austria has been the birthplace of many famous composers, including Mozart, Schubert, and Strauss.',
    'The world\'s oldest restaurant still in operation is in Salzburg, Austria, dating back to 803 AD.',
    'The sewing machine was invented in Austria by Josef Madersperger.'
  ],
  'NL': [
    'The Netherlands has the highest concentration of museums in the world.',
    'Dutch people are the tallest in the world, with an average height of 184 cm for men and 170 cm for women.',
    'The Netherlands is one of the most densely populated countries in Europe.',
    'Approximately 20% of the Netherlands is below sea level.',
    'The famous Dutch tulips actually originated from Turkey.'
  ],
  'SE': [
    'Sweden is one of the most cashless societies, with more than 95% of all transactions being digital.',
    'Sweden has the most islands of any country in the world, approximately 267,570.',
    'The Nobel Prize ceremony is held annually in Stockholm, Sweden.',
    'The Swedish passport is one of the most powerful in the world.',
    'Sweden was the first country in the world to introduce a carbon tax in 1991.'
  ]
};

// Set default facts for countries not in our database
const defaultFacts = [
  'This is a beautiful country with a rich history and culture.',
  'The people here are known for their hospitality and friendliness.',
  'This country has unique cuisine that reflects its history and geographical location.',
  'The landscape ranges from mountains to coastlines, offering diverse natural beauty.',
  'There are many traditions and festivals celebrated throughout the year.'
];

// CORS headers for API Gateway
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  // Handle OPTIONS requests for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS enabled' })
    };
  }

  try {
    // Get current time
    const now = moment();
    
    // Find cities where it's between 5:00 PM and 6:00 PM
    const fiveOClockCities = majorCities.filter(city => {
      const cityTime = moment().tz(city.timezone);
      const hour = cityTime.hour();
      
      // Check if it's exactly 5 PM (17:00)
      if (hour === 17) {
        return true;
      }
      return false;
    });

    // If no cities are having 5 PM right now, select cities where it's recently past 5
    let candidateCities = fiveOClockCities;
    
    if (candidateCities.length === 0) {
      candidateCities = majorCities.filter(city => {
        const cityTime = moment().tz(city.timezone);
        const hour = cityTime.hour();
        const minute = cityTime.minute();
        
        // Check if it's between 5:00 PM and 6:00 PM (17:00 - 18:00)
        // Include all times that are in the 5pm hour or exactly 6:00pm (0 mins)
        return (hour === 17) || (hour === 18 && minute === 0);
      });
    }
    
    // If still no cities, pick a random one (this shouldn't happen often)
    if (candidateCities.length === 0) {
      const randomCity = majorCities[Math.floor(Math.random() * majorCities.length)];
      candidateCities = [randomCity];
    }
    
    // Select a random city from candidates
    const randomCity = candidateCities[Math.floor(Math.random() * candidateCities.length)];
    
    // Get city time
    const cityTime = moment().tz(randomCity.timezone);
    const formattedTime = cityTime.format('h:mm A');
    
    // Calculate how many minutes past 5 PM
    let minutesPast5pm = 0;
    if (cityTime.hour() === 17) {
      minutesPast5pm = cityTime.minute();
    } else if (cityTime.hour() === 18) {
      minutesPast5pm = 60 + cityTime.minute();
    }
    
    // Get country name and facts
    const countryCode = randomCity.country;
    const countryName = countries[countryCode] ? countries[countryCode].name : countryCode;
    
    // Get facts for the country (use default if not in our database)
    const facts = countryFacts[countryCode] || defaultFacts;
    
    // Return the data
    const responseData = {
      city: randomCity.name,
      country: countryName,
      localTime: formattedTime,
      minutesPast5pm: minutesPast5pm,
      countryFacts: facts,
      timezone: randomCity.timezone
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
