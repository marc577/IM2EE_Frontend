import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { DataService, Message, User } from '../services/data.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { load } from '@angular/core/src/render3';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

  private subChat: Subscription;
  private sub:Subscription;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  user:User;
  subUser:Subscription;
  message = new FormControl('', [Validators.required]);
  messages:Message[];
  request:number;

  constructor(private service:DataService, private aRoute: ActivatedRoute) {
    this.subUser = this.service.userData.subscribe(d => {
      this.user = d;
    })
    this.sub = this.aRoute.params.subscribe(params => {
      this.request = +params['request'];
      this.load();
    });
  }

  load(){
    if(this.subChat) this.subChat.unsubscribe();
    this.subChat = this.service.getChatData(this.request).subscribe((data)=>{
      //console.log(data);
      this.messages = data;
    });
  }
  
  ngOnInit() { 
    this.scrollToBottom();
  }

  ngAfterViewChecked() {        
      this.scrollToBottom();        
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
    this.subChat.unsubscribe();
    this.subUser.unsubscribe();
  }
  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  send(){
    if(this.message.invalid) return;
    this.service.sendMessage({
      message: this.message.value,
      idSender: this.user.id,
      idInsertionRequest: this.request
    }).subscribe((me)=>{
      this.message.setValue("");
      this.load();
    }, (er) => {this.service.catchError(er)});
  }

}
