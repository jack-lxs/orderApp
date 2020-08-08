<template>
  <div class="number">
    <van-nav-bar title="账号管理" left-text="返回" left-arrow @click-left="back">1</van-nav-bar>

    <div v-for="(item,index) in userinfo" :key="index">
      <van-cell-group>
        <van-cell class="tou" title="头像">
          <div class="pic fr">
            <img class="auto-img" :src="item.userImg" alt />
            <van-uploader class="upload-box" :after-read="changebg" />
          </div>
        </van-cell>
        <van-cell title="用户Id" :value="item.userId"></van-cell>
        <van-cell title="手机号" :value="item.phone"></van-cell>
        <van-cell title="昵称" class="nin">
          <div class="niname">
            <van-field
              class="v-filed"
              input-align="right"
              v-model="item.nickName"
              @blur="changenick"
            />
          </div>
        </van-cell>
        <van-cell title="简介">
          <div class="fl v-cell-textarea">
            <textarea class="textarea" @change="changeta" v-model="item.desc"></textarea>
          </div>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userinfo: {}
    };
  },
  created() {
    this.getuserInfo();
    
  },

  methods: {
    //获取用户信息
    getuserInfo() {
      let tokenString = localStorage.getItem("__tk");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "GET",
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          {
            this.$toast.clear();
            console.log(result);
            if (result.data.code == "B001") {
              this.userinfo = result.data.result;
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },
    //修改用户图片
    changebg(file) {
      console.log(file);
      let picbase64 = file.content.replace(
        /^data:image\/[A-Za-z]+;base64,/,
        ""
      );
      // console.log(picbase64)
      //获取图片的类型
      let pictype = file.file.type.split("/")[1];

      let tokenString = localStorage.getItem("__tk");

      this.$toast.loading({
        massage: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: pictype,
          serverBase64Img: picbase64
        }
      })
        .then(result => {
          this.$toast.clear();
          // console.log(result);
          if (result.data.code == "H001") {
            this.userinfo.userImg = result.data.userImg;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },
    //修改简介
    changeta() {
      let tokenString = localStorage.getItem("__tk");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "/updateDesc",
        params: {
          appkey: this.appkey,
          tokenString,
          desc: this.userinfo.desc
        }
      })
        .then(result => {
          this.$toast.clear();
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },
    //修改昵称
    changenick() {
      let tokenString = localStorage.getItem("__tk");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "/updateNickName",
        params: {
          appkey: this.appkey,
          tokenString,
          nickName: this.userinfo.nickName
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log("nick",result);
          if (result.data.code == "C001") {
            // this.userinfo.nickName = ;

            this.$toast(result.data.msg);
          }
          console.log(this.userinfo)
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },
    //返回上一页
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.number {
  .tou {
    line-height: 40px;
  }

  .pic {
    width: 40px;
    height: 40px;
    position: relative;
    margin-right: 0;
    display: inline-block;
  }
  .upload-box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
  }
  /deep/.van-uploader__wrapper {
    width: 100%;
    height: 100%;
  }
  /deep/ .van-uploader__upload {
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
  }
  .niname {
    height: 40px;
  }
  .nin {
    line-height: 40px;
  }
  .textarea {
    border: none;
    height: 40px;
    text-align: right;
    resize: none;
  }
  /deep/.v-filed .van-cell .van-field {
    padding: 0;
  }
  /deep/.v-filed .van-cell .van-field {
    padding: 0;
  }
  /deep/ .van-cell__value {
    margin: 0;
  }

  /deep/.van-nav-bar__text {
    color: #ff6700;
  }
  /deep/ .van-nav-bar .van-icon {
    color: #ff6700;
  }
}
</style>