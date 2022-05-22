import axios from 'axios'
import cookies from 'react-cookies'

export let endpoints = {
    "posts": "/posts/",
    "hagtags": "/hagtags/",
    "users":"/users/",
    "oauth2-info": "/oauth2-info",
    "login": "/o/token/",
    "current-user": "/users/current-user/",
    "notifications": "/notifications/",
    "admin":"/admin/",


}

export const authAxios = () => axios.create({
    baseURL: "http://127.0.0.1:8000/",
    headers: {
        'Authorization': `Bearer ${cookies.load('access_token')}`
    }
})

export default axios.create({
    baseURL: "http://127.0.0.1:8000/",

}
)

