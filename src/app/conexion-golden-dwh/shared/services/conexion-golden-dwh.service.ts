import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'platform'
})
export class ConexionGoldenDwhService {

  fg: FormGroup = new FormGroup({
    idUnidad: new FormControl(''),
    dwh_ip: new FormControl(''),
    dwh_usuario: new FormControl(''),
    dwh_contrasena: new FormControl(''),
    dwh_baseDatos: new FormControl(''),
    rest_ip: new FormControl(''),
    rest_usuario: new FormControl(''),
    rest_contrasena: new FormControl(''),
    rest_baseDatos: new FormControl(''),
  });
  constructor() { }
}
