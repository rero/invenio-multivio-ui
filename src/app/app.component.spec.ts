import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularResizedEventModule } from 'angular-resize-event';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule} from 'ng-zorro-antd';
import { BottomMenuComponent } from './bottom-menu/bottom-menu.component';
import { ContentComponent } from './content/content.component';
import { MultivioLayoutComponent } from './multivio-layout/multivio-layout.component';
import { CollapsedMenuComponent } from './collapsed-menu/collapsed-menu.component';
import { DocumentService } from './services/document.service';
import { ImageService } from './services/image.service';
import { BaseService } from './services/base.service';
import { UrlPrefixService } from './services/url-prefix.service';
import { InViewportModule } from 'ng-in-viewport';
import { async, TestBed } from '@angular/core/testing';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        BottomMenuComponent,
        ContentComponent,
        MultivioLayoutComponent,
        CollapsedMenuComponent,
      ],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        NgZorroAntdModule.forRoot(),
        AngularResizedEventModule,
        InViewportModule
      ],
      providers: [BaseService, DocumentService, ImageService, UrlPrefixService]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
