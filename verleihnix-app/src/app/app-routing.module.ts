import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { HomeComponent } from 'src/app/home/home.component';
import { LoginComponent } from 'src/app/login/login.component';
import { BorrowComponent } from 'src/app/borrow/borrow.component';
import { RequestsComponent } from 'src/app/requests/requests.component';
import { DevicesComponent } from 'src/app/devices/devices.component';
import { DeviceDetailComponent } from './device-detail/device-detail.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceEditComponent } from './device-edit/device-edit.component';
import { PoolsComponent } from './pools/pools.component';
import { ChatComponent } from './chat/chat.component';
import { RequestsListComponent } from './requests-list/requests-list.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {path: '', redirectTo: 'borrow', pathMatch: 'full'}, 
      {
        path: 'borrow',
        component: BorrowComponent,
        children:[
          {path: '', redirectTo: 'list', pathMatch: 'full'},
          {path: 'list', component: DeviceListComponent},
          {path: 'device/:id', component: DeviceDetailComponent},
        ]
      },
      {path: 'requests', component: RequestsComponent, children: [
        {path: '', redirectTo: 'list', pathMatch: 'full'},
        {path: 'list', component: RequestsListComponent},
        {path: 'chat/:partner', component: ChatComponent},
      ]},
      {path: 'mydevices', component: DevicesComponent, children:[
        {path: '', redirectTo: 'pools', pathMatch: 'full'},
        {path: 'pools', component: PoolsComponent},
        {path: 'device-edit/:pid/:id', component: DeviceEditComponent},
      ]},
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
