import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlPrefixService } from './url-prefix.service';
import { HttpClient, } from '@angular/common/http';

@Injectable()

export class DocumentService {

  private urlDocument: string = '';
  private maxPagesDocument: number = 0;

  constructor(private http: HttpClient, private urlPrefix: UrlPrefixService) { }

  /** GET toc from the document */
  getTOC(): Observable<Object[]> {
    return this.http.get<Object[]>(this.urlPrefix.tocDocument + this.urlDocument);
  }

  /** GET find text from the document */
  findText(text: string): Observable<Object[]>{
    return this.http.get<Object[]>(this.urlPrefix.findText + this.urlDocument + '?string='+text);
  }

  /** GET metadata from the document */
  getMetadata(): Observable<Object[]> {
    return this.http.get<Object[]>(this.urlPrefix.metadataDocument + this.urlDocument);
  }

  /** GET metadata from the document */
  getImageFromPage(nrPage: number, angle: number, maxWidth: number, minHeight:number): Observable<Blob> {
    let query = "";
    if(nrPage != null)
      query += '?page_nr='+nrPage;
    if(angle != 0)
      query += '&angle='+angle;
    if(maxWidth > 0)
      query += '&max_width='+maxWidth;
    if(minHeight > 0)
      query += '&max_height='+minHeight;
    return this.http.get(this.urlPrefix.imageDocument + this.urlDocument+ query, {responseType: 'blob'});
  }

  /** Download the document */
  downloadDocument(){
    return this.http.get(this.urlPrefix.downloadDocument + this.urlDocument, {responseType: 'blob'});
  }

  /** SET url document from the document for the service */
  setUrlDocument(url: string){
    this.urlDocument = url;
  }

  /** GET url document from the document for the service */
  getUrlDocument(): string{
    return this.urlDocument;
  }

  /** SET max page document */
  setMaxPageDocument(pages: number){
    this.maxPagesDocument = pages;
  }

  /** GET max page document */
  getMaxPageDocument(): number{
    return this.maxPagesDocument;
  }



    
}
