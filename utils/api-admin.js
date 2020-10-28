import axios from 'axios'
import AuthService from './AdminAuthService'
const BASE = `${process.env.HOST}/api`; 
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
   getUsersOne : (id) => service.get(`/users/${id}`),

   //Admin Users
   getAdminProfile : () => service.get(`/backend/admin/profile`),
   getAdminUsers : () => service.get(`/backend/admin`),
   getAdminUsersOne : (id) => service.get(`/backend/admin/${id}`),
   insertAdminUsers : (data) => service.post('/backend/admin',data) ,
   updateAdminUsers : (id, data) => service.put(`/backend/admin/${id}`,data) ,
   delAdminUsers : (id) => service.delete(`/backend/admin/${id}`),

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
 
}