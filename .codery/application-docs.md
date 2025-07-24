# Application Documentation

_This file contains project-specific documentation aggregated from user-defined sources._

---

## test-docs/api-guide.md

# API Guide

This is a sample API guide for testing the application documentation aggregation feature.

## Authentication

All API requests require authentication using JWT tokens.

## Endpoints

### GET /api/users
Returns a list of users.

### POST /api/users
Creates a new user.

---

## test-docs/architecture.md

# System Architecture

## Overview

Our system follows a microservices architecture pattern.

## Components

1. **Frontend**: React-based web application
2. **API Gateway**: Routes requests to appropriate services
3. **Auth Service**: Handles user authentication and authorization
4. **Data Service**: Manages data persistence and retrieval

## Data Flow

Requests flow from the frontend through the API gateway to the appropriate microservice.
