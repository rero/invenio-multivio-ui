import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class UrlPrefixService {

  public tocDocument: string;
  public findText: string;
  public metadataDocument: string;
  public imageDocument: string;

  constructor() { 
    if (environment.production) {

    }
    else{
      this.tocDocument = '/api-pdf/toc/';
      this.findText = '/api-pdf/find/';
      this.metadataDocument = '/api-pdf/metadata/';
      this.imageDocument = '/api-pdf/render/';
    }
  }
}
