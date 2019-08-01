function currencySymbol(name) {
  const currencySymbols = {
    USD: "$", // US Dollar
    EUR: "€", // Euro
    CRC: "₡", // Costa Rican Colón
    GBP: "£", // British Pound Sterling
    ILS: "₪", // Israeli New Sheqel
    INR: "₹", // Indian Rupee
    JPY: "¥", // Japanese Yen
    KRW: "₩", // South Korean Won
    NGN: "₦", // Nigerian Naira
    PHP: "₱", // Philippine Peso
    PLN: "zł", // Polish Zloty
    PYG: "₲", // Paraguayan Guarani
    THB: "฿", // Thai Baht
    UAH: "₴", // Ukrainian Hryvnia
    VND: "₫" // Vietnamese Dong
  };
  return currencySymbols[name] || name;
}

function formatCurrency(num, currency) {
  const formattedNumber = num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"); // 12,345.67
  return `${currencySymbol(currency)}${formattedNumber}`;
}

function formatPercentage(num, digits = 0) {
  return Number(num).toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: digits
  });
}

export { formatCurrency, formatPercentage };
