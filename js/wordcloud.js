function renderInvertedIndex(invertedIndex) {
    // Clear the previous content
    const container = d3.select('#wordcloud');
    container.selectAll('*').remove();

    // Create a new WordCloud instance and draw it
    const wordCloud = new WordCloud({parentElement: '#wordcloud'}, invertedIndex, Object.keys(invertedIndex).length);
}

class WordCloud {
    constructor(_config, _invertedIndex, _totalDatasetLength) {
        this.config = {
            parentElement: _config.parentElement,
            width: 500,
            height: 300
        };
        this.invertedIndex = _invertedIndex;
        this.totalDatasetLength = _totalDatasetLength;
        this.initVis();
    }

    initVis() {
        this.svg = d3.select(this.config.parentElement)
            .append('svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height);
        this.draw();
    }

    draw() {
        let words = Object.keys(this.invertedIndex).map(word => {
            let docs = this.invertedIndex[word];
            let freq = docs.reduce((total, {frequency}) => total + frequency, 0);
            return {
                text: word,
                size: freq,
                indexes: docs.map(({index}) => index)
            };
        });

        words.sort((a, b) => b.size - a.size);
        words = words.slice(0, 100);

        const fontSizeScale = d3.scaleLinear()
            .domain([d3.min(words, d => d.size), d3.max(words, d => d.size)])
            .range([10, 70]);

        d3.layout.cloud()
            .size([this.config.width, this.config.height])
            .words(words)
            .padding(5)
            .rotate(() => 0)
            .font("Impact")
            .fontSize(d => fontSizeScale(d.size))
            .on("end", this.drawWords.bind(this))
            .start();
    }

    drawWords(words) {
        this.svg.append("g")
            .attr("transform", "translate(" + this.config.width / 2 + "," + this.config.height / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => d.size + "px")
            .style("font-family", "Impact")
            .attr("text-anchor", "middle")
            .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
            .text(d => d.text)
            .on("click", d => { 
                console.log(d.srcElement);
            });
    }
}