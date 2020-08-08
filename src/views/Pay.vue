<template>
  <div class="pay">
    <van-nav-bar title="提交订单" left-text="返回" left-arrow @click-left="back" />
    <div class="select-address-box">
      <div class="select-address" @click="show">{{userAddress.address}}</div>
    </div>

    <div class="pay-content">
      <div class="content clearfix" v-for="(item,index) in orderData" :key="index">
        <div class="fl imgs">
          <img :src="item.small_img" alt />
        </div>
        <div class="fl text">
          <div class="word">
            <div class="fl">
              <div class="name">{{item.name}}</div>
              <div class="enname">{{item.enname}}</div>
            </div>
            <div class="fr price">￥{{item.price}}</div>
          </div>
          <div class="type">
            <div class="fl rule">{{item.rule}}</div>
            <div class="fr count">x{{item.count}}</div>
          </div>
        </div>
      </div>

      <div class="money clearfix">
        <div class="fr clearfix">
          <span class="moeny-count fl">共计 {{count}} 件商品</span>
          <span class="moeny-price fl">￥{{total}}</span>
        </div>
      </div>
    </div>

    <van-submit-bar :price="total*100" button-text="立即结算" button-type="info" @submit="commit" />

    <van-popup class="popup-box" v-model="isOpen" position="bottom">
      <van-address-list v-model="aid" :list="list" default-tag-text="默认" @add="go" @select="selectaddress" />
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
      aid: "",
      list: [],
      userAddress: {
        address: "请选择收货地址",
        phone: "",
        receiver: ""
      },
      //订单数据
      orderData: [],
      count: 1,
      total: 0,
      sids: []
    };
  },
  created() {
    this.getaddress();
    this.sids = this.$route.query.sids.split("&");
    console.log(this.sids);
    this.payorderData(this.sids);
  },
  methods: {
    show() {
      this.isOpen = true;
    },
    //先获取地址数据
    getaddress() {
      let tokenString = localStorage.getItem("__tk");
      this.$toast.loading({
        massage: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          // console.log(result);
          if (result.data.code == 20000) {
            result.data.result.forEach(v => {
              let currentaddress = {
                id: v.aid,
                tel: v.tel,
                name: v.name,
                address: v.province + v.city + v.county + v.addressDetail,
                isDefault: Boolean(v.isDefault)
              };

              if (v.isDefault) {
                this.aid = v.aid;
                this.userAddress.address = currentaddress.address;
              }

              this.list.push(currentaddress);
              //   console.log(this.list)
            });
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },

    //选择地址
    selectaddress(item) {
      if (item.id) {
        this.isOpen = false;
        this.address = item.address;
        this.userAddress = {
          address: item.address,
          phone: item.tel,
          receiver: item.name
        };
      }else{
        this.userAddress = "请选择收货地址"
      }

      console.log(item);
    },
    //获取订单数据
    payorderData(sids) {
      let tokenString = localStorage.getItem("__tk");

      this.$toast.loading({
        massage: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids)
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log(result);
          if (result.data.code == 50000) {
            result.data.result.forEach(v => {
              this.count = v.count;
              this.total += v.count * v.price;
            });

            this.orderData = result.data.result;
            console.log(this.orderData);
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },

    //提交订单
    commit() {
      if (this.userAddress.address == "请选择收货地址") {
        this.$toast("请选择收货地址");
        return;
      }
      let tokenString = localStorage.getItem("__tk");
      this.$toast.loading({
        massage: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/pay",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
          phone: this.userAddress.phone,
          address: this.userAddress.address,
          receiver: this.userAddress.receiver
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log(result);
          if (result.data.code == 60000) {

            
            this.$router.push({ name: "Order" });
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },

    go(){
      this.$router.push({name:"Address"})
    },

    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.pay {
  .select-address-box {
    padding: 10px;
  }
  .select-address {
    background-color: #fff;
    height: 40px;
    font-size: 14px;
    line-height: 40px;
  }
  .pay-content {
    padding: 10px;
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
  }

  /deep/.van-button--danger {
    background-color: #ff6700;
  }

  /deep/.van-address-item .van-radio__icon--checked .van-icon {
    background-color: #ff6700;
    border-color: #ff6700;
  }
  /deep/.van-nav-bar__text {
    color: #ff6700;
  }
  /deep/.van-nav-bar .van-icon {
    color: #ff6700;
  }

  /deep/.van-icon-edit::before {
    display: none;
  }
  /deep/.van-button--info {
    background-color: #ff6700;
  }
}
</style>