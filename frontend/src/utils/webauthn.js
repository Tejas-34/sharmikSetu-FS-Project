const base64urlToUint8Array = (value) => {
  const padding = '='.repeat((4 - (value.length % 4)) % 4);
  const base64 = `${value.replace(/-/g, '+').replace(/_/g, '/')}${padding}`;
  const binary = window.atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const arrayBufferToBase64url = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

export const isPasskeySupported = () =>
  Boolean(window.PublicKeyCredential && navigator.credentials && window.isSecureContext);

export const assertPasskeySupported = () => {
  if (!window.isSecureContext) {
    throw new Error('Passkeys require a secure context (HTTPS or localhost).');
  }
  if (!window.PublicKeyCredential || !navigator.credentials) {
    throw new Error('Passkeys are not supported in this browser/device.');
  }
};

export const parseRegistrationOptions = (publicKey) => ({
  ...publicKey,
  challenge: base64urlToUint8Array(publicKey.challenge),
  user: {
    ...publicKey.user,
    id: base64urlToUint8Array(publicKey.user.id),
  },
  excludeCredentials: (publicKey.excludeCredentials || []).map((credential) => ({
    ...credential,
    id: base64urlToUint8Array(credential.id),
  })),
});

export const parseAuthenticationOptions = (publicKey) => ({
  ...publicKey,
  challenge: base64urlToUint8Array(publicKey.challenge),
  allowCredentials: (publicKey.allowCredentials || []).map((credential) => ({
    ...credential,
    id: base64urlToUint8Array(credential.id),
  })),
});

export const serializeRegistrationCredential = (credential) => {
  const { response } = credential;
  return {
    id: credential.id,
    rawId: arrayBufferToBase64url(credential.rawId),
    type: credential.type,
    response: {
      attestationObject: arrayBufferToBase64url(response.attestationObject),
      clientDataJSON: arrayBufferToBase64url(response.clientDataJSON),
      transports: typeof response.getTransports === 'function' ? response.getTransports() : [],
    },
    authenticatorAttachment: credential.authenticatorAttachment || null,
    clientExtensionResults: credential.getClientExtensionResults(),
  };
};

export const serializeAuthenticationCredential = (credential) => {
  const { response } = credential;
  return {
    id: credential.id,
    rawId: arrayBufferToBase64url(credential.rawId),
    type: credential.type,
    response: {
      authenticatorData: arrayBufferToBase64url(response.authenticatorData),
      clientDataJSON: arrayBufferToBase64url(response.clientDataJSON),
      signature: arrayBufferToBase64url(response.signature),
      userHandle: response.userHandle ? arrayBufferToBase64url(response.userHandle) : null,
    },
    authenticatorAttachment: credential.authenticatorAttachment || null,
    clientExtensionResults: credential.getClientExtensionResults(),
  };
};
