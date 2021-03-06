module.exports = (sequelize, type) => {
  var PriceCompanyType  = sequelize.define('price_company_type', {
    id : {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    company_type_id : type.INTEGER,
    price_date_id : type.INTEGER,
    // price : type.DECIMAL(18,2),
    
  },
  {
      timestamps: true,
      freezeTableName: true
  })

  PriceCompanyType.associate = function(models) {
    PriceCompanyType.belongsTo(models.CompanyType,{foreignKey : 'company_type_id',constraints: false})
    PriceCompanyType.hasMany(models.PriceDateDetail,{foreignKey : 'price_company_type_id',constraints: false})
  };
  return PriceCompanyType
}
