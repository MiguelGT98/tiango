const stripe = require("stripe")(process.env.TEST_STRIPE_PRIVATE_KEY);

var AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION
  
});

const dynamodb = new AWS.DynamoDB();
const dynamodbDocClient = new AWS.DynamoDB.DocumentClient();

const { v4: uuidv4 } = require("uuid");

const User = require("../models/User");

exports.payWithCard = (payment_data, user_id) => {
  const { amount, payment_method, description } = payment_data;

  return User.findByID(user_id)
    .then((user) => {
      return stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "mxn",
        confirm: true,
        payment_method,
        description,
        customer: user.stripe_id,
      });
    })
    .then((response) => {
      const {
        id,
        amount,
        invoice,
        description,
        payment_method,
        status,
      } = response;
      return {
        id,
        amount,
        invoice,
        description,
        payment_method,
        status,
      };
    })
    .then((payment) => {
      return this.createPayment(payment, user_id);
    })
    .catch((error) => {
      throw error;
    });
};

exports.createPayment = (payment, user_id) => {
  const id = uuidv4();
  const params = {
    TableName: "payments",
    Item: { ...payment, id, stripe_id: payment.id, user_id },
  };

  return dynamodbDocClient
    .put(params)
    .promise()
    .then(() => {
      return { message: "Payment created successfully.", payment };
    })
    .catch((error) => {
      throw error;
    });
};

exports.createTable = () => {
  const params = {
    TableName: "payments",
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
    TableName: "payments",
    Key: {
      id,
    },
  };
  return dynamodbDocClient
    .get(params)
    .promise()
    .then((result) => {
      if (isEmptyObject(result.Item))
        throw { message: `Payment with ID: ${id} not found.` };
      return result.Item;
    })
    .catch((error) => {
      throw error;
    });
};

exports.findAll = () => {
  const params = { TableName: "payments", Select: "ALL_ATTRIBUTES" };

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

exports.update = (id, payment) => {
  let updateExpression = "set";
  let ExpressionAttributeNames = {};
  let ExpressionAttributeValues = {};

  Object.keys(payment).forEach((property, index, arr) => {
    updateExpression += ` #${property} = :${property}`;

    if (index < arr.length - 1) updateExpression += ",";

    ExpressionAttributeNames["#" + property] = property;
    ExpressionAttributeValues[":" + property] = payment[property];
  });

  const params = {
    TableName: "payments",
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
    TableName: "payments",
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
