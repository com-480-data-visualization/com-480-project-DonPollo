let left = [] ;
let right = [] ;
let names = ['Matches','Wins', 'Draws', 'Losses'];
let left_club_name = '';
let right_club_name = '';

function displayBarChart() {
    var labelArea = 100; // Adjusted for better alignment
    var width = 340; // Adjusted width
    var barHeight = 50;
    var height = barHeight * names.length;
    var chartWidth = width * 2 + labelArea;

    // Remove any existing chart before drawing a new one
    d3.select("#chartContainer").selectAll('*').remove();

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#f4f4f4")
        .style("padding", "5px")
        .style("border", "1px solid #ddd")
        .style("border-radius", "5px")
        .style("opacity", 0);

    var chart = d3.select("#chartContainer")
        .append('svg')
        .attr('class', 'chart')
        .attr('width', chartWidth)
        .attr('height', height)
        .attr('viewBox', `0 0 ${chartWidth} ${height}`) // Ensures responsive design
        .attr('preserveAspectRatio', 'xMidYMid meet'); // Centers the chart

    var y = d3.scaleBand()
        .domain(names)
        .range([0, height])
        .padding(0.1);

    var yPosByIndex = function(d) { return y(d); };

    if (left.length > 0) {
        var xFrom = d3.scaleLinear()
            .domain([0, d3.max(left)])
            .range([0, width]);

        chart.selectAll("rect.left")
            .data(left)
            .enter().append("rect")
            .attr("x", function(d) { return width - xFrom(d) + labelArea / 2; })
            .attr("y", function(d, i) { return y(names[i]); })
            .attr("class", "left")
            .attr("width", xFrom)
            .attr("height", y.bandwidth())
            .on("mouseover", function(event, d) {
                tooltip.transition().duration(200).style("opacity", .7);
                tooltip.html(left_club_name+ ": " + d)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition().duration(500).style("opacity", 0);
            });

        chart.selectAll("text.leftscore")
            .data(left)
            .enter().append("text")
            .attr("x", function(d) { return width - xFrom(d) + labelArea / 2; })
            .attr("y", function(d, i) { return y(names[i]) + y.bandwidth() / 2; })
            .attr("dx", "20")
            .attr("dy", ".36em")
            .attr("text-anchor", "end")
            .attr('class', 'leftscore')
            .text(String);
    }

    chart.selectAll("text.name")
        .data(names)
        .enter().append("text")
        .attr("x", chartWidth / 2 +40)
        .attr("y", function(d) { return y(d) + y.bandwidth() / 2; })
        .attr("dy", ".36em")
        .attr("text-anchor", "middle")
        .attr('class', 'name')
        .text(String);

    if (right.length > 0) {
        var xTo = d3.scaleLinear()
            .domain([0, d3.max(right)])
            .range([0, width]);

        chart.selectAll("rect.right")
            .data(right)
            .enter().append("rect")
            .attr("x", labelArea / 2 + width + labelArea / 2 +40)
            .attr("y", function(d, i) { return y(names[i]); })
            .attr("class", "right")
            .attr("width", xTo)
            .attr("height", y.bandwidth())
            .on("mouseover", function(event, d) {
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(right_club_name+ ": " + d)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition().duration(500).style("opacity", 0);
            });

        chart.selectAll("text.score")
            .data(right)
            .enter().append("text")
            .attr("x", function(d) { return xTo(d) + labelArea / 2 + width + labelArea / 2 +40; })
            .attr("y", function(d, i) { return y(names[i]) + y.bandwidth() / 2; })
            .attr("dx", -5)
            .attr("dy", ".36em")
            .attr("text-anchor", "end")
            .attr('class', 'score')
            .text(String);
    }

    document.getElementById('chartContainer').style.display = 'block';
}


/***********************************************************/


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

                left = [club['MP'],club['W'], club['D'], club['L']];
                left_club_name = club['Squad'];

                // Display the chart
                displayBarChart(names, left, right);

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


let selectedIndex2 = -1; // Index of the currently highlighted club in the suggestions list


// Handle keyboard navigation within the search bar
document.getElementById('teamSearchBar2').addEventListener('keydown', function(event) {
    const suggestionsPanel = document.getElementById('teamSuggestions2');
    const suggestions = suggestionsPanel.querySelectorAll('div');

    if (event.key === 'ArrowDown') {
        // print if the club logo is hidden or not
        console.log("ArrowDown event triggered"); // Debugging line
        // Navigate down in the suggestions list
        if (selectedIndex2 < suggestions.length - 1) {
            selectedIndex2++;
            highlightSelection(suggestions, selectedIndex2);
        }
        event.preventDefault();
    } else if (event.key === 'ArrowUp') {
        // Navigate up in the suggestions list
        if (selectedIndex2 > 0) {
            selectedIndex2--;
            highlightSelection(suggestions, selectedIndex2);
        }
        event.preventDefault();
    } else if (event.key === 'Enter') {
        if (selectedIndex2 > -1 && suggestions[selectedIndex2]) {
            suggestions[selectedIndex2].click();
        }
        event.preventDefault();
    }
});

function highlightSelection(suggestions, index) {
    suggestions.forEach((div, idx) => {
        div.style.backgroundColor = idx === index ? '#f0f0f0' : '';
    });
}


document.getElementById('teamSearchBar2').addEventListener('input', function() {
    let input = this.value.toLowerCase();
    let suggestionsPanel = document.getElementById('teamSuggestions2');
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
                        displayClub2(club.Squad);
                        document.getElementById('teamSearchBar2').value = ''; // Reset the search bar
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

function displayClub2(squadName) {
    fetch('data/teamStatsDf.json')
        .then(response => response.json())
        .then(clubs => {
            let club = clubs.find(club => club.Squad === squadName);
            if (club) {

                document.getElementById('teamLogo2').src = `data/club_logos/${squadName}.png`;
                // log to see if the element is found
                console.log(document.getElementById('teamLogo2').src);
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
                document.getElementById('teamParagraph2').innerHTML = clubInfo;  // Use innerHTML to render the line breaks
                document.getElementById('teamInfo2').style.display = 'block';
                document.getElementById('teamDetails2').style.display = 'block';

                right = [club['MP'],club['W'], club['D'], club['L']];

                right_club_name = club['Squad'];
                // Display the chart
                displayBarChart(names, left, right);

                //print all the position of the element if not hidden
                console.log(document.getElementById('teamInfo2').style.display);

                //print the position of the element

            } else {
                document.getElementById('teamLogo2').style.display = 'none';
                document.getElementById('teamDetails2').style.display = 'none';
            }
        });


}


