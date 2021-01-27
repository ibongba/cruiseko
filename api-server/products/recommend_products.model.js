module.exports = (sequelize, type) => {
  var RecommendProduct  = sequelize.define('rec_products', {
    id : {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order : {
      type : type.INTEGER,
      defaultValue : 0
    },
    cate_key : type.STRING,
    product_id : type.INTEGER
    // deleted : {
    //   type : type.INTEGER,
    //   defaultValue : 0
    // }
  //   price : type.DECIMAL(18,2)
  },
  {
      timestamps: false,
      freezeTableName: true
  })

  RecommendProduct.associate = function(models) {
    RecommendProduct.belongsTo(models.Product,{foreignKey : 'product_id',constraints: false})
  };
  return RecommendProduct
}
