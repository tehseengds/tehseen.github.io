// Typing Animation
const texts = ["Hi, I'm Tehseen Mukhtiar – Mobile App Developer!"];
let count = 0;
let index = 0;
let currentText = '';
let letter = '';

(function type() {
    if (count === texts.length) {
        count = 0;
    }
    currentText = texts[count];
    letter = currentText.slice(0, ++index);

    document.getElementById('typing-text').textContent = letter;
    if (letter.length === currentText.length) {
        index = 0;
    }
    setTimeout(type, 150);
}());

// Circular Progress Bars
document.querySelectorAll('.circle').forEach(circle => {
    const percentage = circle.getAttribute('data-percentage');
    circle.style.setProperty('--percentage', percentage * 3.6 + 'deg');
});

// Interactive Map and Animated Social Media Icons can be implemented using APIs and additional scripts.