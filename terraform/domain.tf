# ACM Certificate for custom domain
resource "aws_acm_certificate" "five_oclock_certificate" {
  domain_name       = "${var.subdomain}.${var.domain_name}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "5OClock-Certificate"
    Environment = var.environment
  }
}

# Route 53 record for certificate validation
resource "aws_route53_record" "certificate_validation" {
  for_each = {
    for dvo in aws_acm_certificate.five_oclock_certificate.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  name    = each.value.name
  type    = each.value.type
  zone_id = data.aws_route53_zone.domain_zone.zone_id
  records = [each.value.record]
  ttl     = 60
}

# ACM Certificate validation
resource "aws_acm_certificate_validation" "five_oclock_certificate_validation" {
  certificate_arn         = aws_acm_certificate.five_oclock_certificate.arn
  validation_record_fqdns = [for record in aws_route53_record.certificate_validation : record.fqdn]
}

# Data source for Route 53 zone
data "aws_route53_zone" "domain_zone" {
  name = var.domain_name
}

# API Gateway Custom Domain
resource "aws_api_gateway_domain_name" "five_oclock_api_domain" {
  domain_name              = "${var.subdomain}.${var.domain_name}"
  regional_certificate_arn = aws_acm_certificate.five_oclock_certificate.arn

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  depends_on = [
    aws_acm_certificate_validation.five_oclock_certificate_validation
  ]
}

# API Gateway base path mapping
resource "aws_api_gateway_base_path_mapping" "five_oclock_api_mapping" {
  api_id      = aws_api_gateway_rest_api.five_oclock_api.id
  stage_name  = aws_api_gateway_deployment.five_oclock_deployment.stage_name
  domain_name = aws_api_gateway_domain_name.five_oclock_api_domain.domain_name
}

# API Gateway custom domain record
# Commented out to avoid conflict with five_oclock_website record
# Both records were trying to manage 5oclock.sweatyross.com
/*
resource "aws_route53_record" "five_oclock_api" {
  name    = aws_api_gateway_domain_name.five_oclock_api_domain.domain_name
  type    = "A"
  zone_id = data.aws_route53_zone.domain_zone.zone_id

  alias {
    name                   = aws_api_gateway_domain_name.five_oclock_api_domain.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.five_oclock_api_domain.regional_zone_id
    evaluate_target_health = false
  }
}
*/

# CloudFront custom domain
resource "aws_cloudfront_distribution" "s3_distribution_custom_domain" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"
  aliases             = ["${var.subdomain}.${var.domain_name}"]

  origin {
    domain_name = aws_s3_bucket.website_bucket.bucket_regional_domain_name
    origin_id   = "S3-${var.bucket_name}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  # API Gateway origin
  origin {
    domain_name = replace(aws_api_gateway_deployment.five_oclock_deployment.invoke_url, "/^https?://([^/]*).*/", "$1")
    origin_id   = "ApiGateway"
    origin_path = "/${var.environment}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Default cache behavior (S3 static content)
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.bucket_name}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # API cache behavior
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "ApiGateway"

    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.five_oclock_certificate.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2019"
  }

  depends_on = [
    aws_acm_certificate_validation.five_oclock_certificate_validation
  ]
}

# Route 53 record for CloudFront
resource "aws_route53_record" "five_oclock_website" {
  name    = "${var.subdomain}.${var.domain_name}"
  type    = "A"
  zone_id = data.aws_route53_zone.domain_zone.zone_id

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution_custom_domain.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution_custom_domain.hosted_zone_id
    evaluate_target_health = false
  }
}

# Output custom domain URL
output "website_url" {
  value = "https://${var.subdomain}.${var.domain_name}"
}
