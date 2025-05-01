# Terraform Deployment Guide for 5 O'Clock Somewhere

This guide explains how to deploy infrastructure changes using Terraform for the 5 O'Clock Somewhere application.

## Prerequisites

- Terraform CLI installed locally
- AWS CLI configured with appropriate credentials
- Proper access to the AWS account

## Deployment Steps

### 1. Navigate to the Terraform Directory

```bash
cd /path/to/5oclock/terraform
```

### 2. Initialize Terraform (if not already done)

This step only needs to be performed once initially or when modules/providers change:

```bash
terraform init
```

### 3. Plan Your Changes

Preview the changes Terraform will make:

```bash
terraform plan
```

For better tracking, you can save the plan to a file:

```bash
terraform plan -out=tfplan
```

### 4. Apply the Changes

Apply the planned changes to create/update the infrastructure:

```bash
terraform apply
```

Or if you saved the plan to a file:

```bash
terraform apply tfplan
```

### 5. Verify the Changes

After deployment, verify that the changes have been applied successfully by:

- Checking the AWS Console
- Testing the API endpoint
- Testing the website

## Important Notes

- Always run `terraform plan` before applying changes to review what will be modified
- The Lambda function code is deployed as part of the Terraform deployment
- After applying changes to the S3 website content, you may need to invalidate the CloudFront cache
- Terraform state is stored locally; be cautious with state files

## Common Commands

```bash
# Refresh state without making changes
terraform refresh

# Destroy all resources (use with caution!)
terraform destroy

# Format terraform files
terraform fmt

# Validate terraform files
terraform validate

# Show current state
terraform show
```

## Troubleshooting

- If you encounter errors related to existing resources, try running `terraform import` to bring them under Terraform management
  ```bash
  # Format: terraform import [resource_type].[resource_name] [resource_id]
  # Example for Route 53 record:
  terraform import aws_route53_record.five_oclock_api Z0924816470JLXIQRP5X_5oclock.sweatyross.com_A
  ```
- For CloudFront distribution changes, be aware that they can take 15-30 minutes to propagate
- Check AWS CloudWatch logs for Lambda function errors

## Handling Resource Conflicts

When Terraform tries to create a resource that already exists in AWS:

1. **Import the existing resource**:
   ```bash
   # For Route 53 records, use format: ZONEID_RECORDNAME_TYPE
   terraform import aws_route53_record.five_oclock_api Z0924816470JLXIQRP5X_5oclock.sweatyross.com_A
   ```

2. **Comment out the resource temporarily**:
   If you can't import the resource, you can comment out the resource block in your Terraform files, run `terraform apply` to update the state, then uncomment and run `terraform refresh`.

3. **Delete the resource from AWS**:
   As a last resort, you can delete the resource from AWS Console and let Terraform recreate it. Be cautious with this approach for production resources.
