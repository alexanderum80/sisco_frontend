import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { EpigrafesApi as epigrafesApi } from './../graphql/epigrafes.actions';
import { EpigrafesQueryResponse, EpigrafesMutationResponse } from './../models/epigrafes.model';
import { Apollo } from 'apollo-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

@Injectable()
export class EpigrafesService {
  fg: FormGroup = new FormGroup({
    idEpigrafe: new FormControl(0),
    epigrafe: new FormControl(''),
  });

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
    private _usuarioSvc: UsuarioService,
  ) { }

  hasAdvancedUserPermission(): boolean {
    return this._usuarioSvc.hasAdvancedUserPermission();
  }

  loadAllEpigrafes(): Observable<EpigrafesQueryResponse> {
    return new Observable<EpigrafesQueryResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.watchQuery<EpigrafesQueryResponse>({
          query: epigrafesApi.all,
          fetchPolicy: 'network-only'
        }).valueChanges.subscribe(res => {
          subscriber.next(res.data);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  loadEpigrafeById(id: number): Observable<EpigrafesQueryResponse> {
    return new Observable<EpigrafesQueryResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.watchQuery<EpigrafesQueryResponse>({
          query: epigrafesApi.byId,
          variables: { id },
          fetchPolicy: 'network-only'
        }).valueChanges.subscribe(response => {
          subscriber.next(response.data);
          subscriber.complete();
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  save(): Observable<EpigrafesMutationResponse> {
    return new Observable<EpigrafesMutationResponse>(subscriber => {
      try {
        const epigrafeInfo = {
          IdEpigafre: this.fg.controls['idEpigrafe'].value,
          Epigrafe: this.fg.controls['epigrafe'].value,
        };

        const mutation = epigrafeInfo.IdEpigafre === 0 ? epigrafesApi.create :  epigrafesApi.update;

        this.subscription.push(this._apollo.mutate<EpigrafesMutationResponse>({
          mutation: mutation,
          variables: { epigrafeInfo },
          refetchQueries: ['GetAllEpigrafes']
        }).subscribe(response => {
          subscriber.next(response.data || undefined);
        }));
      } catch (err: any) {
        subscriber.error(err);
      }
    });
  }

  delete(IDs: number[]): Observable<EpigrafesMutationResponse> {
    return new Observable<EpigrafesMutationResponse>(subscriber => {
      try {
        this.subscription.push(this._apollo.mutate<EpigrafesMutationResponse>({
          mutation: epigrafesApi.delete,
          variables: { IDs },
          refetchQueries: ['GetAllEpigrafes']
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
