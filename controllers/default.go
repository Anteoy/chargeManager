package controllers

import (
	"github.com/astaxie/beego"
	"net/http"
	"io"
	"mynet/mysql"
	"fmt"
)

type MainController struct {
	beego.Controller
}

type AddController struct {
	beego.Controller
}

type CommonReturnModel struct{
	Code string `json:"Code"`
	Totle string `json:"totle"`
	Message string `json:"message"`
	Rows interface{} `json:"rows"`
}
func (this *AddController) Get() {
	fmt.Println("开始获取所有数据")
	var c CommonReturnModel
	var model = CommonReturnModel{"sd","ds","sd","sd"}
	var model2 = new(CommonReturnModel)
	model2.Rows = "ewerere"
	c.Code = "200"
	c.Message = "请求成功"
	c.Rows = "data"
	c.Totle = "20"
	this.Data["json"] = &model
	this.ServeJSON()
	fmt.Println("获取数据请求完成")
}
type IndexController struct {
	beego.Controller
}
type LoginController struct {
	beego.Controller
}

func (c *MainController) Get() {
	c.Data["Website"] = "beego.me"
	c.Data["Email"] = "astaxie@gmail.com"
	c.TplName = "index.tpl"
}

func (c *IndexController) Get(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "../static/html/login.html")
}

func (c *LoginController) Post(){

}

//func (c *LoginController) Login(w http.ResponseWriter, r *http.Request) {// L rp l
//	r.ParseForm()
//	ids := r.Form["id"]
//	if ids == nil {
//		io.WriteString(w, "请输入账号")
//		return
//	}
//	id := ids[0]
//	passwds := r.Form["passwd"]
//	if passwds == nil {
//		io.WriteString(w, "请输入密码")
//		return
//	}
//	passwd := passwds[0]
//	user := mysql.GetUserForEmail(id)
//	if user != nil && user.Passwd == passwd {
//		//if err := addSessionId(w, r, id); err != nil {
//		//	goto addSIIsError
//		//}
//		http.ServeFile(w, r, "./static/html/index.html")
//	} else {
//		http.ServeFile(w, r, "./static/html/index.html")
//	}
//	//addSIIsError:
//	http.ServeFile(w, r, "./static/html/index.html")
//}

func Login(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	ids := r.Form["id"]
	if ids == nil {
		io.WriteString(w, "请输入账号")
		return
	}
	id := ids[0]
	passwds := r.Form["passwd"]
	if passwds == nil {
		io.WriteString(w, "请输入密码")
		return
	}
	passwd := passwds[0]
	user := mysql.GetUserForEmail(id)
	if user != nil && user.Passwd == passwd {
		//if err := addSessionId(w, r, id); err != nil {
		//	goto addSIIsError
		//}
		http.ServeFile(w, r, "./static/html/index.html")
	} else {
		http.ServeFile(w, r, "./static/html/login.html")
	}
	//addSIIsError:
	http.ServeFile(w, r, "./static/html/login.html")
}

