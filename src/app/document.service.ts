import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlPrefixService } from './url-prefix.service';
import { HttpClient, } from '@angular/common/http';
import { ImageService } from './image.service';

@Injectable()

export class DocumentService extends ImageService{

  constructor(protected http: HttpClient, protected urlPrefix: UrlPrefixService) { 
    super(http, urlPrefix);
  }

  /** GET toc from the document */
  getTOC(): Observable<Object[]> {
    return this.http.get<Object[]>(this.urlPrefix.tocDocument + this.urlCurrentObject);
  }

  /** GET find text from the document */
  findText(text: string): Observable<Object[]>{
    return this.http.get<Object[]>(this.urlPrefix.findTextDocument + this.urlCurrentObject + '?string='+text);
  }

  /** GET metadata from the document */
  getMetadataDocument(): Observable<Object[]> {
    return this.http.get<Object[]>(this.urlPrefix.metadataDocument + this.urlCurrentObject);
  }

  /** GET metadata from the document */
  getImageFromDocument(nrPage: number, angle: number, maxWidth: number, minHeight:number): Observable<Blob> {
    let query = "";
    if(nrPage != null)
      query += '?page_nr='+nrPage;
    if(angle != 0)
      query += '&angle='+angle;
    if(maxWidth > 0)
      query += '&max_width='+maxWidth;
    if(minHeight > 0)
      query += '&max_height='+minHeight;
    return this.http.get(this.urlPrefix.imageDocument + this.urlCurrentObject+ query, {responseType: 'blob'});
  }

  /** Download the document */
  downloadDocument(){
    return this.http.get(this.urlPrefix.downloadDocument + this.urlCurrentObject, {responseType: 'blob'});
  }
}
