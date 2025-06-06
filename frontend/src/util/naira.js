const formatAsNaira = (amount) => {
    // Format the number as currency with Naira symbol
    const formatter = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    });
  
    // Use the formatter to format the amount
    return formatter.format(amount);
  };
  
  
  
  const capitalizeFirstLetter = (string) => {
  return string
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Usage in your component
