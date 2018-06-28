import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class UrlPrefixService {

  public tocURL: string;
  public findText: string;

  constructor() { 
    if (environment.production) {

    }
    else{
      this.tocURL = '/api-pdf/toc/';
      this.findText = '/api-pdf/find/';
    }
  }
}
