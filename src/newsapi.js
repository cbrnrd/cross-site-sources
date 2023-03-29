import * as dotenv from 'dotenv';
import NewsAPI from 'newsapi';
import Article from './models/Article.js';

dotenv.config();

const API_KEY = process.env.NEWSAPI_KEY;

const newsapi = new NewsAPI(API_KEY);

/**
 * Get all articles matching a query
 * @param {String} query The query to search for
 * @param {Number} pageSize The number of articles to return
 */
function getEverythingMatching(query, pageSize = 10) {
    // 3/28, this endpoint seems to be broken on the API side
    newsapi.v2.everything({
        q: query,
        language: 'en',
        category: 'cybersecurity',
        sortBy: 'relevancy',
        pageSize: pageSize,
    }).then(response => {
        return response.articles;
    }).catch(error => {
        console.log(error);
    });

    return [];
}

/**
 * Get the top headlines from the NewsAPI
 * @param {Number} numToGet The number of headlines to get
 * @return {Promise} A promise that resolves to an array of articles
 */
async function getDailyHeadlines({ numToGet = 10, q = 'security' }) {

    return newsapi.v2.topHeadlines({
        language: 'en',
        category: 'technology',
        country: 'us',
        q: q,
        pageSize: numToGet,
    }).then(response => {
        var results = response.articles;
        //console.log(results);
        var converted = [];
        for (var i = 0; i < results.length; i++) {
            converted.push(convertArticle(results[i]));
        }
        return converted;
    });
}

/**
 * Convert a NewsAPI article to a format that can be stored in the database
 * @param {Object} article The article to convert
 */
function convertArticle(article) {
    /*
    Example article:
    {
      "source": {
        "id": null,
        "name": "OilPrice.com"
      },
      "author": "Michael Kern",
      "title": "Wind Industry To Install Record New Capacity By 2027 - OilPrice.com",
      "description": "A new Global Wind Energy Council report reveals the wind industry is expected to install a record 136 GW of new wind capacity annually by 2027 due to policy support.",
      "url": "https://oilprice.com/Latest-Energy-News/World-News/Wind-Industry-To-Install-Record-New-Capacity-By-2027.html",
      "urlToImage": "https://d32r1sh890xpii.cloudfront.net/news/718x300/2023-03-27_mkdviocyq0.jpg",
      "publishedAt": "2023-03-27T19:30:00Z",
      "content": "The EU ban on Russian…\r\nCarbon capture and storage (CCS)…\r\nBy Michael Kern - Mar 27, 2023, 2:30 PM CDTA new report from the Global Wind Energy Council (GWEC) has revealed that policies have set the s… [+1836 chars]"
    }
    */
    return new Article({
        title: article.title,
        author: article.author,
        content: article.content,
        url: article.url,
        imageUrl: article.urlToImage,
    });
}


export { getEverythingMatching, getDailyHeadlines, convertArticle };
