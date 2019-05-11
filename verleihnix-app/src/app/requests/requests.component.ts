import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { DataService, Request } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


interface DialogData {
  comment: string;
}

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit, OnDestroy {

  requestType:string;
  subRequestsData:Subscription;
  requests:[Request];
  filterActive:boolean;

  constructor(
    private router: Router,
    private aRoute: ActivatedRoute, 
    private service:DataService,
    private dialog: MatDialog
    ) {
    this.requestType = "0";
    this.filterActive = false;
    
    this.subRequestsData = this.service.requestData.subscribe((data) => {
      this.requests = data;
    });

  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.subRequestsData.unsubscribe();
  }

  requestFilterChanged(e){
    if(e.value == "0"){
      this.filterActive = false;
    }else{
      this.filterActive = true;
    }
  }
  rejectRequest(id:number){
    const dialogRef = this.dialog.open(DialogRejectRequestDialog, {
      width: '300px',
      data: {comment: ""}
    });

    dialogRef.afterClosed().subscribe(comment => {
      console.log('The dialog was closed', comment);
    });
  }

}

@Component({
  selector: 'dialog-reject-request',
  templateUrl: 'dialog-reject-request.html',
})
export class DialogRejectRequestDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogRejectRequestDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
