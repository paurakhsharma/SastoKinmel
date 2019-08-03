from keras.models import load_model
import numpy as np
from flask import jsonify

from nltk.stem import WordNetLemmatizer
import re 
import pickle
import nltk

with open('./model/tokenizer.pickle', 'rb') as handle:
  tokenizer1 = pickle.load(handle)
with open('./model/encoderlevel1.pickle', 'rb') as handle:
  encoder1 = pickle.load(handle)
with open('./model/encoderlevel2.pickle', 'rb') as handle:
  encoder2 = pickle.load(handle)

def init():
  # nltk.download('stopwords')
  # nltk.download('wordnet')
  print('Utils is ready')

def data_preprocessing(X):
  documents = []
  # X = data1['details']

  stemmer = WordNetLemmatizer()

  for i in X:  
      
      document = str(i)
      # Remove all the special characters
      document = re.sub(r'\W', ' ', document) 

      # remove all single characters
      document = re.sub(r'\s+[a-zA-Z]\s+', ' ', document)

      #remove all the nos
      address = re.sub(r'^[\d-]+ ', '', document)

      # Remove single characters from the start
      document = re.sub(r'\^[a-zA-Z]\s+', '', document) 

      # Substituting multiple spaces with single space
      document = re.sub(r'\s+', ' ', document, flags=re.I)
      
      document = document.strip(' ')


      # Converting to Lowercase
      document = document.lower()

      # Lemmatization
      document = document.split()

      document = [stemmer.lemmatize(word) for word in document]
      document = ' '.join(document)

      documents.append(document)
      
  return documents

def predict(input_df):
  # print(input_df)
  input_df['description'] = input_df['name'].str.cat(input_df['details'], sep=' ')
  X = data_preprocessing(input_df['description'])
  token_text = tokenizer1.texts_to_matrix(X)
  model1 = load_model('./model/level1.h5')
  result1 = model1.predict(token_text)
  print('Result is')
  print(np.argmax(result1[0]))
  first_result = []
  for i in range(len(result1[0])):
    cat = encoder1.inverse_transform([i])[0]
    score = result1[0][i].item()
    first_result.append({'category': cat, 'score': score})

  sorted_by_second_first = sorted(first_result, key=lambda tup: tup['score'], reverse=True)
  model2 = load_model('./model/level2.h5')
  result2 = model2.predict(token_text)
  print('Result 2 is')
  print(np.argmax(result2[0]))
  second_result = []
  for i in range(len(result2[0])):
    cat = encoder2.inverse_transform([i])[0]
    score = result2[0][i].item()
    second_result.append({'category': cat, 'score': score})

  sorted_by_second = sorted(second_result, key=lambda tup: tup['score'], reverse=True)
  final_result2 = encoder2.inverse_transform([np.argmax(result2[0])])
  
  return {
    'category': sorted_by_second_first,
    'subCategory': sorted_by_second
  }
