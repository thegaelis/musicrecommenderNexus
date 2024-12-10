import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import spotipy
import json
from spotipy.oauth2 import SpotifyOAuth
from sklearn.preprocessing import MinMaxScaler
from joblib import Parallel, delayed
from sklearn.metrics.pairwise import cosine_similarity


def process_artist(artist_name, sp):
    if not artist_name:
        # Handle the case where the artist name is an empty string
        return 'No Artist Found'

    search_results = sp.search(q=artist_name, type='artist')
    genres_info = []
    if 'artists' in search_results and 'items' in search_results['artists']:
        artists = search_results['artists']['items']
        for artist in artists:
            if artist['name'].lower() == artist_name.lower():
                genres_info = artist.get('genres', [])
                break
    genre_string = ', '.join(genres_info) if genres_info else 'No Genre Found'
    return genre_string




def get_playlist_recommendations(playlist_link):
    df = pd.read_csv('./data_processing/Dataset/dataset.csv')
    pd.set_option('display.max_columns', None)

    # Create Feature Set, drop unnecessary columns
    feat_vec = df.drop(columns=['Unnamed: 0','artists', 'track_name', 'key', 'duration_ms', 'time_signature'])
    pd.set_option('display.max_columns', None)

    #Create genre columns, there's so much, so lets only keep the most popular ones
    genre_list = feat_vec['track_genre'].unique().tolist()
    # genre_list
    len(genre_list)

    genres_to_remove = ['afrobeat','black-metal','breakbeat','cantopop','chicago-house','comedy','death-metal','deep-house','detroit-techno','drum-and-bass','dubstep','electronic','forro','french','garage','german','grindcore','hard-rock','hardcore','hardstyle','heavy-metal','indian','metalcore','industrial','minimal-techno','new-age','pop-film','power-pop','progressive-house','psych-rock','punk-rock','sertanejo','show-tunes','ska','swedish','trance','trip-hop']
    updated_genre_list = list(filter(lambda x: x not in genres_to_remove, genre_list))
    len(updated_genre_list)

    # use one-hot-encoding to convert genre categories into binary matrix format
    # iterate over list of genres and then make value of 1 if genre matches
    for item in updated_genre_list:
        feat_vec['genre_'+item] = feat_vec['track_genre'].apply(lambda genre: 1 if genre == item else 0)

    # drop genre column in feat_vec df
    feat_vec.drop('track_genre', axis=1, inplace=True)
    # popularity scale: 1-100, loudness scale: -60-0, tempo scale: 0-250, scale features from 0-1
    # add min and max values for each row to establish min and max values, then once scaling is done, remove min and max columns
    min_row = {'popularity': '0', 'loudness': '-60', 'tempo': '0'}
    max_row = {'popularity': '100', 'loudness': '0', 'tempo': '250'}

    min_row_df = pd.DataFrame([min_row])
    max_row_df = pd.DataFrame([max_row])

    feat_vec = pd.concat([feat_vec, min_row_df], ignore_index=True)
    feat_vec = pd.concat([feat_vec, max_row_df], ignore_index=True)

    # scale popularity, loudness, and tempo features to 0-1
    scale = ['popularity', 'loudness', 'tempo']
    scaler = MinMaxScaler()
    feat_vec[scale] = scaler.fit_transform(feat_vec[scale])

    # drop min and max values
    feat_vec = feat_vec.iloc[:-2]

    feat_vec = feat_vec.drop(columns = ['album_name', 'explicit'], axis = 1)

    #connect to spotify API
    # Set Spotify API credentials
    client_id = '69641ecc10424a6ca2da963ea415765d'
    client_secret = '8bc62f6a78bf4c99a0fcf9161efccd90'
    redirect_uri = 'http://localhost:3000'

    # Initialize the Spotipy client with authentication
    sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id, client_secret, redirect_uri))

    # Retrieve playlist id from playlist link
    playlist_id = playlist_link[34:56]

    playlist_tracks = sp.playlist_tracks(playlist_id, limit=50)

    # Create lists to hold track titles and artist names
    titles, artists, uri = [], [], []

    # Iterate through the tracks and collect title, artist, and uri from each song
    for item in playlist_tracks['items']:
        track = item['track']
        titles.append(track['name'])
        artist_names = ', '.join([artist['name'] for artist in track['artists']])
        artists.append(artist_names)
        uri.append(track['uri'])

    # Create a DataFrame
    data = {'Title': titles, 'Artist': artists, 'uri': uri}
    playlist = pd.DataFrame(data)

    # create new feature columns and assign null values
    new_feat = ['danceability', 'energy', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']
    for item in new_feat:
        playlist[item] = 0

    # fill null values with feature values
    for i in range(len(playlist)):
        track_uri = playlist.iloc[i].uri
        audio_features = sp.audio_features(track_uri)
        json_string = json.dumps(audio_features[0])
        dictionary = json.loads(json_string)

        #update feature values
        for feature in new_feat:
            playlist.loc[i, feature] = dictionary[feature]

    # Create a list of artist names from the playlist
    artist_names = playlist['Artist'].tolist()

    # Create an empty list to store genres
    genres = []

    import re

    def process_artist(artist_name, sp):
        if not artist_name:
            # Handle the case where the artist name is an empty string
            return 'No Artist Found'

        search_results = sp.search(q=artist_name, type='artist')
        genres_info = []
        if 'artists' in search_results and 'items' in search_results['artists']:
            artists = search_results['artists']['items']
            for artist in artists:
                if artist['name'].lower() == artist_name.lower():
                    genres_info = artist.get('genres', [])
                    break
        genre_string = ', '.join(genres_info) if genres_info else 'No Genre Found'
        return genre_string

    # Fill genre for each song using Parallelization
    genres = Parallel(n_jobs=-1)(delayed(process_artist)(artist_name, sp) for artist_name in artist_names)

    playlist['Genre'] = genres

    genre_count = {}

    # Substring search of genres, 
    for genre in updated_genre_list:
            # substring search for genres, assigns binary value in playlist item-feature matrix
            playlist['genre_'+genre] = playlist['Genre'].str.contains(genre).astype(int)
            # gather count of each genre in playlist
            if playlist['genre_'+genre].sum() > 0:
                genre_count[genre] = playlist['genre_'+genre].sum()
                
    playlist = playlist.drop(columns=['Genre'])

    #get top 3 genres for recommendation 
    top_3_genres = sorted(genre_count, key=genre_count.get, reverse=True)[:3]

    playlist['popularity'] = [0]*len(playlist)

    # iterate through each song to find popularity and release year
    for index, row in playlist.iterrows():
        track_uri = row['uri']
        # Get audio features of the track
        track_info = sp.track(track_uri)

        # Extract release date from track info
        popularity = track_info['popularity']


        playlist.loc[index,'popularity'] = int(popularity)

    # apply scaling again this time to playlist dataframe to normalize feature values 
    min_row = {'popularity': '0', 'loudness': '-60', 'tempo': '0'}
    max_row = {'popularity': '100', 'loudness': '0', 'tempo': '250'}

    min_row_df = pd.DataFrame([min_row])
    max_row_df = pd.DataFrame([max_row])

    playlist = pd.concat([playlist, min_row_df], ignore_index=True)
    playlist = pd.concat([playlist, max_row_df], ignore_index=True)

    # scale popularity, loudness, and tempo features to 0-1
    scale = ['popularity', 'loudness', 'tempo']
    scaler = MinMaxScaler()
    playlist[scale] = scaler.fit_transform(playlist[scale])

    # drop min and max values
    playlist = playlist.iloc[:-2]

    # sort the dataframes in alphabetical order so columns correspond to each other for the cosine similarity algorithm
    playlist = playlist.sort_index(axis=1)
    feat_vec = feat_vec.sort_index(axis=1)

    # for cosine similarity, drop track_id column of the dataframe, this is not needed and numerical values are only needed
    feat_vec_cosine_sim = feat_vec.drop('track_id', axis=1)

    # drop the Artist, Title, and uri in the playlist dataframe as well since they are not numerical values  
    columns_dropped = ['Artist', 'Title', 'uri']
    playlist_cosine_sim = playlist.drop(columns_dropped, axis=1)

    # Calculate column averages of the playlist dataframe
    column_averages = playlist_cosine_sim.mean()

    # Create a new DataFrame for the averages and totals
    averages_cosine_sim = pd.DataFrame([column_averages], index=['Average'])
    columns_type_count = playlist_cosine_sim.dtypes.value_counts()
    columns_type_count_1 = feat_vec_cosine_sim.dtypes.value_counts()

    #generate similarity scores!
    similarity_scores = cosine_similarity(feat_vec_cosine_sim, averages_cosine_sim)
    
    feat_vec['similarity_score'] = similarity_scores
    
    # Sort df from highest to lowest by similarity score and to show songs with highest similarity scores
    top_similarities = feat_vec.sort_values(by='similarity_score', ascending=False)

    # Remove rows in recommendations from top_similarities where IDs match with playlist IDs
    top_similarities = top_similarities[~top_similarities['track_id'].isin(playlist['uri'])]

    # Get song recs from top 3 genres
    first_genre = top_similarities.loc[top_similarities['genre_' + top_3_genres[0]] == 1].head(45)
    second_genre = top_similarities.loc[top_similarities['genre_' + top_3_genres[1]] == 1].head(30)
    third_genre = top_similarities.loc[top_similarities['genre_' + top_3_genres[2]] == 1].head(15)

    top_similarities = pd.concat([first_genre, second_genre, third_genre], ignore_index=True)

    # Find the track name, artist, and 30s audio preview or each song using the track_id
    top_similarities['track'] = [None] * len(top_similarities)
    top_similarities['artist'] = [None] * len(top_similarities)
    top_similarities['preview'] = [None] * len(top_similarities)

    # Get track name, artist, and 30s audio clip url
    for i in range(len(top_similarities)):
        track_info = sp.track(top_similarities.iloc[i, 87])
        track_name = track_info['name']
        artist_name = track_info['artists'][0]['name']
        preview_url = track_info['preview_url']
        
        top_similarities.iloc[i, 90] = track_name
        top_similarities.iloc[i, 91] = artist_name
        top_similarities.iloc[i, 92] = preview_url

    # Get genres of each track in playlist
    artist_names = top_similarities['artist'].tolist()
        
    # Create an empty list to store genres
    genres = []

    # Fill genre for each song using Parallelization
    genres = Parallel(n_jobs=1)(delayed(process_artist)(artist_name, sp) for artist_name in artist_names)

    # Add genres to the dataframe
    top_similarities['genre'] = genres

    # Remove any songs that have ethnic genres included
    ethnic_genres = ['colombia', 'latin', 'mexican', 'puerto rican', 'dominican', 'italian', 'spanish', 'brasil', 'argentine', 'anime', 'japanese', 'indonesian', 'vietnamese', 'korean', 'chinese', 'taiwan', 'spanish']
    mask = top_similarities['genre'].str.contains('|'.join(ethnic_genres), case=False)
    top_similarities.drop(top_similarities[mask].index, inplace=True)
        
    # Select songs from top 3 genres
    first_genre = top_similarities.loc[top_similarities['genre_' + top_3_genres[0]] == 1].head(15)
    second_genre = top_similarities.loc[top_similarities['genre_' + top_3_genres[1]] == 1].head(10)
    third_genre = top_similarities.loc[top_similarities['genre_' + top_3_genres[2]] == 1].head(5)
    top_similarities = pd.concat([first_genre, second_genre, third_genre], ignore_index=True)

    # Show only specific columns useful to the user
    display_features = ['track', 'artist', 'similarity_score', 'genre', 'preview']
    playlist_recs = top_similarities[display_features]

    playlist_recs['similarity_score'] = (playlist_recs['similarity_score'] * 100).round(2)

    # Convert DataFrame to dictionary and print as JSON
    playlist_recs_json = playlist_recs.to_dict(orient='records')
    print(json.dumps(playlist_recs_json, indent=4))

    return playlist_recs_json

