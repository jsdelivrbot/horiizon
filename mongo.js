const stitch = require("mongodb-stitch")
const client = new stitch.StitchClient('horiizonapp-kjfmu');
const db = client.service('mongodb', 'mongodb-atlas').db('HoriizonDB');
client.login().then(() =>
  db.collection('users.horiizonCollection').updateOne({owner_id: client.authedId()}, {$set:{number:42}}, {upsert:true})
).then(() =>
  db.collection('users.horiizonCollection').find({owner_id: client.authedId()})
).then(docs => {
  console.log("Found docs", docs)
  console.log("[MongoDB Stitch] Connected to Stitch")
}).catch(err => {
  console.error(err)
});

/*
mongo "mongodb://horiizoncluster-shard-00-00-mwalx.mongodb.net:27017,horiizoncluster-shard-00-01-mwalx.mongodb.net:27017,horiizoncluster-shard-00-02-mwalx.mongodb.net:27017/test?replicaSet=HoriizonCluster-shard-0" --authenticationDatabase admin --ssl --username NodeBeast --password Ov3rK1ll
*/

