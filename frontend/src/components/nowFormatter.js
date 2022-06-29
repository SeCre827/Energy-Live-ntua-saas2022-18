const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

export const nowRequestFormatter = () => {
    const now = new Date();
    return `${now.getFullYear()}${months[now.getMonth()]}${now.getDate()}`;
}

export const nowDateFormatter = () => {
    const now = new Date();
    return `${now.getFullYear()}-${months[now.getMonth()]}-${now.getDate()}`;
}