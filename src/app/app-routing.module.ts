import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { GuardGuard } from './guard/guard.guard';

const routes: Routes = [
  {path:"login", component:LoginComponent},
  {path:"registro", component:RegistroComponent},
  {path:"home", component:HomeComponent, canActivate:[GuardGuard]},
  {path:"", redirectTo:"/login",pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
