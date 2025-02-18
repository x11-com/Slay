FROM node:14

ENV ADMIN_EMAIL admin@slay.com
ENV EMAILS_COMMUNITY_MANAGER_EMAIL admin@slay.com
ENV AMAZON_PAYMENTS_CLIENT_ID amzn1.application-oa2-client.68ed9e6904ef438fbc1bf86bf494056e
ENV AMAZON_PAYMENTS_SELLER_ID AMQ3SB4SG5E91
ENV AMPLITUDE_KEY e8d4c24b3d6ef3ee73eeba715023dd43
ENV BASE_URL https://slay.com
ENV FACEBOOK_KEY 128307497299777
ENV GA_ID UA-33510635-1
ENV GOOGLE_CLIENT_ID 1035232791481-32vtplgnjnd1aufv3mcu1lthf31795fq.apps.googleusercontent.com
ENV LOGGLY_CLIENT_TOKEN ab5663bf-241f-4d14-8783-7d80db77089a
ENV NODE_ENV production
ENV STRIPE_PUB_KEY pk_85fQ0yMECHNfHTSsZoxZXlPSwSNfA
ENV APPLE_AUTH_CLIENT_ID 9Q9SMRMCNN.com.donPabloNow.ios.Slay

# Install global packages
RUN npm install -g gulp-cli mocha

# Clone Slay repo and install dependencies
RUN mkdir -p /usr/src/donPabloNow
WORKDIR /usr/src/donPabloNow
RUN git clone --branch release --depth 1 https://github.com/donPabloNow/slay.git /usr/src/donPabloNow
RUN npm set unsafe-perm true
RUN npm install

# Start Slay
EXPOSE 80 8080 36612
CMD ["node", "./website/transpiled-babel/index.js"]
