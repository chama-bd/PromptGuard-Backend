package com.promptguard.api.model;

public enum IncidentAction {
    REVOKE_GITHUB_TOKEN,
    DISABLE_AWS_ACCESS,
    SLACK_ALERT,
    FORENSIC_LOG,
    MANDATORY_TRAINING,
    ACCOUNT_LOCK
}
