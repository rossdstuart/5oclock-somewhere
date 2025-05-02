const moment = require('moment-timezone');
const { countries } = require('countries-list');

// Major cities with their timezones and countries
const majorCities = [
  // North America - Eastern Time
  { name: 'New York', timezone: 'America/New_York', country: 'US' },
  { name: 'Toronto', timezone: 'America/New_York', country: 'CA' },
  { name: 'Boston', timezone: 'America/New_York', country: 'US' },
  { name: 'Philadelphia', timezone: 'America/New_York', country: 'US' },
  { name: 'Atlanta', timezone: 'America/New_York', country: 'US' },
  { name: 'Miami', timezone: 'America/New_York', country: 'US' },
  
  // North America - Pacific Time
  { name: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'US' },
  { name: 'San Francisco', timezone: 'America/Los_Angeles', country: 'US' },
  { name: 'Seattle', timezone: 'America/Los_Angeles', country: 'US' },
  { name: 'Vancouver', timezone: 'America/Los_Angeles', country: 'CA' },
  { name: 'Portland', timezone: 'America/Los_Angeles', country: 'US' },
  
  // North America - Alaska Time (UTC-8)
  { name: 'Anchorage', timezone: 'America/Anchorage', country: 'US' },
  { name: 'Juneau', timezone: 'America/Anchorage', country: 'US' },
  { name: 'Fairbanks', timezone: 'America/Anchorage', country: 'US' },
  { name: 'Sitka', timezone: 'America/Anchorage', country: 'US' },
  { name: 'Ketchikan', timezone: 'America/Anchorage', country: 'US' },
  
  // North America - Hawaii Time (UTC-10)
  { name: 'Honolulu', timezone: 'Pacific/Honolulu', country: 'US' },
  { name: 'Hilo', timezone: 'Pacific/Honolulu', country: 'US' },
  { name: 'Kailua', timezone: 'Pacific/Honolulu', country: 'US' },
  { name: 'Waipahu', timezone: 'Pacific/Honolulu', country: 'US' },
  { name: 'Kaneohe', timezone: 'Pacific/Honolulu', country: 'US' },
  
  // Europe - Western
  { name: 'London', timezone: 'Europe/London', country: 'GB' },
  { name: 'Dublin', timezone: 'Europe/London', country: 'IE' },
  { name: 'Lisbon', timezone: 'Europe/London', country: 'PT' },
  { name: 'Edinburgh', timezone: 'Europe/London', country: 'GB' },
  { name: 'Manchester', timezone: 'Europe/London', country: 'GB' },
  
  // Europe - UTC+0
  { name: 'Reykjavik', timezone: 'Atlantic/Reykjavik', country: 'IS' },
  { name: 'Tórshavn', timezone: 'Atlantic/Faroe', country: 'FO' },
  { name: 'Accra', timezone: 'Africa/Accra', country: 'GH' },
  { name: 'Dakar', timezone: 'Africa/Dakar', country: 'SN' },
  { name: 'Abidjan', timezone: 'Africa/Abidjan', country: 'CI' },
  
  // Europe - Central
  { name: 'Paris', timezone: 'Europe/Paris', country: 'FR' },
  { name: 'Amsterdam', timezone: 'Europe/Paris', country: 'NL' },
  { name: 'Brussels', timezone: 'Europe/Paris', country: 'BE' },
  { name: 'Zurich', timezone: 'Europe/Paris', country: 'CH' },
  { name: 'Geneva', timezone: 'Europe/Paris', country: 'CH' },
  
  // Europe - Central (Berlin)
  { name: 'Berlin', timezone: 'Europe/Berlin', country: 'DE' },
  { name: 'Munich', timezone: 'Europe/Berlin', country: 'DE' },
  { name: 'Vienna', timezone: 'Europe/Berlin', country: 'AT' },
  { name: 'Warsaw', timezone: 'Europe/Berlin', country: 'PL' },
  { name: 'Stockholm', timezone: 'Europe/Berlin', country: 'SE' },
  
  // Europe - Central (Madrid)
  { name: 'Madrid', timezone: 'Europe/Madrid', country: 'ES' },
  { name: 'Barcelona', timezone: 'Europe/Madrid', country: 'ES' },
  { name: 'Valencia', timezone: 'Europe/Madrid', country: 'ES' },
  { name: 'Seville', timezone: 'Europe/Madrid', country: 'ES' },
  { name: 'Málaga', timezone: 'Europe/Madrid', country: 'ES' },
  
  // Europe - Central (Rome)
  { name: 'Rome', timezone: 'Europe/Rome', country: 'IT' },
  { name: 'Milan', timezone: 'Europe/Rome', country: 'IT' },
  { name: 'Naples', timezone: 'Europe/Rome', country: 'IT' },
  { name: 'Florence', timezone: 'Europe/Rome', country: 'IT' },
  { name: 'Venice', timezone: 'Europe/Rome', country: 'IT' },
  
  // Eastern Europe
  { name: 'Moscow', timezone: 'Europe/Moscow', country: 'RU' },
  { name: 'St. Petersburg', timezone: 'Europe/Moscow', country: 'RU' },
  { name: 'Kiev', timezone: 'Europe/Moscow', country: 'UA' },
  { name: 'Minsk', timezone: 'Europe/Moscow', country: 'BY' },
  { name: 'Helsinki', timezone: 'Europe/Moscow', country: 'FI' },
  
  // Middle East
  { name: 'Dubai', timezone: 'Asia/Dubai', country: 'AE' },
  { name: 'Abu Dhabi', timezone: 'Asia/Dubai', country: 'AE' },
  { name: 'Riyadh', timezone: 'Asia/Dubai', country: 'SA' },
  { name: 'Doha', timezone: 'Asia/Dubai', country: 'QA' },
  { name: 'Muscat', timezone: 'Asia/Dubai', country: 'OM' },
  
  // South Asia - UTC+5:45 (Nepal - 45 minute offset)
  { name: 'Kathmandu', timezone: 'Asia/Kathmandu', country: 'NP' },
  { name: 'Pokhara', timezone: 'Asia/Kathmandu', country: 'NP' },
  { name: 'Lalitpur', timezone: 'Asia/Kathmandu', country: 'NP' },
  { name: 'Bhaktapur', timezone: 'Asia/Kathmandu', country: 'NP' },
  { name: 'Birgunj', timezone: 'Asia/Kathmandu', country: 'NP' },
  
  // South Asia - India (UTC+5:30)
  { name: 'Mumbai', timezone: 'Asia/Kolkata', country: 'IN' },
  { name: 'New Delhi', timezone: 'Asia/Kolkata', country: 'IN' },
  { name: 'Bangalore', timezone: 'Asia/Kolkata', country: 'IN' },
  { name: 'Chennai', timezone: 'Asia/Kolkata', country: 'IN' },
  { name: 'Kolkata', timezone: 'Asia/Kolkata', country: 'IN' },
  
  // South Asia - Sri Lanka (UTC+5:30)
  { name: 'Colombo', timezone: 'Asia/Colombo', country: 'LK' },
  { name: 'Kandy', timezone: 'Asia/Colombo', country: 'LK' },
  { name: 'Galle', timezone: 'Asia/Colombo', country: 'LK' },
  { name: 'Jaffna', timezone: 'Asia/Colombo', country: 'LK' },
  { name: 'Negombo', timezone: 'Asia/Colombo', country: 'LK' },
  
  // Central Asia (UTC+6)
  { name: 'Dhaka', timezone: 'Asia/Dhaka', country: 'BD' },
  { name: 'Chittagong', timezone: 'Asia/Dhaka', country: 'BD' },
  { name: 'Khulna', timezone: 'Asia/Dhaka', country: 'BD' },
  { name: 'Thimphu', timezone: 'Asia/Thimphu', country: 'BT' },
  { name: 'Astana', timezone: 'Asia/Almaty', country: 'KZ' },
  
  // Southeast Asia (UTC+7)
  { name: 'Bangkok', timezone: 'Asia/Bangkok', country: 'TH' },
  { name: 'Hanoi', timezone: 'Asia/Bangkok', country: 'VN' },
  { name: 'Phnom Penh', timezone: 'Asia/Bangkok', country: 'KH' },
  { name: 'Ho Chi Minh City', timezone: 'Asia/Ho_Chi_Minh', country: 'VN' },
  { name: 'Yangon', timezone: 'Asia/Yangon', country: 'MM' },
  
  // East Asia - Japan (UTC+9)
  { name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'JP' },
  { name: 'Osaka', timezone: 'Asia/Tokyo', country: 'JP' },
  { name: 'Kyoto', timezone: 'Asia/Tokyo', country: 'JP' },
  { name: 'Sapporo', timezone: 'Asia/Tokyo', country: 'JP' },
  { name: 'Yokohama', timezone: 'Asia/Tokyo', country: 'JP' },
  
  // Oceania - Australia (UTC+10)
  { name: 'Sydney', timezone: 'Australia/Sydney', country: 'AU' },
  { name: 'Melbourne', timezone: 'Australia/Sydney', country: 'AU' },
  { name: 'Brisbane', timezone: 'Australia/Sydney', country: 'AU' },
  { name: 'Canberra', timezone: 'Australia/Sydney', country: 'AU' },
  { name: 'Newcastle', timezone: 'Australia/Sydney', country: 'AU' },
  
  // Oceania - Australia (UTC+10:30 - 30 minute offset)
  { name: 'Adelaide', timezone: 'Australia/Adelaide', country: 'AU' },
  { name: 'Darwin', timezone: 'Australia/Darwin', country: 'AU' },
  { name: 'Alice Springs', timezone: 'Australia/Adelaide', country: 'AU' },
  { name: 'Port Lincoln', timezone: 'Australia/Adelaide', country: 'AU' },
  { name: 'Mount Gambier', timezone: 'Australia/Adelaide', country: 'AU' },
  
  // Oceania - New Zealand (UTC+12)
  { name: 'Auckland', timezone: 'Pacific/Auckland', country: 'NZ' },
  { name: 'Wellington', timezone: 'Pacific/Auckland', country: 'NZ' },
  { name: 'Christchurch', timezone: 'Pacific/Auckland', country: 'NZ' },
  { name: 'Hamilton', timezone: 'Pacific/Auckland', country: 'NZ' },
  { name: 'Dunedin', timezone: 'Pacific/Auckland', country: 'NZ' },
  
  // East Asia - China (UTC+8)
  { name: 'Shanghai', timezone: 'Asia/Shanghai', country: 'CN' },
  { name: 'Beijing', timezone: 'Asia/Shanghai', country: 'CN' },
  { name: 'Guangzhou', timezone: 'Asia/Shanghai', country: 'CN' },
  { name: 'Shenzhen', timezone: 'Asia/Shanghai', country: 'CN' },
  { name: 'Chengdu', timezone: 'Asia/Shanghai', country: 'CN' },
  
  // East Asia - Hong Kong (UTC+8)
  { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', country: 'HK' },
  { name: 'Macau', timezone: 'Asia/Hong_Kong', country: 'MO' },
  { name: 'Taipei', timezone: 'Asia/Hong_Kong', country: 'TW' },
  { name: 'Kaohsiung', timezone: 'Asia/Hong_Kong', country: 'TW' },
  { name: 'Taichung', timezone: 'Asia/Hong_Kong', country: 'TW' },
  
  // East Asia - Korea (UTC+9)
  { name: 'Seoul', timezone: 'Asia/Seoul', country: 'KR' },
  { name: 'Busan', timezone: 'Asia/Seoul', country: 'KR' },
  { name: 'Incheon', timezone: 'Asia/Seoul', country: 'KR' },
  { name: 'Daegu', timezone: 'Asia/Seoul', country: 'KR' },
  { name: 'Daejeon', timezone: 'Asia/Seoul', country: 'KR' },
  
  // Southeast Asia (UTC+8)
  { name: 'Singapore', timezone: 'Asia/Singapore', country: 'SG' },
  { name: 'Kuala Lumpur', timezone: 'Asia/Singapore', country: 'MY' },
  { name: 'Jakarta', timezone: 'Asia/Singapore', country: 'ID' },
  { name: 'Manila', timezone: 'Asia/Manila', country: 'PH' },
  { name: 'Denpasar', timezone: 'Asia/Makassar', country: 'ID' },
  
  // South America (UTC-3)
  { name: 'São Paulo', timezone: 'America/Sao_Paulo', country: 'BR' },
  { name: 'Rio de Janeiro', timezone: 'America/Sao_Paulo', country: 'BR' },
  { name: 'Brasília', timezone: 'America/Sao_Paulo', country: 'BR' },
  { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', country: 'AR' },
  { name: 'Santiago', timezone: 'America/Santiago', country: 'CL' },
  
  // South America - Newfoundland (UTC-3:30 - 30 minute offset)
  { name: 'St. John\'s', timezone: 'America/St_Johns', country: 'CA' },
  { name: 'Mount Pearl', timezone: 'America/St_Johns', country: 'CA' },
  { name: 'Corner Brook', timezone: 'America/St_Johns', country: 'CA' },
  { name: 'Conception Bay South', timezone: 'America/St_Johns', country: 'CA' },
  { name: 'Paradise', timezone: 'America/St_Johns', country: 'CA' },
  
  // Central America (UTC-6)
  { name: 'Mexico City', timezone: 'America/Mexico_City', country: 'MX' },
  { name: 'Guadalajara', timezone: 'America/Mexico_City', country: 'MX' },
  { name: 'Monterrey', timezone: 'America/Mexico_City', country: 'MX' },
  { name: 'Guatemala City', timezone: 'America/Guatemala', country: 'GT' },
  { name: 'San Salvador', timezone: 'America/El_Salvador', country: 'SV' },
  
  // Africa - North
  { name: 'Cairo', timezone: 'Africa/Cairo', country: 'EG' },
  { name: 'Alexandria', timezone: 'Africa/Cairo', country: 'EG' },
  { name: 'Casablanca', timezone: 'Africa/Casablanca', country: 'MA' },
  { name: 'Algiers', timezone: 'Africa/Algiers', country: 'DZ' },
  { name: 'Tunis', timezone: 'Africa/Tunis', country: 'TN' },
  
  // Africa - South
  { name: 'Cape Town', timezone: 'Africa/Johannesburg', country: 'ZA' },
  { name: 'Johannesburg', timezone: 'Africa/Johannesburg', country: 'ZA' },
  { name: 'Durban', timezone: 'Africa/Johannesburg', country: 'ZA' },
  { name: 'Pretoria', timezone: 'Africa/Johannesburg', country: 'ZA' },
  { name: 'Gaborone', timezone: 'Africa/Gaborone', country: 'BW' },
  
  // Turkey
  { name: 'Istanbul', timezone: 'Europe/Istanbul', country: 'TR' },
  { name: 'Ankara', timezone: 'Europe/Istanbul', country: 'TR' },
  { name: 'Izmir', timezone: 'Europe/Istanbul', country: 'TR' },
  { name: 'Antalya', timezone: 'Europe/Istanbul', country: 'TR' },
  { name: 'Bursa', timezone: 'Europe/Istanbul', country: 'TR' },

  // Unique 30/45 minute offset timezones (additional locations)
  { name: 'Kabul', timezone: 'Asia/Kabul', country: 'AF' }, // UTC+4:30
  { name: 'Tehran', timezone: 'Asia/Tehran', country: 'IR' }, // UTC+3:30
  { name: 'Marquesas Islands', timezone: 'Pacific/Marquesas', country: 'PF' }, // UTC-9:30
  { name: 'Eucla', timezone: 'Australia/Eucla', country: 'AU' }, // UTC+8:45
  { name: 'Chatham Islands', timezone: 'Pacific/Chatham', country: 'NZ' }, // UTC+12:45
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
    'Dutch people are the tallest in the world on average.',
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
  ],
  'IS': [
    'Iceland has no standing army, navy or air force.',
    'Over 60% of the Icelandic population lives in Reykjavík.',
    'Iceland runs almost entirely on renewable energy.',
    'The Icelandic phone book is listed by first name, not surname.',
    'Icelanders believe in elves and many won\'t build on land where elves supposedly live.'
  ],
  'FO': [
    'The Faroe Islands have more sheep than people - about 70,000 people and 80,000 sheep.',
    'The name "Faroe" comes from the Old Norse word for sheep, reflecting the islands\' primary livestock.',
    'There are no trees native to the Faroe Islands due to the harsh weather conditions.',
    'Every house in the Faroe Islands is no more than 5km from the ocean.',
    'The Faroe Islands have their own language, Faroese, which is derived from Old Norse.'
  ],
  'GH': [
    'Ghana was the first sub-Saharan African country to gain independence from colonial rule in 1957.',
    'The word "Ghana" means "Warrior King" in the Soninke language.',
    'Ghana is the world\'s second-largest producer of cocoa, after Ivory Coast.',
    'Lake Volta in Ghana is the largest artificial lake in the world by surface area.',
    'Ghana\'s flag has the Pan-African colors — red, gold, and green — with a black star in the center.'
  ],
  'SN': [
    'Senegal is named after the Senegal River, which forms the northern border of the country.',
    'Senegal\'s national symbol is the baobab tree, which can live for thousands of years.',
    'Wrestling, not soccer, is actually the national sport of Senegal.',
    'Senegal was once part of the Mali Empire, one of the wealthiest empires in African history.',
    'The Pink Lake of Senegal (Lake Retba) is one of the few pink lakes in the world, colored by algae.'
  ],
  'CI': [
    'Côte d\'Ivoire (Ivory Coast) is the world\'s largest producer and exporter of cocoa beans.',
    'The country\'s economic capital, Abidjan, is sometimes called the "Paris of West Africa."',
    'Côte d\'Ivoire has two official capitals: Yamoussoukro is the political capital, while Abidjan is the economic capital.',
    'The Basilica of Our Lady of Peace in Yamoussoukro is the largest church in the world, even larger than St. Peter\'s Basilica in Vatican City.',
    'Despite its name, the ivory trade was not the main commerce in Ivory Coast\'s history; it was primarily gold and slaves.'
  ],
  'NP': [
    'Nepal is the only country in the world with a non-rectangular flag. It consists of two triangles stacked on each other.',
    'Mount Everest, the highest mountain in the world, is on the border of Nepal and Tibet/China.',
    'Nepal has never been colonized by any foreign power.',
    'Nepal observes its own calendar, Vikram Samvat, which is approximately 56.7 years ahead of the Gregorian calendar.',
    'The birthplace of Buddha, Lumbini, is located in Nepal.'
  ],
  'LK': [
    'Sri Lanka was formerly known as Ceylon until 1972.',
    'Sri Lanka is the world\'s fourth-largest producer of tea.',
    'Sri Lanka is known as the "Pearl of the Indian Ocean" due to its shape and location.',
    'Sri Lanka has one of the highest literacy rates in Asia, at over 90%.',
    'The national sport of Sri Lanka is volleyball, not cricket, despite cricket being more popular.'
  ],
  'BD': [
    'Bangladesh has the eighth-largest population in the world.',
    'The Bengal tiger, the national animal of Bangladesh, is the largest big cat species after the tiger.',
    'The Sundarbans in Bangladesh is the largest mangrove forest in the world.',
    'Bangladesh is one of the largest garment exporters in the world, second only to China.',
    'The world\'s longest uninterrupted natural beach, Cox\'s Bazar, stretches 120 kilometers along Bangladesh\'s coast.'
  ],
  'BT': [
    'Bhutan measures prosperity by Gross National Happiness instead of GDP.',
    'Bhutan is a carbon-negative country - it absorbs more carbon than it produces.',
    'The Bhutanese name for Bhutan, Druk Yul, means "Land of the Thunder Dragon."',
    'Bhutan was completely isolated from the outside world until the 1970s. Television and internet were only introduced in 1999.',
    'Plastic bags have been banned in Bhutan since 1999, making it one of the first countries to implement such a ban.'
  ],
  'KZ': [
    'Kazakhstan is the ninth-largest country in the world by land area, but has one of the lowest population densities.',
    'The world\'s first and largest space launch facility, the Baikonur Cosmodrome, is in Kazakhstan.',
    'Kazakhstan is home to the original wild apple forests, and is believed to be where apples originated.',
    'The national instrument of Kazakhstan, the dombra, has only two strings.',
    'Kazakhstan\'s flag is the only national flag designed with a golden sun and eagle on a sky-blue background.'
  ],
  'KH': [
    'Cambodia\'s Angkor Wat is the largest religious monument in the world.',
    'The Cambodian flag is the only national flag that features a building.',
    'Cambodia has one of the youngest populations in Southeast Asia, with about 65% under the age of 30.',
    'Cambodians celebrate their New Year, Chaul Chnam Thmey, in April rather than January.',
    'Traditional Khmer houses in Cambodia are built on stilts to avoid flooding in the rainy season.'
  ],
  'VN': [
    'Vietnam is the world\'s largest exporter of cashew nuts and black pepper.',
    'The Vietnamese alphabet is a Latin script with additional diacritics for tones and certain letters.',
    'Vietnam is the second-largest coffee producer in the world, after Brazil.',
    'Vietnam has the world\'s largest cave passage, Son Doong Cave, which is large enough to fit a 40-story skyscraper.',
    'The Vietnamese New Year, Tết, is the most important celebration in Vietnamese culture and marks the arrival of spring.'
  ],
  'MM': [
    'Myanmar (Burma) has 135 distinct ethnic groups officially recognized by the government.',
    'Myanmar is one of only three countries in the world that haven\'t adopted the metric system.',
    'Thanaka, a yellowish-white cosmetic paste made from ground bark, has been used by Burmese women for over 2,000 years.',
    'Shwedagon Pagoda in Yangon contains more gold than the Bank of England\'s vaults.',
    'Myanmar\'s Inle Lake is known for its unusual "leg rowers" - fishermen who row their boats with one leg wrapped around an oar.'
  ],
  'PF': [
    'French Polynesia includes 118 islands and atolls spread across an area as large as Western Europe.',
    'The overwater bungalow was invented in French Polynesia in the 1960s.',
    'Tahitian pearls, also known as black pearls, are one of French Polynesia\'s main exports.',
    'The Marquesas Islands influenced numerous artists and writers, including Paul Gauguin and Robert Louis Stevenson.',
    'French Polynesia\'s islands were formed by underwater volcanic activity and are slowly sinking back into the ocean.'
  ],
  'NL': [
    'The Netherlands has more bicycles than people.',
    'About one-third of the Netherlands is below sea level.',
    'The Dutch are the tallest people in the world on average.',
    'Tulips, which the Netherlands is famous for, actually originated in Turkey.',
    'The Netherlands is the world\'s second-largest exporter of agricultural products, after the US.'
  ],
  'BE': [
    'Belgium produces over 220,000 tons of chocolate per year.',
    'Belgium has the most castles per square kilometer in the world.',
    'French fries were actually invented in Belgium, not France.',
    'Belgium has three official languages: Dutch, French, and German.',
    'The Belgian city of Spa gave its name to spa resorts around the world.'
  ],
  'DZ': [
    'Algeria is the largest country in Africa by land area.',
    'The Sahara Desert covers more than 80% of Algeria\'s land.',
    'Algeria has one of the largest reserves of natural gas in the world.',
    'The traditional Algerian dish couscous has been recognized by UNESCO as an intangible cultural heritage.',
    'The ancient Roman ruins of Timgad and Djémila in Algeria are UNESCO World Heritage sites.'
  ],
  'TN': [
    'Tunisia is where George Lucas filmed the iconic desert planet Tatooine scenes for Star Wars.',
    'Tunisia is home to the ancient city of Carthage, once the center of a powerful empire.',
    'Tunisia was the first country in the Arab world to abolish polygamy in 1956.',
    'The town of Matmata in Tunisia is known for its underground cave dwellings.',
    'Tunisia is the northernmost country in Africa.'
  ],
  'BW': [
    'Botswana has the world\'s largest elephant population.',
    'The Okavango Delta in Botswana is the world\'s largest inland delta.',
    'Botswana has one of the lowest population densities in the world.',
    'Botswana is one of the world\'s largest diamond producers.',
    'The national currency of Botswana, the Pula, means "rain" in Setswana - reflecting how precious water is in this semi-arid country.'
  ],
  'AF': [
    'Afghanistan has 14 borders, making it one of the most landlocked countries in the world.',
    'Afghanistan is sometimes called the "Graveyard of Empires" due to the many empires that failed to conquer it.',
    'The national sport of Afghanistan is Buzkashi, a game played on horseback with a goat carcass as the ball.',
    'Afghanistan has been inhabited for over 50,000 years.',
    'Afghanistan is the world\'s largest producer of opium.'
  ],
  'IR': [
    'Iran is home to one of the world\'s oldest civilizations, with urban settlements dating back to 7000 BCE.',
    'Iran (Persia) invented the world\'s first practical refrigerator, called a Yakhchāl, over 2400 years ago.',
    'The word "paradise" comes from the ancient Persian word "pairidaeza" meaning walled garden.',
    'Iran has 24 UNESCO World Heritage Sites, making it one of the richest countries in terms of archaeological sites.',
    'Chess originated in ancient Persia (now Iran).'
  ],
  'MO': [
    'Macau is the most densely populated region in the world.',
    'Macau\'s economy relies heavily on gambling and tourism, with its casinos generating more revenue than Las Vegas.',
    'Macau was the first and last European colony in China, having been administered by Portugal for over 400 years.',
    'Macau has a unique cuisine called Macanese cuisine, which is a fusion of Portuguese and Chinese cooking.',
    'The Historic Centre of Macau is a UNESCO World Heritage Site with a blend of Portuguese and Chinese architecture.'
  ],
  'TW': [
    'Taiwan is home to the world\'s largest collection of Chinese art treasures, housed in the National Palace Museum.',
    'Taiwan has one of the highest densities of convenience stores in the world.',
    'Taiwan\'s Taipei 101 was the world\'s tallest building from 2004 to 2010.',
    'Taiwan is known for its night markets, with over 300 spread across the island.',
    'Taiwan produces some of the world\'s most advanced semiconductor chips.'
  ],
  'PH': [
    'The Philippines is composed of about 7,641 islands.',
    'The Philippines is the world\'s largest supplier of nurses.',
    'Text messaging was first introduced to the world as a commercial service in the Philippines in 1994.',
    'The Philippines is home to the world\'s smallest primate, the tarsier.',
    'The Filipino language has over 180 native languages and dialects.'
  ],
  'AR': [
    'Argentina is home to both the highest and lowest points in South America.',
    'Argentina has the highest number of psychologists per capita in the world.',
    'The tango dance originated in the working-class port neighborhoods of Buenos Aires.',
    'Argentina was the first country in the Americas to legalize same-sex marriage in 2010.',
    'The national dish of Argentina is asado, a traditional barbecue.'
  ],
  'CL': [
    'Chile is the world\'s longest country from north to south, stretching over 2,600 miles.',
    'Chile is one of the world\'s largest producers of copper.',
    'The Atacama Desert in Chile is the driest non-polar desert in the world.',
    'Chile\'s Easter Island (Rapa Nui) is famous for its nearly 1,000 monumental statues called Moai.',
    'Chile has the largest swimming pool in the world, located at the San Alfonso del Mar resort.'
  ],
  'GT': [
    'Guatemala\'s currency, the Quetzal, is named after the national bird of Guatemala.',
    'Guatemala is known as the Land of the Eternal Spring due to its consistent temperate climate.',
    'Lake Atitlán in Guatemala was described by Aldous Huxley as "the most beautiful lake in the world."',
    'Antigua Guatemala, a colonial city, is a UNESCO World Heritage site.',
    'Guatemala is home to 33 volcanoes, of which three remain active.'
  ],
  'SV': [
    'El Salvador is the smallest country in Central America, often called the "Tom Thumb of the Americas."',
    'El Salvador is the only Central American country without a Caribbean coastline.',
    'El Salvador has adopted Bitcoin as legal tender, making it the first country in the world to do so.',
    'El Salvador is known as the Land of Volcanoes, with over 20 volcanoes in its small territory.',
    'Pupusas, thick corn tortillas filled with cheese, beans or meat, are El Salvador\'s national dish.'
  ],
  'MA': [
    'Morocco has the oldest university in the world still in operation, the University of Al Quaraouiyine, founded in 859 CE.',
    'The blue city of Chefchaouen in Morocco has buildings painted various shades of blue to repel mosquitoes and symbolize the sky and heaven.',
    'Morocco is the only African country that is not a member of the African Union.',
    'The movie "Casablanca" was not actually filmed in the Moroccan city of Casablanca, but on a Hollywood set.',
    'Morocco produces more sardines than any other country in the world.'
  ]
};

// National drinks for countries that have one
const countryDrinks = {
  'US': 'Bourbon Whiskey',
  'GB': 'Tea (though some would say ale or gin)',
  'FR': 'Wine (specifically Champagne)',
  'DE': 'Beer',
  'IT': 'Wine (many varieties like Chianti, Barolo)',
  'RU': 'Vodka',
  'JP': 'Sake',
  'MX': 'Tequila',
  'IE': 'Guinness',
  'JM': 'Rum',
  'CU': 'Rum (specifically Havana Club)',
  'KR': 'Soju',
  'CN': 'Baijiu',
  'TR': 'Raki',
  'GR': 'Ouzo',
  'PL': 'Vodka',
  'PE': 'Pisco',
  'CL': 'Pisco Sour',
  'BR': 'Caipirinha',
  'SE': 'Akvavit',
  'FI': 'Koskenkorva Vodka',
  'PT': 'Port Wine',
  'ES': 'Sangria',
  'AR': 'Mate (or Fernet)',
  'PR': 'Piña Colada',
  'TH': 'Mekhong (Thai whiskey)',
  'SG': 'Singapore Sling',
  'IN': 'Toddy (or Chai)',
  'IS': 'Brennivín',
  'NP': 'Raksi',
  'LK': 'Arrack',
  'CH': 'Absinthe',
  'NL': 'Jenever (Gin)',
  'KZ': 'Kumis',
  'VN': 'Rượu đế (Rice wine)',
  'MA': 'Mint Tea',
  'TN': 'Boukha (Fig liquor)'
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
    
    // Find cities where it's between 5:00 PM and 6:00 PM (17:00 - 18:00)
    let candidateCities = majorCities.filter(city => {
      const cityTime = moment().tz(city.timezone);
      const hour = cityTime.hour();
      const minute = cityTime.minute();
      
      // Check if it's between 5:00 PM and 6:00 PM (17:00 - 18:00)
      // Include all times that are in the 5pm hour or exactly 6:00pm (0 mins)
      return (hour === 17) || (hour === 18 && minute === 0);
    });
    
    // Select a city from those in the 5-6pm window
    let randomCity;
    
    if (candidateCities.length > 0) {
      // We have cities in the 5-6pm window, randomly select one
      randomCity = candidateCities[Math.floor(Math.random() * candidateCities.length)];
    } else {
      // No cities are in the 5-6 PM window, select a random city as a fallback
      randomCity = majorCities[Math.floor(Math.random() * majorCities.length)];
    }
    
    // Get city time
    const cityTime = moment().tz(randomCity.timezone);
    const formattedTime = cityTime.format('h:mm A');
    
    // Calculate how many minutes past 5 PM
    let minutesPast5pm = 0;
    if (cityTime.hour() === 17) {
      minutesPast5pm = cityTime.minute();
    } else if (cityTime.hour() === 18) {
      minutesPast5pm = 60;
    }
    
    // Get country name and facts
    const countryCode = randomCity.country;
    const countryName = countries[countryCode] ? countries[countryCode].name : countryCode;
    
    // Get facts for the country (use default if not in our database)
    const facts = countryFacts[countryCode] || defaultFacts;
    
    // Get national drink if it exists
    const nationalDrink = countryDrinks[countryCode] || null;
    
    // Return the data
    const responseData = {
      city: randomCity.name,
      country: countryName,
      localTime: formattedTime,
      minutesPast5pm: minutesPast5pm,
      countryFacts: facts,
      timezone: randomCity.timezone,
      nationalDrink: nationalDrink
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
