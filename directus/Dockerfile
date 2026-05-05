FROM directus/directus:11.17.3

USER root

# Ensure the node user has access to these directories
RUN mkdir -p /directus/extensions /directus/uploads && \
    chown -R node:node /directus/extensions /directus/uploads

USER node

# Copy local extensions into the container
COPY --chown=node:node ./extensions /directus/extensions

# Directus defaults to port 8055, but Railway provides PORT env var which Directus will use
EXPOSE 8055
