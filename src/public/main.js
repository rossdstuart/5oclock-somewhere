document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const cityNameElement = document.getElementById('cityName');
    const localTimeElement = document.getElementById('localTime');
    const timeAgoElement = document.getElementById('timeAgo');
    const countryNameElement = document.getElementById('countryName');
    const countryFactsElement = document.getElementById('countryFacts');
    const nationalDrinkContainer = document.getElementById('nationalDrinkContainer');
    const nationalDrinkElement = document.getElementById('nationalDrink');
    const refreshButton = document.getElementById('refreshBtn');

    // Get API endpoint from configuration
    const API_ENDPOINT = window.config.apiEndpoint;

    // Fetch a city where it's currently 5-6pm and display it
    const fetchFiveOClockCity = async () => {
        try {
            // Show loading state
            cityNameElement.textContent = 'Finding a city...';
            localTimeElement.textContent = 'Local time: --:--';
            timeAgoElement.textContent = "It's been 5pm for -- minutes";
            countryNameElement.textContent = 'Loading...';
            countryFactsElement.innerHTML = '<p>Loading fun facts...</p>';
            nationalDrinkContainer.style.display = 'none';
            
            // Check if we need to use the random parameter
            const isRandom = refreshButton.getAttribute('data-clicked') === 'true';
            const endpoint = isRandom ? `${API_ENDPOINT}?random=true` : API_ENDPOINT;
            
            // Fetch data from our API
            const response = await fetch(endpoint);
            
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            
            const data = await response.json();
            console.log('API Response:', data); // Debug log
            
            // Update the UI with the fetched data
            cityNameElement.textContent = data.city;
            localTimeElement.textContent = `Local time: ${data.localTime}`;
            timeAgoElement.textContent = `It's been 5pm for ${data.minutesPast5pm} minutes`;
            countryNameElement.textContent = data.country;
            
            // Display country facts
            countryFactsElement.innerHTML = '';
            data.countryFacts.forEach(fact => {
                const factElement = document.createElement('p');
                factElement.textContent = fact;
                countryFactsElement.appendChild(factElement);
            });
            
            // Display national drink if available
            if (data.nationalDrink) {
                nationalDrinkElement.textContent = data.nationalDrink;
                nationalDrinkContainer.style.display = 'block';
            } else {
                nationalDrinkContainer.style.display = 'none';
            }
            
            // Reset the button data attribute
            refreshButton.setAttribute('data-clicked', 'false');
        } catch (error) {
            console.error('Error fetching data:', error);
            cityNameElement.textContent = 'Error loading data';
            countryFactsElement.innerHTML = '<p>Unable to load city information. Please try again.</p>';
            nationalDrinkContainer.style.display = 'none';
        }
    };

    // Initial fetch
    fetchFiveOClockCity();

    // Add event listener to refresh button
    refreshButton.addEventListener('click', () => {
        refreshButton.setAttribute('data-clicked', 'true');
        fetchFiveOClockCity();
    });
});
