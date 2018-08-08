
import { ImageService } from './image.service';
import { BaseService } from './base.service';
import { UrlPrefixService } from './url-prefix.service';

let httpClientSpy: { get: jasmine.Spy };
let service: BaseService;
let urlPrefix: UrlPrefixService;
let imageService: ImageService;

beforeEach(() => {
  // TODO: spy on other methods too
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  urlPrefix = new UrlPrefixService();
  service = new BaseService(<any>httpClientSpy, urlPrefix);
  imageService = new ImageService(<any>httpClientSpy, urlPrefix, service);
});

it('should return expected metadata (HttpClient called once)', () => {
  let resp = 'data/json/multi-image.json/';
  httpClientSpy.get.and.returnValue(resp);
  service.setUrl('data/json/multi-image.json/');
  let data = service.getUrl();
  expect(data).toEqual(resp, 'expected url');
});