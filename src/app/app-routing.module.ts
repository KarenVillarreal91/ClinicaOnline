import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AltaAdminComponent } from './components/alta-admin/alta-admin.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { MisTurnosComponent } from './components/mis-turnos/mis-turnos.component';
import { RegistroComponent } from './components/registro/registro.component';
import { SolicitarTurnoComponent } from './components/solicitar-turno/solicitar-turno.component';
import { TurnosComponent } from './components/turnos/turnos.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { GuardGuard } from './guard/guard.guard';

const routes: Routes = [
  {path:"login", component:LoginComponent},
  {path:"registro", component:RegistroComponent},
  {path:"home", component:HomeComponent, canActivate:[GuardGuard]},
  {path:"usuarios", component:UsuariosComponent, canActivate:[GuardGuard]},
  {path:"registroAdmin", component:AltaAdminComponent, canActivate:[GuardGuard]},
  {path:"misTurnos", component:MisTurnosComponent},
  {path:"turnos", component:TurnosComponent},
  {path:"solicitarTurno", component:SolicitarTurnoComponent, canActivate:[GuardGuard]},
  {path:"miPerfil", component:MiPerfilComponent},
  {path:"", redirectTo:"/login",pathMatch:"full"},
  {path:"**", redirectTo:"/login"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
