<template>
  <div class="detail">
    <van-nav-bar title="商品详情" left-text="返回" left-arrow :fixed="true" @click-left="back" />
    <!-- 详情照片 -->
    <div>
      <img class="auto-img" :src="productData.large_img" />
    </div>

    <!-- 详情内容 -->
    <div class="detail-content">
      <div class="clearfix detail-info">
        <span class="fl pro-name">{{productData.name}}</span>
        <span class="fr like">
          <img
            class="auto-img"
            @click="like"
            :src="require('../assets/image/' + (islike ? 'like.png': 'dislike.png'))"
            alt
          />
        </span>
      </div>

      <!-- 商品规格 -->
      <div class="rule-box">
        <div class="rule-item clearfix" v-for="(item,index) in productData.rules " :key="index">
          <div class="fl rule-title">{{item.title}}</div>
          <div class="rule-tags clearfix fl">
            <div
              class="fl tag-item"
              @click="taggle(item,v)"
              :class="{active : v.isActive}"
              v-for="(v,i) in item.tag"
              :key="i"
            >{{v.name}}</div>
          </div>
        </div>
      </div>

      <!-- 商品描述 -->
      <div class="desc-box">
        <div class="desc-title">商品描述</div>
        <div class="desc-content">
          <div class="desc-item" v-for="(item ,index) in productData.desc" :key="index">{{item}}</div>
        </div>
      </div>

      <div class="clearfix price-box">
        <div class="fl price">￥{{productData.price*this.count}}</div>
        <div class="fr">
          <van-stepper
            v-model="count"
            :integer="true"
            theme="round"
            button-size="22"
            disable-input
          />
        </div>
      </div>

      <van-goods-action>
        <van-goods-action-icon icon="cart-o" text="购物车" @click="goShopcart" :badge="shopcartcount" />
        <van-goods-action-button
          color="linear-gradient(to top,yellow,#ff6600) "
          type="warning"
          text="加入购物车"
          @click="addshopcart"
        />
        <van-goods-action-button color="#ff6700" type="danger" text="立即购买" />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //购物车商品数量
      count: 1,

      //商品id
      pid: "",

      //商品数据
      productData: {},

      //爱心
      islike: false,

      //购物车商品数量
      shopcartcount: 0
    };
  },
  created() {
    //接收menu传过来的商品id
    this.pid = this.$route.query.pid;

    // 创建商品数据
    this.getProductPid(this.pid);

    //点击收藏与取消收藏
    this.findlike();

    this.findshopcart();
  },

  methods: {
    //返回
    back() {
      this.$router.go(-1);
    },

    //根据商品id获取商品详情内容
    getProductPid(pid) {
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          pid,
          appkey: this.appkey
        }
      })
        .then(result => {
          this.$toast.clear();
          // console.log('productpid result ==>',result);
          if (result.data.code == 600) {
            let data = result.data.result[0];
            data.desc = data.desc.split(/\n/);

            //商品规格
            let num = ["tem", "sugar", "milk", "cream"];
            // [
            //  {title:糖,tag:[{name:"全糖"},{name:"半糖"}]},
            //  {title:奶油,tag:[{name:"有奶油"},{name:"无奶油"}]},
            //  {title:温度,tag:[{name:"冷"},{name:"热"}]},
            // ]
            let rules = [];
            num.forEach(v => {
              //判断里面的tag是否为空,空就排除
              if (data[v] != "") {
                //给rule创建对象储存
                let rule = {
                  title: data[v + "_desc"],
                  tag: []
                };
                // 将data里面的tag进行切割
                let tag = data[v].split(/\//);
                // 往tag 里面储存isActive
                tag.forEach((item, i) => {
                  let t = {
                    name: item,
                    isActive: i == 0
                  };
                  // 给rule推进tag
                  rule.tag.push(t);
                });

                // console.log("rule==>",rule)
                rules.push(rule);
              }
            });

            data.rules = rules;
            this.productData = data;
            // console.log("this.productData",this.productData);
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==>", err);
        });
    },
    //切换商品规格
    taggle(item, v) {
      // console.log("item -->",item)
      // console.log("v-->", v)
      if (v.isActive) {
        return;
      }

      // 获取标签是否激活
      for (let i = 0; i <= item.tag.length; i++) {
        if (item.tag[i].isActive) {
          item.tag[i].isActive = false;
          break;
        }
      }
      v.isActive = true;
    },
    //点击爱心切换收藏
    like() {
      let url = this.islike ? "/notlike" : "/like";

      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭,
        duration: 0
      });
      let tokenString = localStorage.getItem("__tk");
      this.axios({
        method: "POST",
        url,
        data: {
          pid: this.pid,
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log("result -->", result);
          if (result.data.code == 800 || result.data.code == 900) {
            //收藏成功
            // console.log(result.data.msg)
            this.islike = result.data.code == 800;
            // this.$toast(result.data.msg)
          } else {
            //收藏失败,跳转登录界面
            this.$router.push({ name: "Login" });
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err -->", err);
        });
    },

    //查找商品是否收藏
    findlike() {
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭,
        duration: 0
      });
      let tokenString = localStorage.getItem("__tk");
      this.axios({
        method: "GET",
        url: "/findlike",
        params: {
          pid: this.pid,
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          // console.log("result find-->" ,result)
          if (result.data.code == 1000) {
            if (result.data.result.length > 0) {
              this.islike = true;
            } else {
              this.islike = false;
            }
          } else {
            this.$router.push({ name: "Login" });
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err -->", err);
        });
    },

    //加入购物车
    addshopcart() {
      let tokenString = localStorage.getItem("__tk");
      let rules = this.productData.rules;
      console.log(rules);
      let rule = [];
      rules.forEach(v => {
        for (let i = 0; i < v.tag.length; i++) {
          rule.push(v.tag[i].name);
        }
      });

      // console.log(rule.join("/"))
      // return;
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "/addShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          pid: this.pid,
          // 商品数量
          count: this.count,
          rule: rule.join("/")
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log("result addshopcart==>", result);
          if (result.data.code == 3000) {
            if (result.data.stuta == 1) {
              this.shopcartcount++;
            }

            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==>", err);
        });
    },

    //查询购物车商品数量
    findshopcart() {
      let tokenString = localStorage.getItem("__tk");
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/shopcartCount",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log("result 查询购物车数量 ==>", result);

          if (result.data.code == 4000) {
            this.shopcartcount = result.data.result;
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==>", err);
        });
    },

    //跳转购物车页面
    goShopcart() {
      console.log();
      this.$router.push({ name: "Shopcart" });
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.van-nav-bar__text {
  color: #ff6700;
}
/deep/ .van-nav-bar .van-icon {
  color: #ff6700;
}

.detail {
  margin-bottom: 70px;
  padding-top: 46px;
  .detail-content {
    padding: 10px;
    background-color: #fff;
  }
  .detail-info {
    margin-top: 10px;
  }

  .like {
    width: 24px;
    height: 24px;
  }
  .pro-name {
    font-size: 16px;
    line-height: 24px;
  }

  .rule-box {
    margin-top: 20px;
    padding-bottom: 10px;
    font-size: 14px;
    border-bottom: 1px solid #e8e8e8;
  }

  .rule-title {
    height: 26px;
    line-height: 26px;
    width: 60px;
    color: #444;
  }
  .tag-item {
    width: 60px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    background-color: #f2f2f2;
    border-radius: 13px;
    margin-right: 10px;
    margin-bottom: 10px;
    &:last-child {
      margin-right: 0;
    }
    color: #666;
    &.active {
      background-color: #ff6700;
      color: #fff;
    }
  }

  .desc-box {
    margin-top: 10px;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 20px;
  }

  .desc-title {
    font-size: 16px;
    color: #444;
  }

  .desc-content {
    color: #666;
    font-size: 14px;
  }

  .desc-item {
    padding-top: 10px;
  }

  .price-box {
    padding: 20px 0 10px;
  }
  .price {
    color: #ff6700;
    font-size: 16px;
    line-height: 22px;
  }

  /deep/ .van-stepper__minus {
    color: #ff6700;
    border-color: #ff6700;
  }

  /deep/ .van-stepper__plus {
    background-color: #ff6700;
  }

  element.style {
    background-color: #ff6700;
  }
}
</style>