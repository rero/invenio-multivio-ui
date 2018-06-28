import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UrlPrefixService } from './url-prefix.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()

export class DocumentService {

  constructor(private http: HttpClient,
    private urlPrefix: UrlPrefixService) { }

    /** GET toc from the document */
    getTOC(urlDocument: string): Observable<Object[]> {
      return this.http.get<Object[]>(this.urlPrefix.tocDocument + urlDocument);
    }

    /** GET find text from the document */
    findText(text: string, urlDocument: string): Observable<Object[]>{
      return this.http.get<Object[]>(this.urlPrefix.findText + urlDocument + '?string='+text);
    }

    /** GET metadata from the document */
    getMetadata(urlDocument: string): Observable<Object[]> {
      return this.http.get<Object[]>(this.urlPrefix.metadataDocument + urlDocument);
    }
}
