let data; // Declare data as a global variable
let stopwords; // Declare stopwords as a global variable
let characterInfo = [];

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
    
    // Process each line to be just the words as a list
    data = data.map(d => {
        d.words = filterStopwordsAndPunctuation(d.Line);
        return d;
    });
    

    let dataIndex = 0; // Add this line before the forEach loop

    data.forEach(d => {
        // Find the existing entry for the character
        let characterEntry = characterInfo.find(entry => entry.character === d.Character);
        
        // If the character doesn't exist in the inverted index data yet, create a new entry
        if (!characterEntry) {
            characterEntry = {
                character: d.Character,
                inverted_index: {},
                season_episode_pairs: []
            };
            characterInfo.push(characterEntry);
        }
        
        // Update the inverted index and season_episode_pairs
        d.words.forEach((word) => { // Remove index from here
            if (!characterEntry.inverted_index[word]) {
                characterEntry.inverted_index[word] = [];
            }
            characterEntry.inverted_index[word].push(dataIndex); // Push dataIndex instead of index
        });
        let pair = {season: d.Season, episode: d.Episode, dialogues: 1};
        let existingPair = characterEntry.season_episode_pairs.find(e => e.season === pair.season && e.episode === pair.episode);
        if (existingPair) {
            existingPair.dialogues++;
        } else {
            characterEntry.season_episode_pairs.push(pair);
        }

        dataIndex++; // Increment dataIndex at the end of the loop
    });

    createForceGraph(data); 
    console.log(data);
    console.log(characterInfo);
}).catch(error => console.error(error));

