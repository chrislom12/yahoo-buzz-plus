import { Component, OnInit } from '@angular/core';
import { ArticleService } from './article.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  articles: string = '';

  article = {
    title: 'Sample Article Title that is longer and says something about pilitics',
    content: `This is a longer sample article. It contains interesting information about a variety of topics. 
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam gravida ante et dolor luctus, nec vestibulum orci volutpat. 
    Donec non vestibulum justo. Vivamus nec eros vel ligula facilisis faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Fusce vel tristique nunc. Vivamus consequat eros vitae varius dignissim. Fusce id eros fermentum, consequat leo vel, tristique nulla. 
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut id lectus nisi. 
    Nulla quis nisl sed urna mollis ultricies. Duis rhoncus vel elit vel volutpat. Donec auctor, elit eget faucibus mattis, quam odio consequat dui, nec vehicula magna tortor non nunc. 
    Proin at velit non orci condimentum efficitur. Duis at justo nisi. Duis vel tortor vel tellus luctus congue. Cras finibus lacus eget est egestas malesuada.`
  };

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.getArticles().subscribe(
      (data: string) => this.articles = data,
      (error: any) => console.error('Error fetching articles', error)
    );
  }

  progressRatio(): string {
    const currentArticle = 1; // Assume we are on the first article
    const totalArticles = 10; // Total number of articles
    const ratio = currentArticle / totalArticles;
    return `${ratio * 100}%`;
  }

  likeArticle() {
    // Logic to handle liking the article
    console.log('Article liked!');
  }

  dislikeArticle() {
    // Logic to handle disliking the article
    console.log('Article disliked!');
  }
}
