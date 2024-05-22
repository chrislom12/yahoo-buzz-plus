import numpy as np 
import pandas as pd 
import matplotlib.pyplot as plt

data = pd.read_csv('raw_data.csv')
data = data.drop_duplicates(subset='title', keep='first', inplace=False)

data.insert(0,'id',range(0,data.shape[0]))

ds = data[['date','title','text','link']]
ds = ds.dropna()

ds = ds.sample(n=1000, random_state=42)
print(ds.shape)
ds = ds.drop_duplicates(subset=None, keep='first', inplace=False)


print(ds.shape)


from nltk.corpus import stopwords
from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.tokenize import RegexpTokenizer
import re
import string
import random



def make_lower_case(text):
    return text.lower()

def remove_stop_words(text):
    text = text.split()
    stops = set(stopwords.words("english"))
    text = [w for w in text if not w in stops]
    texts = [w for w in text if w.isalpha()]
    texts = " ".join(texts)
    return texts

def remove_punctuation(text):
    tokenizer = RegexpTokenizer(r'\w+')
    text = tokenizer.tokenize(text)
    text = " ".join(text)
    return text

def remove_html(text):
    html_pattern = re.compile('<.*?>')
    return html_pattern.sub(r'', text)

def clean_date(date_time_str):
    date_part = date_time_str.split(' ')[0]
    return date_part

def add_breaks(text):
    text = text.replace("\r\n", "<br>")
    return text



ds['cleaned_desc'] = ds['text'].apply(func = make_lower_case)


ds['cleaned_desc'] = ds.cleaned_desc.apply(func = remove_stop_words)
ds['cleaned_desc'] = ds.cleaned_desc.apply(func=remove_punctuation)
ds['cleaned_desc'] = ds.cleaned_desc.apply(func=remove_html)
ds['date'] = ds['date'].apply(clean_date)


ds['text'] = ds['text'].apply(add_breaks)



ds.insert(0,'id',range(0,ds.shape[0]))
print(ds.shape)


ds.to_csv('cleaned_data.csv', index=False)

