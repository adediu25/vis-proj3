let data; // Declare data as a global variable
let stopwords; // Declare stopwords as a global variable
let linkCount = 3; // Initial value for link count
let topPercentage = 10; // Initial value for top percentage

// Load stopwords from CSV file
d3.csv('data/stopwords.csv', d => d['stop_word']).then(loadedStopwords => {
    stopwords = loadedStopwords;

    // Print a sentence and then print it without stopwords
    let sentence = 'This is a test sentence';
    console.log('Original sentence:', sentence);

    let words = sentence.toLowerCase().split(' ');
    let filteredWords = words.filter(word => !stopwords.includes(word));
    let filteredSentence = filteredWords.join(' ');

    console.log('Sentence without stopwords:', filteredSentence);
}).catch(error => console.error(error));


// Load CSV file and process data
Promise.all([
    d3.csv('data/season_csvs/Season-1.csv'),
    d3.csv('data/season_csvs/Season-2.csv'),
    d3.csv('data/season_csvs/Season-3.csv'),
    d3.csv('data/season_csvs/Season-4.csv'),
    d3.csv('data/season_csvs/Season-5.csv'),
    d3.csv('data/season_csvs/Season-6.csv'),
    d3.csv('data/season_csvs/Season-7.csv'),
    d3.csv('data/season_csvs/Season-8.csv'),
    d3.csv('data/season_csvs/Season-9.csv'),
    d3.csv('data/season_csvs/Season-10.csv'),
    d3.csv('data/season_csvs/Season-11.csv'),
    d3.csv('data/season_csvs/Season-12.csv'),
    d3.csv('data/season_csvs/Season-13.csv'),
    d3.csv('data/season_csvs/Season-14.csv'),
    d3.csv('data/season_csvs/Season-15.csv'),
    d3.csv('data/season_csvs/Season-16.csv'),
    d3.csv('data/season_csvs/Season-17.csv'),
    d3.csv('data/season_csvs/Season-18.csv'),
    d3.csv('data/season_csvs/Season-19.csv'),
    d3.csv('data/season_csvs/Season-20.csv'),
    d3.csv('data/season_csvs/Season-21.csv'),
    d3.csv('data/season_csvs/Season-22.csv'),
    d3.csv('data/season_csvs/Season-23.csv'),
    d3.csv('data/season_csvs/Season-24.csv'),
    d3.csv('data/season_csvs/Season-25.csv'),
    d3.csv('data/season_csvs/Season-26.csv'),
]).then(loadedData => {
    data = loadedData.flat(); // Flatten the array of arrays into a single array
    createForceGraph(data); 
    console.log(data);
}).catch(error => console.error(error));

// Add event listener for slider
document.getElementById('link-slider').addEventListener('input', function(event) {
    linkCount = event.target.value;
    document.getElementById('link-count').textContent = linkCount;
    createForceGraph(data);
});

// Add event listener for percentage slider
document.getElementById('percentage-slider').addEventListener('input', function(event) {
    topPercentage = event.target.value;
    document.getElementById('percentage-count').textContent = topPercentage;
    createForceGraph(data); // Update the graph with the new top percentage
});


