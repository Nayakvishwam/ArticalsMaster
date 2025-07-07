const DataTypes = require('sequelize').DataTypes;
let _users = require("./users");
let _services = require("./services");
let _emailTasks = require("./emailTasks");
let _mailsmaster = require("./mailsmaster");

function initModels(sequelize) {
  let users = _users(sequelize, DataTypes);
  let services = _services(sequelize, DataTypes);
  let emailTasks = _emailTasks(sequelize, DataTypes);
  let mailsmaster = _mailsmaster(sequelize, DataTypes);

  mailsmaster.belongsTo(emailTasks, { as: "mailstask", foreignKey: "taskId" });
  emailTasks.hasMany(mailsmaster, { as: "tasksmail", foreignKey: "taskId" });

  return {
    users,
    services,
    emailTasks,
    mailsmaster
  };
};

module.exports = {
  initModels
};
