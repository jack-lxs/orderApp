class ValidForm {

  constructor() {

    this.validUserFormReg = {

      //昵称， 1-10个字符, 汉字字母数字_组合
      nickName: {
        reg: /^[\u4e00-\u9fa5\w]{1,10}$/,
        msg: '昵称格式不正确'
      },

      //手机号
      phone: {
        reg: /^1[3-9]\d{9}$/,
        msg: '手机号格式不正确'
      },

      //密码
      password: {
        reg: /^[a-zA-Z]\w{5,15}$/,
        msg: '密码格式不正确且以字母开头'
      }
    }
    
  }


  //验证表单
  validUserForm(o, self) {
    //o：验证表单数据, 类型：object
    for (let key in o) {

      if (!this.validUserFormReg[key].reg.test(o[key])) {

        self.$toast(this.validUserFormReg[key].msg);
        
        return false;
      }
    }

    //表单验证通过
    return true;
  }

}

export default new ValidForm();