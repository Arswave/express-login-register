const mysql = require('mysql');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'user'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('MySQL database conncetin succsesful!');
});

const createUser = (username, password, callback) => {
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return callback(err);

    const insertUserQuery = `INSERT INTO users (username, password) VALUES ('${username}', '${hashedPassword}')`;

    connection.query(insertUserQuery, (err, result) => {
      if (err) return callback(err);

      callback(null, result.insertId);
    });
  });
};

const authenticateUser = (username, password, callback) => {
  const getUserQuery = `SELECT * FROM users WHERE username = '${username}'`;

  connection.query(getUserQuery, (err, rows) => {
    if (err) return callback(err);

    if (rows.length === 0) {
      return callback(null, false);
    }

    const user = rows[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return callback(err);
      if (isMatch) {
        callback(null, user);
      } else {
        callback(null, false);
      }
    });
  });
};
createUser('Tunar', '1234', (err, userId) => {
  if (err) throw err;
  console.log('User Created ID:', userId);

  authenticateUser('Tunar', '1234', (err, user) => {
    if (err) throw err;

    if (user) {
      console.log('user name registired:', user.username);
    } else {
      console.log('user name or password wrong');
    }
  });
});
