module.exports = (sequelize, type) => {
  var Booking  = sequelize.define('booking', {
    id : {
      type: type.STRING,
      primaryKey: true,
      // autoIncrement: true
    },
    // product_id : {
    //   type: type.INTEGER,
    //   allowNull : false
    // },
    user_id : {
      type: type.STRING(40),
      allowNull : false

    },
    // user_company_type_name : type.STRING,
    user_type : type.STRING(20),
    user_firstname : type.STRING,
    user_lastname : type.STRING,
    user_email : type.STRING,
    user_phone : type.STRING(50),
    total_person : {
      type : type.INTEGER,
      allowNull : false,
      defaultValue : 0
    },
    adult : {
      type : type.INTEGER,
      allowNull : false,
      defaultValue : 0
    },
    children : {
      type : type.INTEGER,
      allowNull : false,
      defaultValue : 0
    },
    net_price : {
      type : type.DECIMAL(18,2),
      allowNull : false,
      defaultValue : 0
    },
    addon_price : {
      type : type.DECIMAL(18,2),
      allowNull : false,
      defaultValue : 0
    },
    duration : {
      type : type.INTEGER,
      allowNull : false,
      defaultValue : 0
    },
    // status : {
    //   type : type.INTEGER,
    //   allowNull : false,
    //   defaultValue : 0
    // },
    payment_status : type.INTEGER,
    payment_date : type.DATE,
    start_date : type.DATE,
    end_date : type.DATE,
    //CREDIT, TRANSFER
    payment_type : type.STRING,
    trasaction_id : type.STRING,
    
  },
  {
      timestamps: true,
      freezeTableName: true
  })

  Booking.associate = function(models) {
    Booking.hasMany(models.BookingBoat,{foreignKey : 'booking_id',constraints: false})
    Booking.hasMany(models.BookingDetail,{foreignKey : 'booking_id',constraints: false})
    Booking.hasMany(models.BookingAddon,{foreignKey : 'booking_id',constraints: false})
    Booking.hasOne(models.BookingAddress,{foreignKey : 'booking_id',constraints: false})
    Booking.belongsTo(models.User,{foreignKey : 'user_id',constraints: false})
    Booking.hasMany(models.TransferSlip,{foreignKey : 'booking_id',as : 'slips',constraints: false})
  };
  return Booking
}
