# Liferay Docker Client Extensions

Example to run Liferay and Client Extensions in a Docker Compose stack.

  - [Spring Boot](#spring-boot)
  - [Node JS](#node-js)

## Integrating OAuth 2.0 with Liferay
<img width="1001" alt="OAuth-communication-process-between-Liferay-and-Client-Extensions" src="https://github.com/user-attachments/assets/4af610bf-d2cd-412c-b433-dc86a1fc1699" />


# Enhancing Liferay with OAuth 2.0

OAuth 2.0 enhances Liferay's capabilities by allowing authenticated Liferay users to access resources and applications outside of the Liferay platform. This mechanism is akin to authorizing a neighbor to enter your home to care for your pet while you're away. Importantly, Liferay’s Client Extensions utilize OAuth 2.0 to securely access Liferay resources, streamlining integration across different systems.

## Microservice Client Extensions

You can define microservice client extensions to run your own code in response to events in your Liferay instance. How you implement the code is up to you: use the patterns and technologies you like. Microservice client extensions are hosted outside of Liferay and are triggered by cues from Liferay itself.

### Authentication Profiles

Microservice client extensions require pre-configured authentication profiles to handle requests properly and call protected Liferay APIs. You can add authentication profiles by including them as client extensions within the same project, such as OAuth user agent client extensions.

**Example**:
- **Application Logic**: Application logic that communicates with Liferay DXP using an `oAuthApplicationHeadlessServer` client extension ensures secure data transactions and streamlined processes.


# OAuth Profiles
![image](https://github.com/user-attachments/assets/dc4f4043-bcb8-45cb-8638-99f47261cef8)

## OAuth User Agent Client Extensions
- **Description**: You can use a client extension to configure a Liferay OAuth2 application pre-configured with a User Agent Application client profile. This type of authentication profile is required for API calls authorized by a specific user.

## OAuth Headless Server Client Extensions
- **Description**: You can use a client extension to configure a Liferay OAuth2 application pre-configured with a Headless Server client profile. This kind of authentication profile is required for API calls that are not authorized by a specific user.

## Types of Clients
![image](https://github.com/user-attachments/assets/705e0e34-e021-4b67-82b2-19af56086a3f)

- **oAuthApplicationUserAgent**
  - **Usage**: This type of OAuth client is typically used when the application acts on behalf of a user, with direct user interaction, likely through a web browser.
  
- **oAuthApplicationHeadlessServer**
  - **Usage**: This type is suitable for service-to-service interactions where the application needs to access Liferay resources independently of user context.


# Application Components Overview

## 1. React Front-End Client Extension 
**Function**: The React application is responsible for interfacing with users and providing a UI to interact with backend services. It uses the **liferay-sample-etc-node-oauth-application-user-agent** configuration to request and receive OAuth tokens.

**Process**:
- It accesses the `Liferay.authToken` from Liferay DXP directly.
- It **requests an OAuth token from the Liferay server using the UserAgent profile** which, as seen in your console log, includes scopes that allow it to perform actions related to the admin workflow.
- This token is then **used to authenticate requests made from the React client to the Node.js microservice**, ensuring that these requests are securely authenticated.


![Reat-Frontent-Client-Extension](https://github.com/user-attachments/assets/ad67088e-65b0-4ea8-8823-d89703981290)

![Liferay-oauth-token-react-node-frontend-to-microservice](https://github.com/user-attachments/assets/a4b73e9e-e08f-4a85-9214-0a3d37e64ea6)

## 2. Node.js Microservice
**Function**: Acts as a backend processing agent that handles more complex or sensitive operations that shouldn't be processed directly by the front end.

**Process**:
- It independently requests an OAuth token using the **liferay-sample-etc-node-oauth-application-headless-server** configuration.
- This configuration is set up with scopes that allow it to perform user and system-wide operations that do not require a specific user context, suitable for backend services.
- The token obtained allows the Node.js microservice to communicate securely with Liferay DXP, fetching or pushing data as needed by the React client but processed at the server level.







## Extending Liferay with Client Extensions

<img width="2746" alt="Extending-Liferay-Client-Extension-Loosely-Coupled" src="https://github.com/user-attachments/assets/387be9f9-309b-4dd9-8ff7-0521b83d1017" />







### Overview

Extending Liferay is essential for maximizing the platform’s potential. By tailoring Liferay with specific business requirements in mind, organizations can create digital experiences that are closely aligned with user needs. Client Extensions offer a modern approach to extending Liferay that minimizes dependencies on the platform’s core.

### Key Benefits

#### Loosely-Coupled Architecture

Client Extensions are separate from the core Liferay platform and interact with Liferay DXP through Headless APIs. This separation ensures that customizations do not interfere with the core platform, facilitating easier upgrades.

#### Faster and Continuous Innovation

The loosely-coupled nature of these extensions allows Liferay to deliver updates more frequently, with quarterly releases of Liferay DXP. This accelerates the introduction of new features and improvements, enabling partners and Liferay’s Customer Success teams to engage more regularly with clients to integrate the latest capabilities.

#### Flexible Developer Skill Set

The need for Liferay-specific developers is reduced as Client Extensions can be developed using popular frontend and backend technologies. Developers skilled in JavaScript frameworks like React, Angular, Vue, or backend frameworks such as Spring Boot can effectively work with Liferay DXP via Headless APIs.

### Role of Partners

Partners are instrumental in helping clients:

- Develop a Software Development Life Cycle (SDLC) for extensions.
- Utilize Low-Code / No-Code development tools.
- Implement custom backend services and frontend development.
- Optimize the performance of custom solutions.
- Maintain and update customizations as needed.

By leveraging Client Extensions, organizations can adapt Liferay DXP to meet dynamic market demands and user expectations more swiftly and efficiently.


# Deploying Liferay Client Extensions with Docker: A Step-by-Step Guide

## Introduction

In the fast-evolving world of web development, efficiency and scalability are paramount. Liferay DXP provides a robust platform for building enterprise solutions, and with Docker, setting up and managing your development environment has never been easier. This guide will walk you through the process of deploying Liferay client extensions using Docker, ensuring you get up and running with minimal fuss.

## Prerequisites

Before diving into the deployment process, ensure you have the following:

- **Docker Engine**: Confirm that Docker is installed and running on your machine. [Download Docker](https://www.docker.com/products/docker-desktop).
- **Liferay DXP Knowledge**: A basic understanding of Liferay's architecture and client extensions will help you follow along more effectively.
- **Liferay Account**: While optional, a Liferay account provides access to additional resources and documentation.

## Step 1: Clone the Repository

Start by cloning the Liferay Docker client extensions repository:

```bash
git clone https://github.com/lgdd/liferay-docker-client-extensions.git
``` 

This repository contains the necessary Docker configurations and sample extensions.

## Setting Up the Project
Navigate into the project directory and start up the Docker containers:

```bash
cd liferay-docker-client-extensions
docker-compose up -d
```

You can now access your Liferay instance at http://localhost:8080/.

## Deploying the Activation Key
To fully activate your Liferay instance, you'll need to deploy an activation key:

```bash
docker cp 'C:\Users\Hasnain Ahmed Shaikh\Downloads\activation-key-dxpdevelopment-7.4-developeractivationkeys.xml' <container_id>:/opt/liferay/deploy
```

Replace <container_id> with your container's ID. Refresh your browser at http://localhost:8080/ to activate the license.

## Building the Project
Build the project using the Gradle Wrapper:

```bash
./gradlew clean build
```
This command compiles all the modules in the project, preparing them for deployment.

## React & Node.js Applications
### Build and Deploy a React Application
Navigate to the client extensions directory and build the React application:

```bash
cd client-extensions
./gradlew clean build
```

For building a specific module, use:

```bash
../gradlew clean build -p react-js
```

Once built, package and copy the output to the Liferay deploy folder:

```bash
docker cp .\client-extensions\react-js\dist\project.zip <container_id>:/opt/liferay/deploy
```
## Node JS

To make the [Node JS Sample](https://github.com/lgdd/liferay-client-extensions-samples/tree/main/liferay-sample-etc-node) work, you need to make the following list of changes.

### Build and Deploy a Node Application
Navigate to the client extensions directory and build the Node application:

```bash
cd client-extensions
./gradlew clean build
```

For building a specific module, use:

```bash
../gradlew clean build -p node-js
```

### Local Development (Running Server Independently) without Docker

When running the Node.js application locally without Docker using yarn start:

1. Change the main domain to `localhost:8080`.

### Running with Docker

When running the Node.js application within Docker:

1. Keep the main domain set to `liferay:8080`.

### Updating Domain Configuration on the Fly

To change the domain configuration while the application is running in Docker:

1. Navigate to the Docker container's directory:

```
/opt/liferay/dxp-metadata/com.liferay.lxc.dxp.mainDomain
```

## Deploying on Liferay SaaS Server
For Liferay SaaS users, deploy using the command-line tool:

```bash
lcp list
lcp deploy --extension [extension-zip-file]
```

## Conclusion
Deploying Liferay client extensions with Docker simplifies the development process, allowing you to focus on creating custom functionality and enhancing user experience. Whether you're working locally or deploying to a SaaS environment, Docker and Liferay make a powerful combination for modern web development.

