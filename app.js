var elasticsearch = require('elasticsearch');
var request = require('request');
var parseString = require('xml2js').parseString;

var client = new elasticsearch.Client({
  host: 'https://search-mytestdomain-mcg5ii6fpivtatr7bwpkwdvp7q.us-west-2.es.amazonaws.com/',
  log: 'info'
});

client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: 5000
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

var index = 'ride-waittimes'
function loadDataSet(item, itemId) {
        client.index({
          index: index,
          type: 'rides',
          id: itemId,
          body: {
            title: item.title[0],
            waittime: parseInt(item.description[0]),
          }
        }, function (error, response) {
          console.log("put item successfully.")
        })
}

function getData() {
  request('http://www.universalstudioshollywood.com/waittimes/?type=all&site=USH', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function (err, result) {
        var items = result.rss.channel[0].item;
        console.log(items);
        for(var i = 0; i < items.length; i++) {
          loadDataSet(items[i], i);
        }
      });
    }
  })
}

setInterval(function() {
  getData();
}, 600000);
