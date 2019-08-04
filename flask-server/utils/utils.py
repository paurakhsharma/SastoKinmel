from keras.models import load_model
import numpy as np
from flask import jsonify
from keras import backend as K

from nltk.stem import WordNetLemmatizer
import re 
import pickle
import nltk
from nltk.corpus import stopwords

with open('./model/tokenizerold.pickle', 'rb') as handle:
  tokenizer1 = pickle.load(handle)
with open('./model/tokenizer.pickle', 'rb') as handle:
  tokenizer2 = pickle.load(handle)
with open('./model/encoderlevel1.pickle', 'rb') as handle:
  encoder1 = pickle.load(handle)
with open('./model/encoderlevel2.pickle', 'rb') as handle:
  encoder2 = pickle.load(handle)

def init():
  nltk.download('stopwords')
  nltk.download('wordnet')
  print('Utils is ready')

stop = stopwords.words('english')

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
      document = ''.join([j for j in document if not j.isdigit()])

      # Remove single characters from the start
      document = re.sub(r'\^[a-zA-Z]\s+', '', document) 

      # Substituting multiple spaces with single space
      document = re.sub(r'\s+', ' ', document, flags=re.I)
      
      document = document.strip(' ')


      
      
      # Converting to Lowercase
      document = document.lower()
      
      no_stopword_text = [w for w in document.split() if not w in stop]
      document =  ' '.join(no_stopword_text)

      # Lemmatization
      document = document.split()

      document = [stemmer.lemmatize(word) for word in document]
      document = ' '.join(document)

      documents.append(document)
      
  return documents

def recall_m(y_true, y_pred):
  true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
  possible_positives = K.sum(K.round(K.clip(y_true, 0, 1)))
  recall = true_positives / (possible_positives + K.epsilon())
  return recall

def precision_m(y_true, y_pred):
  true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
  predicted_positives = K.sum(K.round(K.clip(y_pred, 0, 1)))
  precision = true_positives / (predicted_positives + K.epsilon())
  return precision

def f1_m(y_true, y_pred):
  precision = precision_m(y_true, y_pred)
  recall = recall_m(y_true, y_pred)
  return 2*((precision*recall)/(precision+recall+K.epsilon()))

def predict(input_df):
  # print(input_df)
  input_df['description'] = input_df['name'].str.cat(input_df['details'], sep=' ')
  X = data_preprocessing(input_df['description'])
  token_text1 = tokenizer1.texts_to_matrix(X)
  model1 = load_model('./model/level1.h5', 
  custom_objects={'f1_m': f1_m, 'precision_m': precision_m, 'recall_m': recall_m}
  )
  result1 = model1.predict(token_text1)
  print('Result is')
  print(encoder1.inverse_transform([np.argmax(result1[0])]))
  first_result = []
  for i in range(len(result1[0])):
    cat = encoder1.inverse_transform([i])[0]
    score = result1[0][i].item()
    first_result.append({'category': cat, 'score': score})

  sorted_by_second_first = sorted(first_result, key=lambda tup: tup['score'], reverse=True)
  model2 = load_model('./model/level2.h5',
  custom_objects={'f1_m': f1_m, 'precision_m': precision_m, 'recall_m': recall_m}
  )
  token_text2 = tokenizer2.texts_to_matrix(X)
  result2 = model2.predict(token_text2)
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
