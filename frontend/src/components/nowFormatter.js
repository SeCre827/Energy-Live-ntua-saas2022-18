const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

export const nowRequestFormatter = () => {
    const now = new Date();
    return `${now.getFullYear()}${months[now.getMonth()]}${now.getDate().toString().padStart(2, '0')}`;
}

export const nowDateFormatter = () => {
    const now = new Date();
    return `${now.getFullYear()}-${months[now.getMonth()]}-${now.getDate().toString().padStart(2, '0')}`;
}