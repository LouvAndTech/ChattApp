package main

import (
	"log"
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
	log.Println("Pocketbase version:", pocketbase.Version)

	var publicDirFlag string

	// add "--publicDir" option flag
	app.RootCmd.PersistentFlags().StringVar(
		&publicDirFlag,
		"publicDir",
		defaultPublicDir(),
		"the directory to serve static files",
	)

	app.OnRecordAfterCreateRequest().Add(func(e *core.RecordCreateEvent) error {

		// On user creation, add a cat avatar to the user
		if e.Record.TableName() == "users" {
			log.Println("users created")

			e.Record.Set("avatar", getCatImg(e.Record.GetId()))

			if err := app.Dao().SaveRecord(e.Record); err != nil {
				return err
			}
		}

		return nil
	})

	app.OnRecordBeforeCreateRequest().Add(func(e *core.RecordCreateEvent) error {
		if e.Record.TableName() == "messages" {
			log.Println("messages created")

			checkResults, err := profanityCheck(e.Record.Get("field").(string))
			if err != nil {
				return err
			}

			if checkResults {
				log.Println("Toxic message detected !")
				e.Record.Set("user", "v5w8gdo3t5909nm")
				e.Record.Set("field", "This message has been deleted because it is toxic.")
				if err := app.Dao().SaveRecord(e.Record); err != nil {
					return err
				}
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
