import { Component, OnInit } from '@angular/core';
import { ArticleService } from './article.service';
import { RecommendationService } from './recommendor.service';
import { MisinformationService } from './misinformation.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  articleIndex = 0;
  
  articleProgress = 1;

  article: any;

  allArticles: any;

  preferences: any[] = []; 

  recommendations: any;

  view = 1;

  loading=true;

  misinformationStatus = "Click here to detect misinformation";

  constructor(private articleService: ArticleService, private recommendationService: RecommendationService, private misinformationService: MisinformationService) {}

  ngOnInit(): void {
    this.articleService.getArticles().subscribe(
      (data: any[]) => {
        this.setArticleData(data);
      },
      (error: any) => console.error('Error fetching articles', error)
    );
  }

  setArticleData(data:any) : void{
    this.allArticles = data;
    if (this.allArticles.length > 0) {
      this.article = this.allArticles[0];
      this.loading=false;
    }
  }


  likeArticle() {
    const feedback = {"idx": this.article.id, "like": true};
    this.preferences.push(feedback);

    this.checkSend()
    this.articleIndex++;
    this.articleProgress++;
    this.misinformationStatus = "Click here to detect misinformation";
    this.article = this.allArticles[this.articleIndex];
  }

  dislikeArticle() {
    const feedback = {"idx": this.article.id, "like": false};

    this.preferences.push(feedback);

    this.checkSend();
    this.articleIndex++;
    this.articleProgress++;
    this.misinformationStatus = "Click here to detect misinformation";
    this.article = this.allArticles[this.articleIndex];
  }

  checkSend(){
    if (this.articleProgress>9){
      this.sendFeedback();
    }
  }

  sendFeedback() {
    const feedback = {
      "recommendations": this.preferences
    };

    this.loading=true;
    this.recommendationService.getRecommendations(feedback).subscribe(
      (results) => {
        this.receiveRecommendations(results);
      },
      (error) => {
        console.error('Error fetching recommendations:', error);
      }
    );
  }

  receiveRecommendations(data: any): void {
    this.recommendations = data;
    this.view = 2;
    this.loading=false;
  }
  readMore(index: number) {
    this.article = this.recommendations[index];
    this.view=3;
    console.log('Read More button clicked for article index:', index);
  }

  closeView(){
    this.view = 2;
    this.misinformationStatus = "Click here to detect misinformation";
  }

  receiveMisinformation(data:any){
    this.misinformationStatus = "The article might be: " + data.prediction;
  }

  detectMisinformation(){

    const currContent = {
      "text": this.article.title + this.article.text
    };

    this.misinformationService.detectMisinformation(currContent).subscribe(
      (results) => {
        this.receiveMisinformation(results);
      },
      (error) => {
        console.error('Error fetching misinformation detection result:', error);
      }
    );

  }

}
