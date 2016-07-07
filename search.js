var bingCode = process.env.bingCode;
var Bing = require('node-bing-api')({ accKey: "KLSI/YSbQ5HVplhPHmh5VF6TaTURK7H3fsvRVzJ+KR8" });

module.exports = {
    search: function(query, callback) {
        Bing.images(query, { skip: 1 }, function(error, res, body) {
            callback(body);
        });
    }
};
