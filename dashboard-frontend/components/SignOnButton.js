import React from 'react';
import Image from 'next/image';

function SignOnButton({ provider }) {
  return (
    <a href={`http://localhost:1337/api/connect/${provider}`} className="link">
      <button className={`${provider}`}>
        <Image
          src={`/${provider}-icon.png`}
          alt={`${provider} icon`}
          width={30}
          height={30}
          className="icon"
        />
        <span className="text">Sign in with {`${provider}`}</span>
      </button>
    </a>
  );
}

export default SignOnButton;
