# Documentation

## Project's structure

### Generate Access for Users to the API

1. Sign In: POST /authentication/sign-in and get accessToken;
2. Create Api Key: POST /api-key. Need to use Authorization header with Bearer token. Get apiKey from response.
3. Need to use Authorization header with ApiKey token.
