const DataTypes = require('sequelize').DataTypes;
let _users = require("./users");
let _services = require("./services");
let _emailTasks = require("./emailTasks");
let _mailsmaster = require("./mailsmaster");
let _articlemaster = require("./articlemaster");
let _articlerevision = require("./articlerevision");

function initModels(sequelize) {
  let services = _services(sequelize, DataTypes);
  let users = _users(sequelize, DataTypes);
  let emailTasks = _emailTasks(sequelize, DataTypes);
  let mailsmaster = _mailsmaster(sequelize, DataTypes);
  let articlemaster = _articlemaster(sequelize, DataTypes);
  let articlerevision = _articlerevision(sequelize, DataTypes);

  mailsmaster.belongsTo(emailTasks, { as: "mailstask", foreignKey: "taskId" });
  emailTasks.hasMany(mailsmaster, { as: "tasksmail", foreignKey: "taskId" });
  articlemaster.belongsTo(users, { as: "author", foreignKey: "createdBy" });
  users.hasMany(articlemaster, { as: "UserArticle", foreignKey: "createdBy" });
  articlerevision.belongsTo(users, { as: "editor", foreignKey: "createdBy" });
  users.hasMany(articlerevision, { as: "articleEditor", foreignKey: "createdBy" });

  return {
    users,
    services,
    emailTasks,
    mailsmaster,
    articlemaster,
    articlerevision
  };
};

module.exports = {
  initModels
};
