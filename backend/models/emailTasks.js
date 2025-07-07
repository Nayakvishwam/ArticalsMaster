module.exports = function (sequelize, DataTypes) {
    return sequelize.define('emailtasks', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'emailtasks',
        schema: 'public',
        timestamps: false
    });
};