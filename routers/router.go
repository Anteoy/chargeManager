package routers

import (
	"../controllers"
	"github.com/astaxie/beego"
)

func init() {
    beego.Router("/beego", &controllers.MainController{})
    beego.Router("/info", &controllers.AddController{})
    //beego.Router("/login", &controllers.LoginController{},"*:Login")
    //beego.Router("/", &controllers.IndexController{})

}
