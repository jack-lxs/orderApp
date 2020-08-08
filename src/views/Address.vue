<template>
  <div>
    <div>
      <van-nav-bar :title="!!aid ? '编辑地址' :'新增地址'" left-text="返回" left-arrow @click-left="goback" />
    </div>

    <div>
      <van-address-edit
        :area-list="areaList"
        :address-info="addressInfo"
        show-postal
        :show-delete="!!aid"
        show-set-default
        show-search-result
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="addSave"
        @delete="remoaddress"
      />
    </div>
  </div>
</template>

<script>
import areaList from "../assets/js/area";
export default {
  data() {
    return {
      areaList,

      addressInfo: {
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        //详细地址
        addressDetail: "",
        //地区编号，地址选择
        areaCode: "",
        // 邮编
        postalCode: "",
        //默认地址
        isDefault: false,

        //地址id
        aid: ""
      }
    };
  },

  created() {
    // 截取路由参数， 地址Id:aid
    this.aid = this.$route.params.aid;
    console.log(this.aid);
    if (this.aid) {
      this.getAddressByaid(this.aid);
    }
    // console.log(this.aid);  
    
  },

  methods: {

    
    //获取地址信息
    addSave(addressData) {

      // console.log("addressData ==>", addressData)
      let isSame = true;
      if (this.aid) {
        //判断用户是否修改地址，需要获取当前地址数据和查询地址数据是否一致
        // console.log("this.addressInfo",this.addressInfo)
        for (let key in this.addressInfo) {
          //如果数据不想同，则表明修改过数据
         
          if (this.addressInfo[key] != addressData[key]) {
              isSame = false;
               
          }
        }
      }
     
      let tokenString = localStorage.getItem("__tk");
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭,
        duration: 0
      });

      if(this.aid) {//编辑地址
        if (!isSame) {
          let userAddress = Object.assign({}, this.addressInfo);
          for (let key in this.addressInfo) {
            userAddress[key] = addressData[key];
          }
            userAddress.isDefault = Number(userAddress.isDefault);
            userAddress.appkey = this.appkey;
            userAddress.tokenString = tokenString;
            userAddress.aid = this.aid;
          //编辑地址请求
          this.axios({
            method: "POST",
            url: "/editAddress",
            data: userAddress
          })
            .then(result => {
              this.$toast.clear();
              console.log(result);
              if (result.data.code == 30000) {
                this.$router.push({name: "Myaddress" });
              } else {
                this.$toast(result.data.msg);
              }
            })
            .catch(err => {
              this.$toast.clear();
              console.log(err);
            });
        } else {
          this.$toast.clear();
        }
      } else {
        //新增地址
        let data = {
          name: "",
          tel: "",
          province: "",
          city: "",
          county: "",
          addressDetail: "",
          areaCode: "",
          postalCode: "",
          isDefault: ""
        };

        for (let key in data) {
          data[key] = addressData[key];
        }
        data.appkey = this.appkey;
        data.tokenString = tokenString;
        data.isDefault = Number(data.isDefault);

        this.axios({
          method: "POST",
          url: "/addAddress",
          data
        })
          .then(result => {
            this.$toast.clear();
            console.log("result =>", result);
            if (result.data.code == 9000) {
              this.$toast(result.data.msg);
            }
          })
          .catch(err => {
            this.$toast.clear();
            console.log(err);
          });
      }
    },


    //根据aid获取地址信息
    getAddressByaid(aid) {
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
        url: "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log("result =>", result);
          if (result.data.code == 40000) {
            result.data.result[0].isDefault = Boolean(
              result.data.result[0].isDefault
            );
            for (let key in this.addressInfo) {
              this.addressInfo[key] = result.data.result[0][key];
            }
           
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },

    //删除地址
    remoaddress() {
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
        url: "/deleteAddress",
        data: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log("result =>", result);
          if (result.data.code == 10000) {
            this.$router.push({ name: "Myaddress" });
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },

    //返回
    goback() {
      this.$router.go(-1);
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

/deep/.van-button--danger {
  background-color: #ff6700;
}

/deep/ .van-switch--on {
  background-color: #ff6700;
}
</style>