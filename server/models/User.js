var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://dynamodb:8000",
});

const dynamodb = new AWS.DynamoDB();
const dynamodbDocClient = new AWS.DynamoDB.DocumentClient();

const { v4: uuidv4 } = require("uuid");

exports.createTable = () => {
  const params = {
    TableName: "users",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10,
    },
  };

  return dynamodb
    .createTable(params)
    .promise()
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw error;
    });
};

exports.findByID = (id) => {
  const params = {
    TableName: "users",
    Key: {
      id,
    },
  };
  return dynamodbDocClient
    .get(params)
    .promise()
    .then((result) => {
      if (isEmptyObject(result))
        throw { message: `User with ID: ${id} not found.` };
      return result;
    })
    .catch((error) => {
      throw error;
    });
};

exports.createUser = (user) => {
  const id = uuidv4();
  const params = {
    TableName: "users",
    Item: { ...user, id },
  };

  return dynamodbDocClient
    .put(params)
    .promise()
    .then(() => {
      return { message: "User created successfully.", user };
    })
    .catch((error) => {
      throw error;
    });
};

exports.findAll = () => {
  const params = { TableName: "users", Select: "ALL_ATTRIBUTES" };

  return dynamodb
    .scan(params)
    .promise()
    .then(({ Items }) => {
      return Items;
    })
    .catch((error) => {
      throw error;
    });
};

const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};
