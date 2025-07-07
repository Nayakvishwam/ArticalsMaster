module.exports = function (sequelize, DataTypes) {
    return sequelize.define('services', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        }
    }, {
        sequelize,
        tableName: 'services',
        schema: 'public',
        timestamps: false
    });
};