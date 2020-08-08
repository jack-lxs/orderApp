import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'font-awesome/css/font-awesome.css'


import axios from 'axios'
import VueAxios from 'vue-axios'

//导入vant框架
import {
  NavBar,
  Form ,
  field,
  Button,
  Image as VanImage,
  Icon ,
  Toast,
  Tabbar, 
  TabbarItem,
  Swipe, 
  SwipeItem ,
  Sidebar, 
  SidebarItem,
  Lazyload,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  stepper,
  SwipeCell,
  card ,
  empty,
  swipeCell,
  cell,
  Checkbox, 
  CheckboxGroup,
  SubmitBar,
  AddressEdit,
  List,
  AddressList, 
  Popup ,
  Tab, 
  Tabs,
  CellGroup,
  Uploader

} from 'vant'

//导入用于设置 rem 基准值模块
import 'lib-flexible'

//注册vant框架的组件
Vue.use(NavBar)
    .use(Form)
    .use(field)
    .use(Button)
    .use(VanImage)
    .use(Icon)
    .use(Toast)
    .use(Tabbar)
    .use(TabbarItem)
    .use(Swipe)
    .use(SwipeItem)
    .use(Sidebar)
    .use(SidebarItem )
    .use(Lazyload )
    .use(GoodsAction)
    .use(GoodsActionIcon)
    .use(GoodsActionButton)
    .use(stepper)
    .use(SwipeCell)
    .use(card)
    .use(empty)
    .use(swipeCell)
    .use(cell)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(SubmitBar )
    .use(AddressEdit )
    .use(List)
    .use(AddressList )
    .use(Popup )
    .use(Tab)
    .use(Tabs)
    .use(CellGroup)
    .use(Uploader)
//注册axios
Vue.use(VueAxios, axios)

//配置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

//配置post请求头
axios.defaults.headers.post['Content-Type'] = 
'application/x-www-form-urlencoded; charset = utf-8';

//发起请求之前处理
axios.interceptors.request.use(config =>{
  //console.log('config ==>',config)

  if(config.method == 'post'){
    let paramsString = '';
    //post请求参数序列化，转成一个字符串
    for(let key in config.data){
      paramsString += key + '=' +config.data[key] +'&'
    }
    config.data = paramsString.slice(0,-1);

  }

    return config
})



Vue.config.productionTip = false

//添加appkey属性保存appkey
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
