
FROM node:22.18.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

RUN npm install
COPY . .
# Generate Prisma client
RUN npx prisma generate
EXPOSE 5501
CMD ["npm", "run", "dev"]