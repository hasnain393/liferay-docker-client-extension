import React from 'react';
import { Liferay } from '../services/liferay/liferay.js';

let oAuth2Client;

try {
    oAuth2Client = Liferay.OAuth2Client.FromUserAgentApplication(
        'liferay-sample-etc-node-oauth-application-user-agent'
    );
} catch (error) {
    console.error(error);
}

function Headless() {
    const [headlessData, setHeadlessData] = React.useState(null);
    const [roles, setRoles] = React.useState([]);

    React.useEffect(() => {
        oAuth2Client?.fetch('/my-user-account')
           // .then(response => response.json()) // Uncommented this to ensure proper JSON parsing
            .then(data => {
                console.log("Fetched data:", data); // Debugging: Check the fetched data
                setHeadlessData({
                    status: data.status,
                    name: data.name,
                    roles: data.roleBriefs.map(role => role.name) // Extracting role names
                });
                setRoles(data.roleBriefs.map(role => role.name)); // Saving roles to state
            })
            .catch(error => console.error("Fetch error:", error));
    }, []);

    React.useEffect(() => {
        if (headlessData) {
            console.log("State after update:", headlessData); // Log state after it updates
        }
    }, [headlessData]); // This useEffect depends on `headlessData`

    return (
        <div>
            {headlessData ? (
                <>
                    
                    <h2>Status: {headlessData.status}</h2>
                    <h2>Name: {headlessData.name}</h2>
                    <h3>Roles:</h3>
                    <ul>
                        {roles.map((role, index) => (
                            <li key={index}>{role}</li> // Display each role
                        ))}
                    </ul>
                </>
            ) : (
                <div>Headless...</div>
            )}
        </div>
    );
}

export default Headless;
