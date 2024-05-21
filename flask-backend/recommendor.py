import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import json

from app import cosine_similarities, ds


""" ds = pd.read_csv('cleaned_data.csv')

tf = TfidfVectorizer(analyzer='word',stop_words='english',max_df=0.8,min_df=0.0,use_idf=True,ngram_range=(1,3))
tfidf_matrix = tf.fit_transform(ds['cleaned_desc'])



cosine_similarities = linear_kernel(tfidf_matrix, tfidf_matrix)


total_similarity_scores = {idx: 0 for idx in range(len(ds))} """

def aggregateRecommendation(total_similarity_scores):
    sorted_similarity_scores = sorted(total_similarity_scores.items(), key=lambda x: x[1], reverse=True)
    articles = []
    for rank, (article_idx, similarity_score) in enumerate(sorted_similarity_scores[:10], 1):
        article_details = {
            "title": ds['title'].iloc[article_idx],
            "link": ds['link'].iloc[article_idx],
            "text": ds['text'].iloc[article_idx],
            "total_score": similarity_score
        }
        articles.append(article_details)
    return json.dumps(articles, indent=4)


def recommendation(idx, like, total_similarity_scores):
    similarity_score = list(enumerate(cosine_similarities[idx]))
    similarity_score = sorted(similarity_score, key=lambda x: x[1], reverse=True)
    #print("title of exluded article:" + ds['title'].iloc[similarity_score[0][0]])
    #print ("pre exclude:" + str(similarity_score[0]))

    similarity_score = similarity_score[1:]
    #print ("post exclude:" +str(similarity_score[0]))

    if like:
        for i in similarity_score:
            total_similarity_scores[i[0]] += i[1]
    else:
        for i in similarity_score:
            total_similarity_scores[i[0]] -= i[1]
    
    
    """ print("Article Read -- " + ds['title'].iloc[idx] + " Link -- " + ds['link'].iloc[idx])
    print(" ---------------------------------------------------------- ") """

    return total_similarity_scores


def runRecommendations(feedback):
    total_similarity_scores = {idx: 0 for idx in range(len(ds))}
    for rec in feedback.get('recommendations', []):
        idx = rec.get('idx')
        like = rec.get('like')
        total_similarity_scores = recommendation(idx, like, total_similarity_scores)
    results = aggregateRecommendation(total_similarity_scores)
    return results    




""" feedback = '''
{
    "recommendations": [
        {"idx": 78, "like": true},
        {"idx": 5, "like": true},
        {"idx": 23, "like": true},
        {"idx": 30, "like": true},
        {"idx": 11, "like": true},
        {"idx": 67, "like": true},
        {"idx": 9, "like": true},
        {"idx": 88, "like": true}
    ]
}
'''


results = runRecommendations(feedback) """

#print(results)

