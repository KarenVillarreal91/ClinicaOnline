import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { environment } from 'src/environments/environment.prod';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { HomeComponent } from './components/home/home.component';
import { EspecialistasComponent } from './components/especialistas/especialistas.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { MisTurnosComponent } from './components/mis-turnos/mis-turnos.component';
import { SolicitarTurnoComponent } from './components/solicitar-turno/solicitar-turno.component';
import { EspecialidadesComponent } from './components/especialidades/especialidades.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { MisHorariosComponent } from './components/mis-horarios/mis-horarios.component';
import { TurnosComponent } from './components/turnos/turnos.component';
import { HistoriaClinicaComponent } from './components/historia-clinica/historia-clinica.component';
import { TablaHistoriaClinicaComponent } from './components/tabla-historia-clinica/tabla-historia-clinica.component';

@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    LoginComponent,
    RegistroComponent,
    HomeComponent,
    UsuariosComponent,
    EspecialistasComponent,
    PacientesComponent,
    MisTurnosComponent,
    SolicitarTurnoComponent,
    EspecialidadesComponent,
    MiPerfilComponent,
    MisHorariosComponent,
    TurnosComponent,
    HistoriaClinicaComponent,
    TablaHistoriaClinicaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    HttpClientModule,
    ReactiveFormsModule,
    RecaptchaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
