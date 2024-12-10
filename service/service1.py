import joblib
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

DATA = './processed_data/'

# Load the encoders and feature matrix
genre_encoder = joblib.load(DATA + 'genre_encoder.joblib')
artist_encoder = joblib.load(DATA + 'artist_encoder.joblib')
features_dense = joblib.load(DATA + 'features_dense.joblib')
spotify_data_cleaned = joblib.load(DATA + 'spotify_data_cleaned.joblib')

def get_recommendations_track(track_ids, data=spotify_data_cleaned, features_dense=features_dense, num_recommendations=10, top_popular_column='popularity'):
    """
    Get track recommendations based on given track IDs, ensuring a variety of genres in the recommendations.
    If no valid track IDs are provided, recommend the top popular tracks across all genres.

    Parameters:
    - track_ids (str or list of str): One or more track IDs for which to generate recommendations.
    - data (DataFrame): The DataFrame containing track information and features.
    - features_dense (ndarray): The feature matrix for the tracks.
    - num_recommendations (int): Number of recommendations to generate.
    - top_popular_column (str): Column name in the data containing popularity scores.

    Returns:
    - recommendations (list of dict): A list of dictionaries containing recommended tracks.
    """
    # Check if track_ids is a single string (track_id) or a list/array of track_ids
    if isinstance(track_ids, str):
        track_ids = [track_ids]  # Convert it to a list with one element

    # Initialize a list to store feature vectors of the given track_ids
    track_vectors = []

    # Loop through each track_id in the input list or array
    for track_id in track_ids:
        # Get all indices of the track that matches the track_id
        idxs = data[data['track_id'] == track_id].index
        if len(idxs) == 0:
            print(f"Track with ID {track_id} not found in the dataset.")
            continue
        for idx in idxs:
            # Add the feature vector to the list
            track_vectors.append(features_dense[idx])

    if not track_vectors:
        print("No valid track IDs were provided. Recommending top popular tracks across all genres.")
        # Recommend top popular tracks across all genres
        top_popular_tracks = data.sort_values(by=top_popular_column, ascending=False).head(num_recommendations)
        top_popular_tracks.drop_duplicates(subset=['track_id'], inplace=True)
        if 'artists_encoded' in data.columns:
            top_popular_tracks['artists'] = artist_encoder.inverse_transform(top_popular_tracks['artists_encoded'])
        # Convert to JSON-like format
        recommendations = top_popular_tracks.to_dict(orient='records')
        return recommendations

    # Compute the average feature vector
    avg_vector = np.mean(track_vectors, axis=0).reshape(1, -1)

    # Compute cosine similarity for the average vector
    sim_scores = cosine_similarity(avg_vector, features_dense).flatten()

    # Get the indices of the most similar tracks
    nearest_neighbors = np.argsort(-sim_scores)[:num_recommendations + len(track_ids)]
    nearest_neighbors = nearest_neighbors[np.isin(nearest_neighbors, data.index.values)]

    # Filter recommendations by ensuring a variety of genres
    genre_counts = data.iloc[nearest_neighbors]['track_genre'].value_counts()
    filtered_indices = []
    for idx in nearest_neighbors:
        if len(filtered_indices) >= num_recommendations:
            break
        if data.loc[idx, 'track_genre'] not in genre_counts or genre_counts[data.loc[idx, 'track_genre']] > 1:
            filtered_indices.append(idx)
            genre_counts[data.loc[idx, 'track_genre']] -= 1

    # Convert recommended indices set to a list
    recommended_indices = list(filtered_indices)

    # Create DataFrame of recommendations from the recommended indices
    recommendations_df = data.iloc[recommended_indices].reset_index(drop=True)

    # Drop duplicates based on track_id to avoid recommending the same track_id itself
    recommendations_df.drop_duplicates(subset=['track_id'], inplace=True)

    # Map the encoded artist labels back to the original artist names
    if 'artists_encoded' in data.columns:
        recommendations_df['artists'] = artist_encoder.inverse_transform(recommendations_df['artists_encoded'])

    # Convert to JSON-like format
    recommendations = recommendations_df.to_dict(orient='records')

    return recommendations

