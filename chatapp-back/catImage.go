package main

import (
	"encoding/json"
	"errors"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

type CatImg struct {
	Id     string `json:"id"`
	Url    string `json:"url"`
	With   int    `json:"width"`
	Height int    `json:"height"`
}

func getCatImg(userId string) string {
	response, err := http.Get("https://api.thecatapi.com/v1/images/search")
	if err != nil {
		return "nil"
	}

	data, _ := ioutil.ReadAll(response.Body)

	var rep []CatImg

	err = json.Unmarshal(data, &rep)
	if err != nil {
		log.Println(err)
	}

	path, _ := os.Getwd()

	if err := os.MkdirAll("pb_data/storage/_pb_users_auth_/"+userId, os.ModePerm); err != nil {
		log.Fatal(err)
	}

	err = downloadFile(rep[0].Url, path+"/pb_data/storage/_pb_users_auth_/"+userId+"/cat"+rep[0].Id+".jpg")
	if err != nil {
		log.Println(err)
	}

	return ("cat" + rep[0].Id + ".jpg")

}

func downloadFile(URL, fileName string) error {
	//Get the response bytes from the url
	response, err := http.Get(URL)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	if response.StatusCode != 200 {
		return errors.New("Received non 200 response code")
	}
	//Create a empty file
	file, err := os.Create(fileName)
	if err != nil {
		return err
	}
	defer file.Close()

	//Write the bytes to the fiel
	_, err = io.Copy(file, response.Body)
	if err != nil {
		return err
	}

	return nil
}
