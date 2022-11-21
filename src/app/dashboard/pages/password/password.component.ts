import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUsuario } from 'src/app/auth/interfaces/IUsuario';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  usuario!: IUsuario;
  miFormulario!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.authService.usuario.subscribe(usuario => this.usuario = usuario);
    this.miFormulario = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPasswordConfirm: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
  }

  cambiarPassword() {
    console.log(this.miFormulario.value);
    const { password, newPassword, newPasswordConfirm } = this.miFormulario.value;
    if (newPassword === newPasswordConfirm) {
      this.authService.cambiarPassword(this.usuario.uid, password, newPassword).subscribe(ok => {
        if (ok === true) {
          Swal.fire('Ha Actualizado la contraseña correctamente', ok, 'success');
        } else {
          Swal.fire('Error', ok, 'error');
        }
      });
    } else {
      Swal.fire('Error', 'Las contraseñas nuevas no coinciden', 'error');
    }
  }

}
