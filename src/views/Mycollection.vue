<template>
  <div class="mycollection">
    <div>
      <van-nav-bar title="我的收藏" left-text="返回" left-arrow @click-left="back"></van-nav-bar>
    </div>
    <div>
      <div class="likebox">
        <div class="content">
          <div
            class="content-item clearfix"
            v-for="(item, index) in productData"
            :key="index"
          
            :class="[index % 2 == 0 ? 'left' : 'right']"
          >
            <div class="imgs"   @click="goPage(item.pid)">
              <img class="auto-img" :src="item.smallImg" alt />
            </div>
            <div class="pro-name one-text">{{item.name}}</div>
            <div class="pro-enname one-text">{{item.enname}}</div>
            <div class="pro-price">￥{{item.price}}</div>
            <div class="delete" @click="deleteLike(item.pid,index)">
              <img src="../assets/image/like.png" alt />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品数据
      productData: {}
    };
  },

  created() {
    this.getLikeData();
  },

  methods: {
    back() {
      this.$router.go(-1);
    },
    goPage(pid) {
      this.$router.push({ name: "Detail", query: { pid } });
    },
    //获取我的收藏商品数据
    getLikeData() {
      let tokenString = localStorage.getItem("__tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          // console.log("result ==> ", result);
          if (result.data.code == 2000) {
            this.productData = result.data.result;
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //删除收藏
    deleteLike(pid,index) {
      let tokenString = localStorage.getItem("__tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/notlike",
        params: {
          appkey: this.appkey,
          tokenString,
          pid
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log("result ==> ", result);
          if(result.data.code =='901'){
            // console.log(this.productData)
            this.productData.splice(index,1)
            this.$toast("已取消收藏")
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.mycollection {
  .content {
    padding: 10px;
    height: calc(100% - 10px);
    overflow-y: auto;
  }

  .content-item {
    height: 155px;
    padding: 10px;
    background-color: #fff;
    margin-bottom: 10px;
    margin-left: 5px;
    position: relative;
    &.left {
      width: 150px;
      height: 210px;
      float: left;
    }
    &.right {
      width: 150px;
      height: 210px;
      float: left;
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
  .delete{
    width: 20px;
    height: 20px;
    position: absolute;
    right: 25px;
    bottom: 38px;
    z-index: 99;
  }
  .delete img{
    width: 100%;
    height: 100%;
  }
  /deep/.van-nav-bar__text {
    color: #ff6700;
  }
  /deep/.van-nav-bar .van-icon {
    color: #ff6700;
  }
}
</style>