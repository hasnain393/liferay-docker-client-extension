/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import cors from 'cors';
import {verify} from 'jsonwebtoken';
import jwktopem from 'jwk-to-pem';
import fetch from 'node-fetch';

import config from './configTreePath.js';
import {logger} from './logger.js';

const domains = config['com.liferay.lxc.dxp.domains'];
const externalReferenceCode = config[
	'liferay.oauth.application.external.reference.codes'
].split(',')[0];
const lxcDXPMainDomain = config['com.liferay.lxc.dxp.mainDomain'];
const lxcDXPServerProtocol = config['com.liferay.lxc.dxp.server.protocol'];

const clientId =
  config[
    "liferay-sample-etc-node-oauth-application-headless-server.client.id"
  ];
const clientSecret =
  config[
    "liferay-sample-etc-node-oauth-application-headless-server.secret"
  ];

const uriPath =
	config[externalReferenceCode + '.oauth2.jwks.uri'] || '/o/oauth2/jwks';

const oauth2JWKSURI = `${lxcDXPServerProtocol}://${lxcDXPMainDomain}${uriPath}`;

const allowList = domains
	.split(',')
	.map((domain) => `${lxcDXPServerProtocol}://${domain}`);

const corsOptions = {
	origin(origin, callback) {
		callback(null, allowList.includes(origin));
	},
};

export const baseURL = `${lxcDXPServerProtocol}://${lxcDXPMainDomain}`;

export async function corsWithReady(req, res, next) {
	if (req.originalUrl === config.readyPath) {
		return next();
	}

	return cors(corsOptions)(req, res, next);
}



export async function liferayJWT(req, res, next) {
	if (req.path === config.readyPath) {
		return next();
	}

	const authorization = req.headers.authorization;

	if (!authorization) {
		res.status(401).send('No authorization header');

		return;
	}

	const [, bearerToken] = req.headers.authorization.split('Bearer ');

	try {
		const jwksResponse = await fetch(oauth2JWKSURI);

		if (jwksResponse.status === 200) {
			const jwks = await jwksResponse.json();

			const jwksPublicKey = jwktopem(jwks.keys[0]);

			const decoded = verify(bearerToken, jwksPublicKey, {
				algorithms: ['RS256'],
				ignoreExpiration: true, // TODO we need to use refresh token
			});

			const applicationResponse = await fetch(
				`${lxcDXPServerProtocol}://${lxcDXPMainDomain}/o/oauth2/application?externalReferenceCode=${externalReferenceCode}`
			);

			const {client_id} = await applicationResponse.json();

			if (decoded.client_id === client_id) {
				req.jwt = decoded;

				next();
			}
			else {
				logger.log(
					'JWT token client_id value does not match expected client_id value.'
				);

				res.status(401).send('Invalid authorization');
			}
		}
		else {
			logger.error(
				'Error fetching JWKS %s %s',
				jwksResponse.status,
				jwksResponse.statusText
			);

			res.status(401).send('Invalid authorization header');
		}
	}
	catch (error) {
		logger.error('Error validating JWT token\n%s', error);

		res.status(401).send('Invalid authorization header');
	}
}
 

export async function userDetails(req, res) {
	try {
	  // Fetch the user details from Liferay
	  console.log(req);
	  const user = await fetchUserAccount(req.jwt.username);
	  if (!user) {
		return res.status(404).json({ error: "User not found" });
	  }
  
	  return res.status(200).json(user);
	} catch (error) {
	  console.error("Error fetching user:", error);
	  return res.status(500).json({ error: "Unable to retrieve user" });
	}
  }

  async function fetchUserAccount(email) {
	try {
	  const url = `${baseURL}/o/headless-admin-user/v1.0/user-accounts?filter=emailAddress eq '${email}'`;
	  console.log("-------------------------------------------------->");
	  console.log(url);
	  
	  // Call the refactored getFromEndpoint function with the constructed URL
	  const data = await getFromEndpoint(url);
  
	  if (data.items.length === 0) {
		throw new Error(`User with email ${email} not found`);
	  }
  
	  return data.items[0];
	} catch (error) {
	  console.error("Error fetching user account:", error);
	  throw new Error("Unable to retrieve user account");
	}
  }

  async function getFromEndpoint(endpoint) {
	return await requestToEndpoint("GET", endpoint);
  }
  async function requestToEndpoint(method, endpoint, body = null, responseType) {
	try {
	  const token = await getAdminToken();
	  const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization: `${token.token_type} ${token.access_token}`,
	  };
  
	  const options = {
		method: method,
		headers: headers,
	  };
  
	  // Add the body to the request if it's provided (for POST or PUT requests)
	  if (body && (method === "POST" || method === "PUT")) {
		options.body = JSON.stringify(body);
	  }
  
	  const response = await fetch(endpoint, options);
  
	  if (!response.ok) {
		throw new Error(
		  `Error ${method}ing to endpoint: ${endpoint}. Status message: ${response.statusText}`
		);
	  }
  
	  // Parse the response based on the method
	  if (method === "GET" || responseType === "json") {
		return await response.json();
	  } else {
		return await response.text(); // For DELETE, POST, etc.
	  }
	} catch (error) {
	  console.error(`Error ${method}ing to endpoint: ${endpoint}`, error);
	  throw new Error(`Unable to perform ${method} operation`);
	}
  }  

  async function getAdminToken() {
	try {
	  const requestOptions = {
		method: "POST",
		headers: {
		  "Content-Type": "application/x-www-form-urlencoded",
		},
	  };
  
	  const response = await fetch(
		`${baseURL}/o/oauth2/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
		requestOptions
	  );
  
	  if (!response.ok) {
		throw new Error(`Failed to fetch admin token: ${response.statusText}`);
	  }
  
	  const data = await response.json();
	  return data;
	} catch (error) {
	  console.error("Error fetching admin token:", error);
	  throw new Error("Unable to retrieve admin token");
	}
  }