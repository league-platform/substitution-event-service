FROM denoland/deno:alpine-1.42.0

WORKDIR /app

COPY main.ts .

EXPOSE 8000

CMD ["run", "--allow-net", "main.ts"]
