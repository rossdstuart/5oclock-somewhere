# Lambda function
resource "aws_lambda_function" "five_oclock_lambda" {
  function_name    = "five-oclock-api"
  filename         = var.lambda_zip_path
  source_code_hash = filebase64sha256(var.lambda_zip_path)
  handler          = "index.handler"
  runtime          = "nodejs16.x"
  timeout          = 10
  memory_size      = 128
  role             = aws_iam_role.lambda_role.arn

  environment {
    variables = {
      ENVIRONMENT = var.environment
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_policy_attachment
  ]
}

# IAM role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "five-oclock-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# IAM policy for Lambda
resource "aws_iam_policy" "lambda_policy" {
  name = "five-oclock-lambda-policy"
  path = "/"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# Attach the policy to the role
resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

# API Gateway REST API
resource "aws_api_gateway_rest_api" "five_oclock_api" {
  name        = "five-oclock-api"
  description = "API for 5 O'Clock Somewhere"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# API Gateway resource
resource "aws_api_gateway_resource" "five_oclock_resource" {
  rest_api_id = aws_api_gateway_rest_api.five_oclock_api.id
  parent_id   = aws_api_gateway_rest_api.five_oclock_api.root_resource_id
  path_part   = "api"
}

# API Gateway resource for /api/five-oclock endpoint
resource "aws_api_gateway_resource" "five_oclock_api_resource" {
  rest_api_id = aws_api_gateway_rest_api.five_oclock_api.id
  parent_id   = aws_api_gateway_resource.five_oclock_resource.id
  path_part   = "five-oclock"
}

# API Gateway method
resource "aws_api_gateway_method" "five_oclock_method" {
  rest_api_id   = aws_api_gateway_rest_api.five_oclock_api.id
  resource_id   = aws_api_gateway_resource.five_oclock_api_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

# API Gateway integration
resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.five_oclock_api.id
  resource_id             = aws_api_gateway_resource.five_oclock_api_resource.id
  http_method             = aws_api_gateway_method.five_oclock_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.five_oclock_lambda.invoke_arn
}

# API Gateway method response
resource "aws_api_gateway_method_response" "five_oclock_method_response" {
  rest_api_id = aws_api_gateway_rest_api.five_oclock_api.id
  resource_id = aws_api_gateway_resource.five_oclock_api_resource.id
  http_method = aws_api_gateway_method.five_oclock_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }
}

# API Gateway deployment
resource "aws_api_gateway_deployment" "five_oclock_deployment" {
  depends_on = [
    aws_api_gateway_integration.lambda_integration
  ]

  rest_api_id = aws_api_gateway_rest_api.five_oclock_api.id
  stage_name  = var.environment
}

# Lambda permission for API Gateway
resource "aws_lambda_permission" "api_gateway_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.five_oclock_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.five_oclock_api.execution_arn}/*/*"
}

# API Gateway CORS OPTIONS method
resource "aws_api_gateway_method" "options_method" {
  rest_api_id   = aws_api_gateway_rest_api.five_oclock_api.id
  resource_id   = aws_api_gateway_resource.five_oclock_api_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

# API Gateway CORS OPTIONS integration
resource "aws_api_gateway_integration" "options_integration" {
  rest_api_id = aws_api_gateway_rest_api.five_oclock_api.id
  resource_id = aws_api_gateway_resource.five_oclock_api_resource.id
  http_method = aws_api_gateway_method.options_method.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

# API Gateway CORS OPTIONS method response
resource "aws_api_gateway_method_response" "options_method_response" {
  rest_api_id = aws_api_gateway_rest_api.five_oclock_api.id
  resource_id = aws_api_gateway_resource.five_oclock_api_resource.id
  http_method = aws_api_gateway_method.options_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

# API Gateway CORS OPTIONS integration response
resource "aws_api_gateway_integration_response" "options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.five_oclock_api.id
  resource_id = aws_api_gateway_resource.five_oclock_api_resource.id
  http_method = aws_api_gateway_method.options_method.http_method
  status_code = aws_api_gateway_method_response.options_method_response.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'",
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}

# Output the API Gateway URL
output "api_gateway_url" {
  value = "${aws_api_gateway_deployment.five_oclock_deployment.invoke_url}/${aws_api_gateway_resource.five_oclock_resource.path_part}/${aws_api_gateway_resource.five_oclock_api_resource.path_part}"
}
