import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  logueado:any = false;
  userLogueado:any = '';

  constructor(private auth:AngularFireAuth, private firestore:AngularFirestore, private storage:AngularFireStorage) 
  { 
    this.auth.authState.subscribe((user) => (this.userLogueado = user));   
  }
  
  Login(user:any)
  { 
    return this.auth.signInWithEmailAndPassword(user.email, user.clave);
  }
  
  LogOut()
  {
    return this.auth.signOut();
  }

  Registro(user:any)
  {
    return this.auth.createUserWithEmailAndPassword(user.email , user.clave);
  }
  
  async SubirPaciente(user:any, fotos:FormData)
  {
    let path1 = `fotos/${Date.now()}`;
    let path2 = `fotos/${Date.now()}`;

    await this.storage.upload(path1, fotos.get('foto1'));
    await this.storage.upload(path2, fotos.get('foto2'));

    this.storage.ref(path1).getDownloadURL().subscribe((data)=>{
      user.foto1 = data;
      
      this.storage.ref(path2).getDownloadURL().subscribe((data)=>{
        user.foto2 = data;
        this.firestore.collection('pacientes').add(user);
      });
    });

  }

  async SubirEspecialista(user:any, fotos:FormData)
  {
    let path = `fotos/${Date.now()}`;

    await this.storage.upload(path, fotos.get('foto1'));

    this.storage.ref(path).getDownloadURL().subscribe((data)=>{
      user.foto = data;
      this.firestore.collection('especialistas').add(user);
    });
  }

  GetColeccion(tipo:string)
  {
    return this.firestore.collection<any>(tipo).valueChanges({idField: "id"});
  }

  SubirEspecialidad(esp:any)
  {
    this.firestore.collection('especialidades').add(esp);
  }
}
