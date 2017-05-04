import { Injectable }              from '@angular/core';
import { Http, Response, Headers, RequestOptions }          from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../app/app.settings';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class Services {
  private profileURL = AppSettings.API_URL + 'profile';
  
  constructor (private http: Http) {
    
  }

  register(userData): Observable<any[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.profileURL, userData, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  update(userData): Observable<any[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let url = `${this.profileURL}/${userData.aid}`;
    
    return this.http.put(url, userData, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  
  private extractData(response: Response | any) {
    return response.json();
  }

  private handleError (error : Response | any) {
    let errMsg: string;

    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    return Observable.throw(errMsg);
  }
}
