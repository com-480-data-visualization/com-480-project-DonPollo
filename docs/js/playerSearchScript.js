
const max = Math.max;
const sin = Math.sin;
const cos = Math.cos;
const HALF_PI = Math.PI / 2;
const margin = { top: 50, right: 80, bottom: 50, left: 80 },
    width = Math.min(700, window.innerWidth / 4) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

const radarChartOptions2 = {
    w: 290,
    h: 350,
    margin: margin,
    maxValue: 100,
    levels: 5,
    roundStrokes: false,
    color: d3.scaleOrdinal().range(["#AFC52F", "#ff6600"]),
    format: '.0f',
    legend: { title: 'Player comparison', translateX: 100, translateY: 40 },
    unit: ''
};

const RadarChart = function RadarChart(parent_selector, data, options) {
    const wrap = (text, width) => {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }//wrap

    const cfg = {
        w: 600,				//Width of the circle
        h: 600,				//Height of the circle
        margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
        levels: 3,				//How many levels or inner circles should there be drawn
        maxValue: 0, 			//What is the value that the biggest circle will represent
        labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35, 	//The opacity of the area of the blob
        dotRadius: 4, 			//The size of the colored circles of each blog
        opacityCircles: 0.1, 	//The opacity of the circles of each blob
        strokeWidth: 2, 		//The width of the stroke around each blob
        roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
        color: d3.scaleOrdinal(d3.schemeCategory10),	//Color function,
        format: '.2%',
        unit: '',
        legend: false
    };

    //Put all of the options into a variable called cfg
    if('undefined' !== typeof options){
        for(var i in options){
            if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
        }//for i
    }//if

    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    // var maxValue = max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
    let maxValue = 0;
    for (let j=0; j < data.length; j++) {
        for (let i = 0; i < data[j].axes.length; i++) {
            data[j].axes[i]['id'] = data[j].name;
            if (data[j].axes[i]['value'] > maxValue) {
                maxValue = data[j].axes[i]['value'];
            }
        }
    }
    maxValue = max(cfg.maxValue, maxValue);

    const allAxis = data[0].axes.map((i, j) => i.axis),	//Names of each axis
        total = allAxis.length,					//The number of different axes
        radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
        Format = d3.format(cfg.format),			 	//Formatting
        angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

    //Scale for the radius
    const rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////
    const parent = d3.select(parent_selector);

    //Remove whatever chart with the same id/class was present before
    parent.select("svg").remove();

    //Initiate the radar chart SVG
    let svg = parent.append("svg")
        .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr("class", "radar");

    //Append a g element
    let g = svg.append("g")
        .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

    /////////////////////////////////////////////////////////
    ////////// Glow filter for some extra pizzazz ///////////
    /////////////////////////////////////////////////////////

    //Filter for the outside glow
    let filter = g.append('defs').append('filter').attr('id','glow'),
        feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
        feMerge = filter.append('feMerge'),
        feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
        feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

    //Wrapper for the grid & axes
    let axisGrid = g.append("g").attr("class", "axisWrapper");

    //Draw the background circles
    axisGrid.selectAll(".levels")
        .data(d3.range(1,(cfg.levels+1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", d => radius / cfg.levels * d)
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter" , "url(#glow)");

    //Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
        .data(d3.range(1,(cfg.levels+1)).reverse())
        .enter().append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", d => -d * radius / cfg.levels)
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "white")
        .text(d => Format(maxValue * d / cfg.levels) + cfg.unit);

    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

    //Create the straight lines radiating outward from the center
    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
    //Append the lines
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScale(maxValue *1.1) * cos(angleSlice * i - HALF_PI))
        .attr("y2", (d, i) => rScale(maxValue* 1.1) * sin(angleSlice * i - HALF_PI))
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", (d,i) => rScale(maxValue * cfg.labelFactor) * cos(angleSlice * i - HALF_PI))
        .attr("y", (d,i) => rScale(maxValue * cfg.labelFactor) * sin(angleSlice * i - HALF_PI))
        .attr("fill", "white")
        .text(d => d)
        .call(wrap, cfg.wrapWidth);

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////

    //The radial line function
    const radarLine = d3.radialLine()
        .curve(d3.curveLinearClosed)
        .radius(d => rScale(d.value))
        .angle((d,i) => i * angleSlice);

    if(cfg.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed)
    }

    //Create a wrapper for the blobs
    const blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");

    //Append the backgrounds
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", d => radarLine(d.axes))
        .style("fill", (d,i) => cfg.color(i))
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function(d, i) {
            //Dim all blobs
            parent.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", 0.1);
            //Bring back the hovered over blob
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", 0.7);
        })
        .on('mouseout', () => {
            //Bring back all blobs
            parent.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", cfg.opacityArea);
        });

    //Create the outlines
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d,i) { return radarLine(d.axes); })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", (d,i) => cfg.color(i))
        .style("fill", "none")
        .style("filter" , "url(#glow)");

    //Append the circles
    blobWrapper.selectAll(".radarCircle")
        .data(d => d.axes)
        .enter()
        .append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", (d,i) => rScale(d.value) * cos(angleSlice * i - HALF_PI))
        .attr("cy", (d,i) => rScale(d.value) * sin(angleSlice * i - HALF_PI))
        .style("fill", (d) => cfg.color(d.id))
        .style("fill-opacity", 0.8);

    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////

    //Wrapper for the invisible circles on top
    const blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");

    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(d => d.axes)
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius * 1.5)
        .attr("cx", (d,i) => rScale(d.value) * cos(angleSlice*i - HALF_PI))
        .attr("cy", (d,i) => rScale(d.value) * sin(angleSlice*i - HALF_PI))
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function(d,i) {
            tooltip
                .attr('x', this.cx.baseVal.value - 10)
                .attr('y', this.cy.baseVal.value - 10)
                .transition()
                .style('display', 'block')
                .text(Format(d.value) + cfg.unit);
        })
        .on("mouseout", function(){
            tooltip.transition()
                .style('display', 'none').text('');
        });

    const tooltip = g.append("text")
        .attr("class", "tooltip")
        .attr('x', 0)
        .attr('y', 0)
        .style("font-size", "12px")
        .style('display', 'none')
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em");

    if (cfg.legend !== false && typeof cfg.legend === "object") {
        let legendZone = svg.append('g');
        let names = data.map(el => el.name);

        let legend = legendZone.append("g")
            .attr("class", "legend")
            .attr("height", 100)
            .attr("width", 200)
            .attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY + 20})`);
        // Create rectangles markers
        legend.selectAll('rect')
            .data(names)
            .enter()
            .append("rect")
            .attr("x", cfg.w - 65)
            .attr("y", (d,i) => i * 20)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", (d,i) => cfg.color(i));
        // Create labels
        legend.selectAll('text')
            .data(names)
            .enter()
            .append("text")
            .attr("x", cfg.w - 52)
            .attr("y", (d,i) => i * 20 + 9)
            .attr("font-size", "11px")
            .attr("fill", "white")
            .text(d => d);
    }
    return svg;
}


let playerStats = [
    {
        name: '',
        axes: [
            {axis: 'pace', value: 0},
            {axis: 'dribbling', value: 0},
            {axis: 'shooting', value: 0},
            {axis: 'defending', value: 0},
            {axis: 'passing', value: 0},
            {axis: 'physicality', value: 0}
        ]
    },
    {
        name: '',
        axes: [
            {axis: 'pace', value: 0},
            {axis: 'dribbling', value: 0},
            {axis: 'shooting', value: 0},
            {axis: 'defending', value: 0},
            {axis: 'passing', value: 0},
            {axis: 'physicality', value: 0}
        ]
    }
];

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
                console.log(playerName);
                document.getElementById('playerCard').style.display = 'block';
                document.getElementById('playerName').textContent = playerName;
                document.getElementById('playerImage').src = `data/players_images/${playerName}.png`;
                document.getElementById('nationImage').src = `data/flags/${player['Nationality_fifa']}.png`;
                document.getElementById('pace').textContent = `PAC: ${parseInt(player['pace_metric'])}`;
                document.getElementById('shooting').textContent = `SHO: ${parseInt(player['shooting_metric'])}`;
                document.getElementById('dribbling').textContent = `DRI: ${parseInt(player['dribble_metric'])}`;
                document.getElementById('physique').textContent = `PHY: ${parseInt(player['physical_metric'])}`;
                document.getElementById('passing').textContent = `PAS: ${parseInt(player['passing_metric'])}`;
                document.getElementById('defending').textContent = `DEF: ${parseInt(player['defensive_metric'])}`;
                document.getElementById('position').textContent = player['Best Position_fifa'];

                const playerInfo = `
                    Age: ${player['Age']} years<br>
                    Height: ${player['Height(in cm)_fifa']} cm<br>
                    Position: ${player['Best Position_fifa']}<br>
                    Market Value: ${player['Value(in Euro)_fifa']} euros<br>
                    Wage: ${player['Wage(in Euro)_fifa']} euros per week
                `;

                document.getElementById('playerInfo').innerHTML = playerInfo;
                document.getElementById('playerDetails').style.display = 'block';

                // Update player stats in the first position of the global variable
                playerStats[0] = {
                    name: playerName,
                    axes: [
                        {axis: 'pace', value: parseInt(player['pace_metric'])},
                        {axis: 'dribbling', value: parseInt(player['dribble_metric'])},
                        {axis: 'shooting', value: parseInt(player['shooting_metric'])},
                        {axis: 'defending', value: parseInt(player['defensive_metric'])},
                        {axis: 'passing', value: parseInt(player['passing_metric'])},
                        {axis: 'physicality', value: parseInt(player['physical_metric'])}
                    ]
                };
                RadarChart('.radarChart', playerStats, radarChartOptions2);
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



let selectedIndex2 = -1; // Index of the currently highlighted player in the suggestions list

document.getElementById('searchBar2').addEventListener('keydown', function(event) {
    const suggestionsPanel = document.getElementById('suggestions2');
    const suggestions = suggestionsPanel.querySelectorAll('div');

    if (event.key === 'ArrowDown') {
        if (selectedIndex2 < suggestions.length - 1) {
            selectedIndex2++;
            highlightSelection(suggestions, selectedIndex2);
        }
        event.preventDefault();
    } else if (event.key === 'ArrowUp') {
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


document.getElementById('searchBar2').addEventListener('input', function() {
    console.log("listeeerrrrrrrrrr");
    let input = this.value.toLowerCase();
    let suggestionsPanel = document.getElementById('suggestions2');
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
                        displayPlayer2(player.Player);
                        document.getElementById('searchBar2').value = '';
                        suggestionsPanel.style.display = 'none';
                        selectedIndex2 = -1;
                    });
                    div.addEventListener('mouseover', function() {
                        selectedIndex2 = Array.from(suggestionsPanel.children).indexOf(div);
                        highlightSelection(suggestionsPanel.querySelectorAll('div'), selectedIndex2);
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


function displayPlayer2(playerName) {
    fetch('data/finalPlayerDf.json')
        .then(response => response.json())
        .then(players => {
            let player = players.find(p => p.Player === playerName);
            if (player) {
                document.getElementById('playerCard2').style.display = 'block';
                document.getElementById('playerName2').textContent = playerName;
                document.getElementById('playerImage2').src = `data/players_images/${playerName}.png`;
                document.getElementById('nationImage2').src = `data/flags/${player['Nationality_fifa']}.png`;
                document.getElementById('pace2').textContent = `PAC: ${parseInt(player['pace_metric'])}`;
                document.getElementById('shooting2').textContent = `SHO: ${parseInt(player['shooting_metric'])}`;
                document.getElementById('dribbling2').textContent = `DRI: ${parseInt(player['dribble_metric'])}`;
                document.getElementById('physique2').textContent = `PHY: ${parseInt(player['physical_metric'])}`;
                document.getElementById('passing2').textContent = `PAS: ${parseInt(player['passing_metric'])}`;
                document.getElementById('defending2').textContent = `DEF: ${parseInt(player['defensive_metric'])}`;
                document.getElementById('position2').textContent = player['Best Position_fifa'];

                const playerInfo = `
                    Age: ${player['Age']} years<br>
                    Height: ${player['Height(in cm)_fifa']} cm<br>
                    Position: ${player['Best Position_fifa']}<br>
                    Market Value: ${player['Value(in Euro)_fifa']} euros<br>
                    Wage: ${player['Wage(in Euro)_fifa']} euros per week
                `;
                document.getElementById('playerInfo2').innerHTML = playerInfo;
                document.getElementById('playerDetails2').style.display = 'block';

                // Update player stats in the second position of the global variable
                playerStats[1] = {
                    name: playerName,
                    axes: [
                        {axis: 'pace', value: parseInt(player['pace_metric'])},
                        {axis: 'dribbling', value: parseInt(player['dribble_metric'])},
                        {axis: 'shooting', value: parseInt(player['shooting_metric'])},
                        {axis: 'defending', value: parseInt(player['defensive_metric'])},
                        {axis: 'passing', value: parseInt(player['passing_metric'])},
                        {axis: 'physicality', value: parseInt(player['physical_metric'])}
                    ]
                };
                RadarChart('.radarChart', playerStats, radarChartOptions2);
            } else {
                document.getElementById('playerName2').textContent = "Player not found";
                document.getElementById('playerCard2').style.display = 'none';
                document.getElementById('playerDetails2').style.display = 'none';
            }
        });
}