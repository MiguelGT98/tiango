var mysql = require("promise-mysql");

const createConnection = () => {
  return mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: "tiango",
  });
};

exports.findAll = () => {
  return createConnection()
    .then((connection) => {
      return connection.query("SELECT * FROM locations");
    })
    .then((locations) => {
      return locations;
    })
    .catch((error) => {
      throw error;
    });
};

exports.findByID = (id) => {
  return createConnection()
    .then((connection) => {
      return connection.query(
        "SELECT * FROM locations WHERE id = ? LIMIT 1",
        id
      );
    })
    .then((result) => {
      if (result.length === 0)
        throw { message: `Location with id: ${id} does not exist.` };

      return result[0];
    })
    .catch((error) => {
      throw error;
    });
};

exports.create = (location) => {
  return createConnection()
    .then((connection) => {
      return connection.query("INSERT INTO locations SET ?", location);
    })
    .then((result) => {
      return {
        message: "Location created succesfully",
        location: { ...location, id: result.insertId },
      };
    })
    .catch((error) => {
      throw error;
    });
};

exports.delete = (id) => {
  return createConnection()
    .then((connection) => {
      return connection.query("DELETE FROM locations WHERE id=?", id);
    })
    .then(() => {
      return {
        message: `Location with id: ${id} deleted succesfully`,
      };
    })
    .catch((error) => {
      throw error;
    });
};

exports.update = (id, location) => {
  return createConnection()
    .then((connection) => {
      return connection.query("UPDATE locations SET ? WHERE id=?", [
        location,
        id,
      ]);
    })
    .then((result) => {
      console.log(result);
      return {
        message: `Location with id: ${id} updated succesfully`,
      };
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
