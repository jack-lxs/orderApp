<template>
  <div class="menu">
    <!-- 轮播图 -->
    <van-swipe :autoplay="3000" indicator-color="#ffffff" style="height: 163.03px;">
      <van-swipe-item v-for="(item, index) in bannerData" :key="index">
        <img class="auto-img" :src="item.bannerImg" alt />
      </van-swipe-item>
    </van-swipe>
    <!-- 侧栏导航 -->
    <div class="menu-content">
      <div class="fl menu-left">
        <div class="van-sidebar">
          <div
            class="item"
            :ref="'item'+index"
            v-for="(item ,index) in type "
            :key="index"
            :class="{active:item.isActive}"
            @click="onchange(item,index)"
          >{{item.typeDesc}}</div>
          <div class="line" :style="{top: top + 'px' }"></div>
        </div>
      </div>
      <!-- 商品内容 -->
      <div class="content fl clearfix">
        <div
          class="content-item"
          v-for="(item, index) in productData"
          :key="index"
          @click="goPage(item.pid)"
          :class="[index % 2 == 0 ? 'left' : 'right']"
        >
          <div class="imgs">
            <img class="auto-img" :src="item.smallImg" alt />
          </div>
          <div class="pro-name one-text">{{item.name}}</div>
          <div class="pro-enname one-text">{{item.enname}}</div>
          <div class="pro-price">￥{{item.price}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapState, mapMutations } = createNamespacedHelpers("menuModule");

export default {
  data() {
    return {
      top: 0,

      //banner图
      bannerData: [],

      //商品类型
      type: [],

      //移动线条的top
      top: 0,

      //侧边栏菜单的标签高度
      // height: 0,

      //商品数据
      productData: []
    };
  },
  created() {
    //获取banner数据
    this.getBannerData();

    //获取商品类型数据
    this.getTypeData();

    //根据类型获取商品数据
    this.getProductByType({ type: "isHot" });

    this.Line();
  },
  computed: {
    ...mapState(["bannerDataCache", "typeDataCache", "products", "height"])
  },

  methods: {
    ...mapMutations(["changeData", "changeProducts"]),

    //初始化时移动线条
    Line() {
      for (let i = 0; i < this.type.length; i++) {
        if (this.type[i].isActive) {
          this.top = i * this.height;
          return;
        }
      }
    },

    //侧栏导航切换
    onchange(item, index) {
      console.log(item.type);
      if (this.type.isActive) {
        return;
      }
      for (let i = 0; i <= this.type.length; i++) {
        if (this.type[i].isActive) {
          this.type[i].isActive = false;
          break;
        }
      }

      item.isActive = true;
      this.top = this.height * index;
      // console.log(this.top)
      this.getProductByType(item);
    },

    //获取banner数据
    getBannerData() {
      //获取vuex的banner缓存数据，如果存在缓存数据，则不发起请求，否则发起请求
      if (this.bannerDataCache.length > 0) {
        this.bannerData = this.bannerDataCache;
        // console.log('从缓存获取banner数据')
        return;
      }

      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/banner",
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
          this.$toast.clear();
          // console.log('result ==> ', result);
          if (result.data.code == 300) {
            result.data.result;
            // console.log('缓存banner数据');

            //缓存banner数据在vuex中
            // this.$store.commit('menuModule/changeData', {
            //   key: 'bannerDataCache',
            //   value: result.data.result
            // })

            this.changeData({
              key: "bannerDataCache",
              value: result.data.result
            });
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //获取商品类型数据
    getTypeData() {
      //获取vuex的侧边栏菜单缓存数据，如果存在缓存数据，则不发起请求，否则发起请求
      if (this.typeDataCache.length > 0) {
        this.type = this.typeDataCache;
        // console.log('从缓存获取侧边栏菜单数据')
        // console.log(this.typeData)
        return;
      }

      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });
      this.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
          this.$toast.clear();
          // console.log('result ==> ', result);
          if (result.data.code == 400) {
            result.data.result.forEach(v => {
              v.isActive = false;
            });
            result.data.result.unshift({
              type: "isHot",
              typeDesc: "最新推荐",
              isActive: true
            });
            this.type = result.data.result;

            this.$nextTick(() => {
              //获取侧边栏菜单标签高度
              let firstItemHeight = this.$refs.item0[0].clientHeight;
              // this.height = firstItemHeight;
              this.changeData({
                key: "height",
                value: firstItemHeight
              });
            });

            //缓存侧边栏菜单数据在vuex
            this.changeData({
              key: "typeDataCache",
              value: result.data.result
            });
            // console.log('缓存侧边栏菜单数据');
          }
        })
        .catch(err => {
          this.$toast.clear();
          // console.log('err ==> ', err);
        });
    },

    //根据类型获取商品数据
    getProductByType(item) {
      // console.log('this.products ==> ', this.products);

      //在缓存获取商品数据
      if (this.products[item.type]) {
        this.productData = this.products[item.type];
        // console.log('从缓存获取商品数据');
        return;
      }

      this.productData = [];

      let params = {
        appkey: this.appkey,
        key: "type",
        value: item.type
      };

      //最近推荐
      if (item.type == "isHot") {
        params.key = "isHot";
        params.value = 1;
      }

      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params
      })
        .then(result => {
          this.$toast.clear();
          // console.log('result ==> ', result);
          if (result.data.code == 500) {
            this.productData = result.data.result;

            console.log("this.productData", this.productData);
            //缓存商品数据
            this.changeProducts({
              type: item.type,
              value: result.data.result
            });
            // console.log('缓存商品数据');
          }
        })
        .catch(err => {
          this.$toast.clear();
          // console.log('err ==> ', err);
        });
    },
    //点商品跳转详情传输id
    goPage(pid) {
      // console.log( pid)
      this.$router.push({ name: "Detail", query: { pid } });
    }
  }
};
</script>

<style lang="less" scoped>
.menu {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 50px;
  width: 100%;
}
.menu-content {
  height: calc(~"100% - 163.03px");
}
.menu-left {
  width: 100px;
  height: 100%;
  background-color: #f5f5f5;
  overflow-y: auto;
}
.van-sidebar {
  width: 100px;
  height: 100%;
  position: relative;
}
.item {
  width: 100%;
  height: 44px;
  text-align: center;
  display: block;
  box-sizing: border-box;
  overflow: hidden;
  color: #323233;
  font-size: 14px;
  line-height: 44px;
  background-color: #f7f8fa;
  cursor: pointer;
}
.line {
  width: 2px;
  height: 44px;
  background-color: #ff6700;
  position: absolute;
  left: 0;
  transition: top 0.2s;
}
.active {
  background-color: #fff;
  color: #ff6700;
}

.imgs {
  width: 100%;
  height: 80px;
}
.auto-img {
  width: 100%;
  height: 100%;
}

.content {
  padding: 10px 10px 0;
  width: calc(~"100% - 120px");
  height: calc(100% - 10px);
  overflow-y: auto;
}

.content-item {
  // width: calc(~"100% - ");
  height: 155px;
  padding: 10px;
  background-color: #fff;
  margin-bottom: 5px;
  &.left {
    // margin-left: 30px;
    float: left;
    width: 105px;
    height: 155px;
  }
  &.right {
    // margin-left: 30px;
    float: left;
    width: 105px;
    margin-left: 5px;
    height: 155px;
  }
}
.pro-name {
  margin: 10px 0;
  font-size: 14px;
  text-align: center;
}
.pro-enname {
  text-align: center;
}
.pro-price {
  font-size: 14px;
  color: #ff6700;
  text-align: center;
}

.one-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>