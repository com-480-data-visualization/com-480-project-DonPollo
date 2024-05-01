let selectedIndex = -1; // Index of the currently highlighted player in the suggestions list


// Handle keyboard navigation within the search bar
document.getElementById('searchBar').addEventListener('keydown', function(event) {
    const suggestionsPanel = document.getElementById('suggestions');
    const suggestions = suggestionsPanel.querySelectorAll('div');

    if (event.key === 'ArrowDown') {
        // Navigate down in the suggestions list
        if (selectedIndex < suggestions.length - 1) {
            selectedIndex++;
            highlightSelection(suggestions, selectedIndex);
        }
        event.preventDefault();
    } else if (event.key === 'ArrowUp') {
        // Navigate up in the suggestions list
        if (selectedIndex > 0) {
            selectedIndex--;
            highlightSelection(suggestions, selectedIndex);
        }
        event.preventDefault();
    } else if (event.key === 'Enter') {
        // Select the highlighted player with Enter key
        if (selectedIndex > -1 && suggestions[selectedIndex]) {
            suggestions[selectedIndex].click();
        }
        event.preventDefault();
    }
});

// Highlight the selected suggestion
function highlightSelection(suggestions, index) {
    suggestions.forEach((div, idx) => {
        div.style.backgroundColor = idx === index ? '#f0f0f0' : ''; // Highlight only the selected suggestion
    });
}

// Display player data when a player name is selected
function displayPlayer(playerName) {
    fetch('data/finalPlayerDf.json')
        .then(response => response.json())
        .then(players => {
            let player = players.find(p => p.Player === playerName);
            if (player) {
                document.getElementById('playerCard').style.display = 'block';
                document.getElementById('playerName').textContent = playerName;
                document.getElementById('playerImage').src = `data/players_images/${playerName}.png`;
                document.getElementById('nationImage').src = `data/flags/${player['Nation']}.png`;
                document.getElementById('pace').textContent = `PAC: ${parseInt(player['pace_metric'])}`;
                document.getElementById('shooting').textContent = `SHO: ${parseInt(player['shooting_metric'])}`;
                document.getElementById('dribbling').textContent = `DRI: ${parseInt(player['dribble_metric'])}`;
                document.getElementById('physique').textContent = `PHY: ${parseInt(player['physical_metric'])}`;
                document.getElementById('passing').textContent = `PAS: ${parseInt(player['passing_metric'])}`;
                document.getElementById('defending').textContent = `DEF: ${parseInt(player['defensive_metric'])}`;
                document.getElementById('position').textContent = player['Best Position_fifa'];

                // Create a detailed and formatted description of the player
                const playerInfo = `
                    Age: ${player['MP']} years<br>
                    Height: ${player['Height(in cm)_fifa']} cm<br>
                    Position: ${player['Best Position_fifa']}<br>
                     Market Value:: ${player['Value(in Euro)_fifa']} euros <br>
                    Wage: ${player['Wage(in Euro)_fifa'] } euros per week 
                    
                `;
                document.getElementById('playerInfo').innerHTML = playerInfo;  // Use innerHTML to render the line breaks
                document.getElementById('playerDetails').style.display = 'block';
            } else {
                document.getElementById('playerName').textContent = "Player not found";
                document.getElementById('playerCard').style.display = 'none';
                document.getElementById('playerDetails').style.display = 'none';
            }
        });
}



document.getElementById('searchBar').addEventListener('input', function() {
    let input = this.value.toLowerCase();
    let suggestionsPanel = document.getElementById('suggestions');
    if (input.length > 2) {
        fetch('data/finalPlayerDf.json')
            .then(response => response.json())
            .then(players => {
                const filteredPlayers = players.filter(p => p.Player.toLowerCase().includes(input));
                suggestionsPanel.innerHTML = '';
                filteredPlayers.forEach(player => {
                    const div = document.createElement('div');
                    div.textContent = player.Player;
                    div.addEventListener('click', function() {
                        displayPlayer(player.Player);
                        document.getElementById('searchBar').value = ''; // Reset the search bar
                        suggestionsPanel.style.display = 'none'; // Hide the suggestions panel
                        selectedIndex = -1; // Reset selection index
                    });
                    div.addEventListener('mouseover', function() {
                        selectedIndex = Array.from(suggestionsPanel.children).indexOf(div);
                        highlightSelection(suggestionsPanel.querySelectorAll('div'), selectedIndex);
                    });
                    div.addEventListener('mouseout', function() {
                        div.style.backgroundColor = '';
                    });
                    suggestionsPanel.appendChild(div);
                });
                if (filteredPlayers.length > 0) {
                    suggestionsPanel.style.display = 'block';
                } else {
                    suggestionsPanel.style.display = 'none';
                }
            }).catch(error => {
            console.error('Error fetching or processing data:', error);
            suggestionsPanel.innerHTML = '';
            suggestionsPanel.style.display = 'none';
        });
    } else {
        suggestionsPanel.innerHTML = '';
        suggestionsPanel.style.display = 'none';
    }
});



