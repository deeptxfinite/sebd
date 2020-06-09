'use strict';

const {Client} = require('elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

async function run () {
  const { body: bulkResponse } = await client.bulk({
    refresh: true,
    body: [
      { index: { _index: 'game-of-thrones', _type: 'characters' } },
      {
        character: 'Ned Stark',
        quote: 'Winter is coming.'
      },

      { index: { _index: 'game-of-thrones', _type: 'characters' } },
      {
        character: 'Daenerys Targaryen',
        quote: 'I am the blood of the dragon.'
      },

      { index: { _index: 'game-of-thrones', _type: 'characters' } },
      {
        character: 'Tyrion Lannister',
        quote: 'A mind needs books like a sword needs a whetstone.'
      }
    ]
  })

  const { body } = await client.search({
    index: 'game-of-thrones',
    body: {
      query: {
        match: { quote: 'witner' }
      },
      suggest: {
        gotsuggest: {
          text: 'witner',
          term: { field: 'quote' }
        }
      }
    }
  })

  console.log(body)
}

run().catch(console.log)
