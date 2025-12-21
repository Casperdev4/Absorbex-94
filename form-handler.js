async function submitToWebPrime(e) {
    e.preventDefault();
    var form = document.getElementById('contactForm');
    var btn = form.querySelector('button[type="submit"]');
    var originalText = btn.textContent;

    if (form._gotcha && form._gotcha.value) return false;

    btn.textContent = 'Envoi en cours...';
    btn.disabled = true;

    try {
        var formData = new FormData(form);
        var response = await fetch('https://webprime.app/webhook/contact/857f6a6d191ea9ed8f4d7159245a653f3043557bd87b70e04ebc34dea33a261a', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            window.location.href = 'https://assainissement-94.com/';
        } else {
            alert('Erreur lors de l\'envoi. Veuillez reessayer.');
            btn.textContent = originalText;
            btn.disabled = false;
        }
    } catch (error) {
        alert('Erreur de connexion. Veuillez reessayer.');
        btn.textContent = originalText;
        btn.disabled = false;
    }
    return false;
}
