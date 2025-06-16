// consistent color based on a string
export function stringToColor(str: string) {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // predefined set of colors
    const colors = [
        '#25D366', // WhatsApp green
        '#128C7E', // WhatsApp dark green
        '#34B7F1', // WhatsApp blue
        '#075E54', // WhatsApp teal
        '#4CAF50', // Material green
        '#2196F3', // Material blue
        '#3F51B5', // Material indigo
        '#00BCD4', // Material cyan
    ];

    // Use the hash to pick a color from the predefined list
    return colors[Math.abs(hash) % colors.length];
}
