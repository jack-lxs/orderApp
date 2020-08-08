<template>
  <div class="order">
    <van-tabs v-model="status" @change="changetype" :sticky="true">
      <van-tab
        :title="item.title"
        :name="item.name"
        v-for="(item,index) in changetypedata"
        :key="index"
      >
        <!-- 每一单商品 start -->
        <div class="one-order" v-for="(item,index) in alloids" :key="index">
          <!-- 订单上部分 -->
          <div class="tap">
            <div class="fl">{{item}}</div>
            <div class="fr right clearfix" v-if="order[item].status ==2">
              <span class="done fl">已完成</span>
              <span class="icon fl" @click="deleteorder(item)">
                <van-icon name="delete" class="icon" />
              </span>
            </div>
            <div class="fr" v-else>
              <span class="done fl" @click="reOrder(item)">确认收货</span>
            </div>
          </div>
          <!-- 订单下部分 -->
          <div class="pay-content" v-for="(v,i) in order[item].data" :key="i">
            <div class="content clearfix">
              <div class="fl imgs">
                <img :src="v.smallImg" alt />
              </div>
              <div class="fl text">
                <div class="word">
                  <div class="fl">
                    <div class="name">{{v.name}}</div>
                    <div class="enname">{{v.enname}}</div>
                  </div>
                  <div class="fr price">￥{{v.price}}</div>
                </div>
                <div class="type">
                  <div class="fl rule">{{v.rule}}</div>
                  <div class="fr count">x{{v.count}}</div>
                </div>
              </div>
            </div>

            <div class="money clearfix">
              <div class="fr clearfix">
                <span class="moeny-count fl">共计 {{v.count}} 件商品</span>
                <span class="moeny-price fl">￥{{v.count*v.price}}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- end -->
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: "",
      status: 0,

      alloids: [],

      order: {},

      changetypedata: [
        { title: "全部", name: "0" },
        { title: "待收货", name: "1" },
        { title: "已收货", name: "2" }
      ]
    };
  },
  created() {
    this.getorder();
  },
  methods: {
    //切换不同状态的商品
    changetype(name) {
      // console.log(name)
      this.getorder();
    },

    //获取订单信息
    getorder() {
      let tokenString = localStorage.getItem("__tk");
      this.$toast.loading({
        massage: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status: this.status
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log(result);
          if (result.data.code == 70000) {
            //降序排序
            result.data.result.sort((a, b) => {
              return (
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
            });
            //获取所有的订单编号
            let oids = [];
            result.data.result.forEach(v => {
              if (oids.indexOf(v.oid) == -1) {
                oids.push(v.oid);
              }
            });
            this.alloids = oids;
            // console.log(this.alloids);

            //根据订单编号获取订单
            this.order = {};
            result.data.result.forEach(v => {
              if (!this.order[v.oid]) {
                this.order[v.oid] = {
                  data: [v],
                  status: v.status
                };
              } else {
                this.order[v.oid].data.push(v);
              }
              console.log("this.order ==>", this.order[v.oid]);
            });
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },

    //确认收货
    reOrder(oid) {
      let tokenString = localStorage.getItem("__tk");
      this.$toast.loading({
        massage: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/receive",
        data: {
          appkey: this.appkey,
          tokenString,
          oid
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log(result);
          if (result.data.code == 80000) {
            this.order[oid].status = 2;
            // console.log(this.order[oid].status)
            console.log(this.status);
            if (this.status == 1) {
              let index = this.alloids.indexOf(oid);
              this.alloids.splice(index, 1);
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },

    //删除订单
    deleteorder(oid) {
      let tokenString = localStorage.getItem("__tk");
      this.$toast.loading({
        massage: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString,
          oid
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log(result);
          if (result.data.code == 90000) {
            console.log(this.oid);
            let index = this.alloids.indexOf(oid);
            this.alloids.splice(index, 1);
            // console.log(result.data.msg)
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.order {
  .one-order {
    height: auto;
    padding: 10px;
    background-color: #fff;
    margin-top: 10px;
  }
  .tap {
    height: 40px;
    border-bottom: 1px solid #e8e8e8;
    line-height: 40px;
  }
  .right {
    height: 41px;
  }
  .done {
    margin-right: 10px;
    line-height: 40px;
  }
  .icon {
    width: 20px;
    height: 20px;
    font-size: 16px;
    line-height: 40px;
  }
  .pay-content {
    // padding: 10px;
    margin-top: 10px;
    background-color: #fff;
  }
  .content {
    background-color: #fff;
    border-radius: 10px;
    margin-bottom: 10px;
  }
  .imgs {
    width: 60px;
    height: 60px;
    margin-right: 10px;
  }
  .imgs img {
    width: 100%;
    height: 100%;
  }

  .text {
    width: calc(~"100% - 70px");
    height: 60px;
  }

  .word {
    height: 40px;
  }
  .name {
    font-size: 16px;
  }
  .enname {
    font-size: 14px;
    color: #999;
  }
  .price {
    font-size: 14px;
    color: red;
    line-height: 20px;
  }
  .type {
    height: calc(~"100% - 40px");
  }

  .rule {
    font-size: 14px;
    color: #666;
  }
  .count {
    font-size: 14px;
    color: #666;
    line-height: 20px;
  }
  .money {
    height: 20px;
    margin-top: 20px;
    border-bottom: 1px solid #e8e8e8;
  }
  .moeny-count {
    color: #666;
    margin-right: 20px;
  }
  .moeny-price {
    font-size: 18px;
    font-weight: bold;
    line-height: 16px;
    color: red;
  }

  /deep/.van-tabs__line {
    background-color: #ff6700;
  }
}
</style>