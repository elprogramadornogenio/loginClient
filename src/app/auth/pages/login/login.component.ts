import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    usuario: ['oculushorus', [Validators.required]],
    password: ['123abc', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  login() {
    console.log(this.miFormulario.value);
    const {usuario, password} = this.miFormulario.value;
    this.authService.login(usuario, password).subscribe(ok=>{
      if(ok === true){
        this.router.navigate(['/dashboard']);
        Swal.fire('Ha Ingresado correctamente', "" , 'success');
      } else {
        Swal.fire('Error', ok, 'error');
      }
    })
  }

  ngOnInit(): void {
  }

}
