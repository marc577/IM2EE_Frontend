import { Component, OnInit, Inject } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import {MatDialog,MatSnackBar, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl } from '@angular/forms';
import { DataService } from '../services/data.service';

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
export class HomeComponent implements OnInit {

  constructor(private router: Router, private service:AuthService, private dialog: MatDialog) {
    if(!this.service.isLogedIn()){
      this.router.navigate(['./login']);
    }
  }

  ngOnInit() {
  }

  personalEdit(){
    const dialogRef = this.dialog.open(EditPersonalDialog, {
      width: '600px',
      data: {name: "", email:"sds", password:"", newPw:""}
    });

    // dialogRef.afterClosed().subscribe( ok => {
    //   // this.service.addPool(pool);
    // });
  }

  logOut(){
    this.service.logOut();
  }

}
@Component({
  selector: 'dialog-personal-edit',
  templateUrl: 'personal-edit.dialog.html',
})
export class EditPersonalDialog {

  hideOld:boolean;
  hide:boolean;

  constructor(
    public dialogRef: MatDialogRef<EditPersonalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private service:DataService,
    private snackBar: MatSnackBar
    ) {
      this.hide = true;
      this.hideOld = true;
    }

  updatePw(){
    this.service.updatePw(this.data.password, this.data.newPw);
    this.snackBar.open("Passwort aktualisiert", "OK", {
      duration: 2000,
      verticalPosition:"top"
    })
  }
  updateUserData(){
    this.service.updateUserData(this.data.name, this.data.email);
    this.snackBar.open("Benutzerdaten aktualisiert", "OK", {
      duration: 2000,
      verticalPosition:"top"
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}