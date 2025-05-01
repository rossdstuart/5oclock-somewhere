document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const cityNameElement = document.getElementById('cityName');
    const localTimeElement = document.getElementById('localTime');
    const timeAgoElement = document.getElementById('timeAgo');
    const countryNameElement = document.getElementById('countryName');
    const countryFactsElement = document.getElementById('countryFacts');
    const refreshButton = document.getElementById('refreshBtn');

    // Get API endpoint from configuration
    const API_ENDPOINT = window.config.apiEndpoint;

    // Fetch a city where it's recently past 5pm and display it
    const fetchFiveOClockCity = async () => {
        try {
            // Show loading state
            cityNameElement.textContent = 'Finding a city...';
            localTimeElement.textContent = 'Local time: --:--';
            timeAgoElement.textContent = "It's been 5pm for -- minutes";
            countryNameElement.textContent = 'Loading...';
            countryFactsElement.innerHTML = '<p>Loading fun facts...</p>';
            
            // Fetch data from our API
            const response = await fetch(API_ENDPOINT);
            
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            
            const data = await response.json();
            
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
        } catch (error) {
            console.error('Error fetching data:', error);
            cityNameElement.textContent = 'Error loading data';
            countryFactsElement.innerHTML = '<p>Unable to load city information. Please try again.</p>';
        }
    };

    // Initial fetch
    fetchFiveOClockCity();

    // Add event listener to refresh button
    refreshButton.addEventListener('click', fetchFiveOClockCity);
});
