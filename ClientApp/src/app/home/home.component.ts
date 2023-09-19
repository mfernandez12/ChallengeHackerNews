import { HttpClient } from '@angular/common/http';
import { Inject, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { environment } from '../../environments/environment';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  hackerNewsData: any[] = [];
  pagedItems: any[] = [];
  itemsPerPage: number = 10;
  p: number = 1;
  totalNews: any;
  searchText = '';
  loading: boolean = true;
  apiUrl: string = '';

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.apiUrl = `${environment.apiBaseUrl}/api/hackernews/new-stories`;
    console.log(this.apiUrl);
  }

  ngOnInit(): void {
    this.http.get<any[]>(this.apiUrl).pipe(
      timeout(150000)
    )
      .subscribe(data => {
        this.hackerNewsData = data;
        this.totalNews = data.length;
        this.pagedItems = data;
        this.loading = false;
      });
  }

  filterByTitle(): void {
    this.pagedItems = this.hackerNewsData.filter((item =>
      item.title.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.hackerNewsData.length);
    this.pagedItems = this.hackerNewsData.slice(startIndex, endIndex);
    this.p = page;
  }

  get totalPages(): number {
    return Math.ceil(this.hackerNewsData.length / this.itemsPerPage);
  }
}
