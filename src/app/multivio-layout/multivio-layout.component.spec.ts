import { async, TestBed } from '@angular/core/testing';
import { DocumentService } from './../services/document.service';
import { ImageService } from './../services/image.service';
import { BaseService } from './../services/base.service';
import { UrlPrefixService } from './../services/url-prefix.service';
import { MultivioLayoutComponent } from './multivio-layout.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { BottomMenuComponent } from './../bottom-menu/bottom-menu.component';
import { ContentComponent } from './../content/content.component';
import { CollapsedMenuComponent } from './../collapsed-menu/collapsed-menu.component';

describe('MultivioLayoutComponent', () => {
  let component: MultivioLayoutComponent;
  let baseService: BaseService;
  let documentService: DocumentService;
  let urlPrefix: UrlPrefixService;
  let imageService: ImageService;
  let httpClientSpy: { get: jasmine.Spy };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BottomMenuComponent,
        ContentComponent,
        MultivioLayoutComponent,
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
    component = new MultivioLayoutComponent(documentService, imageService, baseService);
  });

  it('component well created', () => {
    expect(component.currentPage).toEqual(1);
  });




});
