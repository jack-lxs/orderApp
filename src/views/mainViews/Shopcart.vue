<template>
  <van-list
    class="shopcart"
    v-model="loading"
    :finished="finished"
    :finished-text="finishedText"
    :offset="50"
    @load="onload"
  >
    <div v-if="isHas">
      <van-empty description="购物车空空如也"></van-empty>
    </div>

    <div v-else>
      <div>
        <van-nav-bar
          title="购物车"
          :right-text=" isManage ? '管理': '完成'"
          @click-right="manage"
          :sticky="true"
        />
      </div>

      <!-- 购物车商品列表 -->
      <div class="list">
        <van-swipe-cell v-for="(item,index) in shopcartData" :key="index">
          <div class="content clearfix">
            <!-- 复选框 -->
            <div class="fl item-left">
              <van-checkbox v-model="item.checked" @click="single"></van-checkbox>
            </div>

            <div class="fl item-right">
              <div class="imgs fl">
                <img :src="item.small_img" alt />
              </div>
              <div class="word fl">
                <div class="word-type">
                  <div class="word-box">
                    <span class="word-name">{{item.name}}</span>
                    <span class="word-feel">{{item.rule}}</span>
                  </div>
                  <div class="word-enname">{{item.enname}}</div>
                </div>

                <div class="money">
                  <div class="fl price">￥{{item.price}}</div>
                  <div class="fr">
                    <van-stepper
                      v-model="item.count"
                      :integer="true"
                      theme="round"
                      button-size="22"
                      disable-input
                      @change="modifyCount(item)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <template #right>
            <van-button square type="danger" text="删除" @click="removeShopcart([item.sid],index)" />
          </template>
        </van-swipe-cell>
      </div>

      <div v-if="isManage">
        <van-submit-bar
          class="submit-bar"
          :disabled="isNohas"
          :price="total"
          button-type="info"
          button-text="提交订单"
          @submit="submit"
        >
          <van-checkbox v-model="allcheck" @click="allselect">全选</van-checkbox>
        </van-submit-bar>
      </div>
      <div v-else>
        <van-submit-bar
          class="submit-bar"
          @submit="removeMove"
          button-type="info"
          :disabled="isNohas"
          button-text="删除选择"
        >
          <van-checkbox v-model="allcheck" @click="allselect">全选</van-checkbox>
        </van-submit-bar>
      </div>
    </div>
  </van-list>
</template>

<script>
export default {
  data() {
    return {
      //购物车数量
      count: 1,
      //管理
      isManage: true,
      //全选
      allcheck: false,
      //初始化空页面
      isHas: false,
      //禁止点击
      isNohas: true,

      //单选
      checked: false,

      sid: [],
      //购物车的商品
      shopcartData: [],
      //购物车的所有商品条数
      allshopcartcount: [],

      //总金额
      total: 0,
      //加载判断
      loading: true,

      finished: false,
      //购物车加载提示
      finishedText: "没有更多数据了",
      //购物车显示的条数
      loadconut: 8
    };
  },

  created() {
    this.getShopcart();
    
  },

  methods: {
    // 获取购车数据
    getShopcart() {
      // console.log(index)
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
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
         
          // console.log("result 查询购物车商品 ==>", result);
          if (result.data.code == 5000) {
            result.data.result.forEach(v => {
              v.checked = false;
            });

            this.allshopcartcount = result.data.result;

            this.shopcartData = this.allshopcartcount.splice(0, this.loadconut);

            if (this.allshopcartcount.length > 0) {
              this.loading = false;
            } else {
              this.loading = true;
              this.finished = true;
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==>", err);
        });
    },

    //全选购物车商品
    allselect() {
      this.allshopcartcount.forEach(v => {
        v.checked = this.allcheck;
      });

      this.shopcartData.forEach(v => {
        v.checked = this.allcheck;
      });
      this.isNohas = !this.allcheck;

      this.num();
    },

    //单选购物车商品
    single() {
      this.num();
      this.isNohas = true;

      for (let i = 0; i < this.shopcartData.length; i++) {
        if (this.shopcartData[i].checked) {
          this.isNohas = false;
          return;
        }
      }
      for (let i = 0; i < this.shopcartData.length; i++) {
        if (!this.shopcartData[i].checked) {
          this.allcheck = false;
          return;
        }

        this.allcheck = true;
      }
    },

    //修改购物车数量
    modifyCount(item) {
      console.log("item ==>", item);

      let tokenString = localStorage.getItem("__tk");

      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          sid: item.sid,
          tokenString,
          count: this.count
        }
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == 6000) {
            this.shopcartData.forEach(v => {
              this.count = v.count;
            });
          }
          this.num();
          console.log("result ==>", result);
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==>", err);
        });
    },

    //懒加载购物车
    onload() {
      console.log("加载了");
      setTimeout(() => {
        this.shopcartData.push(
          ...this.allshopcartcount.splice(0, this.loadconut)
        );
        if (this.allshopcartcount == 0) {
          this.loading = true;
          this.finished = true;
        }
      }, 1000);
    },

    //单个删除商品
    removeShopcart(sids, index) {
      // console.log(this.shopcartData)
      let tokenString = localStorage.getItem("__tk");

      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/removeShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids)
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log("result =>", result);

          // // console.log(sids)
          if (result.data.code == 7000) {
            this.shopcartData.splice(index, 1);
            this.num();
            this.$toast.success("删除成功");
          } else {
            this.$toast.success("删除失败");
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },
    //多个删除商品
    removeMove() {
      let sids = [];

      this.shopcartData.forEach(v => {
        if (v.checked) {
          sids.push(v.sid);
        }
      });

      let tokenString = localStorage.getItem("__tk");
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/removeShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids)
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log("result =>", result);

          // // console.log(sids)
          if (result.data.code == 7000) {
            for (let i = this.shopcartData.length - 1; i >= 0; i--) {
              if (this.shopcartData[i].checked) {
                this.shopcartData.splice(i, 1);
              }
            }
            this.num();
            this.$toast.success("删除成功");
          } else {
            this.$toast.success("删除失败");
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },

    //计算总金额
    num() {
      this.total = 0;
      this.shopcartData.forEach(v => {
        if (v.checked) {
          this.total += v.count * v.price * 100;
        }
      });
    },

    //提交订单
    submit() {
      let sids = [];
      this.shopcartData.forEach(v => {
        if (v.checked) {
          sids.push(v.sid);
        }
      });
      console.log(sids);
      this.$router.push({ name: "Pay", query: { sids: sids.join("&") } });
    },
    //切换删除购物车商品
    manage() {
      this.isManage = !this.isManage;
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.van-nav-bar__text {
  color: #ff6700;
}

.shopcart {
  padding-bottom: 100px;
}
.list {
  overflow-y: auto;
  .content {
    height: 80px;
    padding: 10px;
    margin-bottom: 5px;
  }

  .item-left {
    width: 20px;
    height: 20px;
    margin-top: 30px;
    margin-right: 10px;
  }

  /deep/.van-button {
    height: 100%;
  }
  /deep/.van-icon {
    border: 1px solid #ff6700;
  }
  /deep/.van-checkbox__icon--checked .van-icon {
    background-color: #ff6700;
    border: 1px solid #ff6700;
  }

  .item-right {
    width: calc(~"100% - 30px");
    height: 100%;
  }
  .imgs {
    width: 80px;
    height: 80px;
  }
  .imgs img {
    width: 100%;
    height: 100%;
  }
  .word {
    width: calc(~"100% - 90px");
    height: 100%;
    margin-left: 10px;
  }
  .word-box {
    width: 100%;
    height: 100%;
  }
  .word-name {
    height: 21px;
    font-size: 16px;
  }
  .word-feel {
    height: 21px;
    font-size: 12px;
    margin-left: 10px;
    font-weight: 300;
  }
  .word-enname {
    font-size: 14px;
    font-weight: 400;
    margin-top: 5px;
  }

  .money {
    height: calc(~"100% - 42px");
    line-height: 48px;
  }
  .price {
    height: 37px;
    font-size: 16px;
    color: red;
  }

  /deep/ .van-stepper {
    height: 37px;
    color: #ff6700;
  }
  /deep/ .van-stepper__minus {
    color: #ff6700;
    border: 1px solid #ff6700;
  }
  /deep/ .van-stepper__plus {
    background-color: #ff6700;
  }
}

/deep/.submit-bar {
  bottom: 50px;
}
/deep/.van-button {
  background-color: #ff6700;
}
/deep/.van-icon {
  border: 1px solid #ff6700;
}
/deep/.van-checkbox__icon--checked .van-icon {
  background-color: #ff6700;
  border: 1px solid #ff6700;
}

/deep/.van-checkbox {
  position: absolute;
  left: 10px;
}
</style>