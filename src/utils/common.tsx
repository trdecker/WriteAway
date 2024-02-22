/**
 * @description Common utility functions for various purposes.
 * 
 * @author Tad Decker
 * 2-22-2024
 */


/**
 * Generates a random ID using the current date and a random number 0-10000.
 * @returns {number} random ID
 */
export function generateId(): number {
  const now = Date.now()
  const rand = Math.floor(Math.random() * 10000)
  return now + rand
}