import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, ReplaySubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { IAuthResponse } from '../interfaces/IAuthResponse';
import { IUsuario } from '../interfaces/IUsuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: IUsuario;
  private observableUsuario: ReplaySubject<IUsuario>;
  private observableUsuario$: Observable<IUsuario>;

  get usuario() {
    return this.observableUsuario$;
  }

  constructor(private http: HttpClient) {
    this.observableUsuario = new ReplaySubject<IUsuario>(1);
    this.observableUsuario$ = this.observableUsuario.asObservable();
    if (localStorage.getItem('usuario')) {
      this._usuario = JSON.parse(localStorage.getItem('usuario')!);
      this.observableUsuario.next(this._usuario);
    }
  }

  registro(nombre: string, apellido: string, email: string, usuario: string, password: string) {
    const url = `${this.baseUrl}/registrar`;
    const body = {
      nombre,
      apellido,
      email,
      usuario,
      password
    };

    return this.http.post<IAuthResponse>(url, body).pipe(
      tap(resp => {
        console.log(resp);
        if (resp.ok) {
          localStorage.setItem('token', resp.token!);
          this._usuario = {
            uid: resp.uid!,
            usuario: resp.usuario!,
            nombre: resp.nombre!,
            apellido: resp.apellido!,
            email: resp.email!,
            imagen: resp.imagen
          };
          this.observableUsuario.next(this._usuario);
          localStorage.setItem('usuario', JSON.stringify(this._usuario));
        }
      }),
      map((resp: IAuthResponse) => {
        return resp.ok;
      }),
      catchError(err => of(err.error.msg))
    );
  }

  login(usuario: string, password: string) {
    const url = `${this.baseUrl}/login`;
    const body = {
      usuario,
      password
    };
    return this.http.post<IAuthResponse>(url, body).pipe(
      tap(resp => {
        if (resp.ok) {
          localStorage.setItem('token', resp.token!);
          this._usuario = {
            uid: resp.uid!,
            usuario: resp.usuario!,
            nombre: resp.nombre!,
            apellido: resp.apellido!,
            email: resp.email!,
            imagen: resp.imagen
          };
          this.observableUsuario.next(this._usuario);
          localStorage.setItem('usuario', JSON.stringify(this._usuario));
        }
      }),
      map((resp: IAuthResponse) => {
        return resp.ok;
      }),
      catchError(err => of(err.error.msg))
    );
  }

  editar(_id: string, nombre: string, apellido: string, email: string, usuario: string) {

    if (localStorage.getItem('token')) {
      const url = `${this.baseUrl}/editar`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      });
      const options = { headers: headers };
      const body = {
        _id,
        nombre,
        apellido,
        email,
        usuario
      };
      return this.http.post<IAuthResponse>(url, body, options).pipe(
        tap(resp => {
          if (resp.ok) {
            this._usuario = {
              uid: _id,
              usuario: usuario,
              nombre: nombre,
              apellido: apellido,
              email: email,
              imagen: this._usuario.imagen
            };
            this.observableUsuario.next(this._usuario);
            localStorage.setItem('usuario', JSON.stringify(this._usuario));
          }
        }),
        map((resp: IAuthResponse) => {
          return resp.ok;
        }),
        catchError(err => of(err.error.msg))
      );
    } else {
      return of(false).pipe(
        catchError(err => of('no ha iniciado sección'))
      );
    }
  }

  subirFoto(id: string, imagen: File) {
    if (localStorage.getItem('token')) {
      const url = `${this.baseUrl}/editarImagen/${id}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      });
      const options = { headers: headers };
      let formData = new FormData();
      formData.append("imagen", imagen);
      return this.http.post<IAuthResponse>(url, formData, options).pipe(
        tap(resp => {
          if (resp.ok) {
            this._usuario = {
              uid: this._usuario.uid,
              usuario: this._usuario.usuario!,
              nombre: this._usuario.nombre!,
              apellido: this._usuario.apellido!,
              email: this._usuario.email!,
              imagen: resp.imagen
            };
            this.observableUsuario.next(this._usuario);
            localStorage.setItem('usuario', JSON.stringify(this._usuario));
          }
        }),
        map(resp => {
          return resp.ok;
        }),
        catchError(err => of(err.error.msg))
      );
    } else {
      return of(false).pipe(
        catchError(err => of('no ha iniciado sección'))
      );
    }
  }

  cambiarPassword(_id: string, password: string, newPassword: string) {
    if (localStorage.getItem('token')) {
      const url = `${this.baseUrl}/cambiarPassword`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      });
      const options = { headers: headers };
      const body = {
        _id,
        password,
        newPassword
      };

      return this.http.post<IAuthResponse>(url, body, options).pipe(
        map(resp => {
          return resp.ok;
        }),
        catchError(err => of(err.error.msg))
      );
    } else {
      return of(false).pipe(
        catchError(err => of('no ha iniciado sección'))
      );
    }
  }

  recuperarPassword(usuario: string, email: string) {

    const url = `${this.baseUrl}/RecuperarPassword`;
    const body = {
      usuario,
      email
    };

    return this.http.post<IAuthResponse>(url, body).pipe(
      map(resp => {
        return resp.ok;
      }),
      catchError(err => of(err.error.msg))
    );
  }

  validarToken() {
    if (localStorage.getItem('token')) {
      const url = `${this.baseUrl}/revalidarToken`;
      const body = {}
      const headers = new HttpHeaders({
        'authorization': `Bearer ${localStorage.getItem('token')}`
      });
      return this.http.post<IAuthResponse>(url, body,  { headers }).pipe(
        map(resp => {
          localStorage.setItem('token', resp.token!);
          console.log(resp);
          this._usuario = {
            uid: resp.uid!,
            nombre: resp.nombre!,
            apellido: resp.apellido!,
            email: this._usuario.email!,
            usuario: this._usuario.usuario!,
            imagen: this._usuario.imagen
          }
          this.observableUsuario.next(this._usuario);
          localStorage.setItem('usuario', JSON.stringify(this._usuario));
          return resp.ok;
        }),
        catchError(err => of(err.error.msg))
      );
    } else {
      return of(false).pipe(
        catchError(err => of('no ha iniciado sección'))
      );
    }
  }

  logout() {
    localStorage.clear();
  }
}

