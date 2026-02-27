const parseNumber = (e: React.ChangeEvent<HTMLInputElement>, originNumber: number) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 12) return originNumber;

    const parsed = raw === "" ? 0 : Number(raw);

    if (originNumber === 0 && raw.length === 2) {
        const singleDigit = Number(raw.replace("0", ""));
        return singleDigit;
    } else {
        return parsed;
    }
}

export default parseNumber;