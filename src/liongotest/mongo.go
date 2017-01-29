package main

import (
	"gopkg.in/mgo.v2"
	"io"
	"encoding/json"
	"time"
	"fmt"
)

import (
	"gopkg.in/mgo.v2/bson"
	"math/rand"
	"net/http"
)

// handler functions

// simple handler that just responds with a fixed string
func requestHandler1(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "Hello world!")
}

// Handler which makes three mongo queries at the same time and responds with the
// one that returns the quickest
func requestHandler2(w http.ResponseWriter, r *http.Request, mongoSession *mgo.Session) {
	c1 := make(chan string)
	c2 := make(chan string)
	c3 := make(chan string)

	go query("AAPL", mongoSession, c1)
	go query("GOOG", mongoSession, c2)
	go query("MSFT", mongoSession, c3)

	select {
	case data := <-c1:
		io.WriteString(w, data)
	case data := <-c2:
		io.WriteString(w, data)
	case data := <-c3:
		io.WriteString(w, data)
	}

}

// runs a query against mongodb
func query(ticker string, mongoSession *mgo.Session, c chan string) {
	sessionCopy := mongoSession.Copy()
	defer sessionCopy.Close()
	collection := sessionCopy.DB("akka").C("stocks")
	var result bson.M
	collection.Find(bson.M{"Ticker": ticker}).One(&result)

	asString, _ := json.MarshalIndent(result, "", "  ")

	amt := time.Duration(rand.Intn(120))
	time.Sleep(time.Millisecond * amt)
	c <- string(asString)
}

// starts the application
func main() {

	server := http.Server{
		Addr:    ":8000",
		Handler: NewHandler(),
	}

	// start listening
	fmt.Println("Started server 2")
	server.ListenAndServe()

}

// Constructor for the server handlers
func NewHandler() *myHandler {
	h := new(myHandler)
	h.defineMappings()

	return h
}

// Definition of this struct
type myHandler struct {
	// holds the mapping mux多路复用器
	mux map[string]func(http.ResponseWriter, *http.Request)
}

// functions defined on struct
func (my *myHandler) defineMappings() {

	session, err := mgo.Dial("localhost")
	if err != nil {
		panic(err)
	}

	// make the mux
	my.mux = make(map[string]func(http.ResponseWriter, *http.Request))

	// matching of request path
	my.mux["/hello"] = requestHandler1
	my.mux["/get"] = my.wrap(requestHandler2, session)
}

// returns a function so that we can use the normal mux functionality and pass in a shared mongo session
//返回一个我们能够使用泛型mux 通过一个共用的mongo session
func (my *myHandler) wrap(target func(http.ResponseWriter, *http.Request, *mgo.Session), mongoSession *mgo.Session) func(http.ResponseWriter, *http.Request) {
	return func(resp http.ResponseWriter, req *http.Request) {
		target(resp, req, mongoSession)
	}
}

// implements serveHTTP so this struct can act as a http server
func (my *myHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if h, ok := my.mux[r.URL.String()]; ok {
		// handle paths that are found
		h(w, r)
		return
	} else {
		// handle unhandled paths
		io.WriteString(w, "My server: " + r.URL.String())
	}
}
