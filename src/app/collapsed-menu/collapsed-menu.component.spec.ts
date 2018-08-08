import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { CollapsedMenuComponent } from './collapsed-menu.component';
import { DocumentService } from './../services/document.service';
import { ImageService } from './../services/image.service';
import { BaseService } from './../services/base.service';
import { UrlPrefixService } from './../services/url-prefix.service';


describe('CollapsedMenuComponent', () => {
  let component: CollapsedMenuComponent;
  let baseService: BaseService;
  let documentService: DocumentService;
  let urlPrefix: UrlPrefixService;
  let imageService: ImageService;
  let httpClientSpy: { get: jasmine.Spy };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CollapsedMenuComponent
      ],
      imports: [
        NgZorroAntdModule.forRoot(),
        FormsModule
      ],
      providers: [BaseService, DocumentService, ImageService, UrlPrefixService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    urlPrefix = new UrlPrefixService();
    baseService = new BaseService(<any>httpClientSpy, urlPrefix)
    documentService = new DocumentService(<any>httpClientSpy, urlPrefix, baseService);
    imageService = new ImageService(<any>httpClientSpy, urlPrefix, baseService);
    component = new CollapsedMenuComponent(documentService, imageService, baseService);
  });

  it('component well created', () => {
    expect(component.counter).toEqual(0);
  });


});
