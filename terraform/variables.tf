variable "aws_region" {
  description = "The AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "The name of the S3 bucket for website hosting"
  type        = string
  default     = "5oclock-somewhere-website-unique"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "lambda_zip_path" {
  description = "Path to the zipped Lambda function code"
  type        = string
  default     = "../lambda/function.zip"
}

variable "domain_name" {
  description = "Root domain name for the website"
  type        = string
  default     = "sweatyross.com"
}

variable "subdomain" {
  description = "Subdomain for the 5 O'Clock website"
  type        = string
  default     = "5oclock"
}
