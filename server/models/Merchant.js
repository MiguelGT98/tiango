var AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
});

const dynamodb = new AWS.DynamoDB();
const dynamodbDocClient = new AWS.DynamoDB.DocumentClient();

const { v4: uuidv4 } = require("uuid");

exports.createTable = () => {
  const params = {
    TableName: "merchants",
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
    TableName: "merchants",
    Key: {
      id,
    },
  };

  return dynamodbDocClient
    .get(params)
    .promise()
    .then((result) => {
      if (isEmptyObject(result.Item))
        throw { message: `Merchant with ID: ${id} not found.` };

      return result.Item;
    })
    .catch((error) => {
      throw error;
    });
};

exports.create = (merchant) => {
  const id = uuidv4();
  const params = {
    TableName: "merchants",
    Item: { ...merchant, id },
  };

  return dynamodbDocClient
    .put(params)
    .promise()
    .then(() => {
      return { message: "Merchant created successfully.", merchant };
    })
    .catch((error) => {
      throw error;
    });
};

exports.findAll = (location_id) => {
  const params = {
    TableName: "merchants",
    Select: "ALL_ATTRIBUTES",
    FilterExpression: "location_id = :lid",
    ExpressionAttributeValues: {
      ":lid": location_id,
    },
  };

  return dynamodbDocClient
    .scan(params)
    .promise()
    .then(({ Items }) => {
      return Items;
    })
    .catch((error) => {
      throw error;
    });
};

exports.update = (id, order) => {
  let updateExpression = "set";
  let ExpressionAttributeNames = {};
  let ExpressionAttributeValues = {};

  Object.keys(order).forEach((property, index, arr) => {
    updateExpression += ` #${property} = :${property}`;

    if (index < arr.length - 1) updateExpression += ",";

    ExpressionAttributeNames["#" + property] = property;
    ExpressionAttributeValues[":" + property] = product[property];
  });

  const params = {
    TableName: "merchants",
    Key: {
      id,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues,
    ExpressionAttributeNames,
    ReturnValues: "UPDATED_NEW",
  };

  return dynamodbDocClient
    .update(params)
    .promise()
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw error;
    });
};

exports.delete = (id) => {
  const params = {
    TableName: "merchants",
    Key: {
      id,
    },
  };

  return dynamodbDocClient
    .delete(params)
    .promise()
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw error;
    });
};

const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};
