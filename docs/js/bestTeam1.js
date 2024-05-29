document.addEventListener("DOMContentLoaded", function() {
    const players = [
        { name: "Courtois", team: "Real Madrid", img: "courtois.jpg", x: 50, y: 500, stats: "Stats for Courtois" },
        { name: "Robertson", team: "Liverpool", img: "robertson.jpg", x: 100, y: 400, stats: "Stats for Robertson" },
        { name: "Van Dijk", team: "Liverpool", img: "vandijk.jpg", x: 200, y: 400, stats: "Stats for Van Dijk" },
        { name: "Rüdiger", team: "Chelsea", img: "rudiger.jpg", x: 300, y: 400, stats: "Stats for Rüdiger" },
        { name: "Alexander-Arnold", team: "Liverpool", img: "alexander-arnold.jpg", x: 400, y: 400, stats: "Stats for Alexander-Arnold" },
        { name: "Modric", team: "Real Madrid", img: "modric.jpg", x: 100, y: 300, stats: "Stats for Modric" },
        { name: "Fabinho", team: "Liverpool", img: "fabinho.jpg", x: 200, y: 300, stats: "Stats for Fabinho" },
        { name: "De Bruyne", team: "Man City", img: "debruyne.jpg", x: 300, y: 300, stats: "Stats for De Bruyne" },
        { name: "Vinícius Jr.", team: "Real Madrid", img: "vinicius.jpg", x: 100, y: 200, stats: "Stats for Vinícius Jr." },
        { name: "Benzema", team: "Real Madrid", img: "benzema.jpg", x: 200, y: 200, stats: "Stats for Benzema" },
        { name: "Mbappé", team: "Paris", img: "mbappe.jpg", x: 300, y: 200, stats: "Stats for Mbappé" },
    ];

    const svg = d3.select("#football-field")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    const cards = svg.selectAll(".player-card")
        .data(players)
        .enter()
        .append("foreignObject")
        .attr("class", "player-card")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("width", 100)
        .attr("height", 120)
        .html(d => `
            <div class="player-card" onclick="showStats(event, '${d.stats}')">
                <img src="${d.img}" alt="${d.name}">
                <div class="name">${d.name}</div>
            </div>
        `);

    window.showStats = function(event, stats) {
        const existingStats = document.querySelector(".player-stats");
        if (existingStats) existingStats.remove();

        const statsDiv = document.createElement("div");
        statsDiv.className = "player-stats visible";
        statsDiv.style.left = `${event.clientX}px`;
        statsDiv.style.top = `${event.clientY}px`;
        statsDiv.innerHTML = stats;

        document.body.appendChild(statsDiv);

        setTimeout(() => {
            statsDiv.classList.remove("visible");
        }, 3000);
    };
});
