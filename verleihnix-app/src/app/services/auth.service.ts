import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private logedIn:boolean;

  constructor(private http: HttpClient) {
    this.logedIn = false;
  }

  logIn(email:string, password:string ) {
    this.logedIn = true;
    //return this.http.post('/api/login', {email, password});
  }
  logOut(){
    this.logedIn = false;
  }
  isLogedIn(){
    return true;
  }
}
