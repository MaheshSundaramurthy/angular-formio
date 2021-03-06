import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { FormioForm } from './formio.common';
/* tslint:disable */
const Formio = require('formiojs');
/* tslint:enable */

export class FormioService {
  public formio: any;
  constructor(public url: string, public options?: object) {
    this.formio = new Formio(this.url, this.options);
  }
  requestWrapper(fn: any) {
    let record: any;
    let called: boolean = false;
    return Observable.create((observer: Observer<any>) => {
      try {
        if (!called) {
          called = true;
          fn()
            .then((_record: any) => {
              record = _record;
              observer.next(record);
              observer.complete();
            })
            .catch((err: any) => observer.error(err));
        } else if (record) {
          observer.next(record);
          observer.complete();
        }
      } catch (err) {
        observer.error(err);
      }
    });
  }
  saveForm(form: FormioForm): Observable<FormioForm> {
    return this.requestWrapper(() => this.formio.saveForm(form));
  }
  loadForm(): Observable<FormioForm> {
    return this.requestWrapper(() => this.formio.loadForm());
  }
  loadSubmission(): Observable<{}> {
    return this.requestWrapper(() => this.formio.loadSubmission());
  }
  saveSubmission(submission: {}): Observable<{}> {
    return this.requestWrapper(() => this.formio.saveSubmission(submission));
  }
  loadSubmissions(): Observable<{}> {
    return this.requestWrapper(() => this.formio.loadSubmissions());
  }
}
