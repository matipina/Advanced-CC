/* =========================================
   Week 11 - Palindrome Demo JavaScript
   A comprehensive example of form events, input events, localStorage, and DOM manipulation.
========================================= */

// 1. Wait for the HTML document to fully load before running our code
document.addEventListener('DOMContentLoaded', () => {

    // 2. Select the HTML elements we need to interact with
    const palindromeForm = document.getElementById('palindromeForm');
    const wordInput = document.getElementById('wordInput');
    const charCount = document.getElementById('charCount');
    const wordDisplay = document.getElementById('wordDisplay');
    const resultMessage = document.getElementById('resultMessage');
    const flipBtn = document.getElementById('flipBtn');
    
    const highScoreContainer = document.getElementById('highScoreContainer');
    const highScoreDisplay = document.getElementById('highScoreDisplay');
    const clearHighScoreBtn = document.getElementById('clearHighScoreBtn');

    // Track state
    let isFlipped = false;

    // Load high score on page load
    loadHighScore();

    // 3. INPUT EVENT LISTENER - Real-time feedback
    wordInput.addEventListener('input', function(event) {
        const currentText = event.target.value;
        const cleanedText = cleanString(currentText);
        
        // Update character counter
        charCount.textContent = cleanedText.length + ' characters';

        // Real-time previz updates
        wordDisplay.textContent = isFlipped ? reverseString(cleanedText) : currentText;
        
        // Hide result message when typing
        resultMessage.classList.add('hidden');
        document.body.className = '';
    });

    // 4. FORM SUBMIT LISTENER
    palindromeForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop page refresh!
        
        const originalInput = wordInput.value.trim();
        const cleanedInput = cleanString(originalInput);

        resetFlip();

        if (cleanedInput.length === 0) {
            showWarning("Please enter a word or phrase first.");
            return;
        }

        wordDisplay.textContent = originalInput;
        displayResult(isPalindrome(cleanedInput), originalInput, cleanedInput.length);
    });

    // 5. FLIP BUTTON LISTENER
    flipBtn.addEventListener('click', function () {
        const originalInput = wordInput.value.trim();
        const cleanedInput = cleanString(originalInput);

        if (originalInput.length === 0) {
            showWarning("Please enter a word or phrase first.");
            return;
        }

        isFlipped = !isFlipped;
        wordDisplay.textContent = isFlipped ? reverseString(cleanedInput) : originalInput;
        flipBtn.textContent = isFlipped ? 'Un-Flip' : 'Flip';

        resultMessage.classList.add('hidden');
        document.body.className = '';
    });

    // 6. CLEAR HIGH SCORE LISTENER
    clearHighScoreBtn.addEventListener('click', function() {
        clearHighScore();
    });

    // --- Helper Functions Below ---

    /**
     * Updates the DOM to display the success or failure states.
     * If successful, saves to localStorage.
     * @param {boolean} isPal 
     * @param {string} original 
     * @param {number} cleanedLength 
     */
    function displayResult(isPal, original, cleanedLength) {
        resultMessage.classList.remove('hidden');
        
        if (isPal) {
            resultMessage.textContent = `Yes! "${original}" is a palindrome.`;
            resultMessage.className = 'result-message success';
            document.body.className = 'state-success';
            saveHighScore(original, cleanedLength);
        } else {
            resultMessage.textContent = `No. "${original}" is not a palindrome.`;
            resultMessage.className = 'result-message error';
            document.body.className = 'state-error';
        }
    }

    /**
     * Displays a warning if the input is empty or invalid.
     * @param {string} msg 
     */
    function showWarning(msg) {
        resultMessage.textContent = msg;
        resultMessage.className = 'result-message warning';
        document.body.className = '';
    }

    /**
     * Resets the flip state.
     */
    function resetFlip() {
        isFlipped = false;
        flipBtn.textContent = 'Flip';
    }

    // --- localStorage FUNCTIONS - Saving data across page reloads ---

    /**
     * Loads the high score from localStorage and displays it.
     */
    function loadHighScore() {
        try {
            // Retrieve the data string we saved earlier
            const stored = localStorage.getItem('palindrome_highScore');
            if (stored) {
                // Convert the JSON string back into a real JavaScript object
                const data = JSON.parse(stored);
                displayHighScore(data);
            }
        } catch (error) {
            console.error('Error loading high score:', error);
        }
    }

    /**
     * Saves a palindrome to localStorage if it's longer than the current high score.
     * @param {string} word - The original word
     * @param {number} cleanedLength - The length after cleaning (spaces/punctuation removed)
     */
    function saveHighScore(word, cleanedLength) {
        try {
            const stored = localStorage.getItem('palindrome_highScore');
            let currentBest = null;
            
            if (stored) {
                currentBest = JSON.parse(stored);
            }
            
            // Only save if this is longer than current best (or if there's no best yet)
            if (!currentBest || cleanedLength > currentBest.cleanedLength) {
                const newHighScore = {
                    word: word,
                    cleanedLength: cleanedLength,
                    cleanedVersion: cleanString(word)
                };
                
                // JSON.stringify converts our object to a string format so localStorage can save it
                localStorage.setItem('palindrome_highScore', JSON.stringify(newHighScore));
                displayHighScore(newHighScore);
            }
        } catch (error) {
            console.error('Error saving high score:', error);
        }
    }

    /**
     * Displays the high score in the UI.
     * @param {object} data - The high score data object
     */
    function displayHighScore(data) {
        highScoreDisplay.textContent = `"${data.word}" (${data.cleanedLength} characters)`;
        highScoreContainer.classList.remove('hidden');
    }

    /**
     * Clears the high score from localStorage and updates the UI.
     */
    function clearHighScore() {
        try {
            localStorage.removeItem('palindrome_highScore');
            highScoreContainer.classList.add('hidden');
        } catch (error) {
            console.error('Error clearing high score:', error);
        }
    }
});