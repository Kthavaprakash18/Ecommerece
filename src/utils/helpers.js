export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export const calcDiscount = (original, price) =>
  original > price ? Math.round(((original - price) / original) * 100) : 0;

export const truncate = (str, len = 80) =>
  str && str.length > len ? str.slice(0, len) + '…' : str;

export const starArray = (rating) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return [...Array(full).fill('full'), ...Array(half).fill('half'), ...Array(empty).fill('empty')];
};
