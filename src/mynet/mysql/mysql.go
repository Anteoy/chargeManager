package mysql

import (
	"database/sql"
	"log"
	"mynet"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func init() {
	var err error
	db, err = sql.Open("mysql", "root:123@tcp(localhost:3306)/chargeManager?charset=utf8")
	checkErr(err)
	db.SetMaxOpenConns(2000)
	db.SetMaxIdleConns(1000)
	db.Ping()
}

func InsertChatContent(sendid string, content string) bool {
	stmt, err := db.Prepare(`INSERT INTO chatlog (sendid,content,time) values (?,?,now())`)
	checkErr(err)
	_, err = stmt.Exec(sendid, content)
	if checkErr(err) {
		return false
	}
	return true
}

func GetUserForEmail(id string) *mynet.User {
	rows, err := db.Query(`select * from user where email = ?`, id)
	checkErr(err)
	if !checkErr(err) {
		for rows.Next() {
			var id int
			var name string
			var passwd string
			var friends string
			var other string
			var email string
			rows.Columns()
			err = rows.Scan(&id, &name, &passwd, &friends, &other,&email)
			checkErr(err)
			user := &mynet.User{Id: id, Name: name, Passwd: passwd, Friends: friends, Other: other}
			return user
		}
	}
	return nil
}

func InsertUser(appKey string,passwd string,name string,friends string,other string) bool{
	stmt, err := db.Prepare(`insert chargeManager.user (appkey,passwd,name,friends,other) values (?,?,?,?,?)`)
	checkErr(err)
	_, err = stmt.Exec(appKey, passwd,name,friends,other)
	if checkErr(err) {
		return false
	}
	return true
}
func UpdateUser(appKey string,passwd string,name string,friends string,other string,id int) bool{
	stmt,err := db.Prepare(`update chargeManager.user set appKey = ?,passwd = ?,name=?,friends=?,other=? where id = ?`)
	checkErr(err)
	_,err = stmt.Exec(appKey,passwd,name,friends,other,id)
	if checkErr(err) {
		return false
	}
	return true
}
func DeleteUser(id int) bool {
	stmt,err := db.Prepare(`delete from chargeManager.user where id = ?`)
	checkErr(err)
	_,err = stmt.Exec(id)
	if checkErr(err) {
		return false
	}
	return true
}
func GetUserForAppKey(appKey string) *mynet.User {
	rows, err := db.Query(`select * from user where appkey = ?`, appKey)
	checkErr(err)
	if !checkErr(err) {
		for rows.Next() {
			var id int
			var name string
			var passwd string
			var friends string
			var other string
			var appKey string
			rows.Columns()
			err = rows.Scan(&id, &name, &passwd, &friends, &other,&appKey)
			checkErr(err)
			user := &mynet.User{Id: id, Name: name, Passwd: passwd, Friends: friends, Other: other}
			return user
		}
	}
	return nil
}

func checkErr(err error) bool {
	if err != nil {
		log.Println("数据库操作出错")
		log.Panic(err)
		return true
	}
	return false
}
