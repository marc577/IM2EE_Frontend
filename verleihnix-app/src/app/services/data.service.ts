import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ComponentFactoryResolver } from '@angular/core/src/render3';
import { catchError, map, tap } from 'rxjs/operators';

export enum HTTP_Codes {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404
}

export interface ProductInsertion {
  insertion: Insertion,
  product: Product
}

export interface Product {
  id: number,
  title: string,
  description:string,
  insertions? :Insertion[]
}
export interface Request {
  id: number,
  state: string,
  dateFrom:number,
  dateTo:number,
  editAt: number,
  type: number
}
export interface Insertion {
  id:number,
  description: string,
  title: string,
  image: null,
  active: boolean,
  insertionStateCalendars?: Request[]
}
export interface Pool {
  id:number,
  description: string,
  insertions?: Insertion[]
}
export interface User {
  id:number,
  token:string,
  lastName:string,
  firstName:string,
  email:string
}
export interface Message {
  date: number,
  content: string,
  type:number
}

const sampleProductData = [
  {id:1,  title:"Devie1", description:"Devie1"},
  {id:2, title:"Devie2", description:"Devie2"},
  {id:3, title:"Devie3", description:"Devie3"},
  {id:4, title:"Devie4", description:"Devie4"},
  {id:5,title:"Devie5", description:"Devie5"},
  {id:6, title:"Devie6", description:"Devie6"},
  {id:7, title:"Devie7", description:"Devie7"},
  {id:8, title:"Devie8", description:"Devie8"}
];
const samppleRequestsData = [
  {id:1, state:"requested",  dateFrom: 1558607603, dateTo:1558607603, type: 1, editAt:2},
  {id:1, state:"accepted",  dateFrom: 1558607603, dateTo:1558607603, type: 1, editAt:2},
  {id:1, state:"declined",  dateFrom: 1558607603, dateTo:1558607603, type: 1, editAt:2},
  {id:1, state:"requested",  dateFrom: 1558607603, dateTo:1558607603, type: 2, editAt:2},
  {id:1, state:"accepted",  dateFrom: 1558607603, dateTo:1558607603, type: 2, editAt:2},
  {id:1, state:"declined",  dateFrom: 1558607603, dateTo:1558607603, type: 2, editAt:2},
  {id:1, state:"requested",  dateFrom: 1558607603, dateTo:1558607603, type: 2, editAt:2},
  {id:1, state:"requested",  dateFrom: 1558607603, dateTo:1558607603, type: 1, editAt:2},
  {id:1, state:"requested",  dateFrom: 1558607603, dateTo:1558607603, type: 2, editAt:2},
  {id:1, state:"requested",  dateFrom: 1558607603, dateTo:1558607603, type: 1, editAt:2},
  {id:1, state:"requested",  dateFrom: 1558607603, dateTo:1558607603, type: 2, editAt:2}
];
const sampleDeviceData = [
  {id:1, description: "Pool1", basicDevices:[
    {id:1,  description:"Devie1"},
    {id:2, description:"Devie2"}
  ]},
  {id:2, description: "Pool2", basicDevices:[
    {id:4, description:"Devie4"},
    {id:5, description:"Devie5"},
    {id:6, description:"Devie6"},
    {id:7, description:"Devie7"},
    {id:8, description:"Devie8"}
  ]},
];

const sampleChatData:Message[] = [
  {date: 1558607603, content: "Hallo du deppHallo du deppHallo du deppHallo du deppHallo du deppHallo du deppHallo du deppHallo du deppHallo du deppHallo du deppHallo du depp", type:0},
  {date: 1558607603, content: "Hallo du depp1", type:1},
  {date: 1558607603, content: "Hallo du depp3", type:0},
  {date: 1558607603, content: "Hallo du dep44Hallo du deppHallo du deppHallo du deppHallo du deppHallo du deppHallo du deppHallo du deppHallo du deppHallo du deppHallo du deppHallo du deppHallo du deppHallo du depp", type:0},
  {date: 1558607603, content: "Hallo du depdsfdsfp", type:1},
  {date: 1558607603, content: "Hallo du depdsfp", type:1},
  {date: 1558607603, content: "Hallo du", type:0},
];


@Injectable({
  providedIn: 'root'
})
export class DataService {

  public static TOKEN = "vlnx-jwt";
  public static ROOT = "http://localhost:8080/verleihnix/api/";

  private _productData: BehaviorSubject<Product[]>;
  private _requestData: BehaviorSubject<Request[]>;
  private _devicesData: BehaviorSubject<Pool[]>;
  private _userData: BehaviorSubject<User>;
  private _errorData: BehaviorSubject<HttpErrorResponse>;

  public dateFrom:Date;
  public dateTo:Date;
  public expandedPool:number;
  public searchString:string;

  constructor(private http: HttpClient) {
    this._productData = <BehaviorSubject<Product[]>>new BehaviorSubject([]);
    this._requestData = <BehaviorSubject<Request[]>>new BehaviorSubject(samppleRequestsData);
    this._devicesData = <BehaviorSubject<Pool[]>>new BehaviorSubject([]);
    this._userData = <BehaviorSubject<User>>new BehaviorSubject(null);
    this._errorData = <BehaviorSubject<HttpErrorResponse>>new BehaviorSubject(null);
    this.dateFrom = new Date();
    this.dateTo = new Date();
    this.expandedPool = -1;
    this.searchString = undefined;
  }

  get requestData(){
    // http get requests odered by date data
    return this._requestData.asObservable();
  }

  // Chat
  getChatData(partnerId: number){
    return new BehaviorSubject(sampleChatData).asObservable();
  }

  // User
  get userData(){
    if(this.isLogedIn()){
      const url = DataService.ROOT + "user";
      this.http.get<User>(url).subscribe(res => {
        this._userData.next(res);
      }, (error) => {this.catchError(error)} );
    }
    return this._userData.asObservable();
  }
  logIn(email:string, password:string ) {
    const url = DataService.ROOT+"user/login";
    return this.http.post<User>(url, {"email":email,"password": password}).subscribe( res => {
      localStorage.setItem(DataService.TOKEN, res.token);
      this._userData.next(res);
    }, (error)=>{
      this.catchError(error);
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

  updatePw(oldPW:string, newPw:string){
    const url = DataService.ROOT+"user/changePassword";
    var data = {
      "newPassword": newPw,
      "passwordConfirmation": oldPW
    };
    return this.http.post(url,data);
  }
  updateUserData(user:User){
    const url = DataService.ROOT+"user";
    return this.http.post<User>(url, user);
  }

  // Product
  get productData(){
    const url = DataService.ROOT + "product";
    this.http.get<Product[]>(url).subscribe(res => {
      this._productData.next(res);
    }, (error) => {
      this.catchError(error);
    });
    return this._productData.asObservable();
  }
  getProduct(id:number){
    const url = DataService.ROOT + "product/"+id;
    return this.http.get<Product>(url);
  }


  // Device Pools
  get devicesData(){
    const url = DataService.ROOT + "pool";
    this.http.get<[Pool]>(url).subscribe(res => {
      this._devicesData.next(res);
    }, (error) => {
      this.catchError(error);
    });
    return this._devicesData.asObservable();
  }
  editPool(pool:Pool){
    if(pool != undefined){
      const url = DataService.ROOT + "pool";
      this.http.post(url,pool).subscribe(res => {
        this.devicesData;
      });
    }
  }
  deletePool(pool: Pool){
    const url = DataService.ROOT + "pool/"+pool.id;
    this.http.delete(url).subscribe(res => {
      this.devicesData;
    });
  }

  // Insertion
  getInsertion(id:number){
    const url = DataService.ROOT+"insertion/"+id;
    return this.http.get<ProductInsertion>(url);
  }
  updateInsertion(pool:number, pI:ProductInsertion){
    const url = DataService.ROOT+"insertion/"+pool;
    const data = {
      "product": pI.product,
      "title": pI.insertion.title,
      "description": pI.insertion.description,
      "active": pI.insertion.active,
      "id": pI.insertion.id,
      "image": pI.insertion.image
    };
    return this.http.post<ProductInsertion>(url, data);
  }
  deleteInsertion(id:number){
    const url = DataService.ROOT+"insertion/"+id;
    this.http.delete(url).subscribe(null, (er)=> {this.catchError(er)});
  }

  //erros
  get error(){
    return this._errorData.asObservable();
  }
  catchError(error: HttpErrorResponse){
    console.trace();
    console.log("HTTPError",error);
    this._errorData.next(error);
    switch (error.status) {
      case HTTP_Codes.UNAUTHORIZED:
        //this.logOut();
        break;
    
      default:
        break;
    }
  }


}
