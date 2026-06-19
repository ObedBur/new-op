
export const ProductMapper = {
  /**
   * Splits internal price string into value and currency.
   * Example: "45 $" -> { amount: "45", currency: "$" }
   */
  parsePrice(price: string | number | undefined) {
    if (price === undefined) return { amount: '0', currency: '?' };
    if (typeof price === 'number') return { amount: price.toString(), currency: '$' };
    
    // Handle "45$" or "45 $" or "78000 FC"
    const match = price.match(/^([\d.,]+)\s?(.+)?$/);
    if (match) {
      let detectedCurrency = (match[2] || '$').trim();
      if (detectedCurrency.toUpperCase() === 'FC') detectedCurrency = '$';
      
      return {
        amount: match[1],
        currency: detectedCurrency
      };
    }

    return {
      amount: price.toString(),
      currency: '?'
    };
  }
};
