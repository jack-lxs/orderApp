<template>
  <div class="my">
    <div class="header " :style="{backgroundImage: 'url(' + userinfo.userBg + ')'}">
      <div class="tap">
        <div class="fr bj">更换背景</div>
        <div class="file">
          <van-uploader :after-read="changebg" :max-size="max" />
        </div>
      </div>
      <div class="myself">
        <div class="pic fl">
          <img :src="userinfo.userImg" alt />
        </div>
        <div class="pic-file">
          <!-- <input type="file" /> -->
        </div>
        <div class="name fl">{{userinfo.nickName}}</div>
      </div>
      <div class="title">
        <span> {{userinfo.desc=='' ? '这个家伙很懒，什么也没留下' : userinfo.desc}}</span>
      </div>
    </div>

    <div>
      <van-cell-group>
        <van-cell
          :title="item.title"
          :value="item.value"
          v-for="(item,index) in cell "
          :key="index"
          @click="gopage(item.routename)"
        />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cell: [
        { title: "账号管理", value: ">" ,routename:"Mumber"},
        { title: "地址管理", value: ">" ,routename:"Myaddress"},
        { title: "我的收藏", value: ">",routename:"Mycollection" },
        { title: "安全中心", value: ">",routename:"Security" }
      ],
      //上传文件最大
      max: 1 * 1024 * 1024,

      userinfo: {}
    };
  },

  created() {
    //调用findmy方法
    this.findmy();
  },

  methods: {
    //路由跳转
    gopage(name){

      this.$router.push({name})
    },

    //获取我的用户信息
    findmy() {
      let tokenString = localStorage.getItem("__tk");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //向服务器发起请求
      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log('fingmy',result);
          if (result.data.code == "A001") {
            this.userinfo = result.data.result[0];
          }
            console.log(this.userinfo)
         
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },

    //提交背景
    changebg(file) {
      console.log(file);
      let picbase64 = file.content.replace( /^data:image\/[A-Za-z]+;base64,/,"");
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
        url: "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType:pictype,
          serverBase64Img:picbase64
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log(result);
          if(result.data.code=="I001"){
            //将后台数据的背景赋值给userbg
              this.userinfo.userBg = result.data.userBg;
          }else{
            this.$toast(result.data.msg)
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },

   
  }
};
</script>

<style lang="less" scoped>
.my {
  .header {
    height: 200px;
    background-color: #e8e8e8;
    padding: 10px;
    background: 100% 100% no-repeat;
    background-size: 100% 100% ;
  }
  .tap {
    position: relative;
    height: 40px;
    line-height: 40px;
    color: #fff;
    font-size: 16px;
  }
  .file {
    width: 60px;
    height: 40px;
    position: absolute;
    top: 0;
    right: 4px;
    opacity: 0;
  }
  /deep/ .van-uploader__wrapper {
    width: 100%;
    height: 100%;
  }
  /deep/.van-uploader {
    width: 60px;
    height: 40px;
  }
  /deep/ .van-uploader__upload {
    width: 60px;
    height: 40px;
    margin: 0;
  }
  .bj {
    width: auto;
    height: 100%;
  }
  .myself {
    height: 100px;
    position: relative;
  }

  .pic {
    width: 80px;
    height: 80px;
    margin-top: 10px;
    margin-left: 10px;
  }
  .pic img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .pic-file {
    width: 80px;
    height: 80px;
    position: absolute;
    top: 8px;
    left: 8px;
    opacity: 0;
  }
  .pic-file input {
    width: 100%;
    height: 100%;
  }
  .name {
    height: 100%;
    line-height: 100px;
    margin-left: 20px;
    font-size: 16px;
  }

  .title {
    height: calc(~"100% - 140px");
    text-align: center;
  }
}
</style>