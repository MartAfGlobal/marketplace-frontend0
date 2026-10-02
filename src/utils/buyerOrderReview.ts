export interface BuyerOrderReviewItem {
  has_reviewed?: boolean | null;
  can_review?: boolean | null;
}

export interface BuyerOrderReviewSource extends BuyerOrderReviewItem {
  order_items?: BuyerOrderReviewItem[] | null;
  items?: BuyerOrderReviewItem[] | null;
}

export function getOrderReviewState(order: BuyerOrderReviewSource | null | undefined) {
  if (!order) {
    return { hasReviewableItems: false, canReview: false, allReviewed: false };
  }

  const items = [order.order_items, order.items].find(
    (candidate) => Array.isArray(candidate) && candidate.length > 0,
  );
  const candidates = items?.length ? items : [order];
  const reviewableItems = candidates.filter(
    (item) => item.has_reviewed === true || item.can_review !== false,
  );

  return {
    hasReviewableItems: reviewableItems.length > 0,
    canReview: reviewableItems.some(
      (item) => item.has_reviewed !== true && item.can_review !== false,
    ),
    allReviewed:
      reviewableItems.length > 0 &&
      reviewableItems.every((item) => item.has_reviewed === true),
  };
}