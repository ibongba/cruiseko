module.exports = (sequelize, type) => {
    var ProductAddon  = sequelize.define('products_addon', {
      id : {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      product_id : type.INTEGER,
      name : type.STRING,
      description : type.TEXT,
      price : type.DECIMAL(18,2)
    },
    {
        timestamps: true,
        freezeTableName: true
    })
  
    ProductAddon.associate = function(models) {
      ProductAddon.belongsTo(models.Product,{foreignKey : 'product_id',constraints: false})
      // ProductBoat.belongsTo(models.Product,{foreignKey : 'product_id',constraints: false})
    };
    return ProductAddon
  }
  