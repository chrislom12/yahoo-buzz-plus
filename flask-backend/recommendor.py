import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import json

from shared import cosine_similarities, ds

def aggregateRecommendation(total_similarity_scores):
    sorted_similarity_scores = sorted(total_similarity_scores.items(), key=lambda x: x[1], reverse=True)
    articles = []
    for rank, (article_idx, similarity_score) in enumerate(sorted_similarity_scores[:10], 1):
        article_details = {
            "title": ds['title'].iloc[article_idx],
            "link": ds['link'].iloc[article_idx],
            "date": ds['date'].iloc[article_idx],
            "text": ds['text'].iloc[article_idx],
            "total_score": similarity_score
        }
        articles.append(article_details)
    return json.dumps(articles, indent=4)

def recommendation(idx, like, total_similarity_scores):
    similarity_score = list(enumerate(cosine_similarities[idx]))
    similarity_score = sorted(similarity_score, key=lambda x: x[1], reverse=True)
    similarity_score = similarity_score[1:]

    if like:
        for i in similarity_score:
            total_similarity_scores[i[0]] += i[1]
    else:
        for i in similarity_score:
            total_similarity_scores[i[0]] -= i[1]

    return total_similarity_scores

def runRecommendations(feedback):
    total_similarity_scores = {idx: 0 for idx in range(len(ds))}
    for rec in feedback.get('recommendations', []):
        idx = rec.get('idx')
        like = rec.get('like')
        total_similarity_scores = recommendation(idx, like, total_similarity_scores)
    results = aggregateRecommendation(total_similarity_scores)
    return results
