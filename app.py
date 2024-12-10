from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from service.service1 import get_recommendations_track
from service.service3 import get_playlist_recommendations

app = FastAPI()

# CORS configuration
origins = ["*"]  # Allow all origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint without parameters
@app.get("/")
def root():
    return {"message": "RS link OK"}

# Endpoints with string parameters
# track_id
@app.get("/endpoint1/{track_id}")
def endpoint1(track_id: str):
    item = str.split(track_id,',')
    recommendations = get_recommendations_track(item)
    return recommendations

# artist
@app.get("/endpoint2/{link}")
def endpoint2(link: str):
    item = 'https://open.spotify.com/playlist/'+ link
    recommendations = get_playlist_recommendations(item)
    return recommendations


