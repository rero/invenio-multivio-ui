import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlPrefixService } from './url-prefix.service';
import { HttpClient, } from '@angular/common/http';
import { BaseService } from './base.service';

@Injectable()

export class DocumentService {

  constructor(protected http: HttpClient, protected urlPrefix: UrlPrefixService, private baseService: BaseService) {

  }

  /** GET toc from the document */
  getTOC(): Observable<Object[]> {
    return this.http.get<Object[]>(this.urlPrefix.tocDocument + this.baseService.getUrlCurrenObject());
  }

  /** GET find text from the document */
  findText(text: string): Observable<Object[]> {
    return this.http.get<Object[]>(this.urlPrefix.findTextDocument + this.baseService.getUrlCurrenObject() + '?string=' + text);
  }

  /** GET metadata from the document */
  getMetadataDocument(): Observable<Object[]> {
    return this.http.get<Object[]>(this.urlPrefix.metadataDocument + this.baseService.getUrlCurrenObject());
  }

  /** GET metadata from the document */
  getImageFromDocument(nrPage: number, angle: number, maxWidth: number, minHeight: number): Observable<Blob> {
    let query = '';
    if (nrPage !== null) {
      query += '?page_nr=' + nrPage;
    }
    if (angle !== 0) {
      query += '&angle=' + angle;
    }
    if (maxWidth > 0) {
      query += '&max_width=' + maxWidth;
    }
    if (minHeight > 0) {
      query += '&max_height=' + minHeight;
    }
    return this.http.get(this.urlPrefix.imageDocument + this.baseService.getUrlCurrenObject() + query, {responseType: 'blob'});
  }

  /** Download the document */
  downloadDocument() {
    return this.http.get(this.urlPrefix.downloadDocument + this.baseService.getUrlCurrenObject() , {responseType: 'blob'});
  }

}
