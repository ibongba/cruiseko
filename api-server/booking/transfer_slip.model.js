module.exports = (sequelize, type) => {
  var TransferSlip  = sequelize.define('transfer_slip', {
    id : {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    booking_id : {
      type: type.STRING,
      allowNull : false
    },
    user_id : {
      type: type.STRING,
      allowNull : false
    },
    from_bank : type.STRING,
    to_bank : type.STRING,
    image : type.STRING,
    pin : type.STRING(40),
    transfer_date : type.DATE,
    amount : {
      type : type.DECIMAL(18,2),
      allowNull : false,
      defaultValue : 0
    },
    status : {
      type : type.INTEGER,
      defaultValue : 1
    },
    
    
  },
  {
      timestamps: true,
      freezeTableName: true
  })

  TransferSlip.associate = function(models) {
    TransferSlip.belongsTo(models.Booking,{foreignKey : 'booking_id',constraints: false})
  };
  return TransferSlip
}
