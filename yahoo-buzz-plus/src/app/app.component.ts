import { Component, OnInit } from '@angular/core';
import { ArticleService } from './article.service';
import { RecommendationService } from './recommendor.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  articleIndex = 0;
  articleProgress = 1;

  /* article = {
    title:
      'Sample Article Title that is longer and says something about pilitics',
    text: `This is a longer sample article. It contains interesting information about a variety of topics. 
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
  }; */

  article: any;

  allArticles: any;

  preferences: any[] = []; // Initialize preferences as an empty array

  recommendations: any;

  view = 1;

  loading=true;

  constructor(private articleService: ArticleService, private recommendationService: RecommendationService) {}

  ngOnInit(): void {
    this.articleService.getArticles().subscribe(
      (data: any[]) => {
        this.allArticles = data;
        if (this.allArticles.length > 0) {
          console.log(this.allArticles)
          this.article = this.allArticles[0];
          this.loading=false;
          console.log("article incoming")
          console.log(this.article)
        }
      },
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
    const feedback = {"idx": this.article.id, "like": true};
    this.preferences.push(feedback);

    this.checkSend()
    this.articleIndex++;
    this.articleProgress++;
    this.article = this.allArticles[this.articleIndex];
    console.log(this.preferences);
  }

  dislikeArticle() {
    // Logic to handle disliking the article
    const feedback = {"idx": this.article.id, "like": false};

    this.preferences.push(feedback);

    this.checkSend();
    this.articleIndex++;
    this.articleProgress++;

    this.article = this.allArticles[this.articleIndex];
    console.log(this.preferences);
  }

  checkSend(){
    console.log("checking send")
    console.log(this.articleProgress)
    if (this.articleProgress>9){
      this.sendFeedback();
    }
  }

  sendFeedback() {
    const feedback = {
      "recommendations": this.preferences
    };

    console.log("about to send")
    this.loading=true;
    this.recommendationService.getRecommendations(feedback).subscribe(
      (results) => {
        // Handle the results returned from the Flask API
        this.recommendations = results;
        this.view = 2;
        this.loading=false;
        console.log(results);
      },
      (error) => {
        console.error('Error fetching recommendations:', error);
      }
    );
  }

  readMore(index: number) {
    // Do something with the index, such as logging it or performing an action based on it
    this.article = this.recommendations[index];
    this.view=3;
    console.log('Read More button clicked for article index:', index);
  }

  closeView(){
    console.log("close")
    this.view = 2;
  }

}
