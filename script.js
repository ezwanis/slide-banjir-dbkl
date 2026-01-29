// Slide Navigation System
let currentSlide = 1;
const totalSlides = 12;

// Initialize presentation
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key >= '1' && e.key <= '9') {
            goToSlide(parseInt(e.key));
        } else if (e.key === '0') {
            goToSlide(10);
        } else if (e.key === 'Home') {
            goToSlide(1);
        } else if (e.key === 'End') {
            goToSlide(totalSlides);
        }
    });
    
    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide();
        }
    }
    
    // Animate content cards when slide becomes active
    observeSlideChanges();
});

// Navigate to next slide
function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        showSlide(currentSlide);
    }
}

// Navigate to previous slide
function prevSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        showSlide(currentSlide);
    }
}

// Go to specific slide
function goToSlide(slideNumber) {
    if (slideNumber >= 1 && slideNumber <= totalSlides) {
        currentSlide = slideNumber;
        showSlide(currentSlide);
    }
}

// Show the specified slide
function showSlide(slideNumber) {
    // Remove active class from all slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Add active class to current slide
    const activeSlide = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
    if (activeSlide) {
        activeSlide.classList.add('active');
    }
    
    // Update navigation
    updateNavigation();
    
    // Trigger animations for content cards
    triggerSlideAnimations(activeSlide);
}

// Update navigation buttons and indicators
function updateNavigation() {
    // Update slide indicator
    document.querySelector('.current-slide').textContent = currentSlide;
    
    // Update navigation buttons
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;
    
    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index + 1 === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Trigger animations when slide becomes active
function triggerSlideAnimations(slide) {
    if (!slide) return;
    
    // Reset and trigger fade-in animations
    const fadeElements = slide.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = '';
        }, 10);
    });
    
    // Animate solution cards
    const solutionCards = slide.querySelectorAll('.solution-card');
    solutionCards.forEach((card, index) => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = `fadeInScale 0.6s ease-out ${index * 0.1}s forwards`;
        }, 10);
    });
    
    // Animate timeline items
    const timelineItems = slide.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 150);
    });
    
    // Animate component items
    const componentItems = slide.querySelectorAll('.component-item');
    componentItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Observe slide changes for animations
function observeSlideChanges() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('active')) {
                    triggerSlideAnimations(target);
                }
            }
        });
    });
    
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        observer.observe(slide, { attributes: true });
    });
}

// Fullscreen toggle (F11 or F key)
document.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
    }
});

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Auto-save presentation progress
function saveProgress() {
    localStorage.setItem('presentationSlide', currentSlide);
}

function loadProgress() {
    const savedSlide = localStorage.getItem('presentationSlide');
    if (savedSlide) {
        goToSlide(parseInt(savedSlide));
    }
}

// Add slide counter on every slide change
window.addEventListener('beforeunload', saveProgress);

// Prevent accidental page refresh during presentation
window.addEventListener('beforeunload', (e) => {
    if (currentSlide > 1 && currentSlide < totalSlides) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Add visual feedback for interactions
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

// Smooth scroll for content areas
document.querySelectorAll('.slide-content').forEach(content => {
    content.style.scrollBehavior = 'smooth';
});

// Download PDF Function - Direct Print Method
function downloadPDF() {
    // Show notification
    showNotification('📄 Print dialog akan muncul. Pilih "Save as PDF" dan enable "Background graphics"', 'success');
    
    // Small delay then trigger print
    setTimeout(() => {
        printToPDF();
    }, 500);
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 40px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-size: 1rem;
        font-weight: 600;
        animation: slideInRight 0.5s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Print to PDF Function - Shows ALL content perfectly - EXACTLY 12 PAGES
function printToPDF() {
    // Store original state
    const originalSlide = currentSlide;
    const originalStyles = new Map();
    
    // Hide navigation elements
    const navigation = document.querySelector('.navigation');
    const slideDots = document.querySelector('.slide-dots');
    const pdfButton = document.querySelector('.pdf-btn');
    
    if (navigation) navigation.style.display = 'none';
    if (slideDots) slideDots.style.display = 'none';
    if (pdfButton) pdfButton.style.display = 'none';
    
    // Get all slides - SHOULD BE EXACTLY 12
    const slides = document.querySelectorAll('.slide');
    
    // Debug: Log slide count
    console.log(`Total slides for print: ${slides.length} (should be 12)`);
    
    // Show ALL slides with ALL content for printing - EXACTLY 12 PAGES
    slides.forEach((slide, index) => {
        // Make slide visible
        slide.classList.add('active');
        
        // Apply page break ONLY if not last slide
        const pageBreak = (index < slides.length - 1) ? 'always' : 'auto';
        
        slide.style.cssText = `
            position: relative !important;
            opacity: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
            height: 100vh !important;
            min-height: 100vh !important;
            max-height: 100vh !important;
            page-break-after: ${pageBreak} !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            overflow: hidden !important;
        `;
        
        // FORCE ALL ANIMATED ELEMENTS TO BE FULLY VISIBLE
        
        // 1. Content cards (Slide 2, 3)
        const contentCards = slide.querySelectorAll('.content-card');
        contentCards.forEach(card => {
            card.style.cssText = `
                opacity: 1 !important;
                transform: none !important;
                animation: none !important;
                visibility: visible !important;
                display: flex !important;
                page-break-inside: avoid !important;
            `;
        });
        
        // 2. Solution cards (Slide 4)
        const solutionCards = slide.querySelectorAll('.solution-card');
        solutionCards.forEach(card => {
            card.style.cssText = `
                opacity: 1 !important;
                transform: none !important;
                animation: none !important;
                visibility: visible !important;
                display: flex !important;
            `;
        });
        
        // 3. Component items (Slide 5)
        const componentItems = slide.querySelectorAll('.component-item');
        componentItems.forEach(item => {
            item.style.cssText = `
                opacity: 1 !important;
                transform: translateY(0) !important;
                animation: none !important;
                visibility: visible !important;
                display: flex !important;
                transition: none !important;
            `;
        });
        
        // 4. Flow steps (Slide 6) - COMPRESSED FOR PRINT
        const flowSteps = slide.querySelectorAll('.flow-step');
        flowSteps.forEach(step => {
            step.style.cssText = `
                opacity: 1 !important;
                transform: none !important;
                animation: none !important;
                visibility: visible !important;
                display: flex !important;
                width: 150px !important;
                min-width: 150px !important;
                max-width: 150px !important;
                height: 160px !important;
                padding: 0.8rem 0.6rem !important;
                flex-shrink: 0 !important;
                box-sizing: border-box !important;
            `;
            
            // Make text smaller for print
            const h3 = step.querySelector('h3');
            if (h3) {
                h3.style.cssText = `
                    font-size: 0.9rem !important;
                    margin-bottom: 0.3rem !important;
                    line-height: 1.1 !important;
                `;
            }
            
            const p = step.querySelector('p');
            if (p) {
                p.style.cssText = `
                    font-size: 0.7rem !important;
                    line-height: 1.2 !important;
                    margin: 0 !important;
                `;
            }
            
            const icon = step.querySelector('.flow-icon');
            if (icon) {
                icon.style.cssText = `
                    font-size: 1.6rem !important;
                    margin-bottom: 0.4rem !important;
                `;
            }
        });
        
        // 5. Flow arrows (Slide 6) - SMALLER FOR PRINT
        const flowArrows = slide.querySelectorAll('.flow-arrow');
        flowArrows.forEach(arrow => {
            arrow.style.cssText = `
                opacity: 1 !important;
                transform: none !important;
                animation: none !important;
                visibility: visible !important;
                display: flex !important;
                font-size: 1.5rem !important;
                flex-shrink: 0 !important;
                width: auto !important;
                min-width: 20px !important;
            `;
        });
        
        // 5a. Flow container and wrapper (Slide 6) - SINGLE HORIZONTAL LINE
        const flowContainers = slide.querySelectorAll('.flow-container');
        flowContainers.forEach(container => {
            container.style.cssText = `
                display: flex !important;
                flex-wrap: nowrap !important;
                justify-content: center !important;
                align-items: center !important;
                overflow: hidden !important;
                width: 100% !important;
                padding: 1rem 0.5rem !important;
            `;
        });
        
        const flowWrappers = slide.querySelectorAll('.flow-wrapper');
        flowWrappers.forEach(wrapper => {
            wrapper.style.cssText = `
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 0.5rem !important;
                width: 100% !important;
            `;
        });
        
        // 6. Timeline items (Slide 7)
        const timelineItems = slide.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.style.cssText = `
                opacity: 1 !important;
                transform: translateX(0) !important;
                animation: none !important;
                visibility: visible !important;
                display: flex !important;
                transition: none !important;
            `;
        });
        
        // 7. Timeline bars (Slide 7)
        const timelineBars = slide.querySelectorAll('.timeline-bar');
        timelineBars.forEach(bar => {
            bar.style.cssText = `
                opacity: 1 !important;
                width: 100% !important;
                transform: none !important;
                animation: none !important;
                visibility: visible !important;
            `;
        });
        
        // 8. All fade-in elements
        const fadeInElements = slide.querySelectorAll('.fade-in');
        fadeInElements.forEach(el => {
            el.style.cssText = `
                opacity: 1 !important;
                transform: none !important;
                animation: none !important;
                visibility: visible !important;
            `;
        });
        
        // 9. All nested elements - ensure visible
        const allElements = slide.querySelectorAll('*');
        allElements.forEach(el => {
            // Don't hide elements that should be hidden by design
            if (!el.classList.contains('navigation') && 
                !el.classList.contains('slide-dots') && 
                !el.classList.contains('pdf-btn')) {
                el.style.visibility = 'visible';
                // Remove any opacity that might hide content
                if (window.getComputedStyle(el).opacity === '0') {
                    el.style.opacity = '1';
                }
            }
        });
        
        // 10. Ensure icons and images visible
        const icons = slide.querySelectorAll('.icon, .component-icon, .flow-icon');
        icons.forEach(icon => {
            icon.style.cssText += `
                opacity: 1 !important;
                visibility: visible !important;
                display: flex !important;
            `;
        });
        
        // 11. Specific slide adjustments for better print fit
        const slideNum = slide.getAttribute('data-slide');
        const slideContent = slide.querySelector('.slide-content');
        const slideHeader = slide.querySelector('.slide-header');
        
        // Adjust slide header for all slides with headers
        if (slideHeader) {
            slideHeader.style.cssText += `
                padding: 1rem 2rem !important;
                flex-shrink: 0 !important;
            `;
            const headerH2 = slideHeader.querySelector('h2');
            if (headerH2) {
                headerH2.style.cssText += `
                    font-size: 2rem !important;
                `;
            }
        }
        
        if (slideContent) {
            if (slideNum === '1') {
                // Slide 1: Title Slide
                const mainTitle = slide.querySelector('.main-title');
                if (mainTitle) {
                    mainTitle.style.cssText += `
                        font-size: 3.5rem !important;
                        margin-bottom: 1.5rem !important;
                    `;
                }
                const subTitle = slide.querySelector('.sub-title');
                if (subTitle) {
                    subTitle.style.cssText += `
                        font-size: 2rem !important;
                        margin-bottom: 1.5rem !important;
                    `;
                }
                const titleDivider = slide.querySelector('.title-divider');
                if (titleDivider) {
                    titleDivider.style.cssText += `
                        width: 250px !important;
                        margin: 1.5rem auto !important;
                    `;
                }
                const dateInfo = slide.querySelector('.date-info');
                if (dateInfo) {
                    dateInfo.style.cssText += `
                        margin-top: 2rem !important;
                        font-size: 1.2rem !important;
                    `;
                }
                const dbklLogo = slide.querySelector('.dbkl-logo');
                if (dbklLogo) {
                    dbklLogo.style.cssText += `
                        height: 150px !important;
                    `;
                }
            } else if (slideNum === '2') {
                // Slide 2: Objektif
                slideContent.style.cssText += `
                    padding: 0.8rem 2rem !important;
                    overflow: visible !important;
                    justify-content: space-evenly !important;
                `;
            } else if (slideNum === '3') {
                // Slide 3: Pernyataan Masalah
                slideContent.style.cssText += `
                    padding: 0.8rem 2rem !important;
                `;
                const problemBox = slide.querySelector('.problem-box');
                if (problemBox) {
                    problemBox.style.cssText += `
                        padding: 1.5rem !important;
                    `;
                }
                const problemListItems = slide.querySelectorAll('.problem-list li');
                problemListItems.forEach(li => {
                    li.style.cssText += `
                        font-size: 1rem !important;
                        line-height: 1.5 !important;
                        padding: 0.5rem 0 !important;
                    `;
                });
            } else if (slideNum === '4') {
                // Slide 4: Penyelesaian
                slideContent.style.cssText += `
                    padding: 0.8rem 2rem !important;
                `;
                const solutionGrid = slide.querySelector('.solution-grid');
                if (solutionGrid) {
                    solutionGrid.style.cssText += `
                        gap: 1rem !important;
                    `;
                }
            } else if (slideNum === '5') {
                // Slide 5: Komponen Sistem
                slideContent.style.cssText += `
                    padding: 0.6rem 2rem !important;
                    overflow: visible !important;
                    justify-content: space-evenly !important;
                `;
                const componentContainer = slide.querySelector('.component-container');
                if (componentContainer) {
                    componentContainer.style.cssText += `
                        gap: 0.5rem !important;
                    `;
                }
                const componentItemsList = slide.querySelectorAll('.component-item');
                componentItemsList.forEach(compItem => {
                    compItem.style.cssText += `
                        padding: 0.7rem 1.2rem !important;
                    `;
                });
                const componentListItems = slide.querySelectorAll('.component-list li');
                componentListItems.forEach(li => {
                    li.style.cssText += `
                        font-size: 0.85rem !important;
                        line-height: 1.4 !important;
                        padding: 0.2rem 0 !important;
                    `;
                });
            } else if (slideNum === '7') {
                // Slide 7: Timeline
                slideContent.style.cssText += `
                    padding: 0.8rem 2rem !important;
                    justify-content: center !important;
                `;
                const timelineContainer = slide.querySelector('.timeline-container');
                if (timelineContainer) {
                    timelineContainer.style.cssText += `
                        padding: 0 !important;
                    `;
                }
                const timelineItemsList = slide.querySelectorAll('.timeline-item');
                timelineItemsList.forEach((item, idx) => {
                    item.style.cssText += `
                        margin-bottom: ${idx === timelineItemsList.length - 1 ? '0' : '1rem'} !important;
                    `;
                });
            } else if (slideNum === '8') {
                // Slide 8: Title Slide (Repeat) - Same as Slide 1
                const mainTitle = slide.querySelector('.main-title');
                if (mainTitle) {
                    mainTitle.style.cssText += `
                        font-size: 3.5rem !important;
                        margin-bottom: 1.5rem !important;
                    `;
                }
                const subTitle = slide.querySelector('.sub-title');
                if (subTitle) {
                    subTitle.style.cssText += `
                        font-size: 2rem !important;
                        margin-bottom: 1.5rem !important;
                    `;
                }
                const titleDivider = slide.querySelector('.title-divider');
                if (titleDivider) {
                    titleDivider.style.cssText += `
                        width: 250px !important;
                        margin: 1.5rem auto !important;
                    `;
                }
                const dateInfo = slide.querySelector('.date-info');
                if (dateInfo) {
                    dateInfo.style.cssText += `
                        margin-top: 2rem !important;
                        font-size: 1.2rem !important;
                    `;
                }
                const dbklLogo = slide.querySelector('.dbkl-logo');
                if (dbklLogo) {
                    dbklLogo.style.cssText += `
                        height: 150px !important;
                    `;
                }
            } else if (slideNum === '9') {
                // Slide 9: Pelan Pendigitalan (with table)
                slideContent.style.cssText += `
                    padding: 0.8rem 2rem !important;
                    overflow: visible !important;
                `;
                const table = slide.querySelector('table');
                if (table) {
                    table.style.cssText += `
                        font-size: 0.7rem !important;
                        width: 100% !important;
                    `;
                    const tableCells = table.querySelectorAll('th, td');
                    tableCells.forEach(cell => {
                        cell.style.cssText += `
                            padding: 5px 6px !important;
                            font-size: 0.7rem !important;
                        `;
                    });
                }
            } else if (slideNum === '10') {
                // Slide 10: Perkhidmatan E2E (with table)
                slideContent.style.cssText += `
                    padding: 0.8rem 2rem !important;
                    overflow: visible !important;
                `;
                const table = slide.querySelector('table');
                if (table) {
                    table.style.cssText += `
                        font-size: 0.75rem !important;
                        width: 100% !important;
                    `;
                    const tableCells = table.querySelectorAll('th, td');
                    tableCells.forEach(cell => {
                        cell.style.cssText += `
                            padding: 6px 8px !important;
                            font-size: 0.75rem !important;
                        `;
                    });
                }
            } else if (slideNum === '11') {
                // Slide 11: Sistem MyMesyuarat
                slideContent.style.cssText += `
                    padding: 1rem 2rem !important;
                    overflow: visible !important;
                    justify-content: center !important;
                `;
                const orderedList = slide.querySelector('ol');
                if (orderedList) {
                    orderedList.style.cssText += `
                        font-size: 0.9rem !important;
                        line-height: 1.6 !important;
                    `;
                }
            } else if (slideNum === '12') {
                // Slide 12: Closing Slide
                const closingSlideContent = slide.querySelector('.closing-slide-content');
                if (closingSlideContent) {
                    closingSlideContent.style.cssText += `
                        opacity: 1 !important;
                        visibility: visible !important;
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        justify-content: center !important;
                    `;
                }
                const closingTitle = slide.querySelector('.closing-title');
                if (closingTitle) {
                    closingTitle.style.cssText += `
                        font-size: 4rem !important;
                        margin-bottom: 2rem !important;
                    `;
                }
                const contactInfo = slide.querySelector('.contact-info');
                if (contactInfo) {
                    contactInfo.style.cssText += `
                        margin-top: 2rem !important;
                    `;
                    const contactParagraphs = contactInfo.querySelectorAll('p');
                    contactParagraphs.forEach(p => {
                        p.style.cssText += `
                            font-size: 1.3rem !important;
                            margin: 0.8rem 0 !important;
                        `;
                    });
                }
            }
        }
    });
    
    // Wait for styles to apply then print
    setTimeout(() => {
        // Trigger print dialog
        window.print();
        
        // Restore function
        const restoreView = () => {
            // Hide all slides except original
            slides.forEach((slide, index) => {
                if (index + 1 === originalSlide) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
                // Clear inline styles
                slide.style.cssText = '';
                
                // Clear all element inline styles
                const allElements = slide.querySelectorAll('*');
                allElements.forEach(el => {
                    el.style.cssText = '';
                });
            });
            
            // Show navigation
            if (navigation) navigation.style.display = 'flex';
            if (slideDots) slideDots.style.display = 'flex';
            if (pdfButton) pdfButton.style.display = 'flex';
            
            // Re-trigger current slide animations
            showSlide(originalSlide);
            
            // Remove listener
            window.removeEventListener('afterprint', restoreView);
        };
        
        // Listen for print completion
        window.addEventListener('afterprint', restoreView);
        
        // Fallback timeout (if afterprint doesn't fire)
        setTimeout(restoreView, 3000);
        
    }, 800);
}

// Flow scroll functions
function scrollFlowLeft() {
    const wrapper = document.getElementById('flowWrapper');
    if (wrapper) {
        wrapper.scrollBy({
            left: -350,
            behavior: 'smooth'
        });
    }
}

function scrollFlowRight() {
    const wrapper = document.getElementById('flowWrapper');
    if (wrapper) {
        wrapper.scrollBy({
            left: 350,
            behavior: 'smooth'
        });
    }
}

// Check library on load
window.addEventListener('load', () => {
    setTimeout(() => {
        if (typeof html2pdf === 'undefined') {
            console.warn('html2pdf library not loaded. PDF download may not work.');
            // Change button tooltip
            const pdfBtn = document.querySelector('.pdf-btn');
            if (pdfBtn) {
                pdfBtn.title = 'Print to PDF (Ctrl+P)';
                // Change onclick to print function
                pdfBtn.onclick = printToPDF;
            }
        } else {
            console.log('html2pdf library loaded successfully.');
        }
    }, 1000);
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    /* Print styles for PDF - All 12 slides */
    @media print {
        /* Hide everything first */
        body * {
            visibility: hidden;
        }
        
        /* Show only presentation content */
        .presentation-container,
        .presentation-container * {
            visibility: visible;
        }
        
        /* Hide navigation elements */
        .navigation,
        .slide-dots,
        .pdf-btn {
            display: none !important;
            visibility: hidden !important;
        }
        
        /* Ensure all slides are visible */
        .slide {
            page-break-after: always;
            page-break-inside: avoid;
            position: relative !important;
            opacity: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
            height: 100vh !important;
            min-height: 100vh !important;
        }
        
        /* Last slide no page break */
        .slide:last-child {
            page-break-after: auto;
        }
        
        /* Ensure backgrounds print */
        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        
        /* Container adjustments */
        .presentation-container {
            position: relative;
            width: 100%;
            height: auto;
        }
        
        /* Ensure gradient backgrounds print */
        .gradient-bg,
        .slide-background {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        
        /* Print landscape */
        @page {
            size: landscape;
            margin: 0;
        }
    }
`;
document.head.appendChild(style);

// Console helper message
console.log(`
╔════════════════════════════════════════════╗
║   SISTEM AMARAN BANJIR - Pay@KL           ║
║   Presentation Controls:                   ║
║   ────────────────────────────────────    ║
║   → Arrow Right / Space  : Next Slide     ║
║   ← Arrow Left          : Previous Slide  ║
║   1-9, 0 (for 10)       : Go to Slide     ║
║   F                     : Fullscreen      ║
║   Home                  : First Slide     ║
║   End                   : Last Slide      ║
║   📄 PDF Button         : Download PDF    ║
╚════════════════════════════════════════════╝
`);
