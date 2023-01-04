package main

import (
	"encoding/json"
	"errors"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func defaultPublicDir() string {
	if strings.HasPrefix(os.Args[0], os.TempDir()) {
		// most likely ran with go run
		return "./pb_public"
	}

	return filepath.Join(os.Args[0], "../pb_public")
}

var app = pocketbase.New()

func main() {

	var publicDirFlag string

	// add "--publicDir" option flag
	app.RootCmd.PersistentFlags().StringVar(
		&publicDirFlag,
		"publicDir",
		defaultPublicDir(),
		"the directory to serve static files",
	)

	app.OnModelAfterCreate().Add(func(e *core.ModelEvent) error {
		if e.Model.TableName() == "users" {
			log.Println("users created")
			record, err := app.Dao().FindRecordById("users", e.Model.GetId())
			if err != nil {
				return err
			}

			record.Set("avatar", getCatImg(e.Model.GetId()))

			if err := app.Dao().SaveRecord(record); err != nil {
				return err
			}
		}
		return nil
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		// serves static files from the provided public dir (if exists)
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS(publicDirFlag), false))
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

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
