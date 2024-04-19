function filterStopwordsAndPunctuation(sentence) {
    // Remove all punctuation except for apostrophes
    let cleanedSentence = sentence.replace(/[^\w\s']|_/g, "").replace(/\s+/g, " ");

    // Split the sentence into words
    let words = cleanedSentence.toLowerCase().split(' ');

    // Filter out stopwords and empty strings
    let filteredWords = words.filter(word => word && !stopwords.includes(word));

    return filteredWords;
}

// Load stopwords from CSV file
d3.csv('data/stopwords.csv', d => d['stop_word']).then(loadedStopwords => {
    stopwords = loadedStopwords;
}).catch(error => console.error(error));