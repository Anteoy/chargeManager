package main

import "fmt"

type interfacetest interface {
	//testMothod1() string
	//testMothod()//这种会报语法错误 在go里面是不允许的
	iMethod() //加上int则会报错 说明go的方法判断有返回值，而java没有
}

type obj1 struct {
	valte1 string
}

type obj2 struct {
	valte2 string
}

//从属不同对象的testMothod 返回值不同的接口实现
func ( obj11 obj1)iMethod(){//这里传值和引用*obj1皆可
	fmt.Println("testMothod go obj1")
}

//从属不同对象的testMothod 返回值不同的接口实现
func ( obj11 obj2)iMethod() {//这里传值和引用*obj1皆可
	fmt.Println("testMothod go obj2")
}


func gorun(ii interfacetest){
	fmt.Println(ii.iMethod)
}

func main(){
	var i interfacetest
	//interfacetest_ := new(interfacetest)//这种方式进行多台路由转发会报错 GO需先声明 如 var i interfacetest
	obj1_ := new(obj1)
	//赋obj1
	i = obj1_
	i.iMethod()//正确打印
	gorun(i)
	gorun(obj1_)
	//interfacetest_.testMethod() //这种在java中允许，在go中是不允许的
	//赋obj2
	obj2_ := new(obj2)
	i = obj2_
	i.iMethod()//正确打印
	gorun(i)
	gorun(obj2_)
	list := [2]interfacetest{obj1_,obj2_}

	slice := []interfacetest{}
	slice = append(slice, obj1_)
	slice = append(slice, obj2_)
	for index,value := range slice {
		fmt.Println(index)
		fmt.Println(value)
	}
	fmt.Println(len(slice))

	fmt.Println(len(list))
}