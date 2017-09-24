const cheerio = require('cheerio');
const urlService = require('url');
const Request = require('./request.js');

class ArticleParser {
  constructor(url) {
    try {
      this.urlInfo = urlService.parse(url);
    } catch (err) {
      let error = new Error('Incorrect URL');
      error.code = 422;
      throw error;
    }

    if (!this.urlInfo.hostname || !this.urlInfo.pathname || !this.urlInfo.protocol) {
      let error = new Error('Incorrect URL');
      error.code = 422;
      throw error;
    }
  }

  async parse() {
    let requestParams = {
      method: 'GET',
      hostName: this.urlInfo.hostname,
      path: this.urlInfo.pathname,
      protocolName: this.urlInfo.protocol
    }

    let request = new Request();
    let webPage = await request.makeRequest(requestParams);
    let dom = cheerio.load(webPage);
    let result = {
      title: '',
      pharagraphs: []
    };

    result.title = dom('article').find('*[itemprop = "headline"]').text();
    dom('*[itemprop = "articleBody"]').find('p').each((index, item) => {
      result.pharagraphs.push(dom(item).text());
    });

    return result;
  }
}

module.exports = ArticleParser;