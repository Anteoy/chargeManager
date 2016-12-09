package mynet

type User struct {
	Id      int    `json:"id"`
	Name    string `json:"name"`
	Passwd  string
	Friends string `json:"friends"`
	Other   string `json:"other"`
	appKey  string `json:"appKey"`
}

func NewUser(id int, name string, pass string, fri string, other string,appKey string) *User {
	return &User{id, name, pass, fri, other,appKey}
}
