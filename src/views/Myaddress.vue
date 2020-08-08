<template>
  <div class="myaddress">
      <van-nav-bar
        title="收货地址"
        left-text="返回"
        left-arrow
        @click-left="back"
     />
    <van-address-list v-model="aid" :list="list" default-tag-text="默认" @add="toAddress" @edit="toAddress" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      aid: "1",
      list: []
    };
  },
  created() {
    this.getAddress();
  }, 
  methods: {

    //获取地址数据
    getAddress() {
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
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log("result =>", result);
          if (result.data.code == 20000) {
            result.data.result.forEach(v => {
              let currentAddress = {
                id: v.aid,
                tel: v.tel,
                name: v.name,
                address: v.province + v.city + v.county,
                isDefault: Boolean(v.isDefault)
              };
              if (this.isDefault) {
                this.aid = v.aid;
              }
              this.list.push(currentAddress);
            });
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },

    toAddress(address){
        let o = {
            name:"Address"
        }
        //判断地址是否需要带地址id 
        if(address){
            o.params ={
                aid:address.id
            }
        }
        
        this.$router.push(o)
    },
    back(){
      this.$router.go(-1)
    }
  }
};
</script>

<style lang="less" scoped>
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
/deep/.van-nav-bar .van-icon{
    color: #ff6700
}

</style>