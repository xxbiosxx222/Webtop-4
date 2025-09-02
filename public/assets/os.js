import { WindowManager } from './window-manager.js';

const steps = document.querySelectorAll('.setup');
const nextButtons = document.querySelectorAll('.next');

let currentStep = 0;

nextButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        steps[currentStep].classList.remove('active');
        steps[currentStep].classList.add('disabled');

        currentStep++;
        if (currentStep < steps.length) {
            steps[currentStep].classList.remove('disabled');
            steps[currentStep].classList.add('active');
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const wm = new WindowManager();

    // Example: Create a window when the "Continue" button is clicked
        wm.createWindow({
            title: 'Example Window',
            icon: './assets/icon.png',
            content: '<iframe src="settings.html" style="width:100%;height:100%;border:none;"></iframe>',
            x: 100,
            y: 100,
            width: 400,
            height: 300
        });
});