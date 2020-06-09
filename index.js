(function () {
  'use strict';

  const fs = require('fs');
  const elasticsearch = require('elasticsearch');
  const esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
  });

  const bulkIndex = async function bulkIndex(index, type, data) {
    console.log("------------Entered bulkIndex Call------------");
    let bulkBody = [];

    console.log("------------Before forEach loop 1------------");
    await data.forEach(item => {
      bulkBody.push({
        index: {
          _index: index,
          _type: type,
          _id: item.id
        }
      });

      bulkBody.push(item);
      //console.log(item);
    });
    //console.log(bulkBody);
    console.log("------------After forEach loop 1------------");

    console.log("------------Before esClient bulk method call------------");
    await esClient.bulk({body: bulkBody})
    .then(response => {
      let errorCount = 0;
      console.log("------------Before forEach loop 2------------");
      response.items.forEach(item => {
        if (item.index && item.index.error) {
          console.log(++errorCount, item.index.error);
        }
      });
      console.log("------------After forEach loop 2------------");
      console.log(`Successfully indexed ${data.length - errorCount} out of ${data.length} items`);
    })
    .catch(console.err);
    console.log("------------After esClient bulk method call------------");
  };

  // only for testing purposes
  // all calls should be initiated through the module
  const test = function test() {
    const articlesRaw = fs.readFileSync('data.json');
    const articles = JSON.parse(articlesRaw);
    console.log(`${articles.length} items parsed from data file`);
    console.log("------------Before bulkIndex Call------------");
    bulkIndex('library', 'article', articles);
    console.log("------------After bulkIndex Call------------");
  };

  test();

  module.exports = {
    bulkIndex
  };
} ());
