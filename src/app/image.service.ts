import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlPrefixService } from './url-prefix.service';
import { HttpClient, } from '@angular/common/http';

@Injectable()
export class ImageService{

  constructor(protected http: HttpClient, protected urlPrefix: UrlPrefixService) { }
  
  protected asMultiplesObjects: boolean = false;
  protected structureObject: any;
  protected urlCurrentObject: string = '';
  protected url: string = '';
  protected maxPages: number = 0;
  protected prefixMetadata: string = '';
  protected prefixPhysical: string = '';
  
  /** GET image from server */
  getImage(angle: number, maxWidth: number, minHeight:number): Observable<Blob> {
    let query = "";
    query += '?angle='+angle;
    if(maxWidth > 0)
      query += '&max_width='+maxWidth;
    if(minHeight > 0)
      query += '&max_height='+minHeight;
    return this.http.get(this.urlPrefix.imageRender + this.urlCurrentObject+ query, {responseType: 'blob'});
  }

  /** GET metadata from the document */
  getMetadataImage(): Observable<Object[]> {
    return this.http.get<Object[]>(this.urlPrefix.metadataImage + this.urlCurrentObject);
  }

  /** Download the image */
  downloadImage(){
    return this.http.get(this.urlPrefix.downloadImage + this.urlCurrentObject, {responseType: 'blob'});
  }
  
  /** GET metadata from json or xml */
  getMetadata(): Observable<Object> {
    return this.http.get<Object[]>(this.prefixMetadata + this.url);
  }

  /** GET metadata from json or xml */
  getPhysical(): Observable<Object> {
    return this.http.get<Object[]>(this.prefixPhysical + this.url);
  }

  /** SET url document from the document for the service */
  setUrlCurrentObject(url: string){
    this.urlCurrentObject = url;
  }

  /** GET url document from the document for the service */
  getUrlCurrenObject(): string{
    return this.urlCurrentObject;
  }

  /** SET url of document  for the service */
  setUrl(url: string){
    this.url = url;
    if (this.url.endsWith(".json/")){
      this.prefixMetadata = this.urlPrefix.metadataJSON;
      this.prefixPhysical = this.urlPrefix.physicalJSON
    }
    else{
      this.prefixMetadata = this.urlPrefix.metadataXML;
      this.prefixPhysical = this.urlPrefix.physicalXML;
    }
  }

  /** GET url json of document from the document for the service */
  getUrl(): string{
    return this.url;
  }

  /** SET max page */
  setMaxPage(pages: number){
    this.maxPages = pages;
  }

  /** GET max page */
  getMaxPage(): number{
    return this.maxPages;
  }

  /** SET structure */
  setStructureObject(struc: any) {
    this.structureObject = struc;
  }

  /** SET structure */
  getStructureObject() {
    return this.structureObject;
  }

  /** SET info about of multiple structure */
  setAsMultipleOnjects(isMultiple: boolean){
    this.asMultiplesObjects = isMultiple;
  }

  /** GET info about struture object */
  getAsMultipleOnjects(): boolean {
    return this.asMultiplesObjects;
  }
}
