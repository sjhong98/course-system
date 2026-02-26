const formatNumber = (number: number, minimumFractionDigits: number = 2, maximumFractionDigits: number = 2) => {
    if (Number.isNaN(number) || !Number.isFinite(number)) return 'N/A';
    return number.toLocaleString(undefined, { minimumFractionDigits, maximumFractionDigits });
}

export default formatNumber;