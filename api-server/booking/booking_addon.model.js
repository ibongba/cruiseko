module.exports = (sequelize, type) => {
  var BookingAddon  = sequelize.define('booking_addon', {
    id : {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    booking_id : type.STRING,
    product_id : type.INTEGER,
    addon_id : type.INTEGER,
    price : type.DECIMAL(18,2),
    quantity : {
      type : type.INTEGER,
      defaultValue : 1
    }
  },
  {
      timestamps: false,
      freezeTableName: true
  })

  BookingAddon.associate = function(models) {
    BookingAddon.belongsTo(models.ProductAddon,{foreignKey : 'addon_id',constraints: false , as :'addon'})
    // ProductBoat.belongsTo(models.Product,{foreignKey : 'product_id',constraints: false})
  };
  return BookingAddon
}
