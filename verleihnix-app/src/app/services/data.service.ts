import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export enum HTTP_Codes {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404
}


export interface BorrowDevice {
  id: number,
  img: string,
  title: string
}
export interface Request {
  id: number,
  type:number,
  title: string,
  from:Date,
  to:Date
}
export interface Device {
  id:number,
  title: string
}
export interface DevicePool {
  id:number,
  description: string,
  basicDevices?: [Device]
}
export interface User {
  id:number,
  token:string,
  lastName:string,
  firstName:string,
  email:string
}

const sampleBorrowData = [
  {id:1, img: "", title:"Devie1"},
  {id:2,img: "", title:"Devie2"},
  {id:3,img: "", title:"Devie3"},
  {id:4,img: "", title:"Devie4"},
  {id:5,img: "", title:"Devie5"},
  {id:6,img: "", title:"Devie6"},
  {id:7,img: "", title:"Devie7"},
  {id:8,img: "", title:"Devie8"}
];
const samppleRequestsData = [
  {id:1, type:1, title:"request1", from: new Date(), to:new Date()},
  {id:2, type:2, title:"request2", from: new Date(), to:new Date()},
  {id:3, type:1, title:"request3", from: new Date(), to:new Date()},
  {id:4, type:2, title:"request4", from: new Date(), to:new Date()},
  {id:5, type:1, title:"request5", from: new Date(), to:new Date()},
  {id:6, type:1, title:"request6", from: new Date(), to:new Date()},
  {id:7, type:1, title:"request7", from: new Date(), to:new Date()}
];
const sampleDeviceData = [
  {id:1, description: "Pool1", devices:[
    {id:1,  title:"Devie1"},
    {id:2, title:"Devie2"}
  ]},
  {id:2, description: "Pool2", devices:[
    {id:4, title:"Devie4"},
    {id:5, title:"Devie5"},
    {id:6, title:"Devie6"},
    {id:7, title:"Devie7"},
    {id:8, title:"Devie8"}
  ]},
];


@Injectable({
  providedIn: 'root'
})
export class DataService {

  public static TOKEN = "vlnx-jwt";
  public static ROOT = "http://localhost:8080/verleihnix/api/";

  private _borrowData: BehaviorSubject<[BorrowDevice]>;
  private _requestData: BehaviorSubject<[Request]>;
  private _devicesData: BehaviorSubject<DevicePool[]>;
  private _userData: BehaviorSubject<User>;
  private _errorData: BehaviorSubject<HttpErrorResponse>;

  public dateFrom:Date;
  public dateTo:Date;
  public expandedPool:number;
  public searchString:string;

  constructor(private http: HttpClient) {
    this._borrowData = <BehaviorSubject<[BorrowDevice]>>new BehaviorSubject(sampleBorrowData);
    this._requestData = <BehaviorSubject<[Request]>>new BehaviorSubject(samppleRequestsData);
    this._devicesData = <BehaviorSubject<DevicePool[]>>new BehaviorSubject([]);
    this._userData = <BehaviorSubject<User>>new BehaviorSubject(null);
    this._errorData = <BehaviorSubject<HttpErrorResponse>>new BehaviorSubject(null);
    this.dateFrom = new Date();
    this.dateTo = new Date();
    this.expandedPool = -1;
    this.searchString = undefined;
  }

  get borrowData(){
    // http get borrow data
    return this._borrowData.asObservable();
  }
  get requestData(){
    // http get requests odered by date data
    return this._requestData.asObservable();
  }

  // User
  get userData(){
    const url = DataService.ROOT + "user";
    this.http.get<User>(url).subscribe(res => {
      this._userData.next(res);
    }, (error) => {this.catchError(error)} );
    return this._userData.asObservable();
  }
  logIn(email:string, password:string ) {
    const url = DataService.ROOT+"user/login";
    return this.http.post<User>(url, {"email":email,"password": password}).subscribe( res => {
      localStorage.setItem(DataService.TOKEN, res.token);
      this._userData.next(res);
    });
  }
  logOut(){
    localStorage.removeItem(DataService.TOKEN);
    this._userData.next(null);
  }
  isLogedIn(){
    return localStorage.getItem(DataService.TOKEN) ? true : false;
  }
  register(firstName:string, lastName:string, email:string, password:string){
    const url = DataService.ROOT+"user/register";
    const data = {
      "firstName": firstName,
      "lastName": lastName,
      "email": email,
      "password": password
    }
    return this.http.post(url, data);
  }
  // User
  updatePw(oldPW:string, newPw:string){
    console.log("Update PW", oldPW, newPw);
  }
  updateUserData(user:User){
    const url = DataService.ROOT+"user";
    var subscribtion = this.http.post<User>(url, user);
    subscribtion.subscribe();
    subscribtion.subscribe(res => {
      this._userData.next(res);
    }, (error) => {
      this.catchError(error);
    });
    return subscribtion;
  }


  // Device Pools
  get devicesData(){
    const url = DataService.ROOT + "pool";
    this.http.get<[DevicePool]>(url).subscribe(res => {
      this._devicesData.next(res);
    });
    return this._devicesData.asObservable();
  }
  editPool(pool:DevicePool){
    if(pool != undefined){
      const url = DataService.ROOT + "pool";
      this.http.post(url,pool).subscribe(res => {
        this.devicesData;
      });
    }
  }
  deletePool(pool: DevicePool){
    const url = DataService.ROOT + "pool/"+pool.id;
    this.http.delete(url).subscribe(res => {
      this.devicesData;
    });
  }

  // Devices
  deleteDevice(d:Device){
    console.log("Delete device", d);
  }
  addDevice(d:Device){
    console.log("add device", d);
  }
  editDevice(d:Device){
    console.log("edit device", d);
  }

  getDevice(id:number){
    //http get one device
    return sampleBorrowData[0];
  }


  //erros
  get error(){
    return this._errorData.asObservable();
  }
  catchError(error: HttpErrorResponse){
    console.log("HTTPError",error);
    this._errorData.next(error);
    switch (error.status) {
      case HTTP_Codes.UNAUTHORIZED:
        // this.logOut();
        break;
    
      default:
        break;
    }
  }


}
