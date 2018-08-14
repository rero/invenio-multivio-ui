import { Injectable } from '@angular/core';
import { UrlPrefixService } from './url-prefix.service';
import { HttpClient, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class BaseService {

  protected asMultiplesObjects = false;
  protected structureObject: any;
  protected urlCurrentObject = '';
  protected url = '';
  protected maxPages = 0;
  protected prefixMetadata = '';
  protected prefixPhysical = '';
  protected listTypeObjects: any = [];
  protected physicalInMemory: Object;

  constructor(protected http: HttpClient, protected urlPrefix: UrlPrefixService) { }

  /** GET metadata from json or xml */
  getMetadata(): Observable<Object> {
    // return this.http.get<Object[]>(this.prefixMetadata + this.url);
    // console.log(this.UrlPrefixService, this.url);
  //   const httpOptions = {
  //   headers: new HttpHeaders({
  //     'Accept':  'application/xml'
  //   })
  // };
    return this.http.get<Object[]>(
      this.urlPrefix.invenioAPI + this.url + '/metadata',
      // {
      //   headers: {'Accept': 'application/xml'}
      // }
    );
  }

  /** GET metadata from json or xml */
  getPhysical(): Observable<Object> {
    return this.http.get<Object[]>(this.urlPrefix.invenioAPI + this.url + '/physical');
  }

  /** SET url document from the document for the service */
  setUrlCurrentObject(url: string) {
    this.urlCurrentObject = url;
  }

  /** GET url document from the document for the service */
  getUrlCurrenObject(): string {
    return this.urlCurrentObject;
  }

  /** SET url of document  for the service */
  setUrl(url: string) {
    this.url = url;
    // if (this.url.endsWith('.json')) {
    //   this.prefixMetadata = this.urlPrefix.metadataJSON;
    //   this.prefixPhysical = this.urlPrefix.physicalJSON;
    // } else {
    //   this.prefixMetadata = this.urlPrefix.metadataXML;
    //   this.prefixPhysical = this.urlPrefix.physicalXML;
    // }
  }

  /** GET url json of document from the document for the service */
  getUrl(): string {
    return this.url;
  }

  /** SET max page */
  setMaxPage(pages: number) {
    this.maxPages = pages;
  }

  /** GET max page */
  getMaxPage(): number {
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

  /** SET structure */
  setListTypeObjects(struc: any) {
    this.listTypeObjects = struc;
  }

  /** SET structure */
  getListTypeObjects() {
    return this.listTypeObjects;
  }

  /** SET info about of multiple structure */
  setAsMultipleObjects(isMultiple: boolean) {
    this.asMultiplesObjects = isMultiple;
  }

  /** GET info about struture object */
  getAsMultipleObjects(): boolean {
    return this.asMultiplesObjects;
  }

  /** SET the physical into memory */
  setPhysicalInMemory(data: Object) {
    this.physicalInMemory = data;
  }

  /** GET the physical from memory */
  getPhysicalInMemory(): Object {
    return this.physicalInMemory;
  }
}
