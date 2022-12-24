import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { pb } from 'src/main';

const messageperpage = 15;

@Component({
  selector: 'app-msg-thread',
  templateUrl: './msg-thread.component.html',
  styleUrls: ['./msg-thread.component.scss']
})
export class MsgThreadComponent implements OnInit {
  pb = pb

  messages :Messages[] = [];
  loading : boolean = false;
  allMessagesLoaded : boolean = false;

  @ViewChild('messageContainer') messageContainer !: ElementRef;
  //On init fetch the messages
  ngOnInit(): void {
    this.fetchMessages(1);
    this.subscibe();
    this.bottomMessage();
  }

    //Scroll to the last message in the list
    private bottomMessage(){
      try {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      } catch(err) {
        console.log(err);
      }  
    }
  
    /*
    Work only on new message and not on load
    And stop at the n-1 message
    ngAfterViewInit() {
      this.bottomMessage();
    }*/
  
    //Fetch the last 10 messages
    private async fetchMessages(start : number) : Promise<any>{
      this.loading = true;
      // fetch a paginated records list
      let response = await pb.collection('messages').getList(start, messageperpage, {
        sort: '-created',
        expand: 'user',
      });
      
      console.log(response);
      //add the messages to the list
      response.items.reverse().forEach(res => {
        this.messages.push(new Messages(res));
      })
      //stop the loading
      this.loading = false;
      //scroll to the bottom of the list
      setTimeout(()=>{
        this.bottomMessage();
      }, 10);
    }
  
    //subscribe to the fil of messages
    private subscibe(){
      pb.collection('messages').subscribe('*', e => {
        this.updateFil(e)
      });
    }
  
    //When the user scroll to the top of the list fetch the next 10 messages
    onScroll(){
      //when on top of the list
      if (this.messageContainer.nativeElement.scrollTop == 0 && !this.loading && !this.allMessagesLoaded){
        this.loadMore();
      }
    }
  
    async loadMore(){
      //fetch the next 10 messages
      this.loading = true;
      try{
        // fetch a paginated records list
        var response = await pb.collection('messages').getList(1, messageperpage, {
          filter: 'created < "' + this.messages[0].date + '"',
          sort: '-created',
          expand: 'user',
        });
        //If there is no more messages
        if (response.items.length < messageperpage){
          this.allMessagesLoaded = true;
        }
        //add the messages to the list at the top
        response.items.forEach(res => {
          this.messages.unshift(new Messages(res));
        })
      }catch(e){
        console.log(e);
      }
      //stop the loading
      this.loading = false;
    }
  
    //NewMessage arrive 
    private async updateFil(e : any){
      try{
        //expand the user
        e.record.expand.user = await pb.collection('users').getOne(e.record.user, {});
        //add the message to the list
        this.messages.push(new Messages(e.record));
        //scroll to the bottom of the list
        setTimeout(()=>{
          this.bottomMessage();
        }, 10);
      }catch(e){}
    }
  
  }
  
  class Messages{
    date : string;
    author : any;
    message : string;
    
    constructor(entity:any){
      this.date = entity.created;
      this.message = entity.field;
      this.author = {
        name : entity.expand.user.name,
        avatar : pb.getFileUrl(entity.expand.user, entity.expand.user.avatar),
        id: entity.expand.user.id,
      }
    }
  }
