import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { pb } from 'src/main';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  messages :Messages[] = [];
  @ViewChild('messageContainer') messageContainer !: ElementRef;

  ngOnInit(): void {
    this.fetchMessages(1);
  }

  ngAfterViewChecked() {
    this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;       
  } 

  

  async fetchMessages(start : number) : Promise<any>{
    // fetch a paginated records list
    let response = await pb.collection('messages').getList(start, 10, {
      sort: 'created',
      expand: 'user',
    });
    

    response.items.forEach(res => {
      this.messages.push(new Messages(res));
    })

  }

  async newMessage(message : string){
    if(pb.authStore.model)
      await pb.collection('messages').create({
        "field": message,
        "user": pb.authStore.model.id,
      });
      this.messages = [];
      this.fetchMessages(1);
  }

}

class Messages{
  author : any;
  message : string;

  constructor(entity:any){
    this.message = entity.field;
    this.author = {
      name : entity.expand.user.name,
    }
  }
}