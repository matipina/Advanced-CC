// =========================================
// Palindrome Logic (Business Logic)
// This file contains pure JavaScript functions that process data 
// without touching the DOM or HTML directly.
// =========================================

/**
 * Reverses a string.
 * Uses split('') to convert to array, reverse() to flip it, and join('') to make it a string again.
 * @param {string} str 
 * @returns {string} The reversed string
 */
function reverseString(str) {
    return str.split('').reverse().join('');
}

/**
 * Cleans a string by removing spaces, punctuation, and converting to lowercase.
 * Uses a Regular Expression (RegEx) to replace anything that is NOT a letter or number.
 * @param {string} str 
 * @returns {string} The cleaned string
 */
function cleanString(str) {
    // \W matches any non-word character (equivalent to [^a-zA-Z0-9_])
    // _ matches underscores
    // We replace them with an empty string ''
    return str.toLowerCase().replace(/[\W_]/g, '');
}

/**
 * Checks if a string reads the same forwards and backwards.
 * @param {string} str 
 * @returns {boolean} True if palindrome, False otherwise
 */
function isPalindrome(str) {
    // Use the reverseString helper function
    const reversedStr = reverseString(str);
    return str === reversedStr;
}
