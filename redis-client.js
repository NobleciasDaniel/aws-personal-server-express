const redis = require('redis');

exports.default = class RedisClient {

    constructor({host, port, password}) {
        this.client = redis.createClient({
            host, port, password
        })
        this.client.on('error', (err) => {
            console.log('Redis-error: ', err);
        })
    }

    setKey({key,value}){
        return new Promise((resolve, reject) => {
            this.client.set(key, value, (error, reply) => {
                if(error) reject(error);
                resolve(reply);
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
