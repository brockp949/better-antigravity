/**
 * Better Antigravity - Auto-Scroller Payload
 * 
 * Injected into workbench.html to observe DOM and force
 * the chat container AND all scrollable ancestor containers to scroll
 * to the bottom. Adds strong redundancy using the native 'Scroll to bottom' button.
 */
(function() {
    console.log('[Better Antigravity] Auto-scroller payload initialized');

    let isUserScrolling = false;
    let scrollTimeout = null;

    // Detect manual user scrolling intent on the entire window to pause aggressive scrolling
    window.addEventListener('wheel', () => handleUserInput(), { passive: true });
    window.addEventListener('touchmove', () => handleUserInput(), { passive: true });
    window.addEventListener('mousedown', () => handleUserInput(), { passive: true });

    function handleUserInput() {
        isUserScrolling = true;
        
        clearTimeout(scrollTimeout);
        // Pause auto-scrolling for 4 seconds after any manual interaction
        scrollTimeout = setTimeout(() => {
            isUserScrolling = false;
        }, 4000);
    }

    /**
     * Periodically check for the native "Scroll to bottom" button or manually fix scroll.
     */
    setInterval(() => {
        if (isUserScrolling) return;

        // 1. Redundancy: Try targeting the native "Scroll to bottom" button first
        const scrollBtn = document.querySelector('button[aria-label="Scroll to bottom"]');
        if (scrollBtn) {
            // Only click if it's visible (opacity is 1 or no opacity-0 class)
            const style = window.getComputedStyle(scrollBtn);
            if (style.opacity !== '0' && style.display !== 'none' && scrollBtn.offsetParent !== null) {
                scrollBtn.click();
            }
        }

        // 2. Fallback: Force every scrollable area that looks like a chat down
        document.querySelectorAll('.relative.flex.flex-col.gap-y-3.px-4, .antigravity-chat-scroll-area').forEach(chatContainer => {
            let current = chatContainer;
            while (current && current !== document.documentElement) {
                const s = window.getComputedStyle(current);
                if ((s.overflowY === 'auto' || s.overflowY === 'scroll' || s.overflowY === 'overlay') && current.scrollHeight > current.clientHeight + 1) {
                    current.scrollTop = current.scrollHeight;
                }
                current = current.parentElement;
            }
        });

    }, 250); // Aggressive 250ms polling loop

})();
