import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class UrlPrefixService {

  public tocDocument: string;
  public findTextDocument: string;
  public metadataDocument: string;
  public imageDocument: string;
  public downloadDocument: string;
  public metadataJSON: string;
  public physicalJSON: string;
  public metadataXML: string;
  public physicalXML: string;
  public imageRender: string;
  public metadataImage: string;
  public image: string;
  public downloadImage: string;


  constructor() { 
    if (environment.production) {

    }
    else{
      //URL's Document
      this.tocDocument = '/api-pdf/toc/';
      this.findTextDocument = '/api-pdf/find/';
      this.metadataDocument = '/api-pdf/metadata/';
      this.imageDocument = '/api-pdf/render/';
      this.downloadDocument = '/api-pdf/download/';
      //URL's JSON
      this.metadataJSON = '/api-json/metadata/';
      this.physicalJSON = '/api-json/physical/';
      //URL's XML
      this.metadataXML = '/api-xml/metadata/';
      this.physicalXML = '/api-xml/physical/';
      //URL's Image
      this.imageRender = '/api-image/render/';
      this.metadataImage = '/api-image/metadata/';
      this.downloadImage = '/api-image/download/';
    }
  }
}
