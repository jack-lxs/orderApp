
export const routes = [
  {
    path: '/register',
    name: 'Register',
    component: r => require(['../views/Register.vue'], r)
  },
  {
    path: '/login',
    name: 'Login',
    component: r => require(['../views/Login.vue'], r)
  },
  {
    path: '/main',
    name: 'Main',
    component: r => require(['../views/Main.vue'], r),

    children:[
      {
        path: 'menu',
        name: 'Menu',
        component: r => require(['../views/mainViews/Menu.vue'], r)
      },
      {
        path: 'order',
        name: 'Order',
        component: r => require(['../views/mainViews/Order.vue'], r)
      },
      {
        path: 'shopcart',
        name: 'Shopcart',
        component: r => require(['../views/mainViews/Shopcart.vue'], r)
      },
      {
        path: 'my',
        name: 'My',
        component: r => require(['../views/mainViews/My.vue'], r)
      },
    ]
  },
  {
    path: '/detail',
    name: 'Detail',
    component: r => require(['../views/Detail.vue'], r)
  },
  {
    path: '/address/:aid?',
    name: 'Address',
    component: r => require(['../views/Address.vue'], r)
  },
  {
    path: '/myaddress',
    name: 'Myaddress',
    component: r => require(['../views/Myaddress.vue'], r)
  },
  {
    path: '/pay',
    name: 'Pay',
    component: r => require(['../views/Pay.vue'], r)
  },
  {
    path: '/mumber',
    name: 'Mumber',
    component: r => require(['../views/Mumber.vue'], r)
  },
  {
    path: '/mycollection',
    name: 'Mycollection',
    component: r => require(['../views/Mycollection.vue'], r)
  },
  {
    path: '/security',
    name: 'Security',
    component: r => require(['../views/Security.vue'], r)
  },
  {
    path: '*',
    redirect: {
      name: 'Register'
    }
  },
 

]