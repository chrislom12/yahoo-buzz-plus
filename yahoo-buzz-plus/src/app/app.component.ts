import { Component, OnInit } from '@angular/core';
import { ArticleService } from './article.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  articles: string = '';

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.getArticles().subscribe(
      (data: string) => this.articles = data,
      (error: any) => console.error('Error fetching articles', error)
    );
  }
}
