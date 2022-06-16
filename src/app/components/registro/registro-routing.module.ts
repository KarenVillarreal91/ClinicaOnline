import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardGuard } from 'src/app/guard/guard.guard';
import { AltaAdminComponent } from '../alta-admin/alta-admin.component';

const routes: Routes = [
  {path: 'administrador', component: AltaAdminComponent, canActivate: [GuardGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroRoutingModule { }
