package main

import "fmt"

type oo struct {
	inner
	ss1 string
	ss2 int
	ss3 bool
}

type inner struct {
	ss4 string
}

func (i *inner) testMethod(){
	fmt.Println("testMethod is called!!!")
}

func main()  {
	oo1 := new(oo)
	fmt.Println("ss4无值："+oo1.ss4)
	oo1.ss4 = "abc"
	fmt.Println("ss4已赋值"+oo1.ss4)
	oo1.testMethod()//继承调用
	oo1.inner.testMethod()//继承调用 这里也可以重写
}