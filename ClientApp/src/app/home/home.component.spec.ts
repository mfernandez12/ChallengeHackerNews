import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxPaginationModule],
      declarations: [HomeComponent],
      providers: [
        { provide: 'BASE_URL', useValue: 'https://localhost:7139' },
      ],
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch hacker news data and populate pagedItems', fakeAsync(() => {
    const dummyData = [{ title: 'News 1' }, { title: 'News 2' }, { title: 'News 3' }];
    component.ngOnInit();

    const req = httpTestingController.expectOne('https://localhost:7139/api/hackernews/new-stories');
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);

    tick();

    expect(component.hackerNewsData).toEqual(dummyData);
    expect(component.totalNews).toBe(dummyData.length);
    expect(component.pagedItems).toEqual(dummyData);
    expect(component.loading).toBe(false);
  }));

  it('should filter hacker news data by title', () => {
    const dummyData = [
      { title: 'News 1' },
      { title: 'News 2' },
      { title: 'News 3' },
    ];
    component.hackerNewsData = dummyData;
    component.searchText = 'News 2';

    component.filterByTitle();

    expect(component.pagedItems).toEqual([{ title: 'News 2' }]);
  });

  it('should set the current page and update pagedItems', () => {
    const dummyData = [
      { title: 'News 1' },
      { title: 'News 2' },
      { title: 'News 3' },
      { title: 'News 4' },
      { title: 'News 5' },
    ];
    component.hackerNewsData = dummyData;
    component.totalNews = dummyData.length;

    component.setPage(2);

    expect(component.p).toBe(2);
    expect(component.pagedItems).toEqual([{ title: 'News 3' }, { title: 'News 4' }]);
  });

  it('should not set the current page if it is out of bounds', () => {
    const dummyData = [
      { title: 'News 1' },
      { title: 'News 2' },
    ];
    component.hackerNewsData = dummyData;
    component.totalNews = dummyData.length;

    component.setPage(-1);

    expect(component.p).toBe(1);

    component.setPage(5);

    expect(component.p).toBe(1);
  });

  it('should calculate total pages correctly', () => {
    const dummyData = [
      { title: 'News 1' },
      { title: 'News 2' },
      { title: 'News 3' },
    ];
    component.hackerNewsData = dummyData;
    component.itemsPerPage = 2;

    const totalPages = component.totalPages;

    expect(totalPages).toBe(2);
  });
});
