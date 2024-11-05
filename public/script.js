document.querySelector('.refresh-button').addEventListener('click', fetchTickers);

function fetchTickers() {
    fetch('/api/tickers')
        .then(response => response.json())
        .then(data => {
            const tickerDataElement = document.getElementById('ticker-data');
            tickerDataElement.innerHTML = ''; // Clear previous data
            data.forEach(ticker => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${ticker.name}</td>
                    <td>${ticker.last}</td>
                    <td>${ticker.buy}</td>
                    <td>${ticker.sell}</td>
                    <td>${ticker.volume}</td>
                    <td>${ticker.base_unit}</td>
                `;
                tickerDataElement.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}
