/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export default {
	'configTreePaths': [
		process.env.LIFERAY_ROUTES_CLIENT_EXTENSION,
		process.env.LIFERAY_ROUTES_DXP??"dxp-metadata",
	],
	'liferay.oauth.application.external.reference.codes':
		'liferay-sample-etc-node-oauth-application-user-agent',
	'readyPath': '/ready',
	'server.port': 3001,
};
