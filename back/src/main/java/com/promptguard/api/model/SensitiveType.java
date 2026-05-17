package com.promptguard.api.model;

public enum SensitiveType {
    AWS_KEY,
    OPENAI_KEY,
    JWT_TOKEN,
    EMAIL,
    PRIVATE_IP,
    CREDIT_CARD,
    DB_CREDENTIAL,
    ENV_SECRET,
    SLACK_TOKEN,
    STRIPE_KEY,
    PROPRIETARY_CODE
}
