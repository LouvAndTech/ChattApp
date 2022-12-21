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
  @ViewChild('message') inputMessage !: ElementRef;

  //On init fetch the messages
  ngOnInit(): void {
    this.fetchMessages(1);
    this.subscibe();
  }

  //Each time a change append in the view scroll to the last message
  ngAfterViewChecked() {
    this.bottomMessage();
  } 

  //Scroll to the last message in the list
  bottomMessage(){
    this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
  }

  //Fetch the last 10 messages
  async fetchMessages(start : number) : Promise<any>{
    // fetch a paginated records list
    let response = await pb.collection('messages').getList(start, 10, {
      sort: '-created',
      expand: 'user',
    });
    
    response.items.reverse().forEach(res => {
      this.messages.push(new Messages(res));
    })
  }

  //subscribe to the fil of messages
  subscibe(){
    pb.collection('messages').subscribe('*', e => this.updateFil(e));
  }

  //NewMessage arrive 
  async updateFil(e : any){
    e.record.expand.user = await pb.collection('users').getOne(e.record.user, {});
    this.messages.push(new Messages(e.record));
  }
  
  //Send a new message
  async newMessage(message : string){
    //Empty the field
    this.inputMessage.nativeElement.value = null;
    //create a new message in the db
    if(pb.authStore.model)
      await pb.collection('messages').create({
        "field": message,
        "user": pb.authStore.model.id,
      });
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