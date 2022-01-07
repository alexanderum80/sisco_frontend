import { toNumber } from 'lodash';
import { supervisoresApi } from './../graphql/supervisores-api';
import { UsuarioService } from './../../../shared/services/usuario.service';
import { Apollo } from 'apollo-angular';
import { SupervisoresQueryResponse, SupervisoresMutationResponse, ISupervisor } from './../models/supervisores.model';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SupervisoresService {

  fg = new FormGroup({
    idSupervisor: new FormControl(''),
    supervisor: new FormControl(''),
    cargo: new FormControl(''),
    division: new FormControl(''),
  });

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
    private _usuarioSvc: UsuarioService,
  ) { }

  loadAllSupervisores(): Observable<SupervisoresQueryResponse> {
    return new Observable<SupervisoresQueryResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.watchQuery<SupervisoresQueryResponse>({
          query: supervisoresApi.all,
          fetchPolicy: 'network-only'
        }).valueChanges.subscribe(response => {
          subscriber.next(response.data);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  loadSupervisorById(id: number): Observable<SupervisoresQueryResponse> {
    return new Observable<SupervisoresQueryResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.query<SupervisoresQueryResponse>({
          query: supervisoresApi.byId,
          variables: { id },
          fetchPolicy: 'network-only'
        }).subscribe(response => {
          subscriber.next(response.data);
          subscriber.complete();
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  save(): Observable<SupervisoresMutationResponse> {
    return new Observable<SupervisoresMutationResponse>(subscriber => {
      try {
        const supervisorInfo: ISupervisor = {
          IdSupervisor: toNumber(this.fg.controls['idSupervisor'].value),
          Supervisor: this.fg.controls['supervisor'].value,
          IdCargo: this.fg.controls['cargo'].value,
          IdDivision: toNumber(this.fg.controls['division'].value),
        };

        const mutation = supervisorInfo.IdSupervisor === 0 ? supervisoresApi.create : supervisoresApi.update;

        this.subscription.push(this._apollo.mutate<SupervisoresMutationResponse>({
          mutation: mutation,
          variables: { supervisorInfo },
          refetchQueries: ['GetAllSupervisores']
        }).subscribe(response => {
          subscriber.next(response.data || undefined);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  delete(IDs: number[]): Observable<SupervisoresMutationResponse> {
    return new Observable<SupervisoresMutationResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.mutate<SupervisoresMutationResponse>({
          mutation: supervisoresApi.delete,
          variables: { IDs },
          refetchQueries: ['GetAllSupervisores']
        }).subscribe(response => {
          subscriber.next(response.data || undefined);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}
