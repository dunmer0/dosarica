import {Component, OnInit} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {invoke} from "@tauri-apps/api/core";
import {open} from "@tauri-apps/plugin-dialog";
import {load, Store} from "@tauri-apps/plugin-store";
import {appDataDir} from "@tauri-apps/api/path";
import {Main} from "./views/main/main";

@Component({
  selector: "app-root",
    imports: [RouterOutlet, Main],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
    store: Store | undefined;
    pathFromStore:string = ""

  greetingMessage = "";




  greet(event: SubmitEvent, name: string): void {
    event.preventDefault();

    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    invoke<string>("greet", { name }).then((text) => {
      this.greetingMessage = text;
    });
  }

  createFolder(event: SubmitEvent, path: string): void {
      event.preventDefault();
      // let folderPath = `${this.pathFromStore}/${path}`;
      let includedPath = this.pathFromStore
      console.log(includedPath);
      invoke<void>("create_folder", {path: includedPath, folderName: path}).then(r =>{})
   }

   async savePath() {
      open({
          multiple: false,
          directory: true
      }).then(result => {
          if (this.store){
              this.store.set("path", result);
          }

          // console.log(result);
      })



   }



    async ngOnInit(): Promise<void> {
        this.store =  await load('dosarica.json')

        // await this.store.set('path', '/home/catalin')
        // await this.store.save()
        // console.log("store", this.store)
        this.pathFromStore = await this.store.get("path") as string;
        // console.log("path", path)
        const appDataDirPath = await appDataDir();
        console.log(appDataDirPath);

    }
}
