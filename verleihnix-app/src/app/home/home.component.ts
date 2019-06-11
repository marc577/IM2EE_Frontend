import { Component, OnInit, Inject, OnDestroy } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import {MatDialog,MatSnackBar, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DataService, User } from '../services/data.service';
import { Subscription } from 'rxjs';


interface DialogData {
  name: string;
  email: string;
  password: string;
  newPw: string;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  subUser:Subscription;
  user:User;
  countNewMsg = 0;

  constructor(private router: Router, private service:DataService, private dialog: MatDialog) {
    this.subUser = this.service.userData.subscribe((val) => {
      if(val != null){
        this.user = val;
      }
      if(!this.service.isLogedIn()){
        this.router.navigate(['./login']);
      }
    });
  }

  ngOnInit() {
    this.service.getNewMessages().subscribe((val)=>{
      this.countNewMsg = val;
    });
  }
  ngOnDestroy(){
    this.subUser.unsubscribe();
  }

  personalEdit(){
    const dialogRef = this.dialog.open(EditPersonalDialog, {
      width: '600px',
      data: this.user || {}
    });
  }

  logOut(){
    this.service.logOut();
  }

}
@Component({
  selector: 'dialog-personal-edit',
  templateUrl: 'personal-edit.dialog.html',
  styles:[".mat-form-field { width: 100%; }"]
})
export class EditPersonalDialog {

  hideOld:boolean;
  hide:boolean;

  oldPW = new FormControl('', [Validators.required]);
  newPW = new FormControl('', [Validators.required]);



  constructor(
    public dialogRef: MatDialogRef<EditPersonalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private service:DataService,
    private snackBar: MatSnackBar
    ) {
      this.hide = true;
      this.hideOld = true;
    }

  updatePw(){
    if(this.oldPW.valid && this.newPW.valid){
      this.service.updatePw(this.oldPW.value, this.newPW.value).subscribe(()=>{
        this.snackBar.open("Passwort aktualisiert", "OK", {
          duration: 2000,
          verticalPosition:"top"
        });
        this.dialogRef.close();
      }, (er)=> {this.service.catchError(er)});
    }
  }

  updateUserData(){
    this.service.updateUserData(this.data).subscribe((val) => {
      this.snackBar.open("Benutzerdaten aktualisiert", "OK", {
        duration: 2000,
        verticalPosition:"top"
      });
      this.dialogRef.close();
    }, (er)=>{this.service.catchError(er)});
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}