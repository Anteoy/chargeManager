package main

import(
	"fmt"
)
//Go语言中string，slice，map这三种类型的实现机制类似指针，所以可以直接传递，而不用取地址后传递指针
//智能 要访问指针 p 指向的结构体中某个元素 x，不需要显式地使用 * 运算，可以直接 p.x
func main(){
	var i int // i 的类型是int型
	i=1 // i 的值为 1;
	var p *int // p 的类型是[int型的指针]
	p=&i         // p 的值为 [i的地址]

	var pv **int
	//pv = 2//cannot use 2 (type int) as type **int in assignment
	//pv = &i//非 **int 类型
	//pv = 1//非 **int 类型
	pv=nil
	//pv="ds"//非 string类型

	fmt.Printf("i=%d;p=%d;*p=%d;pv=%d\n",i,p,*p,pv)

	*p=2 // *p 的值为 [[i的地址]的指针] (其实就是i嘛),这行代码也就等价于 i = 2
	fmt.Printf("i=%d;p=%d;*p=%d\n",i,p,*p)

	i=3 // 验证想法
	fmt.Printf("i=%d;p=%d;*p=%d\n",i,p,*p)
}

// method use pointer
type abc struct{
	v int
}

func (a abc)aaaa(){ //传入的是值，而不是引用
	a.v=1
	fmt.Printf("1:%d\n",a.v)
}

func (a *abc)bbbb(){ //传入的是引用，而不是值
	fmt.Printf("2:%d\n",a.v)
	a.v=2
	fmt.Printf("3:%d\n",a.v)
}

func (a *abc)cccc(){ //传入的是引用，而不是值
	fmt.Printf("4:%d\n",a.v)
}

/*
func main(){
	aobj:=abc{}  //new(abc);
	aobj.aaaa()
	aobj.bbbb()
	aobj.cccc()
}*/
