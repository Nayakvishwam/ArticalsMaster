module.exports = function (sequelize, DataTypes) {
    return sequelize.define('mailsmaster', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        to: {
            type: DataTypes.STRING,
            allowNull: false
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        taskId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('queued', 'sent', 'failed'),
            allowNull: false,
            defaultValue: 'queued'
        },
        replaceContent: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        sent_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'mailsmaster',
        schema: 'public',
        timestamps: true // or true if you want Sequelize to manage createdAt/updatedAt automatically
    });
};