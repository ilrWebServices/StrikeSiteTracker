FROM docker.io/library/node:22 AS builder
WORKDIR /usr/src/app
# .dockerignore file controls what ends up inside the build image.
COPY . .
RUN npm install
RUN npm run build


FROM docker.io/library/busybox:1

# Create a non-root user to own the files and run our server
RUN adduser -D static
USER static
WORKDIR /home/static

# Copy the static website from the builder.
COPY --from=builder /usr/src/app/. .

# Remove the .env file from the final image.
RUN rm ./.env

# Run BusyBox httpd on port 3000.
CMD ["busybox", "httpd", "-f", "-v", "-p", "3000"]
