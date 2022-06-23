import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ClinicaOnline';

  spinner:boolean = false;

  constructor(public userService: UserService, private router:Router)
  {}

  async LogOut()
  {
    this.spinner = true;

    setTimeout(() => {
      this.spinner = false;
            
      this.userService.LogOut()
      .then(()=>{
        this.userService.logueado = false;
        this.router.navigateByUrl('login');
      });
    }, 2000);
  }
}
