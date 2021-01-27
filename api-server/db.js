const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
        
    },
    logging: false,
    // timezone: 'Asia/Bangkok'
});


// (async () =>{
//     try {
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//     } 
//     catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// })()
const models = {
    User :  require('./users/users.model')(sequelize,Sequelize),
    Admin : require('./admins/admins.model')(sequelize,Sequelize),
    Role : require('./admins/roles.model')(sequelize,Sequelize),
    RoleHasPermission : require('./admins/role_has_permission.model')(sequelize,Sequelize),
    Permission : require('./admins/permission.model')(sequelize,Sequelize),
    CompanyType : require('./backend/company_type/company_type.model')(sequelize,Sequelize),
    ProductCategory : require('./products/products_category.model')(sequelize,Sequelize),
    Product : require('./products/products.model')(sequelize,Sequelize),
    ProductImage : require('./products/products_images.model')(sequelize,Sequelize),
    Boat : require('./products/boat/boat.model')(sequelize,Sequelize),
    
    BoatImage : require('./products/boat/boat_images.model')(sequelize,Sequelize),
    BoatCategory : require('./products/boat/boat_category.model')(sequelize,Sequelize),
    PriceDate : require('./products/price_date.model')(sequelize,Sequelize),
    PriceCompanyType : require('./products/price_company_type.model')(sequelize,Sequelize),
    PriceDateDetail : require('./products/price_date_detail.model')(sequelize,Sequelize),
    ProductBoat : require('./products/products_boat.model')(sequelize,Sequelize),
    Event : require('./products/event.model')(sequelize,Sequelize),
    Booking : require('./booking/booking.model')(sequelize,Sequelize),
    BookingDetail : require('./booking/booking_detail.model')(sequelize,Sequelize),
    BookingAddress : require('./booking/booking_address.model')(sequelize,Sequelize),
    BookingBoat : require('./booking/booking_boat.model')(sequelize,Sequelize),
    BookingAddon : require('./booking/booking_addon.model')(sequelize,Sequelize),

    TransferSlip : require('./booking/transfer_slip.model')(sequelize,Sequelize),

    Location : require('./location/location.model')(sequelize,Sequelize),

    ProductAddon : require('./products/products_addon.model')(sequelize,Sequelize),

    PaypalHist :require('./booking/paypal_hist.model')(sequelize,Sequelize),

    BlogCategory : require('./blog/blog_category.model')(sequelize,Sequelize),
    Blog : require('./blog/blog.model')(sequelize,Sequelize),

    Page : require('./pages/pages.model')(sequelize,Sequelize),
    PageWidget : require('./pages/pages_widgets.model')(sequelize,Sequelize),

    Review : require('./review/review.model')(sequelize,Sequelize),

    RecommendCate : require('./products/recommend_cate.model')(sequelize,Sequelize),
    RecommendProduct : require('./products/recommend_products.model')(sequelize,Sequelize),
    
}

for (var key of Object.keys(models)) {
    models[key].associate && models[key].associate(models)
}


// console.log(Admin.associate)
// console.log('models',sequelize.models)
// models.Admin.sync({force : true})
// models.Permission.sync({force : true})
// models.User.sync({force : true})
// models.CompanyType.sync({force : true})
// sequelize.sync({alter:true})
// .then(() => console.log('Sync db success') )


module.exports = {
    sequelize,
    ...models
}