import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    nombre: ['oculus', [Validators.required]],
    apellido: ['horus', [Validators.required]],
    email: ['cclagunag@correo.udistrital.edu.co', [Validators.required, Validators.email]],
    password: ['123abc', [Validators.required, Validators.minLength(6)]],
    usuario: ['oculushorus', [Validators.required]]
  });
  
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  register() {
    console.log(this.miFormulario.value);
    const {nombre, apellido, email, password, usuario} = this.miFormulario.value;
    this.authService.registro(nombre, apellido, email, usuario, password).subscribe(ok => {
      if(ok === true){
        this.router.navigate(['/dashboard']);
        Swal.fire('Registrado', ok, 'success');
      } else {
        Swal.fire('Error', ok, 'error');
      }
    });
  }

  

}
