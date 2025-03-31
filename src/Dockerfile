FROM public.ecr.aws/lambda/nodejs:18

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and config files
COPY tsconfig.json ./
COPY . .

# Build TypeScript files
RUN npm run build

# Command can be overwritten by providing a different command in the template directly.
CMD ["dist/app.handler"]
