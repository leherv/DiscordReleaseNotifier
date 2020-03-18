FROM alpine:edge

# Installs latest Chromium (77) package.
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# set workdir inside container
WORKDIR /usr/src/app
# create dist directory
RUN mkdir dist
# copy src into container workdir
COPY src ./src
# now copy other necessary files into workdir (extra because it creates own layer and does not have to be done again if nothing changed)
COPY tsconfig.json package*.json releases.json ./ 
# install all dependencies
RUN npm install

CMD [ "npm", "run", "build:start" ]
