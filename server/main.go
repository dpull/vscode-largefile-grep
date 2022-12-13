package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func testHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "%v\n", r)

	vars := mux.Vars(r)
	fmt.Fprintf(w, "%v\n", vars)
}

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	file, err := os.OpenFile("xxx.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		log.Fatal(err)
	}

	defer file.Close()

	filePlusStdout := io.MultiWriter(file, os.Stdout)
	log.SetOutput(filePlusStdout)

	r := mux.NewRouter()
	r.HandleFunc("/test/{tag}", testHandler)

	log.Fatal(http.ListenAndServe(":50084", r))
}
