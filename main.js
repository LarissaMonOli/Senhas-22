const chars = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>/?'
};

const ambiguous = '0O1Il';

function generatePassword() {
    const length = parseInt(document.getElementById('length').value);
    const useUpper = document.getElementById('uppercase').checked;
    const useLower = document.getElementById('lowercase').checked;
    const useNumbers = document.getElementById('numbers').checked;
    const useSymbols = document.getElementById('symbols').checked;
    const avoidAmbiguous = document.getElementById('avoid-ambiguous').checked;

    let charset = '';
    if (useUpper) charset += chars.uppercase;
    if (useLower) charset += chars.lowercase;
    if (useNumbers) charset += chars.numbers;
    if (useSymbols) charset += chars.symbols;

    if (charset === '') {
        alert('Selecione pelo menos um tipo de caractere!');
        return;
    }

    let password = '';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
        let index = array[i] % charset.length;
        let char = charset[index];
        if (avoidAmbiguous && ambiguous.includes(char)) {
            i--;
            continue;
        }
        password += char;
    }

    password = ensureCharacterTypes(password, useUpper, useLower, useNumbers, useSymbols);
    document.getElementById('password').value = password;
    updateStrength(password);
}

function ensureCharacterTypes(password, useUpper, useLower, useNumbers, useSymbols) {
    let newPass = password.split('');
    if (useUpper && !/[A-Z]/.test(password)) newPass[Math.floor(Math.random()*newPass.length)] = chars.uppercase[Math.floor(Math.random()*chars.uppercase.length)];
    if (useLower && !/[a-z]/.test(password)) newPass[Math.floor(Math.random()*newPass.length)] = chars.lowercase[Math.floor(Math.random()*chars.lowercase.length)];
    if (useNumbers && !/[0-9]/.test(password)) newPass[Math.floor(Math.random()*newPass.length)] = chars.numbers[Math.floor(Math.random()*chars.numbers.length)];
    if (useSymbols && !/[^A-Za-z0-9]/.test(password)) newPass[Math.floor(Math.random()*newPass.length)] = chars.symbols[Math.floor(Math.random()*chars.symbols.length)];
    return newPass.join('');
}

function updateStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const fill = document.getElementById('strength-fill');
    const text = document.getElementById('strength-text');
    const width = Math.min((score / 7) * 100, 100);
    fill.style.width = width + '%';

    if (score >= 6) {
        fill.style.background = 'linear-gradient(90deg, #00cc66, #33ff99)';
        text.textContent = 'Muito Forte';
        text.style.color = '#00cc66';
    } else if (score >= 4) {
        fill.style.background = 'linear-gradient(90deg, #ffaa00, #ffdd66)';
        text.textContent = 'Forte';
        text.style.color = '#ffaa00';
    } else {
        fill.style.background = 'linear-gradient(90deg, #ff4444, #ff8866)';
        text.textContent = 'Média';
        text.style.color = '#ff4444';
    }
}

// Eventos
document.getElementById('generate-btn').addEventListener('click', generatePassword);
document.getElementById('copy-btn').addEventListener('click', () => {
    const pass = document.getElementById('password').value;
    if (!pass) return alert('Gere uma senha primeiro!');
    navigator.clipboard.writeText(pass).then(() => {
        const btn = document.getElementById('copy-btn');
        const orig = btn.textContent;
        btn.textContent = 'Copiado!';
        setTimeout(() => btn.textContent = orig, 2000);
    });
});

document.getElementById('length').addEventListener('input', (e) => {
    document.getElementById('length-value').textContent = e.target.value;
});

window.onload = generatePassword;
