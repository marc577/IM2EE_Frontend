import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild("loginForm") loginForm: NgForm;
  @ViewChild("registerForm") registerForm: NgForm;

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  name = new FormControl('', [Validators.required]);
  hide = true;

  constructor(private router: Router, private service:AuthService) {
    if(this.service.isLogedIn()){
      this.router.navigate(['./home']);
    }
  }

  ngOnInit() {
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
    console.log(this.loginForm);
  }
  onSubmitRegister(){
    console.log(this.registerForm);
  }

}
