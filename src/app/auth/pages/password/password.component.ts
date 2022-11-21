import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    usuario: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
  }

  recuperarPassword() {
    const { usuario, email } = this.miFormulario.value;
    this.authService.recuperarPassword(usuario, email).subscribe(ok => {
      if (ok === true) {
        Swal.fire(`Recuperación`, `Se ha enviado un correo a la dirección ${email}`, 'success');
      } else {
        Swal.fire('Error', ok, 'error');
      }
    })
  }

}
