/*
This file is responsible for pulling headlines from the API a few times a day and storing them in the database.
*/

import { getDailyHeadlines } from "./newsapi.js";
import Article from "./models/Article.js";

// Every 4 hours, pull 4 headlines from the API and store them in the database
function startDailyAggregator({ hours }) {
  setInterval(async () => {
    console.log("Aggregating headlines...");
    const headlines = await getDailyHeadlines({ numToGet: 4 });
    headlines.forEach(async (headline) => {
      try {
        if (headline.title && headline.url && headline.author && headline.content) {
          // Check if article with same url exists in db
          var foundArticles = await Article.find({ url: headline.url });
          console.log("Found " + foundArticles.length + " articles with url " + headline.url);
          if (foundArticles.length > 0) {
            console.log("Article with url " + headline.url + " already exists in database");
            return;
          }
          console.log("Saving headline: " + headline.title)
          await headline.save();
        }
      }
      catch (error) {
        console.log(error);
      }
    });
  }, 1000 * 60 * 60 * hours);
}

export default startDailyAggregator;


