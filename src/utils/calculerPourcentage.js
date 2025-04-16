export const calculerPourcentage = (partie, total) => {
    if (total === 0) {
        return 0; // Évite une division par zéro
    }

    return Math.round((partie / total) * 100);
}
