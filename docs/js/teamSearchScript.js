let selectedIndex = -1; // Index of the currently highlighted club in the suggestions list


// Handle keyboard navigation within the search bar
document.getElementById('teamSearchBar').addEventListener('keydown', function(event) {
    const suggestionsPanel = document.getElementById('teamSuggestions');
    const suggestions = suggestionsPanel.querySelectorAll('div');

    if (event.key === 'ArrowDown') {
        // print if the club logo is hidden or not
        console.log("ArrowDown event triggered"); // Debugging line
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
        if (selectedIndex > -1 && suggestions[selectedIndex]) {
            suggestions[selectedIndex].click();
        }
        event.preventDefault();
    }
});

function highlightSelection(suggestions, index) {
    suggestions.forEach((div, idx) => {
        div.style.backgroundColor = idx === index ? '#f0f0f0' : '';
    });
}


document.getElementById('teamSearchBar').addEventListener('input', function() {
    let input = this.value.toLowerCase();
    let suggestionsPanel = document.getElementById('teamSuggestions');
    if (input.length > 2) {
        fetch('data/teamStatsDf.json')
            .then(response => response.json())
            .then(clubs => {
                const filteredClubs = clubs.filter(club => club.Squad.toLowerCase().includes(input));
                suggestionsPanel.innerHTML = '';
                filteredClubs.forEach(club => {
                    const div = document.createElement('div');
                    div.textContent = club.Squad;
                    div.addEventListener('click', function() {
                        displayClub(club.Squad);
                        document.getElementById('teamSearchBar').value = ''; // Reset the search bar
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
                if (filteredClubs.length > 0) {
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

function displayClub(squadName) {
    fetch('data/teamStatsDf.json')
        .then(response => response.json())
        .then(clubs => {
            let club = clubs.find(club => club.Squad === squadName);
            if (club) {

                document.getElementById('teamLogo').src = `data/club_logos/${squadName}.png`;
                // log to see if the element is found
                console.log(document.getElementById('teamLogo').src);
                const clubInfo = `
                    country: ${club['Country']} <br>
                    league Rank: ${club['LgRk']} <br>
                    league Points: ${club['Pts']} <br>
                    matches played: ${club['MP']} <br>
                    wins: ${club['W']} <br>
                    draws: ${club['D']} <br>
                    losses: ${club['L']} <br>
                    top team scorer: ${club['Top Team Scorer']} <br>
                    goalkeeper: ${club['Goalkeeper']} <br>
                    
                    
                     `;
                document.getElementById('teamParagraph').innerHTML = clubInfo;  // Use innerHTML to render the line breaks
                document.getElementById('teamInfo').style.display = 'block';
                document.getElementById('teamDetails').style.display = 'block';

                //print all the position of the element if not hidden
                console.log(document.getElementById('teamInfo').style.display);

                //print the position of the element

            } else {
                document.getElementById('teamLogo').style.display = 'none';
                document.getElementById('teamDetails').style.display = 'none';
            }
        });
}