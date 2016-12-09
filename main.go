package main

import (
	_ "./routers"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context"
	"fmt"
	"io"
	"mynet/mysql"
	"net/http"
	"strconv"
)

func main() {
	beego.SetStaticPath("/","./static/html/login.html")
	beego.Post("/login",func(ctx *context.Context){
		r:=ctx.Request
		r.ParseForm()
		ids := r.Form["id"]
		fmt.Println(ids)
		passwds :=r.Form["passwd"]
		fmt.Println(passwds)
		//fmt.Println("用户："+ids+"进行登录操作，正在解析。。。")
		if passwds == nil {
			io.WriteString(ctx.ResponseWriter, "请输入密码")
			return
		}
		id := ids[0]
		passwd := passwds[0]
		user := mysql.GetUserForAppKey(id)
		if user != nil && user.Passwd == passwd {
			http.ServeFile(ctx.ResponseWriter, r, "./static/html/main.html")
		} else {
			http.ServeFile(ctx.ResponseWriter, r, "./static/html/login.html")
		}
		return
	})
	beego.Get("/queryAllUser", func(ctx *context.Context) {
		fmt.Println("开始查询所有用户信息")
	})
	beego.Post("/addUser", func(ctx *context.Context) {
		fmt.Println("开始进行新增用户操作")
		r:=ctx.Request
		r.ParseForm()
		//id := r.Form["id"][0]
		appKey := r.Form["appKey"][0]
		passwd := r.Form["passwd"][0]
		name := r.Form["name"][0]
		friends := r.Form["friends"][0]
		other := r.Form["other"][0]
		mysql.InsertUser(appKey,passwd,name,friends,other)
		fmt.Println("进行新增用户操作完成")
	})
	beego.Post("/updateUser", func(ctx *context.Context) {
		fmt.Println("开始进行用户资料更改操作")
		r:=ctx.Request
		r.ParseForm()
		idstr := r.Form["id"][0]
		//id := fmt.Sprintf("%d", idstr)
		i, _ := strconv.Atoi(idstr)
		appKey := r.Form["appKey"][0]
		passwd := r.Form["passwd"][0]
		name := r.Form["name"][0]
		friends := r.Form["friends"][0]
		other := r.Form["other"][0]
		mysql.UpdateUser(appKey,passwd,name,friends,other,i)
		fmt.Println("进行用户资料更改操作完成")
	})
	beego.Post("/deleteUser", func(ctx *context.Context) {
		fmt.Println("开始进行删除用户操作")
		r:=ctx.Request
		r.ParseForm()
		idstr := r.Form["id"][0]
		i,_ := strconv.Atoi(idstr)
		mysql.DeleteUser(i)
		fmt.Println("进行删除用户操作完成")
	})
	beego.Get("/login",func(ctx *context.Context){
		ctx.Output.Body([]byte("bob"))
	})
	//var commonReturnModel struct{
	//	code string
	//	totle string
	//	message string
	//	rows interface{}
	//}
	//beego.Post("/info", func(ctx *context.Context) {
	//	commonReturnModel.code = 200
	//	commonReturnModel.message = "请求成功"
	//	commonReturnModel.rows = "data"
	//	commonReturnModel.totle = 20
	//	Controller.Data["json"] = &commonReturnModel
	//})
	beego.Run()
}


