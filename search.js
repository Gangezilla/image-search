var bingCode = process.env.bingCode;
var Bing = require('node-bing-api')({ accKey: bingCode });

module.exports = {
    search: function(query, num, callback) {
    	if (num===undefined) {
    		num=1;
    	}
        Bing.images(query, { skip: num, top: 20 }, function(error, res, body) {
            callback(body);
        });
    }
};
