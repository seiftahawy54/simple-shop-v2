const extractMimeType = (base64String: string) => {
    const regex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/;
    const match = base64String.match(regex);

    if (match) {
        return match[1].split('/')[1];
    } else {
        return null;
    }
}



export {extractMimeType}