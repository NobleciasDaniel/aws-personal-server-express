const redis = require('redis');

exports.default = class RedisClient {

    constructor({host, port, password}) {
        this.expirationTime = parseInt(process.env.REDIS_EXP, 10);
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
            this.client.setEx(key, this.expirationTime ,value).then(resp => {
                return resolve(resp);
            }).catch( (err) => {
               return reject(err);
            });
        });
    }

    getKey(key){
        return new Promise((resolve, reject) => {
            console.log('ON REDIS', key);
            this.client.get(key, function (error, replay){
                console.log('REDIS', error, replay);
                if(error) reject(error);
                resolve(replay);
            });
        })
    }

}
