import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# Load dataset
ds = pd.read_csv('cleaned_data.csv')

# Compute TF-IDF matrix
tf = TfidfVectorizer(analyzer='word', stop_words='english', max_df=0.8, min_df=0.0, use_idf=True, ngram_range=(1,3))
tfidf_matrix = tf.fit_transform(ds['cleaned_desc'])

# Compute cosine similarities
cosine_similarities = linear_kernel(tfidf_matrix, tfidf_matrix)
