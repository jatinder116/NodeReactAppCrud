import Login from '../components/login/index';
import cretateUser from '../components/createUser/index';
import Home from '../components/home/index';
import User from '../components/user/index';
export const routes = [
    {
        path: '/',
        exact: true,
        name: 'Login',
        component: Login
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/cretateUser',
        name: 'cretateUser',
        component: cretateUser
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/user',
        name: 'User',
        component: User
    }
]

