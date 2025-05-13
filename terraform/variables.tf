variable "aws_region" {
  description = "The AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "domain_name" {
  description = "Root domain name for the website"
  type        = string
  default     = "sweatyross.com"
}

variable "base_subdomain" {
  description = "Base subdomain for the 5 O'Clock website"
  type        = string
  default     = "5oclock"
}

variable "enable_dev_environment" {
  description = "Whether to enable the dev environment features"
  type        = bool
  default     = false
}

variable "lambda_zip_path" {
  description = "Path to the zipped Lambda function code"
  type        = string
  default     = "../lambda/function.zip"
}

# Environment-specific variables and computed values
locals {
  # Environment specific naming
  env_suffix                = var.environment == "prod" ? "" : "-${var.environment}"
  subdomain                 = var.environment == "prod" ? var.base_subdomain : "dev-${var.base_subdomain}"
  fully_qualified_subdomain = "${local.subdomain}.${var.domain_name}"
  
  # Resource naming with environment suffixes to avoid conflicts
  bucket_name               = "5oclock-somewhere-website${local.env_suffix}"
  api_name                  = "5oclock-api${local.env_suffix}"
  lambda_function_name      = "5oclock-lambda${local.env_suffix}"
  distribution_name         = "5oclock-distribution${local.env_suffix}"
  
  # Tags to apply to all resources
  common_tags = {
    Environment = var.environment
    Project     = "5oclock"
    ManagedBy   = "Terraform"
  }
}
