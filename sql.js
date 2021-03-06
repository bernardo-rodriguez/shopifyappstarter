require("openssl")

const { Pool, Client } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})

// const pool = new Pool({
//     user: 'XXXXXX',
//     host: 'localhost',
//     database: 'XXXXXX',
//     password: 'XXXXXXX',
//     port: 5432,
//  });

module.exports = {
    merchantAuth:  function(shop, accessToken) {
        pool.connect((err, client, release) => {
            if (err) {
              console.log(err)
              return console.error('Error acquiring client', err.stack)
            }
             client.query("insert into merchant_entries (shop_name, offline_token) values ($1, $2) ON CONFLICT (shop_name) DO UPDATE SET offline_token = $2", [shop, accessToken], (err, result) => {
              release()
              if (err) {
                return console.error('Error executing query', err.stack)
              }
              console.log(result.rows)
            })
          })
    },

    getOfflineToken:  async function(shop) {
        return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
              return reject(err)
            }
              client.query("select offline_token from merchant_entries where shop_name = $1", [shop], (err, result) => {
              release()
              if (err) {
                return reject(err)
              }
              resolve(result.rows)
            })
          })
        })
    }
}