import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  @ViewChild("loginForm") loginForm: NgForm;
  @ViewChild("registerForm") registerForm: NgForm;

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  fName = new FormControl('', [Validators.required]);
  lName = new FormControl('', [Validators.required]);
  hide = true;
  selected = new FormControl(0);

  subUser:Subscription;

  constructor(private router: Router, private service:DataService, private snackBar:MatSnackBar) {
    this.subUser = this.service.userData.subscribe((val) => {
      if(this.service.isLogedIn()){
        this.router.navigate(['./home']);
      }
    });
  }

  ngOnInit() {
  }
  ngOnDestroy(){
    this.subUser.unsubscribe();
  }

  getErrorMessage(control:FormControl, errText:string, errors:[string]) {
    for (let index = 0; index < errors.length; index++) {
      const element = errors[index];
      if(control.hasError(element)){
        return errText;
        break;
      }
    }
    return "";
  }

  onSubmitLogin(){
    if(this.loginForm.valid){
      this.service.logIn(this.email.value, this.password.value).subscribe((val)=>{
        if(val == true){
          this.snackBar.open("Benutzer oder Passwort falsch!", "OK", {
            duration: 3000,
            verticalPosition:"top"
          })
        }
      })
    }
  }
  onSubmitRegister(){
    if(this.registerForm.valid){
      this.service.register(this.fName.value, this.lName.value, this.email.value, this.password.value).subscribe(()=>{
        this.password.setValue("");
        this.selected.setValue(0);
        this.snackBar.open("Erfolgreich registriert!", "OK", {
          duration: 2000,
          verticalPosition:"top"
        })
      }, error => {
        this.email.reset();
        this.snackBar.open(error.error, "OK", {
          duration: 3000,
          verticalPosition:"top"
        })
      });
    }
  }

}
