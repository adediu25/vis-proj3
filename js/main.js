let data; // Declare data as a global variable
let stopwords; // Declare stopwords as a global variable
let profanity;
let characterInfo = [];
let seasonInfo = [];
let allInfo = {character:'All', inverted_index:{}, season_episode_pairs: []};
// chart objects
let profanityChart;

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
    
    unfilteredData = data;

    // Process each line to be just the words as a list
    data = data.map(d => {
        d.words = filterStopwordsAndPunctuation(d.Line);
        return d;
    });
    

    let dataIndex = 0; // Add this line before the forEach loop

    data.forEach(d => {
        // Find the existing entry for the character
        let characterEntry = characterInfo.find(entry => entry.character === d.Character);
        let seasonEntry = seasonInfo.find(entry => entry.character === d.Season);
        
        // If the character doesn't exist in the inverted index data yet, create a new entry
        if (!characterEntry) {
            characterEntry = {
                character: d.Character,
                inverted_index: {},
                season_episode_pairs: [],
                episode_profanity_pairs: []
            };
            characterInfo.push(characterEntry);
        }

        if (!seasonEntry) {
            seasonEntry = {
                character: d.Season,
                inverted_index: {},
                season_episode_pairs: []
            };
            seasonInfo.push(seasonEntry);
        }
        
        // Update the inverted index and season_episode_pairs
        let wordCounts = d.words.reduce((counts, word) => {
            counts[word] = (counts[word] || 0) + 1;
            return counts;
        }, {});
        Object.entries(wordCounts).forEach(([word, count]) => {
            // characters
            if (!characterEntry.inverted_index[word]) {
                characterEntry.inverted_index[word] = [];
            }
            characterEntry.inverted_index[word].push({index: dataIndex, frequency: count});

            // seasons
            if (!seasonEntry.inverted_index[word]) {
                seasonEntry.inverted_index[word] = [];
            }
            seasonEntry.inverted_index[word].push({index: dataIndex, frequency: count});

            // all
            if (!allInfo.inverted_index[word]) {
                allInfo.inverted_index[word] = [];
            }
            allInfo.inverted_index[word].push({index: dataIndex, frequency: count});
        });
        let pair = {season: d.Season, episode: d.Episode, dialogues: 1};

        let profanityCount = d.words.reduce((total,word) => {
            return profanity.includes(word) ? total+1 : total;
        }, 0)
        let profanityPair = {season: d.Season, episode: d.Episode, profanity: profanityCount}

        // update season episode pairs
        // characters
        let existingPair = characterEntry.season_episode_pairs.find(e => e.season === pair.season && e.episode === pair.episode);
        if (existingPair) {
            existingPair.dialogues++;
        } else {
            characterEntry.season_episode_pairs.push(pair);
        }

        // seasons
        existingPair = seasonEntry.season_episode_pairs.find(e => e.season === pair.season && e.episode === pair.episode);
        if (existingPair) {
            existingPair.dialogues++;
        } else {
            seasonEntry.season_episode_pairs.push(pair);
        }

        // all
        existingPair = allInfo.season_episode_pairs.find(e => e.season === pair.season && e.episode === pair.episode);
        if (existingPair) {
            existingPair.dialogues++;
        } else {
            allInfo.season_episode_pairs.push(pair);
        }

        let existingProfanity = characterEntry.episode_profanity_pairs.find(e => e.episode === profanityPair.season && e.season === profanityPair.season);
        if (existingProfanity){
            existingProfanity.profanity++;
        } else {
            characterEntry.episode_profanity_pairs.push(profanityPair);
        }

        dataIndex++; // Increment dataIndex at the end of the loop
    });

    // count profanity
    characterInfo.forEach(characterEntry => {
        let seasonCounts = characterEntry.episode_profanity_pairs.reduce((counts, pair) => {
            counts["All"] = counts["All"] ? counts["All"]+pair.profanity : pair.profanity;
            counts[pair.season] = counts[pair.season] ? counts[pair.season]+pair.profanity : pair.profanity;
            return counts;
        }, {});

        characterEntry.seasonProfanityCount = seasonCounts;
    });

    createForceGraph(data); 
    console.log(data);
    console.log(characterInfo);

    // Get the 4th character's info
    let characterEntry = characterInfo[3];
    let wordCloud = new WordCloud({parentElement: '#wordcloud'}, characterEntry, data.length);    // Get the entries of the inverted_index object and sort them by total frequency
    let allCloud = new WordCloud({parentElement: '#allcloud'}, allInfo, data.length);
    profanityChart = new ProfanityChart({parentElement: '#char-profanity'}, characterInfo);

    // Take the top 10 most used words
    
}).catch(error => console.error(error));

d3.select("#season-select").on("input", function(){
    let season = +this.value;

    profanityChart.season = season;
    profanityChart.updateVis();

    if (season === "All") {
        renderInvertedIndex(allInfo,'#allcloud');
        document.getElementById('char-profanity-name').innerText = "Profanity by Characer All Seasons";
    }
    else {
        renderInvertedIndex(seasonInfo.find(e => e.character == season),'#allcloud');
        document.getElementById('char-profanity-name').innerText = "Profanity by Characer Season " + season;
    }
});

function print_character_top_words(characterEntry){

    let sortedWords = Object.entries(characterEntry.inverted_index).sort((a, b) => {
        let totalFrequencyA = a[1].reduce((total, {frequency}) => total + frequency, 0);
        let totalFrequencyB = b[1].reduce((total, {frequency}) => total + frequency, 0);
        return totalFrequencyB - totalFrequencyA;
    });
    let topWords = sortedWords.slice(0, 10);

    console.log(`The most used words by ${characterEntry.character} are:`);
    topWords.forEach(([word, occurrences]) => {
        let totalFrequency = occurrences.reduce((total, {frequency}) => total + frequency, 0);
        console.log(`${word}: ${totalFrequency} times`);
    });

};