console.log('Loading function');
var AWS = require("aws-sdk");
var ddb = new AWS.DynamoDB();
var ddbgeo = require("dynamodb-geo");
//const { timeStamp } = require("console");
const DDB_name = 'ParkingDataLoad'; // table mane
 var config = new ddbgeo.GeoDataManagerConfiguration(ddb,DDB_name)//creating the table name- Parking
 config.hashKeyLength = 5

 var myGeoTableManager = new ddbgeo.GeoDataManager(config)
exports.handler = async (event, context,callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    myGeoTableManager.updatePoint({
        RangeKeyValue: { S:event.deviceID}, // Use this to ensure uniqueness of the hash/range pairs.
                  // RangeKeyValue: {S: data.timestamp.toString()},
                    GeoPoint: {
                        latitude: event.location[0],
                        longitude: event.location[1]
                    },
        UpdateItemInput:{
            UpdateExpression:'SET isOccupied = :newName',
            ExpressionAttributeValues: {
                ':newName':{BOOL :event.isOccupied}
            }
        }
    }).promise()
    .then(function(){
        console.log("success");
        callback(null,"ok");
    });

    return `Successfully processed ${event.Records} records.`;
};
