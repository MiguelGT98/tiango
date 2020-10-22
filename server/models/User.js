var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://dynamodb:8000",
});

const dynamodb = new AWS.DynamoDB();
const dynamodbDocClient = new AWS.DynamoDB.DocumentClient();

const { v4: uuidv4 } = require("uuid");

// For Cognito auth
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWSCognito = require("aws-sdk");
AWSCognito.config.region = "us-east-1";
const request = require("request");
const jwkToPem = require("jwk-to-pem");
const jwt = require("jsonwebtoken");
global.fetch = require("node-fetch");

const util = require("util");
const Cognito = require("./Cognito");

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
      if (isEmptyObject(result.Item))
        throw { message: `User with ID: ${id} not found.` };
      return result.Item;
    })
    .catch((error) => {
      throw error;
    });
};

const signUpWithCognito = (username, password, agent = "none") => {
  return new Promise((resolve, reject) => {
    Cognito.initAWS();
    Cognito.setCognitoAttributeList(username, agent);
    Cognito.getUserPool().signUp(
      username,
      password,
      Cognito.getCognitoAttributeList(),
      null,
      function (err, result) {
        if (err) {
          return reject(err);
        }

        const response = {
          uid: result.userSub,
          username: result.user.username,
          userConfirmed: result.userConfirmed,
          userAgent: result.user.client.userAgent,
        };

        return resolve(response);
      }
    );
  });
};

exports.register = (user) => {
  return signUpWithCognito(user.username, user.password)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw error;
    });
};

const verifyCode = (user, code) => {
  return new Promise((resolve, reject) => {
    Cognito.getCognitoUser(user).confirmRegistration(
      code,
      true,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      }
    );
  });
};

exports.confirmCode = (user, code) => {
  return verifyCode(user.username, code)
    .then(() => {
      return this.update(user.id, { verified: true });
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw error;
    });
};

const signInWithCognito = (username, password) => {
  return new Promise((resolve, reject) => {
    Cognito.getCognitoUser(username).authenticateUser(
      Cognito.getAuthDetails(username, password),
      {
        onSuccess: (result) => {
          const token = {
            accessToken: result.getAccessToken().getJwtToken(),
            idToken: result.getIdToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          };
          return resolve(Cognito.decodeJWTToken(token));
        },
        onFailure: (err) => {
          return reject(err);
        },
      }
    );
  });
};

exports.login = (user) => {
  return signInWithCognito(user.username, user.password)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw error;
    });
};

exports.createUser = (user) => {
  const params = {
    TableName: "users",
    Item: { ...user },
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

exports.update = (id, user) => {
  let updateExpression = "set";
  let ExpressionAttributeNames = {};
  let ExpressionAttributeValues = {};

  Object.keys(user).forEach((property, index, arr) => {
    updateExpression += ` #${property} = :${property}`;

    if (index < arr.length - 1) updateExpression += ",";

    ExpressionAttributeNames["#" + property] = property;
    ExpressionAttributeValues[":" + property] = user[property];
  });

  const params = {
    TableName: "users",
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

const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};
