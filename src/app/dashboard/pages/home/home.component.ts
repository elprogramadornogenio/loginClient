import { Component, OnInit } from '@angular/core';
import { IUsuario } from 'src/app/auth/interfaces/IUsuario';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuario!: IUsuario;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.usuario.subscribe(usuario=> this.usuario = usuario);
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

}
