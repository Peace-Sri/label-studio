docker network create clavi_network 2>/dev/null || true

docker build -t custom-ls .

docker stop label_studio 2>/dev/null || true
docker rm label_studio 2>/dev/null || true

docker run -d \
  --name label_studio \
  --network clavi_network \
  -v ~/label_studio_media:/label-studio/data \
  --env-file .env \
  custom-ls label-studio

cd routing && docker compose up -d
