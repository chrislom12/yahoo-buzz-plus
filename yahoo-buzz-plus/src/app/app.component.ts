import { Component, OnInit } from '@angular/core';
import { ArticleService } from './article.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  articleIndex = 0;
  articleProgress = 1;
  articles: string = '';

  article = {
    title:
      'Sample Article Title that is longer and says something about pilitics',
    content: `This is a longer sample article. It contains interesting information about a variety of topics. 
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam gravida ante et dolor luctus, nec vestibulum orci volutpat. 
    Donec non vestibulum justo. Vivamus nec eros vel ligula facilisis faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Fusce vel tristique nunc. Vivamus consequat eros vitae varius dignissim. Fusce id eros fermentum, consequat leo vel, tristique nulla. 
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut id lectus nisi. 
    Nulla quis nisl sed urna mollis ultricies. Duis rhoncu
    um justo. Vivamus nec eros vel ligula facilisis faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Fusce vel tristique nunc. Vivamus consequat eros vitae varius dignissim. Fusce id eros fermentum, consequat leo vel, tristique nulla. 
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut id lectus nisi. 
    Nulla quis nisl sed urna mollis ultricies. Duis rhoncus vel elit vel vols vel elit vel volutpat. Donec auctor, elit eget faucibus mattis, quam odio consequat dui, nec vehicula magna tortor non nunc. 
    Proin at velit non orci condimentum efficitur. Duis at justo nisi. Duis vel tortor vel tellus luctus congue. Cras finibus lacus eget est egestas malesuada.`,
    date: '2024-05-21',
    link: 'https://news.yahoo.com/raisi-death-threatens-instability-iran-174728884.html',
  };

  allArticles = [
    {
      title: 'Politics in the Modern Age: An In-Depth Analysis',
      content: `This article explores the complexities of modern politics, touching on key issues such as partisanship, policy-making, and international relations. 
      The political landscape has undergone significant changes over
      um justo. Vivamus nec eros vel ligula facilisis faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Fusce vel tristique nunc. Vivamus consequat eros vitae varius dignissim. Fusce id eros fermentum, consequat leo vel, tristique nulla. 
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut id lectus nisi. 
    Nulla quis nisl sed urna mollis ultricies. Duis rhoncus vel elit vel vol
    um justo. Vivamus nec eros vel ligula facilisis faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Fusce vel tristique nunc. Vivamus consequat eros vitae varius dignissim. Fusce id eros fermentum, consequat leo vel, tristique nulla. 
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut id lectus nisi. 
    Nulla quis nisl sed urna mollis ultricies. Duis rhoncus vel elit vel vol the past few decades, with new challenges emerging on the global stage.`,
      date: '2024-05-21',
      link: 'https://news.yahoo.com/raisi-death-threatens-instability-iran-174728884.html',
    },
    {
      title: 'Politics in the Modern Age: An In-Depth Analysis',
      content: `This article explores the complexities of modern politics, touching on key issues such as partisanship, policy-making, and international relations. 
      The political landscape has undergone significant changes over
      um justo. Vivamus nec eros vel ligula facilisis faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Fusce vel tristique nunc. Vivamus consequat eros vitae varius dignissim. Fusce id eros fermentum, consequat leo vel, tristique nulla. 
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut id lectus nisi. 
    Nulla quis nisl sed urna mollis ultricies. Duis rhoncus vel elit vel vol
    um justo. Vivamus nec eros vel ligula facilisis faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Fusce vel tristique nunc. Vivamus consequat eros vitae varius dignissim. Fusce id eros fermentum, consequat leo vel, tristique nulla. 
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut id lectus nisi. 
    Nulla quis nisl sed urna mollis ultricies. Duis rhoncus vel elit vel vol the past few decades, with new challenges emerging on the global stage.`,
      date: '2014-07-21',
      link: 'https://www.yahoo.com/news/us-lashes-israeli-officials-targeted-211416314.html',
    },
    {
      title: 'Climate Change: Understanding the Crisis',
      content: `Climate change is one of the most pressing issues of our time. This article discusses the science behind climate change, its effects on the environment, and potential solutions to mitigate its Nulla quis nisl sed urna mollis ultricies. Duis rhoncus vel elit vel vol the past few decades, with new challenges emerging on the global stage.`,
      date: '2024-05-56',
      link: 'https://news.yahoo.com/raisi-death-threatens-instability-iran-174728884.html',
    },
    {
      title: 'Healthcare Innovations: What to Expect in the Future',
      content: `The healthcare industry is constantly evolving with new technologies and treatments. This article explores the latest innovations in healthcare and what they mean for patients and providNulla quis nisl sed urna mollis ultricies. Duis rhoncus vel elit vel vol the past few decades, with new challenges emerging on the global stage.`,
      date: '2024-02-21',
      link: 'https://news.yahoo.com/raisi-death-threatens-instability-iran-174728884.html',
    },
  ];

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.getArticles().subscribe(
      (data: string) => (this.articles = data),
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
    this.articleIndex++;
    this.articleProgress++;
    this.article = this.allArticles[this.articleIndex];
    console.log('Article liked!');
  }

  dislikeArticle() {
    // Logic to handle disliking the article
    this.articleIndex++;
    this.articleProgress++;

    this.article = this.allArticles[this.articleIndex];
    console.log('Article disliked!');
  }
}
