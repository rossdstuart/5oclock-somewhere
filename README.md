# 5 O'Clock Somewhere

A website that shows where it's recently past 5pm around the world, along with fun facts about those countries.

## Features

- Displays a random major city where it's recently past 5pm (within the last 60 minutes)
- Shows interesting facts about the country where the city is located
- Refreshes with new cities/facts on demand

## Architecture

The application uses a serverless architecture on AWS with the following components:

```
                              ┌───────────────────┐
                              │                   │
                              │  Route 53         │
                              │  (DNS)            │
                              │                   │
                              └─────────┬─────────┘
                                        │
                                        │ 5oclock.sweatyross.com
                                        │
                                        ▼
┌───────────────────┐         ┌──────────────────┐         ┌───────────────────┐
│                   │         │                  │         │                   │
│  S3 Bucket        │ ────►   │  CloudFront      │ ────►   │  End Users        │
│  (Static Content) │         │  (CDN)           │         │  (Web Browsers)   │
│                   │         │                  │         │                   │
└───────────────────┘         └──────┬───────────┘         └───────────────────┘
                                     │
                                     │ /api/* requests
                                     │
                                     ▼
                            ┌──────────────────┐         ┌───────────────────┐
                            │                  │         │                   │
                            │  API Gateway     │ ────►   │  Lambda Function  │
                            │  (REST API)      │         │  (Backend Logic)  │
                            │                  │         │                   │
                            └──────────────────┘         └───────────────────┘
```

### Components

1. **S3 Bucket**
   - Hosts all static website content (HTML, CSS, JavaScript)
   - Configured for website hosting but not publicly accessible

2. **CloudFront**
   - Content Delivery Network (CDN) for global distribution
   - Serves static content from S3
   - Routes API requests to API Gateway
   - Provides HTTPS security via ACM certificate

3. **API Gateway**
   - Exposes the Lambda function as a RESTful API
   - Handles CORS for browser requests
   - Manages API endpoints and methods

4. **Lambda Function**
   - Contains the server-side logic to determine cities where it's 5 PM
   - Processes requests and returns city/country data with fun facts
   - Runs only when requested (serverless)

5. **Route 53**
   - DNS management for custom domain (5oclock.sweatyross.com)
   - Routes traffic to CloudFront distribution

6. **AWS Certificate Manager (ACM)**
   - Provides SSL/TLS certificates for secure HTTPS connections
   - Integrated with CloudFront and API Gateway

## Development

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Terraform (for deployment)
- AWS CLI configured (for deployment)

### Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm start
```

The site will be available at http://localhost:3000

## Deployment

The website is configured to be deployed to AWS S3 with CloudFront distribution and a Lambda backend using Terraform.

```bash
# Navigate to terraform directory
cd terraform

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan -out=tfplan

# Apply the deployment
terraform apply tfplan
```

After deployment, you need to update the configuration with the API endpoint:

1. Find the API Gateway URL in the Terraform output
2. Update `src/public/config.js` with the correct API endpoint
3. Re-sync the S3 bucket:
   ```bash
   aws s3 sync src/public/ s3://your-bucket-name/ --delete
   ```

## Project Structure

```
5oclock/
├── src/                  # Source code for the website
│   ├── public/           # Static assets
│   │   ├── index.html    # Main HTML file
│   │   ├── error.html    # Error page
│   │   ├── styles.css    # CSS styles
│   │   ├── main.js       # Frontend JavaScript
│   │   └── config.js     # Configuration file
├── lambda/               # Lambda function code
│   ├── index.js          # Lambda handler
│   ├── package.json      # Lambda dependencies
│   └── function.zip      # Deployment package
├── terraform/            # Terraform configuration
│   ├── main.tf           # S3 and CloudFront resources
│   ├── lambda.tf         # Lambda and API Gateway resources
│   ├── domain.tf         # Route 53 and ACM resources
│   └── variables.tf      # Configuration variables
├── package.json          # Node.js dependencies
└── README.md             # Project documentation
