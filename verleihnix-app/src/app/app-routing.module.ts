import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { HomeComponent } from 'src/app/home/home.component';
import { LoginComponent } from 'src/app/login/login.component';
import { BorrowComponent } from 'src/app/borrow/borrow.component';
import { RequestsComponent } from 'src/app/requests/requests.component';
import { DevicesComponent } from 'src/app/devices/devices.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {path: '', redirectTo: 'borrow', pathMatch: 'full'}, 
      {path: 'borrow', component: BorrowComponent},
      {path: 'requests', component: RequestsComponent},
      {path: 'devices', component: DevicesComponent},
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [BrowserAnimationsModule,RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
