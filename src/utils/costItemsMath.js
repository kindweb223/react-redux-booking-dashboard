export function computeCostItemsSummary(costItems, discount) {
  const netSubtotal =
    costItems &&
    costItems.reduce(
      (acc, item) =>
        acc + item.quantity * item.unitPrice * (1 - discount / 100),
      0
    );

  const taxes =
    costItems &&
    costItems.reduce(
      (acc, item) =>
        acc +
        (item.quantity * item.unitPrice * (1 - discount / 100) * item.vatRate) /
          100,
      0
    );

  const grandTotal = netSubtotal + taxes;

  return [netSubtotal, taxes, grandTotal];
}
