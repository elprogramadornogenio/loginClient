export interface IAuthResponse {
    ok: boolean;
    uid?: string;
    usuario?: string;
    email?: string;
    nombre?: string;
    apellido?: string;
    imagen?: string;
    token?: string;
    msg?: string;
}
