<template>
  <div class="register">
    <van-nav-bar
      title="注册"
      left-text="登录"
      right-text="关闭"

      @click-left="goPage('Login')"
    />
    <div class="img">
      <van-image class="imgs" width="50%" height="50%"  :src="require('../assets/image/logo.png')" />
    </div>
    <!-- 表单提交 -->
    <van-form class="form"   @submit="register">
      
      <van-field
        left-icon="phone-o" 
        name="手机号"
        label="手机号"
        placeholder="手机号"
         v-model="userInfo.phone"
         autocomplete="off"
      >
        <template v-slot:right-icon>
            <i class="fafa-life-ring" aria-hidden="true"></i>
        </template>

      </van-field>

       <van-field
        left-icon="friends-o" 
        name="昵称"
        label="昵称"
        placeholder="昵称"
        v-model="userInfo.nickName"
         autocomplete="off"

      />

      <van-field
        left-icon="bag-o" 
        :type="isEye ? 'text':'password'"
        name="密码"
        label="密码"
        placeholder="密码"
        :right-icon="isEye ? 'eye-o' : 'closed-eye'"
        @click-right-icon="viewPassword"
        v-model="userInfo.password"
         autocomplete="off"

      />

      <div class="btn" >
        <van-button  round block type="info" native-type="submit">
          立即注册
        </van-button>
      </div>
    </van-form>


  </div>
</template>

<script>
  //导入验证表单模块
  import validForm from '../assets/js/validForm'

  export default {
      data() {
       return {

        //用户注册信息
        userInfo: {
          phone: '',
          nickName: '',
          password: ''
        },

        //false: 闭合，true：睁开
        isEye: false

      }
   },
   methods: {

     //跳转页面
     goPage(name){
         this.$router.push({name})
     },

      //切换密码的格式
      viewPassword() {
        this.isEye = !this.isEye;
      },

      //注册
      register() {

        //进行验证表单
        if (validForm.validUserForm(this.userInfo, this)) {

          //复制对象
          let data = Object.assign({}, this.userInfo);

          //请求密钥
          data.appkey = this.appkey;

          //开启加载提示
          this.$toast.loading({
            message: '加载中...',
            forbidClick: true,

            //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
            duration:0
          });

          //发起注册请求
          this.axios({
            method: 'POST',
            url: '/register',

            //post传递参数需要写在data
            data
          }).then(result => {
            //关闭加载提示
            this.$toast.clear();
            console.log('result ==> ', result);
            if(result.data.code == 100){
                this.$router.push({name:'Login'})
            }else{
                this.$toast(result.data.msg);
            }


          }).catch(err => {
            //关闭加载提示
            this.$toast.clear();
            console.log('err ==> ', err);
          })
        }

      }
    }

  }
</script>

<style lang="less" scoped>

 
    .img{
      width: 100%;
      height: 250px;
      text-align: center;
      
    }
    .imgs{
      margin-top: 60px; 
      margin-right: 20px;
    }


  .form{
      padding: 10px 10px;
  }
  .van-field{
   
    border-radius: 10px;
    margin-bottom:8px; 
  }

  .btn{
    margin-top:30px; 
    
  }


  .van-button{
    border: 1px solid #ff6700;
    background-color: #ff6700;
  }
  /deep/.van-nav-bar__text{
    color:#ff6700;
  }


</style>