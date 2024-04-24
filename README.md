# South Park Script Analysis

**Built by Alexandru Dediu, Andrew Gerstenslager, Nick Murray and Zach Carlson**

[Live Webpage](https://adediu25.github.io/vis-proj3/).

**Note**: The webpage was built to look best on 1440p monitors at 100% scaling or 1080p monitors at 125% scaling.

## Motivation

The motivation of our application was to give an overview on South Park characters to show what specific words show up most in each character's dialogue. Our application will allow a user to understand which characters have the most dialogue, (in every season or per specific season), which characters show up in the most episodes, links between the characters in the show, what words are used most often by each character, the words used most in all of the shows dialogue, and the number of profanities used by each character.

## Data

Transcripts for seasons 1-18 were found in this [GitHub repo](https://github.com/c0mpiler/SouthParkData).

For the rest of the seasons 19-26 were pulled from the [South Park Fandom page](https://southpark.fandom.com/wiki/Portal:Scripts). The webpages were scraped using python and dumped into csv files to match the format of the seasons from the GitHub repo.

## Visualization Components

At the top a the page, there is a season drop down. This allows the user to specify which season to focus on for some of the visualizations. It is set to all seasons by default.

### Dialogue Lines by Character Chart:

This visualization is a bar chart showing the number of dialogue lines that each of the four main characters, (Eric Cartman, Kyle Broflovski, Stan Marsh, and Kenny McCormick) have in the show, as well as a few more well-known characters. On initial render, the chart shows the number of dialogue lines each of these characters have over all of the season, but change based on the season that is chosen from the dropdown above. When you hover over a bar, it will tell you the name of the character and the number of lines of dialogue that character has.

### Episode Appearances by Character Chart:

This visualization is another bar chart that has the same interactions as the previous chart, but tells you the number of episodes that each of the characters appear in. Again, this chart will change based on the season that is chosen from the dropdown above and when a bar is hovered over, it will tell you the character name and the number of appearances made.

### Character Relationship Force Graph

This visualization is a force graph that contains nodes of different characters in the show and which characters are connected. When you hover over a character node, it will tell you the character's name and the frequency of dialogue in the show. The lines between the nodes are the strength of the relationship between the characters. This is defined as the number of times two characters' dialogiue follows each other. The lines are thicker for stronger direct relationships. When a character node is clicked on, it will show you a picture of the character on the left of the graph and will update the character word cloud on the right. The sliders above the graph allow the user to control the amount of data that is displayed in the graph. The number of links slider alters how many total character links will be rendered. Strongest links are shown first. The top percentage slider alters how many character nodes are rendered, with the top chosen percent of total characters included.

### Character-specific Word Cloud

The word cloud will show the words most spoken by a specific character, and when a word is hovered over, it will tell you the frequency that the words show up in the show. The character can be selected from the force graph. There is also a search bar above the word that allows you to search for a specific character that will update the image and word cloud when one is searched for.

### Word Frequency Chart

This chart displays the frequency of a specific word for each season of the show. Trends become very apparent through this visualization. A search bar is available above the chart. Searching a valid word will update the chart to show the frequencies of that word. This visualization also has details on demand that show the exact value for the bar.

### All Dialogue Word Cloud

This visualization shows the words that show up most often in the show. When you hover over a word, it will tell you the frequency that it is used in the show. This will change based on the season that is chosen in the top dropdown on the page.

### Profanity by Character Chart

As profanity is one of the defining characteristics of this show, the profanity chart provides some additional insight. This visualization shows the number of profanities said by characters in the show. Profanities are determined using the json file in this [GitHub repo](https://github.com/zacanger/profane-words). When you hover over a bar, it will show a tooltip of the character's name and the number of profanities that were said. This chart also updates based on the season dropdown at the top of the page. This will tell you how many profanities were said by each character per season.

### Character Dialogue by Season Chart

This chart is another useful tool for investigating trends in the show. The chart visualizes the number of dialogues by season for a specific character. This visualization also has details on demand that show the exact value for the bar. The character used for the visualization can be updated from the force graph or the search bar above the character word cloud.

## Visual Design

The beginning of our website has a button that allows you to show/hide info for the show. When clicked the description of the show will be shown as well as the 4 main characters and the logo for the show.

For the two graphs going over how many episodes each character has been in and how many lines are said, we went with a bar chart to show the difference in character lines and appearances. We included 10 characters as to not clutter up the bar charts. For the 4 main characters of the show (Stan, Kenny, Kyle, and Cartman), we went with coloring those bars in accordance to the actual color of their hat as they wear in the show. For the remaining 8 characters their color was made a beige as to distinguish those characters from the main characters. 

Since Cartman is the most prominent character, we decided to keep his corresponding color as the color scheme for the rest of the page. We only used sequential color scales, so we did not need to worry about mixing colors.

For the character relationship force graph, we made a slider to change how many characters and connections are wanted. When clicking on a node in the force graph, we have included the picture of the character which was selected. The force graphs colors depend on how many interactions each character has which each other.

The word cloud corresponds to the character and is kept the same color as the force graph. The colors on the word cloud are a darker blue and larger if the character says those words more often and get smaller and bright/more faded as the count of the words goes down.

As for layout, we wanted to have charts that provide similar analytical capabilities closer together. 

## Visualization Discoveries

The application enables you to discover a lot of different information. These include, but are not limited to number of dialogue lines by character per season, the number of episode appearances of each character per season, the number of links per character, the most words said by specific characters, the most words said in the entirety of the show, and the number of profanities said by character per season. 

One finding that we thought was interesting from the data was that in only nine out of the twenty-six seasons, Eric Cartman has the most profanities used. This is interesting because he is a character in the show that you would expect to always be the most profane, but is apparently not consistently the most. 

Another interesting finding is that you can see the family of characters in the force graph. Parents are linked the closest to their spouse and their kid. 

Cartman also appears the most in dialogue lines in the show and looking at the force graph while limiting the total links to 1 per character, you can see the majority of the top characters appear in dialogue closest to Cartman. 

Also, the character-specific word clouds are interesting to look at as you can see the names of the friends or closely related characters in the frequently used dialogue. 

A specific finding is that, Chef uses the word "Children" the most in the word cloud since he frequently is used as a character to talk to the children. He also has the majority of his relationships in the force graph connected to the kids in the show.

Using the word search box, we can search for word associated with current events. For example, searching the word "Obama", we see a massive use of the word in season 12. Season 12 was released in 2008, the year Obama was elected as president. The search function can be used to see how the show keeps up with other current events.

Searching "killed" in the word search, we see a downward trend in the use of the word in the show. This follows the fact that the writers used to kill off Kenny in basically every episode, but they stopped doing that as much as the seasons went on. 

