#!/bin/bash

# Script to invalidate CloudFront cache for 5oclock.sweatyross.com

# Set -e to exit immediately if any command exits with a non-zero status
set -e

echo "CloudFront distribution invalidation for 5oclock.sweatyross.com"

# Hard-code the distribution ID we found earlier
DISTRIBUTION_ID="E3HV6QLL3JY74A"

echo "Using CloudFront distribution ID: $DISTRIBUTION_ID"
echo "Creating invalidation for all paths..."

# Create an invalidation for all paths
INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*" --query "Invalidation.Id" --output text)

echo "Invalidation created with ID: $INVALIDATION_ID"
echo "CloudFront cache invalidation in progress. This may take a few minutes to complete."
echo "You can check the status with: aws cloudfront get-invalidation --distribution-id $DISTRIBUTION_ID --id $INVALIDATION_ID"
