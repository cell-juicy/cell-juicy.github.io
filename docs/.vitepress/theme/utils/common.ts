export function processOrder(order: any): number {
    return isNaN(Number(order)) ? 0 : Number(order); 
}