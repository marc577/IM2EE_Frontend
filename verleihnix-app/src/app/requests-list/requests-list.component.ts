import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { DataService, Request } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { COMMENT_MARKER } from '@angular/core/src/render3/interfaces/i18n';


interface DialogData {
  comment: string;
}

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.css']
})
export class RequestsListComponent implements OnInit {

  requestType:string;
  subRequestsData:Subscription;
  requests:Request[];
  filterActive:boolean;

  constructor(
    private router: Router,
    private aRoute: ActivatedRoute, 
    private service:DataService,
    private dialog: MatDialog,
    private snackBar:MatSnackBar
    ) {
    this.requestType = "0";
    this.filterActive = false;

  }

  ngOnInit() {
    this.subRequestsData = this.service.requestData.subscribe((data) => {
      this.requests = data;
    });
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
      if(comment != undefined){
        this.service.setRequestState(id, {message: comment, state: 2}).subscribe((val)=>{
          this.ngOnInit();
          this.snackBar.open("Anfrage abgelehnt!", "OK", {
            duration: 3000,
            verticalPosition:"top"
          });
        }, (er)=>{
          this.service.catchError(er);
        });
      }
    });
  }

  acceptRequest(id:number){
    const comment = "Anfrage aktzeptiert!";
    this.service.setRequestState(id, {message: comment, state: 1}).subscribe((val)=>{
      this.ngOnInit();
      this.snackBar.open(comment, "OK", {
        duration: 3000,
        verticalPosition:"top"
      });
    }, (er)=>{
      this.service.catchError(er);
    });
  }
  reopenRequest(id:number){
    const comment = "Anfrage wieder geöffnet!";
    this.service.setRequestState(id, {message: comment, state: 0}).subscribe((val)=>{
      this.ngOnInit();
      this.snackBar.open(comment, "OK", {
        duration: 3000,
        verticalPosition:"top"
      });
    }, (er)=>{
      this.service.catchError(er);
    });
  }
  deleteRequest(id:number){
    if(confirm("Anfrage wirklich löschen?")){
      this.service.deleteRequest(id).subscribe(() => {
        this.service.requestData;
      });
    }
  }

  goToChat(partner: number){
    this.router.navigate([]);
  }

}

@Component({
  selector: 'dialog-reject-request',
  templateUrl: 'dialog-reject-request.html',
  styles:[".mat-form-field { width: 100%; }"]
})
export class DialogRejectRequestDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogRejectRequestDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
