export function formatCOP(value: number): string {
    const formatted = new Intl.NumberFormat("es-CO", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(value);

    return `$${formatted}`;
}