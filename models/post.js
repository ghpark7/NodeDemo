const sequelize = require('sequelize');

class Post extends sequelize.Model {
    static initiate(sequelize) {
        Post.init({
            content: {
                type: sequelize.STRING(140),
                allowNull: false,
            },
            img: {
                type: sequelize.STRING(200),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Post.belongsTo(db.User);
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    }
};

module.exports = Post;