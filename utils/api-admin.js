import axios from 'axios'
import AuthService from './AdminAuthService'
const BASE = `${process.env.URL}/api`; 
const service = axios.create({baseURL : '/api' })

// axios.interceptors.response.use((response) => {
//     if(response.status === 401) {
//          alert("You are not authorized");
//     }
//     return response;
// }, (error) => {
//     if (error.response && error.response.data) {
//         return Promise.reject(error.response.data);
//     }
//     return Promise.reject(error.message);
// });

service.interceptors.request.use(function (config) {
    // console.log('call api url2' ,config.url)
    if(typeof window == 'undefined'){
        // console.log('asda')
        return config;
    }
    const token = AuthService.getToken();
    //If logged in
     if (token && !config.headers.access_token) {
        //console.log('test1')
        config.headers.Authorization =  'bearer '+token;
     } 
     
     
     return config;
});

export default {
  //Payment
   baseUrl : BASE,

   //Login
   login : (data) => service.post(`/backend/admin/login`,data),

   //Users Front End
   getUsers : (params) => service.get(`/users`,{params}),
   getUsersOne : (id, params) => service.get(`/users/${id}`,{params}),
   updateUsers : (id, data) => service.put(`/users/${id}`,data) ,

   //All Count
   getCountUsers : () => service.get(`/backend/count`),

   //Admin Users
   getAdminProfile : () => service.get(`/backend/admin/profile`),
   getAdminUsers : () => service.get(`/backend/admin`),
   getAdminUsersOne : (id) => service.get(`/backend/admin/${id}`),
   insertAdminUsers : (data) => service.post('/backend/admin',data) ,
   updateAdminUsers : (id, data) => service.put(`/backend/admin/${id}`,data) ,
   delAdminUsers : (id) => service.delete(`/backend/admin/${id}`),

   //Company Type
   getCompany : (params) => service.get(`/backend/company-type`, {params}),
   getCompanyOne : (id) => service.get(`/backend/company-type/${id}`),
   insertCompany : (data) => service.post('/backend/company-type',data) ,
   updateCompany : (id, data) => service.put(`/backend/company-type/${id}`,data) ,
   delCompany : (id) => service.delete(`/backend/company-type/${id}`),

   //Permission
   getPermission : () => service.get(`/backend/permission`),
   getPermissioneOne : (id) => service.get(`/backend/permission/${id}`),
   insertPermission : (data) => service.post(`/backend/permission`,data),
   updatePermission : (data) => service.post(`/backend/permission/update`,data),
   delPermission : (id) => service.delete(`/backend/permission/${id}`),

    //Role
    getRole : () => service.get(`backend/roles`),
    getRoleOne : (id) => service.get(`/backend/roles/${id}`),
    insertRole : (data) => service.post(`/backend/roles`,data),
    updateRole : (data) => service.post(`/backend/roles/update`,data),
    delRole : (id) => service.delete(`/backend/roles/${id}`),

    //Boat
    getBoat : (params) => service.get(`/boat`, {params}),
    getBoatOne : (id) => service.get(`/boat/${id}`),
    insertBoat : (data) => service.post('/boat',data) ,
    updateBoat : (id, data) => service.put(`/boat/${id}`,data) ,
    delBoat : (id) => service.delete(`/boat/${id}`),

    //Boat Category
    getBoatCate : (params) => service.get(`/boat-category`, {params}),
    getBoatCateOne : (id) => service.get(`/boat-category/${id}`),
    insertBoatCate : (data) => service.post('/boat-category',data) ,
    updateBoatCate : (id, data) => service.put(`/boat-category/${id}`,data) ,
    delBoatCate : (id) => service.delete(`/boat-category/${id}`),


    //Product Category
    getPackageCate : (params) => service.get(`/products-category`, {params}),
    getPackageCateOne : (id) => service.get(`/products-category/${id}`),
    insertPackageCate : (data) => service.post('/products-category',data) ,
    updatePackageCate : (id, data) => service.put(`/products-category/${id}`,data) ,
    delPackageCate : (id) => service.delete(`/products-category/${id}`),
 
    //Package
    getPackage : (params) => service.get(`/products`, {params}),
    getPackageOne : (id,params) => service.get(`/products/${id}`,{params}),
    updatePackageOne : (id,data) => service.put(`/products/${id}`,data),
    updatePackagePublish : (data) => service.post(`/products/publish`,data),
    insertPackage : (data) => service.post('/products',data) ,
    delPackage : (id) => service.delete(`/products/${id}`),
   
    //Duplicate Package
    dupPackage : (data) => service.post(`/products/duplicate`, data),


    //Bookings
    getBooking : (params) => service.get(`/booking`, {params}),
    getBookingOne : (id) => service.get(`/booking/${id}`),



    //Blog
    getBlog : (params) => service.get(`/blog`, {params}),
    getBlogOne : (id) => service.get(`/blog/${id}`),
    insertBlog : (data) => service.post('/blog',data) ,
    updateBlog : (id, data) => service.put(`/blog/${id}`,data) ,
    delBlog : (id) => service.delete(`/blog/${id}`),
 
    //Blog Category
    getBlogCate : (params) => service.get(`/blog/category`, {params}),
    getBlogCateOne : (id) => service.get(`/blog/category/${id}`),
    insertBlogCate : (data) => service.post('/blog/category',data) ,
    updateBlogCate : (id, data) => service.put(`/blog/category/${id}`,data) ,
    delBlogCate : (id) => service.delete(`/blog/category/${id}`),


    //Location
    getLocation : () => service.get(`/location`),
    getLocationOne : (id) => service.get(`/location/${id}`),
    insertLocation : (data) => service.post(`/location`,data),
    updateLocation : (data, id) => service.put(`/location/${id}`,data),
    delLocation : (id) => service.delete(`/location/${id}`),
 

     //Page
    getPage : (params) => service.get(`/pages`, {params}),
    getPageOne : (id) => service.get(`/pages/${id}`),
    insertPage : (data) => service.post(`/pages`,data),
    updatePage : (id, data) => service.put(`/pages/${id}`,data) ,

    //Page Widget
    getPageWidget : (params) => service.get(`/pages/widgets`, {params}),
    getPageWidgetOne : (id) => service.get(`/pages/widgets/${id}`),
    insertPageWidget : (data) => service.post(`/pages/widgets`,data),
    updatePageWidget : (id, data) => service.put(`/pages/widgets/${id}`,data) ,
    delPageWidget : (id) => service.delete(`/pages/widgets/${id}`),

    //Popular Package
    getPopularPackage : (params) => service.get(`/recommend/products`, {params}),
    insertPopularPackage : (data) => service.post('/recommend/products',data) ,
    updatePopularPackage : (id, data) => service.put(`/recommend/products/${id}`,data) ,
    delPopularPackage : (id) => service.delete(`/recommend/products/${id}`),


}