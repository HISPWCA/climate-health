export function consecutivePeaks(array) {
    let peakCount = 0; // Compte le nombre total de pics
    let peakLengths = {}; // Stocke la fréquence de chaque longueur de pics
    let currentPeakLength = 0; // Longueur du pic actuel
    let longestPeakLength = 0; // Longueur du pic le plus long

    for (let i = 0; i < array.length; i++) {
        if (array[i] === 1) {
            currentPeakLength++; // Incrémenter la longueur du pic actuel
        } else {
            if (currentPeakLength > 0) { // Un pic est détecté
                peakCount++; // Incrémenter le nombre total de pics
                peakLengths[currentPeakLength] = (peakLengths[currentPeakLength] || 0) + 1;
                longestPeakLength = Math.max(longestPeakLength, currentPeakLength); // Mettre à jour le pic le plus long
            }
            currentPeakLength = 0; // Réinitialiser la longueur du pic
        }
    }

    // Vérifier si un pic se termine à la fin du tableau
    if (currentPeakLength > 1) {
        peakCount++;
        peakLengths[currentPeakLength] = (peakLengths[currentPeakLength] || 0) + 1;
        longestPeakLength = Math.max(longestPeakLength, currentPeakLength); // Mettre à jour le pic le plus long
    }

    return {
        totalPeaks: peakCount,
        peakLengths: peakLengths,
        longestPeak: longestPeakLength === 0 ? 0 : longestPeakLength + 3,
    };
}