function createForceGraph(data) {
    const container = d3.select('#force-graph-container');
    container.selectAll('*').remove(); // Clear the container
    const nodes = [], allLinks = [];
    const characterMap = new Map(); // To track character indices
    const characterFrequency = new Map(); // To count occurrences
    let lastCharacter = null;
    const link_range = [0,50];

    // Calculate frequency of each character
    data.forEach(entry => {
        characterFrequency.set(entry.Character, (characterFrequency.get(entry.Character) || 0) + 1);
    });

    // Determine the top topPercentage of characters by frequency
    const frequencies = Array.from(characterFrequency.values()).sort((a, b) => b - a);
    const cutoffIndex = Math.floor(frequencies.length * (topPercentage / 100));
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
                const existingLink = allLinks.find(l => (l.source.id === source.id && l.target.id === target.id) || (l.source.id === target.id && l.target.id === source.id));
                if (existingLink) {
                    existingLink.value++;
                } else {
                    allLinks.push({ source, target, value: 1 });
                }
            }
            lastCharacter = entry.Character;
        }
    });

    const links = [];
    allLinks.sort((a, b) => b.value - a.value);
    nodes.forEach(node => {
        const topLinks = allLinks.filter(link => link.source.id === node.id || link.target.id === node.id).slice(0, linkCount);
        links.push(...topLinks);
    });

    
    
    // Normalize link strength
    const maxLinkValue = d3.max(links, d => d.value);
    const linkStrengthScale = d3.scaleLinear()
        .domain([0, maxLinkValue])
        .range(link_range);

    // Create a color scale for link strength
    const linkColorScale = d3.scaleLinear()
        .domain(link_range)
        .range(['#FFC0C0', '#8B0000']);

    links.forEach(link => {
        link.normalizedValue = linkStrengthScale(link.value);
    });

    const width = 600, height = 600;
        
    // Set up simulation
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(150))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("y", d3.forceY(height / 2).strength(0.1));

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    // Sort links by strength in descending order
    links.sort((b, a) => b.normalizedValue - a.normalizedValue);


    const link = svg.append("g")
        .attr("stroke", "#999")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.normalizedValue))  // Use normalized value for stroke width
        .attr("stroke", d => linkColorScale(d.normalizedValue));  // Color scale can also reflect normalized value

    nodes.forEach(node => {
        node.totalFrequency = characterFrequency.get(node.id);
    });
    //&console.log(nodes);

    const nodeSizeScale = d3.scaleLinear()
        .domain(d3.extent(nodes, node => node.totalFrequency))
        .range([5, 15]);
    
    const nodeColorScale = d3.scaleLinear()
        .domain(d3.extent(nodes, node => node.totalFrequency))
        .range(['#FFC0C0', '#8B0000']);

        const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", node => nodeSizeScale(node.totalFrequency))
        .attr("fill", node => nodeColorScale(node.totalFrequency))
        .on("mouseover", function(d) {
            //console.log(d.srcElement.__data__); 
            d3.select(this).attr("fill", "blue"); 
        })
        .on("mouseout", function(d) { 
            d3.select(this).attr("fill", nodeColorScale(d.srcElement.__data__.totalFrequency)); 
        })
        .on("click", function(d) {
            console.log(d.srcElement.__data__.id);
        })
        .call(drag(simulation));

    node.append("title")
        .text(d => d.id);

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

    // Print links information
    // console.log("Link Details:");
    // links.forEach(link => {
    //     console.log(`Link between ${link.source.id} and ${link.target.id} with strength ${link.value}`);
    // });

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