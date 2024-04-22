class WordCloud {
    constructor(_config, _invertedIndex, _totalDatasetLength) {
        this.config = {
            parentElement: _config.parentElement,
            width: 500,
            height: 300
        };
        this.invertedIndex = _invertedIndex;
        this.totalDatasetLength = _totalDatasetLength; // Use the passed total dataset length
        this.initVis();
    }

    initVis() {
        this.draw();
    }

    draw() {
        let words = Object.keys(this.invertedIndex).map(word => {
            let docs = this.invertedIndex[word].indices;
            let freq = this.invertedIndex[word].frequency;
            return {
                text: word,
                size: freq,
                indexes: docs
            };
        }).filter(word => word !== null);

        words.sort((a, b) => b.size - a.size);
        words = words.slice(0, 100);

        const fontSizeScale = d3.scaleLinear()
            .domain([d3.min(words, d => d.size), d3.max(words, d => d.size)])
            .range([10, 70]);

        this.layout = d3.layout.cloud()
            .size([this.config.width, this.config.height])
            .words(words)
            .padding(5)
            .rotate(() => 0)
            .font("Impact")
            .fontSize(d => fontSizeScale(d.size))
            .on("end", this.drawWords.bind(this));

        this.layout.start();
    }

    drawWords(words) {
        d3.select(this.config.parentElement).append("svg")
            .attr("width", this.layout.size()[0])
            .attr("height", this.layout.size()[1])
            .append("g")
            .attr("transform", "translate(" + this.layout.size()[0] / 2 + "," + this.layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => d.size + "px")
            .style("font-family", "Impact")
            .attr("text-anchor", "middle")
            .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
            .text(d => d.text)
            .on("click", d => { 
                console.log("Clicked word: " + d.text);
                // Use the indices directly for a concise and informative output
                console.log("Found in documents:", d.indexes.join(', '));
            });
    }
}




class WordCloud {
    constructor(_config, _invertedIndex, _totalDatasetLength) {
        this.config = {
            parentElement: _config.parentElement,
            width: 500,
            height: 300
        };
        this.invertedIndex = _invertedIndex;
        this.totalDatasetLength = _totalDatasetLength; // Use the passed total dataset length
        this.initVis();
    }

    initVis() {
        this.draw();
    }

    draw() {
        let words = Object.keys(this.invertedIndex).map(word => {
            let docs = this.invertedIndex[word].indices;
            let freq = this.invertedIndex[word].frequency;
            return {
                text: word,
                size: freq,
                indexes: docs
            };
        }).filter(word => word !== null);

        words.sort((a, b) => b.size - a.size);
        words = words.slice(0, 100);

        const fontSizeScale = d3.scaleLinear()
            .domain([d3.min(words, d => d.size), d3.max(words, d => d.size)])
            .range([10, 70]);

        this.layout = d3.layout.cloud()
            .size([this.config.width, this.config.height])
            .words(words)
            .padding(5)
            .rotate(() => 0)
            .font("Impact")
            .fontSize(d => fontSizeScale(d.size))
            .on("end", this.drawWords.bind(this));

        this.layout.start();
    }

    drawWords(words) {
        d3.select(this.config.parentElement).append("svg")
            .attr("width", this.layout.size()[0])
            .attr("height", this.layout.size()[1])
            .append("g")
            .attr("transform", "translate(" + this.layout.size()[0] / 2 + "," + this.layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => d.size + "px")
            .style("font-family", "Impact")
            .attr("text-anchor", "middle")
            .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
            .text(d => d.text)
            .on("click", d => { 
                console.log("Clicked word: " + d.text);
                // Use the indices directly for a concise and informative output
                console.log("Found in documents:", d.indexes.join(', '));
            });
    }
}