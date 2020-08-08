<template>
    <div class="security">
       
    <van-nav-bar title="安全中心" left-text="返回" left-arrow @click-left="back" />
    <div class="list-box">
      <van-cell-group>
        <van-cell title="修改密码" is-link @click="openPopup" />
        <van-cell title="注销账号" is-link />
      </van-cell-group>
    </div>
    <div class="logout">
      <van-button :round="true" :block="true" type="danger">退出登录</van-button>
    </div>
    <van-popup v-model="isOpen" position="bottom">
      <div class="v-popup">
        <van-form @submit="commit">
          <van-field
            v-model="pwds.oldPassword"
            label="旧密码"
            placeholder="旧密码"
          />
          <van-field
            v-model="pwds.password"
            type="text"
            label="新密码"
            placeholder="新密码"
          />
          <div class="btn-box">
            <van-button round block type="info" native-type="submit">提交</van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  
    </div>
</template>

<script>
import '../assets/js/validForm'
    export default {
        data() {
    return {
      isOpen: false,
      pwds: {
        oldPassword: '',
        password: ''
      }
    };
  },
  methods: {
    //返回
    back() {
      this.$router.go(-1);
    },

    //显示修改密码框
    openPopup() {
      this.isOpen = true;
    },

    commit() {

      if (!validForm.validUserForm(this.pwds)) {
        return;
      }

      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/updatePassword",
        data: {
          appkey: this.appkey,
          tokenString,
          //新的密码
          password: this.pwds.password,
          //旧密码
          oldPassword: this.pwds.oldPassword
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log("result ==> ", result);
          //关闭修改密码弹出框
          this.isOpen = false;
          if (result.data.code == 'E001') {
            //清除token
            localStorage.removeItem('__Tk');
            this.$router.push({name: 'Login'});
          } else {
            this.$toast(result.data.msg);
          }
          
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    }
  }
    }
</script>

<style lang="less" scoped>
.security{
  .list-box{
    margin-top: 10px;
  }
  .logout{
    margin-top: 60px;
    padding: 0 20px;
  }
  .v-popup{
    padding: 20px;
  }
  .btn-box{
    margin-top: 20px;
  }

   /deep/.van-nav-bar__text {
    color: #ff6700;
  }
  /deep/.van-nav-bar .van-icon {
    color: #ff6700;
  }
 /deep/ .van-button--danger {
     background-color: #ff6700;
 }
 /deep/.van-button--info{
    background-color: #ff6700;
    border:1px solid #ff6700;
 }
}
</style>