import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlPrefixService } from './url-prefix.service';
import { HttpClient, } from '@angular/common/http';
import { BaseService } from './base.service';

@Injectable()
export class ImageService {

  constructor(protected http: HttpClient, protected urlPrefix: UrlPrefixService, private baseService: BaseService) {

  }

  /** GET image from server */
  getImage(angle: number, maxWidth: number, minHeight: number): Observable<Blob> {
    let query = '';
    query += '?angle=' + angle;
    if (maxWidth > 0) {
      query += '&max_width=' + maxWidth;
    }
    if (minHeight > 0) {
      query += '&max_height=' + minHeight;
    }
    return this.http.get(this.urlPrefix.imageRender + this.baseService.getUrlCurrenObject() + query, {responseType: 'blob'});
  }

  /** GET metadata from the document */
  getMetadataImage(): Observable<Object[]> {
    return this.http.get<Object[]>(this.urlPrefix.metadataImage + this.baseService.getUrlCurrenObject());
  }

  /** Download the image */
  downloadImage() {
    return this.http.get(this.urlPrefix.downloadImage + this.baseService.getUrlCurrenObject(), {responseType: 'blob'});
  }
}
