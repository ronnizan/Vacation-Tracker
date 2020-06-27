import React from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import { Config } from '../../config';

const Google = ({ informParent = (f: any) => f }) => {
    const responseGoogle = (response: any) => {
        console.log(response.tokenId);
        axios({
            method: 'POST',
            url: `${Config.serverUrl}/api/auth/google-login`,
            data: { idToken: response.tokenId }
        })
            .then(response => {
                console.log('GOOGLE SIGNIN SUCCESS', response);
                // inform parent component
                informParent(response);
            })
            .catch(error => {
                console.log('GOOGLE SIGNIN ERROR', error.response);
            });
    };
    return (
        <div className="pb-3">
            <GoogleLogin
                clientId={''}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                render={renderProps => (
                    <button
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        className="btn btn-danger btn-lg btn-block"
                    >
                        <i className="fab fa-google pr-2"></i> Sign In   With Google
                    </button>
                )}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    );
};

export default Google;