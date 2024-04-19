// Load CSV file and process data
Promise.all([
    d3.csv('data/season_csvs/Season-1.csv')
]).then(data => {
    createForceGraph(data[0]); // Using only the first CSV for simplicity
}).catch(error => console.error(error));

function createForceGraph(data) {
    const nodes = [], links = [];
    const characterMap = new Map(); // To track character indices
    const characterFrequency = new Map(); // To count occurrences
    let lastCharacter = null;

    // Calculate frequency of each character
    data.forEach(entry => {
        characterFrequency.set(entry.Character, (characterFrequency.get(entry.Character) || 0) + 1);
    });

    // Determine the top 10% of characters by frequency
    const frequencies = Array.from(characterFrequency.values()).sort((a, b) => b - a);
    const cutoffIndex = Math.floor(frequencies.length * 0.1);
    const frequencyCutoff = frequencies[cutoffIndex];

    // Process data to construct nodes and links
    data.forEach(entry => {
        if (characterFrequency.get(entry.Character) >= frequencyCutoff) {
            if (!characterMap.has(entry.Character)) {
                characterMap.set(entry.Character, { id: entry.Character });
                nodes.push(characterMap.get(entry.Character));
            }

            if (lastCharacter && lastCharacter !== entry.Character && characterFrequency.get(lastCharacter) >= frequencyCutoff) {
                const source = characterMap.get(lastCharacter);
                const target = characterMap.get(entry.Character);

                // Find existing link or create a new one
                const existingLink = links.find(l => (l.source.id === source.id && l.target.id === target.id) || (l.source.id === target.id && l.target.id === source.id));
                if (existingLink) {
                    existingLink.value++;
                } else {
                    links.push({ source, target, value: 1 });
                }
            }
            lastCharacter = entry.Character;
        }
    });

    // Print links information
    console.log("Link Details:");
    links.forEach(link => {
        console.log(`Link between ${link.source.id} and ${link.target.id} with strength ${link.value}`);
    });

    // Visualization with d3-force
    const width = 1200, height = 1200;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).strength(d => d.value / 15))
        .force("charge", d3.forceManyBody().strength(-0))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    const link = svg.append("g")
        .attr("stroke", "#999")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 5)
        .attr("fill", d => color(d.group))
        .call(drag(simulation));

    node.append("title")
        .text(d => d.id);

    // Tick function for graph dynamics
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
}
