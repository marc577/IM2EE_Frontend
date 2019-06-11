import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ComponentFactoryResolver, pipe } from '@angular/core/src/render3';
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
  minPricePerDay:number,
  insertions? :Insertion[],
  image: string
}

export interface NewRequest {
  dateFrom:number,
  dateTo:number,
  message:string,
  insertionId:number
}
export interface Request {
  id: number,
  state: string,
  dateFrom:number,
  dateTo:number,
  editAt: number,
  type: number,
  insertionTitle:string
}
export interface Insertion {
  id:number,
  description: string,
  title: string,
  image: string,
  active: boolean,
  pricePerDay: number,
  insertionStateCalendars?: Request[],
  insertionRequests?: Request[]
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
  sendDate: number,
  message: string,
  senderId:number,
  id:number,
  readByListener:boolean
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public static TOKEN = "vlnx-jwt";
  //public static ROOT = "http://localhost:8080/verleihnix/api/";
  public static ROOT = "./api/";

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
    this._requestData = <BehaviorSubject<Request[]>>new BehaviorSubject([]);
    this._devicesData = <BehaviorSubject<Pool[]>>new BehaviorSubject([]);
    this._userData = <BehaviorSubject<User>>new BehaviorSubject(null);
    this._errorData = <BehaviorSubject<HttpErrorResponse>>new BehaviorSubject(null);
    this.dateFrom = new Date();
    this.dateTo = new Date();
    this.expandedPool = -1;
    this.searchString = undefined;
  }

  // Requests
  get requestData(){
    const url = DataService.ROOT + "insertionRequest";
    this.http.get<Request[]>(url).subscribe(res => {
      this._requestData.next(res);
    }, (error) => {
      this.catchError(error);
    });
    return this._requestData.asObservable();
  }
  requestInsertion(request:NewRequest){
    const url = DataService.ROOT+"insertionRequest"
    return this.http.post<NewRequest>(url, request);
  }
  setRequestState(requestId:number, data : {message: string, state:number}){
    const url = DataService.ROOT+"insertionRequest/state/"+requestId;
    return this.http.post<NewRequest>(url, data);
  }
  deleteRequest(requestId: number){
    const url = DataService.ROOT+"insertionRequest/"+requestId;
    return this.http.delete<NewRequest>(url);
  }

  // Chat
  getChatData(requestId: number){
    const url = DataService.ROOT + "chat/"+requestId;
    return this.http.get<Message[]>(url);
  }
  sendMessage(message:{idSender:number, message:string, idInsertionRequest:number}){
    const url = DataService.ROOT+"chat";
    return this.http.post<Message>(url, message);
  }
  getNewMessages(){
    const url = DataService.ROOT + "chat/new";
    return this.http.get<number>(url);
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
    var ret =  <BehaviorSubject<Boolean>>new BehaviorSubject(false);
    this.http.post<User>(url, {"email":email,"password": password}).subscribe( res => {
      localStorage.setItem(DataService.TOKEN, res.token);
      this._userData.next(res);
      ret.next(false);
    }, (error)=>{
      ret.next(true);
      // this.catchError(error);
    });
    return ret;
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
      "pricePerDay": pI.insertion.pricePerDay
    };
    return this.http.post<ProductInsertion>(url, data);
  }
  deleteInsertion(id:number){
    const url = DataService.ROOT+"insertion/"+id;
    this.http.delete(url).subscribe((va) => {
      this.devicesData;
    }, (er)=> {this.catchError(er)});
  }
  updateInsertionImage(id:number, image:string){
    const url = DataService.ROOT+"insertion/image/"+id;
    return this.http.post(url, image);
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
