<template>
    <div class="main">
        

        <van-tabbar v-model="menuindex"  @change="changetag" active-color="#ff6700" >
            <van-tabbar-item v-for="(item,index) in menuData" :key="index"
             :icon="item.icon">{{item.title}}</van-tabbar-item>
           
        </van-tabbar>
        <!-- 二级路由插座 -->
      <router-view></router-view>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                menuindex:0,
                 menuData:[
                     {
                        title:"菜单",
                       name:"menu",
                        icon:"coupon-o",
                        routeName:'Menu'
                    },

                     {
                        title:"订单",
                        name:"orders",
                        icon :"orders-o",
                        routeName:'Order'
                    },
                     {
                        title:"购物车",
                        name:"shopping",
                        icon :"shopping-cart-o",
                        routeName:'Shopcart'
                    },
                     {
                        title:"我的",
                        name:"contact",
                        icon:"contact",
                        routeName:'My'
                    },
                 ]

            };
        },

        methods:{

            changetag(index){
                // console.log(index)
                this.$router.push({name:this.menuData[index].routeName})
            }

        }

    }
</script>

<style lang="less" scoped>

</style>