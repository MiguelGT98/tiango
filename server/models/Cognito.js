const AWS = require("aws-sdk");
const jwt_decode = require("jwt-decode");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
let cognitoAttributeList = [];

const poolData = {
  UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  ClientId: process.env.AWS_COGNITO_CLIENT_ID,
};

const attributes = (key, value) => {
  return {
    Name: key,
    Value: value,
  };
};

function setCognitoAttributeList(user, agent) {
  let attributeList = [];
  attributeList.push(attributes("preferred_username", user.username));
  attributeList.push(attributes("phone_number", user.phone));

  attributeList.forEach((element) => {
    cognitoAttributeList.push(
      new AmazonCognitoIdentity.CognitoUserAttribute(element)
    );
  });
}

function getCognitoAttributeList() {
  return cognitoAttributeList;
}

function getCognitoUser(username) {
  const userData = {
    Username: username,
    Pool: getUserPool(),
  };
  return new AmazonCognitoIdentity.CognitoUser(userData);
}

function getUserPool() {
  return new AmazonCognitoIdentity.CognitoUserPool(poolData);
}

function getAuthDetails(username, password) {
  var authenticationData = {
    Username: username,
    Password: password,
  };
  return new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
}

function initAWS(region = process.env.AWS_COGNITO_REGION) {
  AWS.config.region = region; // Region
}

function decodeJWTToken(token) {
  const { exp, auth_time, token_use, sub, phone_number } = jwt_decode(
    token.idToken
  );
  return { token, exp, uid: sub, auth_time, token_use, phone_number };
}

module.exports = {
  initAWS,
  getCognitoAttributeList,
  getUserPool,
  getCognitoUser,
  setCognitoAttributeList,
  getAuthDetails,
  decodeJWTToken,
};
