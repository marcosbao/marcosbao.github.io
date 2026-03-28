FROM swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/library/node:22-alpine

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.mjs ./

EXPOSE 8787
CMD ["npm", "start"]
