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
  especialistas:Array<any> = [];
  administradores:Array<any> = [];
  pacientes:Array<any> = [];

  constructor(private auth:AngularFireAuth, private firestore:AngularFirestore, private storage:AngularFireStorage) 
  { 
    this.GetColeccion('especialistas').subscribe((lista)=>{
      this.especialistas = lista;
    });

    this.GetColeccion('pacientes').subscribe((lista)=>{
      this.pacientes = lista;
    });

    this.GetColeccion('administradores').subscribe((lista)=>{
      this.administradores = lista;
    });
  }
  
  async Login(user:any)
  { 
    this.userLogueado = user;

    return this.auth.signInWithEmailAndPassword(user.email, user.clave);
  }
  
  LogOut()
  {
    return this.auth.signOut();
  }

  Registro(user:any)
  {
    let retorno = this.auth.createUserWithEmailAndPassword(user.email , user.clave)
    .then(()=>{
      this.auth.authState.subscribe((data)=>{data?.sendEmailVerification();});
    });
    
    return retorno;
  }
  
  async SubirPaciente(user:any, fotos:FormData)
  {
    let path1 = `fotos/${Date.now()}`;
    let path2 = `fotos/${Date.now()}`;

    await this.storage.upload(path1, fotos.get('foto1'));
    await this.storage.upload(path2, fotos.get('foto2'));

    this.storage.ref(path1).getDownloadURL().subscribe((data)=>{
      user.foto = data;
      
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

  async SubirAdmin(user:any, fotos:FormData)
  {
    let path = `fotos/${Date.now()}`;

    await this.storage.upload(path, fotos.get('foto'));

    this.storage.ref(path).getDownloadURL().subscribe((data)=>{
      user.foto = data;
      this.firestore.collection('administradores').add(user);
    });
  }

  GetColeccion(coleccion:string)
  {
    return this.firestore.collection<any>(coleccion).valueChanges({idField: "id"});
  }

  SubirColeccion(esp:any, coleccion:string)
  {
    return this.firestore.collection(coleccion).add(esp);
  }

  EditarColeccion(id:string, datos:any, tipo:string)
  {
    return this.firestore.collection(tipo).doc(id).update(datos);
  }

  GetUsuarioActual()
  {
    let todos:any = [this.EsAdmin(), this.EsEspecialista(), this.EsPaciente()];

    if(todos[0])
    {
      this.userLogueado = todos[0]; 
    }
    else
    {
      if(todos[1])
      {
        this.userLogueado = todos[1]; 
      }
      else
      {
        this.userLogueado = todos[2]; 
      }
    }
  }

  EsAdmin()
  {
    let encontro = false;

    for(let user of this.administradores)
    {
      if(user.email == this.userLogueado.email)
      {
        encontro = user;
        break;
      }
    }

    return encontro;
  }

  EsPaciente()
  {
    let encontro = false;

    for(let user of this.pacientes)
    {
      if(user.email == this.userLogueado.email)
      {
        encontro = user;
        break;
      }
    }

    return encontro;
  }

  EsEspecialista()
  {
    let encontro = false;

    for(let user of this.especialistas)
    {
      if(user.email == this.userLogueado.email)
      {
        encontro = user;
        break;
      }
    }

    return encontro;
  }
}
