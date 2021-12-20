const redis = require('redis');

exports.default = class RedisClient {

    constructor({host, port, password}) {
        this.client = redis.createClient({
            host, port, password
        });
        this.client.connect();
        this.client.on('error', (err) => {
            console.log('Redis-error: ', err);
        })
    }

    setKey({key,value}){
        return new Promise((resolve, reject) => {
            this.client.setEx(key, 60 ,value).then(resp => {
                return resolve(resp);
            }).catch( (err) => {
               return reject(err);
            });
        });
    }

    getKey(key){
        return new Promise((resolve, reject) => {
            this.client.get(key, function (error, replay){
                if(error) reject(error);
                resolve(replay);
            });
        })
    }

}
